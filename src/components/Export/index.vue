<template>
  <el-popover
    v-permission="['admin']"
    placement="bottom"
    width="500"
    trigger="hover"
  >
    <FilenameOption v-model="filename" />
    <AutoWidthOption v-model="autoWidth" />
    <BookTypeOption v-model="bookType" />

    <el-button
      v-waves
      :loading="downloadLoading"
      class="filter-item"
      type="primary"
      icon="el-icon-download"
      @click="handleDownload"
    >
    </el-button>
    <el-button
      class="filter-item"
      v-bind:disabled="list[0] == null"
      icon="el-icon-document"
      type="primary"
      slot="reference"
      >Export</el-button
    >
  </el-popover>
</template>

<script>
import { parseTime } from "@/utils/index";
// options components
import FilenameOption from "./components/FilenameOption";
import AutoWidthOption from "./components/AutoWidthOption";
import BookTypeOption from "./components/BookTypeOption";
import waves from "@/directive/waves"; // waves directive
import permission from "@/directive/permission/index.js";

export default {
  name: "Export",
  props: ["list"],
  directives: { waves, permission },
  components: { FilenameOption, AutoWidthOption, BookTypeOption },
  data() {
    return {
      // list: null,
      downloadLoading: false,
      filename: "",
      autoWidth: true,
      bookType: "xlsx",
    };
  },
  created() {},
  methods: {
    handleDownload() {
      console.log("this.list", this.list);
      this.downloadLoading = true;
      import("@/Report/Excel/Export2Excel").then((excel) => {
        const tHeader = Object.keys(this.list[0]); // ['Id', 'Title', 'Author', 'Readings', 'Date']
        const filterVal = Object.keys(this.list[0]); //['id', 'title', 'author', 'pageviews', 'display_time']
        const list = this.list;
        let formatJson = this.formatJson(filterVal, list);
        console.log("this.list",this.filename, this.autoWidth, this.bookType);
        excel.export_json_to_excel({
          header: tHeader,
          data: formatJson,
          filename: this.filename,
          autoWidth: this.autoWidth,
          bookType: this.bookType,
        });
        this.downloadLoading = false;
      });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map((v) =>
        filterVal.map((j) => {
          if (j === "timestamp") {
            return parseTime(v[j],"{y}-{m}-{d} {h}:{i}");
          }
          if (j === "InventoryMovements") {
            return JSON.stringify(v[j]);
          }
          if (j === "ActionLogs") {
            return JSON.stringify(v[j]);
          }
          if (j === "FakeDate") {
            return parseTime(v[j],"{y}-{m}-{d} {h}:{i}");
          } else {
            return v[j];
          }
        })
      );
    },
  },
};
</script>

<style>
.radio-label {
  font-size: 14px;
  color: #606266;
  line-height: 40px;
  padding: 0 12px 0 30px;
}
</style>
