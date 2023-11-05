<template>
  <div>
    <el-row type="flex">
      <el-col :span="4">
        <div style="float: left">
          <pan-thumb
            :image="Vendor.Avatar"
            :height="'100px'"
            :width="'100px'"
            :hoverable="false"
          >
            <el-button
              type="primary"
              icon="el-icon-upload"
              @click="imagecropperShow = true"
            ></el-button>
            <web-cam tableName="Vendor" :ObjectId="Vendor.Id" />
          </pan-thumb>
          <image-cropper
            v-show="imagecropperShow"
            :key="imagecropperKey"
            :width="150"
            :height="150"
            lang-type="ar"
            tableName="Vendor"
            :ObjectId="Vendor.Id"
            @close="close"
            @crop-upload-success="cropSuccess"
          />
        </div>
      </el-col>
      <el-col :span="20">
        <el-row type="flex">
          <el-col :span="4">
            <span>رقم العميل</span>
          </el-col>
          <el-col :span="4">
            <el-input disabled v-model="Vendor.Id"></el-input>
          </el-col>
          <el-col :span="4">
            <span>اسم الشخص</span>
          </el-col>
          <el-col :span="12">
            <el-input disabled v-model="Vendor.Name"></el-input>
          </el-col>
        </el-row>

        <el-row type="flex">
          <el-col :span="4">
            <span>رقم الحساب</span>
          </el-col>
          <el-col :span="8">
            <el-input disabled v-model="Vendor.AccountId"></el-input>
          </el-col>
          <el-col :span="4">
            <span>رقم الهاتف</span>
          </el-col>
          <el-col :span="8">
            <el-input disabled v-model="Vendor.PhoneNumber1"></el-input>
          </el-col>
        </el-row>
        <el-row type="flex">
          <el-col :span="4">
            <span>الرصيد</span>
          </el-col>
          <el-col :span="8">
            <span
              >{{
                (Vendor.TotalCredit - Vendor.TotalDebit).toFixed(
                  this.$store.getters.settings.ToFixed
                )
              }}
              JOD</span
            >
          </el-col>
          <el-col :span="4">
            <span>حالة </span>
          </el-col>
          <el-col :span="8">
            <Status-Tag :status="Vendor.Status" tableName="Vendor" />
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import checkPermission from "@/utils/permission";

import PanThumb from "@/components/PanThumb";
import WebCam from "@/components/WebCam";
import ImageCropper from "@/components/ImageCropper";
import StatusTag from "@/components/Oprationsys/StatusTag";

export default {
  components: { PanThumb, WebCam, StatusTag, ImageCropper },
  props: {
    Vendor: {
      type: Object,
      default: () => {
        return undefined;
      }
    }
  },
  data() {
    return {
      dialogOprationVisible: false,
      dialogOprationVisible2: false,
      imagecropperShow: false,
      imagecropperKey: 0,
      tempOpration: {
        ObjId: undefined,
        OprationId: undefined,
        Description: ""
      }
    };
  },
  methods: {
    checkPermission,
    cropSuccess(resData) {
      this.imagecropperShow = false;
      this.imagecropperKey = this.imagecropperKey + 1;
    },
    close() {
      this.imagecropperShow = false;
    }
  }
};
</script>
