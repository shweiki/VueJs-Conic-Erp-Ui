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
        <el-table-column
          prop="Ip"
          :label="$t('Classification.Ip')"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="Port"
          :label="$t('Classification.Port')"
          align="center"
        ></el-table-column>
        <el-table-column
          v-bind:label="$t('Classification.Notes')"
          prop="Description"
          width="220"
          align="center"
        ></el-table-column>
        <el-table-column :label="$t('Classification.Edit')" align="center">
          <template slot-scope="scope">
            <edit-device :DeviceId="scope.row.Id" />
          </template>
        </el-table-column>
        <el-table-column prop="Name" align="center">
          <template slot-scope="scope">
            <el-button
              @click="GetLogData(scope.row.Ip)"
              :size="$store.getters.size"
              type="primary"
            >
              سحب جميع سجلات
            </el-button>

            <el-button
              @click="EnrollAllUser(scope.row.Ip)"
              :size="$store.getters.size"
              type="warning"
            >
              ارسال جميع معلومات
            </el-button>

            <el-button
              @click="ClearLog(scope.row.Ip)"
              :size="$store.getters.size"
              type="danger"
              >مسح سجلات المشتركين</el-button
            >
            <el-button
              @click="ClearAdministrators(scope.row.Ip)"
              :size="$store.getters.size"
              type="success"
              >Clear Administrators</el-button
            >
            <el-button
              @click="TurnOffDevice(scope.row.Ip)"
              :size="$store.getters.size"
              type="danger"
              >إيقاف تشغيل الجهاز</el-button
            >
            <el-button
              @click="RestartDevice(scope.row.Ip)"
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
import { GetDevice } from "@/api/Device";
import AddDevice from "@/components/Device/AddDevice.vue";
import EditDevice from "@/components/Device/EditDevice.vue";
import { connection } from "@/utils/signalR";
import { getToken } from "@/utils/auth";

export default {
  name: "Device",
  components: { AddDevice, EditDevice },
  data() {
    return {
      signalRConnection: null,
      tableData: [],
      loading: true,
      search: "",
      response: "",
    };
  },
  created() {
    this.getdata();
    this.signalRConnection = connection();
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
    async EnrollAllUser(Ip) {
      this.loading = true;
      try {
        await this.signalRConnection.invoke(
          "EnrollServerUsers",
          Ip,
          getToken().replace("Bearer ", "")
        );
      } catch (err) {
        console.error(err);
      } finally {
        this.loading = false;
      }
    },
    async GetLogData(Ip) {
      this.loading = true;
      try {
        await this.signalRConnection.invoke("GetLogData", Ip);
      } catch (err) {
        console.error(err);
      } finally {
        this.loading = false;
      }
    },
    async ClearLog(Ip) {
      this.loading = true;
      try {
        await this.signalRConnection.invoke("ClearLog", Ip);
      } catch (err) {
        console.error(err);
      } finally {
        this.loading = false;
      }
    },
    async ClearAdministrators(Ip) {
      this.loading = true;
      try {
        await this.signalRConnection.invoke("ClearAdministrators", Ip);
      } catch (err) {
        console.error(err);
      } finally {
        this.loading = false;
      }
    },
    async RestartDevice(Ip) {
      this.loading = true;
      try {
        await this.signalRConnection.invoke("RestartDevice", Ip);
      } catch (err) {
        console.error(err);
      } finally {
        this.loading = false;
      }
    },
    async TurnOffDevice(Ip) {
      this.loading = true;
      try {
        await this.signalRConnection.invoke("TurnOffDevice", Ip);
      } catch (err) {
        console.error(err);
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
