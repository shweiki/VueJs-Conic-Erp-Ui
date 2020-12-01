<template>
  <div class="app-container">
    <el-card class="box-card">
      <el-button
        style="margin-left: 10px"
        size="small"
        type="primary"
        :loading="loading"
        @click="SubmitBackUp"
      >
        BackUp DataBase</el-button
      >
    </el-card>
    <el-table
      v-loading="loading"
      :data="tableData"
      fit
      max-height="700"
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column label="#" prop="Id" width="50"></el-table-column>

      <el-table-column prop="Name" align="center">
        <template slot="header" slot-scope="{}">
          <el-input v-model="search" v-bind:placeholder="$t('Account.Name')" />
        </template>
      </el-table-column>
      <el-table-column
        label="DataBaseName"
        prop="DataBaseName"
      ></el-table-column>
      <el-table-column label="DateTime" prop="DateTime"></el-table-column>
      <el-table-column label="UserID" prop="userID"></el-table-column>

      <el-table-column align="right" width="200">
        <template slot-scope="scope">
          <el-button
            style="margin-left: 10px"
            size="small"
            type='success'
            :loading="loading"
            @click="SubmitRestore(scope.row.Id)"
            >Submit Restore to server</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { BackUp, Restore, GetBackUp } from "@/api/BackupRestore";

export default {
  name: "BackupRestore",
  data() {
    return {
      loading: false,
      tableData: [],
      search: '',
    };
  },
  created() {
    this.getdata();
  },
  methods: {
    getdata() {
      this.loading = true;
      GetBackUp()
        .then((response) => {
          // handle success
          console.log(response)
          this.tableData = response.reverse();
          this.loading = false
        })
        .catch((error) => {
          // handle error
          console.log(error);
        })
    },
    SubmitRestore(id) {
      this.loading = true;

      Restore({ backUpId: id }).then((response) => {
        if (response) {
          this.$notify({
            title: "تم ",
            message: "تم الإضافة بنجاح",
            type: 'success',
            duration: 2000,
          })
          this.loading = true;
          this.getdata();
        }
      })
    },
    SubmitBackUp() {
      this.loading = true;
      BackUp().then((response) => {
        if (response) {
          this.$notify({
            title: "تم ",
            message: "تم الإضافة بنجاح",
            type: 'success',
            duration: 2000,
          })
          this.loading = true;
          this.getdata();
        }
      })
    },
  },
};
</script>

