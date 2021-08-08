<template>
  <div class="app-container">
    <upload-excel-component
      :on-success="handleSuccess"
      :before-upload="beforeUpload"
    />
    <el-button @click="AddVendor" plain :disabled="isDisabled" type="success"
      >Push</el-button
    >
    <el-table
      height="250"
      v-loading="loading"
      :data="tableData"
      border
      highlight-current-row
      style="width: 100%;margin-top:20px;"
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
import { Create } from "@/api/Vendor";

export default {
  name: "Vendor",
  components: { UploadExcelComponent },
  data() {
    return {
      isDisabled: true,
      loading: false,
      tableData: [],
      data: [],
      tableHeader: []
    };
  },
  methods: {
    AddVendor() {
      this.loading = true;
      this.isDisabled = true;

      Create(this.data[0])
        .then(response => {
          console.log("tag", "" + response);
          this.data.splice(0, 1);
          if (this.data.length != 0) {
            this.AddVendor();
          } else {
            this.loading = false;
            this.tableData = [];
            this.$notify({
              title: "تم ",
              message: "تم الإضافة بنجاح",
              type: "success",
              duration: 2000
            });
          }
        })
        .catch(error => {
          console.log(error);
          //this.AddVendor(100), 1000);
        });
    },

    beforeUpload(file) {
      const isLt1M = file.size / 1024 / 1024 < 8;

      if (isLt1M) {
        return true;
      }

      this.$message({
        message: "Please do not upload files larger than 8m in size.",
        type: "warning"
      });
      return false;
    },
    handleSuccess({ results, header }) {
      this.loading = true;
      this.tableData = results;
      console.log(this.tableData);
      this.data = this.tableData.map(x => {
        /*    let Phone1 = x.Description.toString().match(/\d+/);
        let Name = x.Description.toString().replace(/[0-9]/g, "");

        if (Phone1 == null || Phone1[0].length != 10) {
          if (x.PhoneNumber != null) {
            Phone1 = [];
            Phone1[0] = "0" + x.PhoneNumber;
            Name = x.Name;
          } else return false;
        }

        return {
          Id: undefined,
          Name: Name,
          Region: x.Region,
          Email: "",
          PhoneNumber1: Phone1[0],
          PhoneNumber2: "",
          Fax: "0",
          CreditLimit: 0.0,
          Description: "",
          IsPrime: false,
          Type: "Customer"
        };
        */
        return {
          Id: undefined,
          Name: x.Name,
          Region: x.Region,
          Email: x.Email,
          PhoneNumber1: x.PhoneNumber1,
          PhoneNumber2: x.PhoneNumber2,
          Fax: x.Fax,
          CreditLimit: x.CreditLimit,
          Description: x.Description,
          IsPrime: false,
          Type: x.Type
        };
      });
      const seen = new Set();
      this.data = this.data.filter(el => {
        const duplicate = seen.has(el.PhoneNumber1);
        seen.add(el.PhoneNumber1);
        return !duplicate;
      });
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
    }
  }
};
</script>