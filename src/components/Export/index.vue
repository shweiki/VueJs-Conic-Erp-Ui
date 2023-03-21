<template>
  <el-popover v-permission="['admin']" placement="bottom" width="500" trigger="hover">
    <FilenameOption v-model="filename" />
    <AutoWidthOption v-model="autoWidth" />
    <BookTypeOption v-model="bookType" />

    <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download"
      @click="handleDownload">
    </el-button>
    <el-button class="filter-item" v-bind:disabled="list[0] == null" icon="el-icon-document" type="primary"
      slot="reference">{{ $t("Members.Export") }}</el-button>
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
  props: ["list", "Type"],
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
  created() { },
  methods: {
    handleDownload() {
      this.downloadLoading = true;
      import("@/Report/Excel/Export2ExcelOrginal").then((excel) => {
        const tHeader = Object.keys(this.list[0]);
        const filterVal = Object.keys(this.list[0]);
        const list = this.list;
        let formatJson = this.formatJson(filterVal, list);
        let fileName = this.Type
        if (this.fileName) {
          fileName += " " + this.fileName;
        }
        excel.export_json_to_excel({
          header: tHeader,
          data: formatJson,
          filename: fileName,
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
            return parseTime(v[j], "{y}-{m}-{d} {h}:{i}");
          }
          if (j === "InventoryMovements") {
            return JSON.stringify(v[j]);
          }
          if (j === "ActionLogs") {
            return JSON.stringify(v[j]);
          }
          if (j === "FakeDate") {
            return parseTime(v[j], "{y}-{m}-{d} {h}:{i}");
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
