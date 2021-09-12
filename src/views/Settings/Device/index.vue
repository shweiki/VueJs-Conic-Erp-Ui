<template>
  <div class="app-container">
    <p>{{ response }}</p>
    <el-card class="box-card">
      <div slot="header">
        <add-device />

        <span>جميع الاجهزة</span>
      </div>
      <el-table
        v-loading="loading"
        :data="
          tableData.filter(
            (data) => !search || data.Name.toLowerCase().includes(search.toLowerCase())
          )
        "
        fit
        border
        max-height="900"
        highlight-current-row
        style="width: 100%"
      >
        <el-table-column prop="Id" width="80" align="center">
          <template slot="header" slot-scope="{}">
            <el-button
              type="primary"
              icon="el-icon-refresh"
              @click="getdata()"
            ></el-button>
          </template>
        </el-table-column>
        <el-table-column prop="Name" align="center">
          <template slot="header" slot-scope="{}">
            <el-input v-model="search" v-bind:placeholder="$t('Classification.Name')" />
          </template>
        </el-table-column>
        <el-table-column prop="Ip" label="IP" align="center"></el-table-column>
        <el-table-column prop="Port" label="Port" align="center"></el-table-column>
        <el-table-column
          v-bind:label="$t('Classification.Notes')"
          prop="Description"
          width="220"
          align="center"
        ></el-table-column>
        <el-table-column label="Edit" width="220" align="center">
          <template slot-scope="scope">
            <edit-device :DeviceId="scope.row.Id" />
          </template>
        </el-table-column>
        <el-table-column prop="Name" align="center">
          <template slot-scope="scope">
            <el-button
              @click="ClearAdministrators(scope.row.Id)"
              :size="$store.getters.size"
              type="success"
              >Clear Administrators</el-button
            >
            <el-button
              @click="GetAllFaceMember(scope.row.Id)"
              :size="$store.getters.size"
              type="info"
              >سحب جميع بصمات الوجه المشتركين</el-button
            >
            <el-button
              @click="GetAllLogMember(scope.row.Id)"
              :size="$store.getters.size"
              type="primary"
            >
              سحب جميع سجلات المشتركين</el-button
            >
            <el-button
              @click="SetAllMember(scope.row.Id)"
              :size="$store.getters.size"
              type="warning"
            >
              ارسال جميع معلومات المشتركين</el-button
            >
            <el-button
              @click="ClearUserLog(scope.row.Id)"
              :size="$store.getters.size"
              type="danger"
              >مسح سجلات المشتركين</el-button
            >
            <el-button
              @click="TurnOff(scope.row.Id)"
              :size="$store.getters.size"
              type="danger"
              >إيقاف تشغيل الجهاز</el-button
            >
            <el-button
              @click="RestartDevice(scope.row.Id)"
              :size="$store.getters.size"
              type="success"
              >اعادة تشغيل الجهاز</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import {
  GetDevice,
  GetAllFaceMembers,
  GetAllLogMembers,
  SetAllMembers,
  ClearUserLog,
  ClearAdministrators,
  RestartDevice,
  TurnOff,
} from "@/api/Device";
import AddDevice from "@/components/Device/AddDevice.vue";
import EditDevice from "@/components/Device/EditDevice.vue";

export default {
  name: "Device",
  components: { AddDevice, EditDevice },
  data() {
    return {
      tableData: [],
      loading: true,
      search: "",
      response: "",
    };
  },
  created() {
    this.getdata();
  },
  methods: {
    getdata() {
      this.loading = true;
      GetDevice()
        .then((response) => {
          // handle success
          console.log(response);
          this.tableData = response;
          this.loading = false;
        })
        .catch((error) => {
          // handle error
          this.response = error;
          console.log(error);
        });
    },
    SetAllMember(id) {
      SetAllMembers({ DeviceId: id })
        .then((response) => {
          // handle success
          this.response = response;

          console.log(response);
        })
        .catch((error) => {
          // handle error
          this.response = error;

          console.log(error);
        });
    },
    ClearAdministrators(id) {
      ClearAdministrators({ DeviceId: id })
        .then((response) => {
          // handle success
          this.response = response;

          console.log(response);
        })
        .catch((error) => {
          // handle error
          this.response = error;

          console.log(error);
        });
    },
    GetAllFaceMember(id) {
      GetAllFaceMembers({ DeviceId: id })
        .then((response) => {
          // handle success
          this.response = response;

          console.log(response);
        })
        .catch((error) => {
          // handle error
          this.response = error;

          console.log(error);
        });
    },
    GetAllLogMember(id) {
      GetAllLogMembers({ DeviceId: id })
        .then((response) => {
          // handle success
          this.response = response;

          console.log(response);
        })
        .catch((error) => {
          // handle error
          this.response = error;

          console.log(error);
        });
    },
    ClearUserLog(id) {
      ClearUserLog({ DeviceId: id })
        .then((response) => {
          // handle success
          this.response = response;

          console.log(response);
        })
        .catch((error) => {
          // handle error
          this.response = error;

          console.log(error);
        });
    },
    RestartDevice(id) {
      RestartDevice({ DeviceId: id })
        .then((response) => {
          // handle success
          this.response = response;
          console.log(response);
        })
        .catch((error) => {
          // handle error
          this.response = error;

          console.log(error);
        });
    },
    TurnOff(id) {
      TurnOff({ DeviceId: id })
        .then((response) => {
          // handle success
          this.response = response;
          console.log(response);
        })
        .catch((error) => {
          // handle error
          this.response = error;

          console.log(error);
        });
    },
  },
};
</script>
