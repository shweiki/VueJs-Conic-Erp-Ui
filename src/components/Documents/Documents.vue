<template>
  <div class="demo-image__preview">
    <el-row type="flex">
      <el-col :span="6">
        <button-scan :ObjectId="ObjectId" :TableName="TableName" />
      </el-col>
      <el-col :span="6">
        <el-button
          type="success"
          icon="el-icon-upload"
          @click="imagecropperShow = true"
        ></el-button>
        <image-cropper
          v-show="imagecropperShow"
          :key="imagecropperKey"
          :width="150"
          :height="150"
          lang-type="ar"
          :TableName="TableName"
          :ObjectId="ObjectId"
          @close="close"
          @crop-upload-success="cropSuccess"
      /></el-col>
      <el-col :span="6"> <web-cam :TableName="TableName" :ObjectId="ObjectId" /> </el-col>
      <el-col :span="6">
        <el-button type="primary" @click="GetFiles" icon="el-icon-refresh"></el-button>
      </el-col>
    </el-row>

    <el-card>
      <el-image
        style="width: 100px; height: 100px"
        v-for="item in List"
        :key="item.Id"
        :src="item.File"
        :preview-src-list="srcList"
      >
        <div slot="placeholder" class="image-slot">
          Loading<span class="dot">...</span>
        </div>
      </el-image></el-card
    >
  </div>
</template>

<script>
import { GetFilesByObjId } from "@/api/File";
import WebCam from "@/components/WebCam";
import ImageCropper from "@/components/ImageCropper";
import ButtonScan from "@/components/Device/ButtonScan";

export default {
  props: ["ObjectId", "TableName"],
  components: { ImageCropper, WebCam, ButtonScan },
  data() {
    return {
      srcList: [],
      List: [],
      imagecropperShow: false,
      imagecropperKey: 0,
    };
  },
  methods: {
    GetFiles() {
      GetFilesByObjId({ TableName: this.TableName, ObjId: this.ObjectId })
        .then((response) => {
          this.List = response;
          this.srcList = response.map((x) => x.File);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    b64toBlob(b64Data, contentType = "", sliceSize = 512) {
      const byteCharacters = atob(b64Data);
      const byteArrays = [];

      for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        const slice = byteCharacters.slice(offset, offset + sliceSize);

        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
      }

      const blob = new Blob(byteArrays, { type: contentType });
      return blob;
    },
    cropSuccess(resData) {
      this.imagecropperShow = false;
      this.imagecropperKey = this.imagecropperKey + 1;
    },
    close() {
      this.imagecropperShow = false;
    },
  },
};
</script>
