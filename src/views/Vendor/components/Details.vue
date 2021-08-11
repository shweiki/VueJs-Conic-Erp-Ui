<template>
  <div>
    <el-row>
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
            <web-cam TableName="Vendor" :ObjectId="Vendor.Id" />
          </pan-thumb>
          <image-cropper
            v-show="imagecropperShow"
            :key="imagecropperKey"
            :width="150"
            :height="150"
            lang-type="ar"
            TableName="Vendor"
            :ObjectId="Vendor.Id"
            @close="close"
            @crop-upload-success="cropSuccess"
          />
          <el-col :span="24">
            <el-tag v-if="Vendor.HaveFaceOnDevice == true" type="success"
              >يوجد بصمة وجه</el-tag
            >
            <el-tag v-if="Vendor.HaveFaceOnDevice == false" type="danger"
              >لا يوجد بصمة وجه</el-tag
            >
          </el-col>
          <el-col :span="24" v-if="Vendor.Status != -2">
            <el-button @click="dialogOprationVisible = true" type="danger" plain
              >Black List</el-button
            >
          </el-col>
          <el-col
            :span="24"
            v-if="checkPermission(['Admin']) && Vendor.Status == -2"
          >
            <el-button
              @click="dialogOprationVisible2 = true"
              type="success"
              plain
              >الغاء Black List</el-button
            >
          </el-col>
        </div>
      </el-col>
      <el-col :span="20">
        <el-row type="flex">
          <el-col :span="4">
            <span>رقم العضوية</span>
          </el-col>
          <el-col :span="4">
            <el-input disabled v-model="Vendor.Id"></el-input>
            <!--
            <el-col :span="12">
              <el-input disabled v-model="Vendor.Tag"></el-input>
            </el-col>-->
          </el-col>
          <el-col :span="4">
            <span>اسم المشترك</span>
          </el-col>
          <el-col :span="12">
            <el-input disabled v-model="Vendor.Name"></el-input>
          </el-col>
        </el-row>
        <el-row type="flex">
          <el-col :span="4">
            <span>العمر</span>
          </el-col>
          <el-col :span="8">
            <el-input disabled v-model="Vendor.Age"></el-input>
          </el-col>
          <el-col :span="4">
            <span>تاريخ الميلاد</span>
          </el-col>
          <el-col :span="8">
            <el-date-picker
              format="dd/MM/yyyy"
              v-model="Vendor.DateofBirth"
              type="date"
              disabled
            ></el-date-picker>
          </el-col>
        </el-row>
        <el-row type="flex">
          <el-col :span="4">

            <span>اخر زيارة</span>
          </el-col>
          <el-col :span="8">
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
            <span>تاريخ البدء</span>
          </el-col>
          <el-col :span="8">
            <el-date-picker
              v-if="Vendor.ActiveVendorShip"
              format="dd/MM/yyyy"
              disabled
              v-model="Vendor.ActiveVendorShip.StartDate"
              type="date"
            ></el-date-picker>
          </el-col>
          <el-col :span="4">
            <span>تاريخ الانتهاء</span>
          </el-col>
          <el-col :span="8">
            <el-date-picker
              v-if="Vendor.ActiveVendorShip"
              format="dd/MM/yyyy"
              disabled
              v-model="Vendor.ActiveVendorShip.EndDate"
              type="date"
            ></el-date-picker>
          </el-col>
        </el-row>
        <el-row type="flex">
          <el-col :span="4">
            <span>الايام المتبقية</span>
          </el-col>
          <el-col :span="8">
            <span v-if="Vendor.ActiveVendorShip"
              >(
              {{
                Math.round(
                  Math.abs(
                    (new Date() - new Date(Vendor.ActiveVendorShip.EndDate)) /
                      (24 * 60 * 60 * 1000)
                  )
                )
              }}
              )</span
            >
          </el-col>
          <el-col :span="4">
            <span>نوع الاشتراك</span>
          </el-col>
          <el-col :span="8">
            <el-tag v-if="Vendor.ActiveVendorShip"
              >{{ Vendor.ActiveVendorShip.Type + " - "
              }}{{ Vendor.ActiveVendorShip.Name }}</el-tag
            >
          </el-col>
        </el-row>
        <el-row type="flex">
          <el-col :span="4">
            <span>الرصيد</span>
          </el-col>
          <el-col :span="8">
            <span>{{
              (Vendor.TotalCredit - Vendor.TotalDebit).toFixed(this.$store.getters.settings.ToFixed) +
                $t("VendorList.JOD")
            }}</span>
          </el-col>
          <el-col :span="4">
            <span>حالة المشترك</span>
          </el-col>
          <el-col :span="8">
            <Status-Tag :Status="Vendor.Status" TableName="Vendor" />
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <el-dialog
      style="margin-top: -13vh"
      :show-close="false"
      title="رفض العضو و ارساله الى القائمة السوداء"
      :visible.sync="dialogOprationVisible"
    >
      <el-form
        ref="dataOpration"
        :model="tempOpration"
        label-position="top"
        label-width="70px"
        style="width: 400px margin-left:50px"
      >
        <el-form-item
          label="ملاحظات للعملية "
          prop="Description"
          :rules="[
            {
              required: true,
              message: 'لايمكن ترك السبب فارغ',
              trigger: 'blur'
            }
          ]"
        >
          <el-input
            type="textarea"
            v-model="tempOpration.Description"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" @click="BlackList()"
          >ارسال الى القائمة السوداء</el-button
        >
      </div>
    </el-dialog>
    <el-dialog
      style="margin-top: -13vh"
      :show-close="false"
      title="الغاء الرفض"
      :visible.sync="dialogOprationVisible2"
    >
      <el-form
        ref="dataOpration"
        :model="tempOpration"
        label-position="top"
        label-width="70px"
        style="width: 400px margin-left:50px"
      >
        <el-form-item
          label="ملاحظات للعملية "
          prop="Description"
          :rules="[
            {
              required: true,
              message: 'لايمكن ترك السبب فارغ',
              trigger: 'blur'
            }
          ]"
        >
          <el-input
            type="textarea"
            v-model="tempOpration.Description"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="success" @click="RemoveBlackList()"
          >فك الرفض</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import checkPermission from "@/utils/permission";

import PanThumb from "@/components/PanThumb";
import WebCam from "@/components/WebCam";
import ImageCropper from "@/components/ImageCropper";


import { ChangeObjStatusByTableName } from "@/api/Oprationsys";
import StatusTag from "@/components/Oprationsys/StatusTag";

export default {
  components: {  PanThumb, WebCam, StatusTag, ImageCropper },
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
    RemoveBlackList() {
      this.$refs["dataOpration"].validate(valid => {
        if (valid) {
          ChangeObjStatusByTableName({
            ObjId: this.Vendor.Id,
            TableName: "Vendor",
            Status: -1,
            Description: this.tempOpration.Description
          }).then(response => {
            this.$notify({
              title: "تم ",
              message: "تم الإضافة بنجاح",
              type: "success",
              duration: 2000
            });
            this.$nextTick(() => {
              this.$router.replace({
                path: "/redirect" + this.$route.fullPath
              });
            });
          });
        }
      });
    },
    BlackList() {
      this.$refs["dataOpration"].validate(valid => {
        if (valid) {
          ChangeObjStatusByTableName({
            ObjId: this.Vendor.Id,
            TableName: "Vendor",
            Status: -2,
            Description: this.tempOpration.Description
          }).then(response => {
            this.$notify({
              title: "تم ",
              message: "تم الإضافة بنجاح",
              type: "success",
              duration: 2000
            });
            this.$nextTick(() => {
              this.$router.replace({
                path: "/redirect" + this.$route.fullPath
              });
            });
          });
        }
      });
    },
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
