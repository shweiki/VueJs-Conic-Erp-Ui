<template>
  <div>
    <el-card>
      <Drawer-Print
        style="float: left"
        Type="QrlabelList"
        :Data="{
          Items: List,
        }"
      />
      <el-button
        @click="DownloadAll('Qrlabel', List)"
        icon="el-icon-download"
        type="success"
        :loading="loading"
        >Download All As Image
        <span> {{ counter + "  Of  " + List.length }} </span></el-button
      >
      <upload-excel-component :on-success="handleSuccess" :before-upload="beforeUpload" />
    </el-card>
    <el-card>
      <el-table
        height="350"
        :data="List"
        border
        fit
        highlight-current-row
        style="width: 100%"
      >
        <el-table-column label="name" prop="name" align="center"> </el-table-column>

        <el-table-column align="center">
          <template slot-scope="scope">
            <el-col :span="16">
              <el-button
                @click="DownloadAsImage('Qrlabel', scope.row)"
                icon="el-icon-download"
                type="primary"
                :loading="loading"
                >Download As Image</el-button
              >
            </el-col>
            <el-col :span="8">
              <Drawer-Print Type="Qrlabel" :Data="scope.row" />
            </el-col>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <iframe
      height="1000px"
      frameborder="0"
      style="overflow: hidden; width: 100%"
      id="DownloadAsImage"
      class="iframeR"
    ></iframe>
  </div>
</template>

<script>
import DrawerPrint from "@/components/PrintRepot/DrawerPrint.vue";
import { DownloadReportAsImage, ReportAsDataUrl } from "@/report/FunctionalityReport";
import { saveAs } from "file-saver";
import JSZip from "jszip";
import UploadExcelComponent from "@/components/UploadExcel/index.vue";

export default {
  components: { DrawerPrint, UploadExcelComponent },
  data() {
    return {
      List: [],
      zip: new JSZip(),
      loading: false,
      counter: 0,
    };
  },
  methods: {
    async DownloadAsImage(type, data) {
      this.loading = true;
      await DownloadReportAsImage(type, data);
      this.loading = false;
    },
    DownloadAll(type) {
      this.loading = true;
      ReportAsDataUrl(type, this.List[0]).then((res) => {
        //  console.log("tag", res);
        this.zip.file(this.List[0].name + ".png", res, {
          base64: true,
        });
        this.List.splice(0, 1);
        this.counter++;
        if (this.List.length != 0) {
          this.DownloadAll(type);
        } else {
          this.zip.generateAsync({ type: "blob" }).then((content) => {
            // see FileSaver.js
            saveAs(content, "Qr_Code.zip");
            this.loading = false;
            this.$notify({
              title: "تم ",
              message: "تم الإضافة بنجاح",
              type: "success",
              duration: 2000,
            });
          });
        }
      });
    },

    handleSuccess({ results, header }) {
      this.loading = true;
      this.List = results;
      this.List.map((el) => {
        let str_name = el.name;
        el.Name = str_name.slice(str_name.lastIndexOf(",") + 1, str_name.length);
        //el.qr = el.name.substring(0, el.name.lastIndexOf(".")).replaceAll("-", "");
        // el.qr = el.qr.replaceAll("'", "");
      });
      this.loading = false;
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
  },
};
</script>
