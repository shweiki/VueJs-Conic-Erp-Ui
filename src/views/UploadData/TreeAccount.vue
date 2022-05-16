<template>
  <div class="app-container">
    <upload-excel-component
      :on-success="handleSuccess"
      :before-upload="beforeUpload"
    />
    <el-button @click="Add" plain :disabled="isDisabled" type="success"
      >Push</el-button
    >
    <el-radio-group v-model="radio">
      <el-radio label="Create">Create</el-radio>
      <el-radio label="CreateWithCheck">Create With Check </el-radio>
      <el-radio label="9">Option C</el-radio>
    </el-radio-group>
    <el-table
      height="500"
      v-loading="loading"
      :data="tableData"
      border
      highlight-current-row
      style="width: 100%; margin-top: 20px"
    >
      <el-table-column
        v-for="item of tableHeader"
        :key="item"
        :prop="item"
        :label="item"
      />
    </el-table>
  </div>
</template>

<script>
import UploadExcelComponent from "@/components/UploadExcel/index.vue";
import { Create, CheckIsExist } from "@/api/Account";

export default {
  name: "Account",
  components: { UploadExcelComponent },
  data() {
    return {
      isDisabled: true,
      radio: "Create",
      loading: false,
      tableData: [],
      data: [],
      tableHeader: [],
    };
  },
  methods: {
    async Add() {
      this.loading = true;
      this.isDisabled = true;
      var found = false;
      if (this.radio == "Create") found = false;

      if (this.radio == "CreateWithCheck") {
        found = await this.Check(this.data[0].Name, this.data[0].Type);
      }
      if (!found) {
        Create(this.data[0])
          .then((response) => {
            console.log("tag", "" + response);
            this.data.splice(0, 1);
            if (this.data.length != 0) {
              this.Add();
            } else {
              this.loading = false;
              this.tableData = [];
              this.$notify({
                title: "تم ",
                message: "تم الإضافة بنجاح",
                type: "success",
                duration: 2000,
              });
            }
          })
          .catch((error) => {
            console.log(error);
            //this.Add(100), 1000);
          });
      } else {
        console.log("tag", "يوجد  نفس الاسم / نوع");
      }
    },

    Check(Name, Type) {
      return new Promise((resolve) => {
        CheckIsExist({
          Name: Name,
          Type: Type,
        }).then((res) => {
          resolve(res);
        });
      });
    },
    beforeUpload(file) {
      const isLt1M = file.size / 1024 / 1024 < 8;

      if (isLt1M) {
        return true;
      }

      this.$message({
        message: "Please do not upload files larger than 8m in size.",
        type: "warning",
      });
      return false;
    },
    handleSuccess({ results, header }) {
      this.loading = true;
      this.tableData = results;
      console.log(this.tableData);
      this.data = this.tableData;
      this.tableHeader = header;
      this.isDisabled = false;
      this.loading = false;
    },

    ExcelDateToJSDate(serial) {
      var utc_days = Math.floor(serial - 25569);
      var utc_value = utc_days * 86400;
      var date_info = new Date(utc_value * 1000);

      var fractional_day = serial - Math.floor(serial) + 0.0000001;

      var total_seconds = Math.floor(86400 * fractional_day);

      var seconds = total_seconds % 60;

      total_seconds -= seconds;

      var hours = Math.floor(total_seconds / (60 * 60));
      var minutes = Math.floor(total_seconds / 60) % 60;

      return new Date(
        date_info.getFullYear(),
        date_info.getMonth(),
        date_info.getDate(),
        hours,
        minutes,
        seconds
      );
    },
  },
};
</script>
