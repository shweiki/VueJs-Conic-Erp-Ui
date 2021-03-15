<template>
  <div class="app-container">
    <upload-excel-component
      :on-success="handleSuccess"
      :before-upload="beforeUpload"
    />
    <el-button @click="AddItem" plain :disabled="isDisabled" type="success"
      >Push
      <span> {{ counter + "  Of  " + tableData.length }} </span></el-button
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
import { CreateItem } from "@/api/Item";

export default {
  name: "Item",
  components: { UploadExcelComponent },
  data() {
    return {
      isDisabled: true,
      loading: false,
      tableData: [],
      counter: 0,
      data: [],
      tableHeader: []
    };
  },
  methods: {
    AddItem() {
      this.loading = true;
      this.isDisabled = true;
      CreateItem(this.data[0])
        .then(response => {
          console.log("tag", response);
          this.data.splice(0, 1);
          this.counter++;
          if (this.data.length != 0) {
            this.AddItem();
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
          //this.AddItem(100), 1000);
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
      this.data = this.tableData.map(element => {
        return {
          Id: undefined,
          Name: element.Name,
          CostPrice: element.CostPrice,
          SellingPrice: element.SellingPrice,
          OtherPrice: element.OtherPrice,
          LowOrder: element.LowOrder,
          Tax: element.Tax,
          Rate: element.Rate,
          Barcode: element.Barcode,
          Description: element.Description,
          Status: 0,
          Category: element.Category,
          IsPrime: false
        };
      });
      this.tableHeader = header;
      this.loading = false;
      this.isDisabled = false;
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