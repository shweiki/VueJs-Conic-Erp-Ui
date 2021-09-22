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
        >Download All As Image</el-button
      >
      <upload-excel-component :on-success="handleSuccess" :before-upload="beforeUpload" />

      <!--      <el-upload
        class="upload-demo"
        action="http://localhost:8090/test1/Files/Upload"
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        :before-remove="beforeRemove"
        :on-success="handleSuccess"
        multiple
        :show-file-list="false"
        :limit="500"
        :on-exceed="handleExceed"
        name="filex"
        :file-list="fileList"
      >
        <el-button size="small" type="primary">Click to upload</el-button>
        <div slot="tip" class="el-upload__tip">
          jpg/png files with a size less than 500kb
        </div>
      </el-upload>-->
    </el-card>
    <el-card>
      <el-table :data="List" border fit highlight-current-row style="width: 100%">
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
import { DownloadReportAsImage, ReportAsDataUrl } from "@/Report/FunctionalityReport";
import { saveAs } from "file-saver";
import JSZip from "jszip";
import UploadExcelComponent from "@/components/UploadExcel/index.vue";

export default {
  components: { DrawerPrint, UploadExcelComponent },
  data() {
    return {
      fileList: [],
      List: [],
      loading: false,
    };
  },
  methods: {
    async DownloadAsImage(type, data) {
      this.loading = true;
      await DownloadReportAsImage(type, data);
      this.loading = false;
    },
    async DownloadAll(type, data) {
      this.loading = true;
      data.map(async (item) => await this.DownloadAsImage(type, item));
      /*
      var zip = new JSZip();
      data.map(async (item) =>
        zip.file(item.name + ".png", await ReportAsDataUrl(type, item), {
          base64: true,
        })
      );

      zip.generateAsync({ type: "blob" }).then(function (content) {
        // see FileSaver.js
        saveAs(content, "Qr_Code.zip");
      });*/
      this.loading = false;
    },
    handleSuccess({ results, header }) {
      this.loading = true;
      this.List = results;
      this.List.map((el) => {
        el.Name = el.name.slice(el.name.lastIndexOf(",") + 1, el.name.lastIndexOf("."));
        //el.qr = el.name.substring(0, el.name.lastIndexOf(".")).replaceAll("-", "");
        // el.qr = el.qr.replaceAll("'", "");
      });
      this.loading = false;
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
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
    /*
    handleSuccess(response, file, fileList) {
      this.List = fileList;
      this.List.map((el) => {
        console.log("xx", el.name);
        el.Name = el.name.slice(el.name.lastIndexOf(",") + 1, el.name.lastIndexOf("."));
        el.qr = el.name.substring(0, el.name.lastIndexOf(".")).replaceAll("-", "");
        el.qr = el.qr.replaceAll("'", "");
      });
      console.log(response, file, fileList);
    },*/
    handlePreview(file) {
      console.log(file);
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `The limit is 3, you selected ${files.length} files this time, add up to ${
          files.length + fileList.length
        } totally`
      );
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`Cancel the transfert of ${file.name} ?`);
    },
  },
};
</script>
