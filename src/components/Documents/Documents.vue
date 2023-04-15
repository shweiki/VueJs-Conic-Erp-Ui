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
      <el-col :span="6">
        <web-cam :TableName="TableName" :ObjectId="ObjectId" />
      </el-col>
      <el-col :span="6">
        <el-button type="primary" @click="GetFiles" icon="el-icon-refresh"></el-button>
      </el-col>
    </el-row>
    <el-col v-for="item in List" :key="item.Id" v-bind:span="24 / List.length">
      <el-card :body-style="{ padding: '3px' }">
        <el-image
          style="width: 100px; height: 100px"
          :src="item.FileUrl"
          :preview-src-list="srcList"
        >
          <div slot="error" class="image-slot">
            <i class="el-icon-picture-outline"></i>
          </div>
        </el-image>
        <div style="padding: 14px">
          <el-select @change="SetType(item)" v-model="item.Type" placeholder="النوع">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </div>
      </el-card>
    </el-col>
  </div>
</template>

<script>
import { GetFilesByObjId, SetTypeByObjId } from "@/api/File";
import WebCam from "@/components/WebCam";
import ImageCropper from "@/components/ImageCropper";
import ButtonScan from "@/components/Device/ButtonScan.vue";

export default {
  components: { ImageCropper, WebCam, ButtonScan },
  props: {
    ObjectId: {
      type: Number,
      default: () => {
        return undefined;
      },
    },
    TableName: {
      type: String,
      default: () => {
        return undefined;
      },
    },
  },
  watch: {
    ObjectId(val) {
      if (val) this.GetFiles();
    },
  },
  //  props: ["ObjectId", "TableName"],
  created() {
    //   this.GetFiles();
  },
  data() {
    return {
      srcList: [],
      List: [],
      imagecropperShow: false,
      imagecropperKey: 0,
      options: [
        {
          value: "ProfilePicture",
          label: "شخصية",
        },
        {
          value: "ID",
          label: "الهوية",
        },
        {
          value: "Passport",
          label: "جواز",
        },
      ],
      value: "",
    };
  },
  methods: {
    GetFiles() {
      GetFilesByObjId({ TableName: this.TableName, ObjId: this.ObjectId })
        .then((response) => {
          this.List = response;
          this.srcList = response.map((x) => x.FileUrl);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    SetType(item) {
      SetTypeByObjId({ Id: item.Id, Type: item.Type }).then((res) => {
        this.$notify({
          title: "تم ",
          message: "تم الإضافة بنجاح " + res + " ",
          type: "success",
          duration: 2000,
        });
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
