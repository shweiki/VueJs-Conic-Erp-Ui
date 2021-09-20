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
      <el-upload
        class="upload-demo"
        action="http://localhost:8090/test1/Files/Upload"
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        :before-remove="beforeRemove"
        :on-success="handleSuccess"
        multiple
        :limit="300"
        :on-exceed="handleExceed"
        name="filex"
        :file-list="fileList"
      >
        <el-button size="small" type="primary">Click to upload</el-button>
        <div slot="tip" class="el-upload__tip">
          jpg/png files with a size less than 500kb
        </div>
      </el-upload>
    </el-card>
    <el-card>
      <el-table :data="List" border fit highlight-current-row style="width: 100%">
        <el-table-column label="name" prop="name" align="center"> </el-table-column>

        <el-table-column label="size" prop="size" align="center"> </el-table-column>
        <el-table-column label="type" prop="raw" align="center">
          <template slot-scope="{ row }">
            {{ row.raw.type }}
          </template>
        </el-table-column>

        <el-table-column label="type" prop="raw" align="center">
          <template slot-scope="{ row }">
            {{ row.raw.lastModifiedDate }}
          </template>
        </el-table-column>

        <el-table-column align="center">
          <template slot-scope="scope">
            <el-col :span="8">
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
      height="100%"
      frameborder="0"
      style="overflow: hidden; width: 100%"
      id="DownloadAsImage"
      class="iframeR"
      :srcdoc="'<head><style> body {zoom: 60%;}</style></head>'"
    ></iframe>
  </div>
</template>

<script>
import DrawerPrint from "@/components/PrintRepot/DrawerPrint.vue";
import { DownloadReportAsImage } from "@/Report/FunctionalityReport";

export default {
  components: { DrawerPrint },
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
      data.name = data.name.split(".")[0];
      data.name = data.name.replaceAll("-", "");
      await DownloadReportAsImage(type, data);
      this.loading = false;
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handleSuccess(response, file, fileList) {
      this.List = fileList;
      console.log(response, file, fileList);
    },
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
