<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-button
          style="float: left"
          type="success"
          icon="el-icon-plus"
          @click="handleCreate()"
        >{{ $t('Classification.Add') }}</el-button>

        <span>جميع الاجهزة</span>
      </div>
      <el-table
        v-loading="loading"
        :data="tableData.filter(data => !search || data.name.toLowerCase().includes(search.toLowerCase()))"
        fit
        border
        max-height="900"
        highlight-current-row
        style="width: 100%"
      >
        <el-table-column prop="id" width="80" align="center">
          <template slot="header" slot-scope="{}">
            <el-button type="primary" icon="el-icon-refresh" @click="getdata()"></el-button>
          </template>
        </el-table-column>
        <el-table-column prop="name" align="center">
          <template slot="header" slot-scope="{}">
            <el-input v-model="search" v-bind:placeholder="$t('Classification.name')" />
          </template>
        </el-table-column>
        <el-table-column prop="IP" label="IP" align="center"></el-table-column>
        <el-table-column prop="Port" label="Port" align="center"></el-table-column>
        <el-table-column
          v-bind:label="$t('Classification.Notes')"
          prop="description"
          width="220"
          align="center"
        ></el-table-column>
        <el-table-column prop="name" align="center">
          <template slot-scope="scope">
            <el-button
              @click="GetAllFaceMember(scope.row.id)"
              size="mini"
              type="info"
            >{{scope.row.name}} سحب جميع بصمات الوجه المشتركين</el-button>
            <el-button
              @click="GetAllLogMember(scope.row.id)"
              size="mini"
              type="primary"
            >{{scope.row.name}} سحب جميع سجلات المشتركين</el-button>
            <el-button
              @click="SetAllMember(scope.row.id)"
              size="mini"
              type="warning"
            >{{scope.row.name}} ارسال جميع معلومات المشتركين</el-button>
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
  SetAllMembers
} from "@/api/Device";
export default {
  name: "Device",
  data() {
    return {
      tableData: [],
      loading: true,
      search: ""
    };
  },
  created() {
    this.getdata();
  },
  methods: {
    getdata() {
      this.loading = true;
      GetDevice()
        .then(response => {
          // handle success
          console.log(response);
          this.tableData = response;
          this.loading = false;
        })
        .catch(error => {
          // handle error
          console.log(error);
        });
    },
    SetAllMember(id) {
      SetAllMembers({ DeviceID: id })
        .then(response => {
          // handle success
          console.log(response);
        })
        .catch(error => {
          // handle error
          console.log(error);
        });
    },
    GetAllFaceMember(id) {
      GetAllFaceMembers({ DeviceID: id })
        .then(response => {
          // handle success
          console.log(response);
        })
        .catch(error => {
          // handle error
          console.log(error);
        });
    },
    GetAllLogMember(id) {
      GetAllLogMembers({ DeviceID: id })
        .then(response => {
          // handle success
          console.log(response);
        })
        .catch(error => {
          // handle error
          console.log(error);
        });
    }
  }
};
</script>

