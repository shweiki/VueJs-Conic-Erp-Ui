<template>
  <div class="app-container">
    <upload-excel-component :on-success="handleSuccess" :before-upload="beforeUpload" />
    <Export :list="data" />

    <el-row type="flex">
      <el-col :span="12">
        <el-table
          height="500"
          v-loading="loading"
          :data="ExcelData"
          border
          highlight-current-row
          style="width: 100%; margin-top: 20px"
        >
          <el-table-column
            v-for="item of ExcelHeader"
            :key="item"
            :prop="item"
            :label="item"
          /> </el-table
      ></el-col>
      <el-col :span="12">
        <el-table
          height="500"
          v-loading="loading"
          :data="data"
          border
          highlight-current-row
          style="width: 100%; margin-top: 20px"
        >
          <el-table-column
            v-for="item of dataHeader"
            :key="item"
            :prop="item"
            :label="item"
          /> </el-table
      ></el-col>
    </el-row>
  </div>
</template>

<script>
import UploadExcelComponent from "@/components/UploadExcel/index.vue";
import waves from "@/directive/waves"; // waves directive
import { parseTime } from "@/utils";
import Export from "@/components/Export";
import CountriesNationality from "./Countries_Nationality";

export default {
  name: "ForUploadBioLab",
  components: { UploadExcelComponent, Export },
  directives: { waves },
  data() {
    return {
      isDisabled: true,
      radio: "Create",
      loading: false,
      ExcelData: [],
      data: [],
      ExcelHeader: [],
      dataHeader: [],
      file: undefined,
    };
  },
  methods: {
    beforeUpload(file) {
      const isLt1M = file.size / 1024 / 1024 < 8;
      this.file = file;
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
      this.ExcelData = results;
      this.ExcelHeader = header;

      this.data = results.map((x) => {
        let VDateBirthday = new Date(x["DATE OF BIRTH"]);
        console.log(x["NAT"]);
        return {
          Arabicname:
            x["CABIN"] != undefined || null || ""
              ? x["CABIN"].toString().replaceAll(" ", "")
              : "",
          Englishname:
            (x["FIRSTNAME"] != undefined || null || "" ? x["FIRSTNAME"] : "") +
            " " +
            (x["LASTNAME"] != undefined || null || "" ? x["LASTNAME"] : ""),
          DateBirthday: this.formatDate(this.ExcelDateToJSDate(x["DATE OF BIRTH"])), // x["DATE OF BIRTH"] != undefined || null || "" ? VDateBirthday : "", //   +,
          Gender: x["GEN"] != "M" ? "Female" : "Male",
          Email: x["EMAIL"] != undefined || null || "" ? x["EMAIL"] : "",
          MobileCountryCode:
            x["MobileCountryCode"] != undefined || null || ""
              ? x["MobileCountryCode"]
              : "962",
          Mobilenumber:
            x["Mobilenumber"] != undefined || null || ""
              ? x["Mobilenumber"]
              : "785907000",
          PatNationality:
            x["NAT"] != undefined || null || ""
              ? CountriesNationality.find((obj) => {
                  return (
                    obj.value.toUpperCase() ===
                    x["NAT"].replaceAll(",", " ").toUpperCase()
                  );
                }).key
              : "",
          DocumentNumber:
            x["PASS NR"] != undefined || null || ""
              ? x["PASS NR"].toString().replaceAll(" ", "")
              : "",
          Barcodenumber:
            x["MSC CARD"] != undefined || null || ""
              ? x["MSC CARD"].toString().replace("'", "*").replaceAll(" ", "")
              : "",
        };
      });
      this.dataHeader = Object.keys(this.data[0]);
      this.isDisabled = false;
      this.loading = false;
    },
    formatJson(filterVal) {
      return this.data.map((v) =>
        filterVal.map((j) => {
          if (j === "timestamp") {
            return parseTime(v[j]);
          } else {
            return v[j];
          }
        })
      );
    },
    formatDate(date) {
      let d = new Date(date),
        day = "" + d.getDate(),
        month = "" + (d.getMonth() + 1),
        year = d.getFullYear();
      if (month.length < 2) month = "0" + month;
      if (day.length < 2) day = "0" + day;

      return [day, month, year].join("/");
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
        date_info.getFullYear() < 1922
          ? date_info.getFullYear() + 100
          : date_info.getFullYear(),
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
