<template>
  <div class="app-container">
    <el-card class="box-card">
      <el-form
        ref="dataForm"
        :rules="rulesForm"
        :model="tempForm"
        label-position="top"
        label-width="70px"
      >
        <el-row :gutter="24">
          <el-col :span="8">
            <pan-thumb
              :image="tempForm.Logo"
              :height="'100px'"
              :width="'100px'"
            >
              <el-button
                type="primary"
                icon="el-icon-upload"
                @click="imagecropperShow = true"
              ></el-button>
            </pan-thumb>

            <image-cropper
              v-show="imagecropperShow"
              :key="imagecropperKey"
              :width="150"
              :height="150"
              lang-type="ar"
              TableName="CompanyInfo"
              :ObjectId="1"
              @close="close"
              @crop-upload-success="cropSuccess"
              @SetImage="SetBaseImage"
            />
          </el-col>
          <el-col :span="8">
            <el-form-item v-bind:label="$t('Company.NickName')" prop="nickName">
              <el-input type="text" v-model="tempForm.nickName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item v-bind:label="$t('Company.Name')" prop="Name">
              <el-input type="text" v-model="tempForm.Name"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item v-bind:label="$t('Company.Fax')" prop="Fax">
              <el-input type="text" v-model="tempForm.Fax"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-bind:label="$t('Company.Address')" prop="address">
              <el-input type="text" v-model="tempForm.Address"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item
              v-bind:label="$t('Company.PhoneNumber2')"
              prop="PhoneNumber2"
            >
              <el-input type="text" v-model="tempForm.PhoneNumber2"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              v-bind:label="$t('Company.PhoneNumber1')"
              prop="PhoneNumber1"
            >
              <el-input type="text" v-model="tempForm.PhoneNumber1"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item
              v-bind:label="$t('Company.TaxNumber')"
              prop="TaxNumber"
            >
              <el-input type="text" v-model="tempForm.TaxNumber"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              v-bind:label="$t('Company.RateNumber')"
              prop="RateNumber"
            >
              <el-input type="text" v-model="tempForm.RateNumber"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item v-bind:label="$t('Company.Website')" prop="website">
              <el-input type="text" v-model="tempForm.Website"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-bind:label="$t('Company.Email')" prop="Email">
              <el-input type="text" v-model="tempForm.Email"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item
          v-bind:label="$t('Company.FooterReport')"
          prop="FooterReport"
        >
          <el-input type="textarea" v-model="tempForm.FooterReport"></el-input>
        </el-form-item>
        <el-form-item
          v-bind:label="$t('Company.BusinessDescription')"
          prop="BusinessDescription"
        >
          <el-input
            type="textarea"
            v-model="tempForm.BusinessDescription"
          ></el-input>
        </el-form-item>
      </el-form>

      <el-button type="primary" @click="updateData()">{{
        $t("AddVendors.Save")
      }}</el-button>
    </el-card>
    <tinymce :width="900" :height="300" id="02s" v-model="tempForm.HeaderReport"  />
  </div>
</template>

<script>
import Tinymce from "@/components/Tinymce";
import { GetCompanyInfo, Edit } from "@/api/CompanyInfo";
import ImageCropper from "@/components/ImageCropper";
import PanThumb from "@/components/PanThumb";
export default {
  name: "TinymceDemo",
  components: { Tinymce, ImageCropper, PanThumb },
  data() {
    return {
      imagecropperShow: false,
      imagecropperKey: 0,
      tempForm: {
        Id: undefined,
        Name: "",
        NickName: "",
        TaxNumber: "",
        Logo: "",
        BusinessDescription: "",
        RateNumber: "",
        Address: "",
        PhoneNumber1: "",
        PhoneNumber2: "",
        Fax: "",
        Email: "",
        Website: "",
        HeaderReport: "",
        FooterReport: ""
      },
      rulesForm: {
        Name: [
          {
            required: true,
            message: "يجب إدخال إسم ",
            trigger: "blur"
          },
          {
            minlength: 3,
            maxlength: 50,
            message: "الرجاء إدخال إسم لا يقل عن 3 أحرف و لا يزيد عن 50 حرف",
            trigger: "blur"
          }
        ]
      }
    };
  },
  created() {
    this.getdata();
  },
  methods: {
    SetBaseImage(base) {
      console.log(base);
      this.tempForm.Logo = base;
    },
    cropSuccess(resData) {
      console.log("i'm here " + resData);
      this.imagecropperShow = false;
      this.imagecropperKey = this.imagecropperKey + 1;
    },
    close() {
      this.imagecropperShow = false;
    },
    getdata() {
      GetCompanyInfo()
        .then(response => {
          // handle success
          if(response)
          this.tempForm = response;
          this.loading = false;
        })
        .catch(error => {
          // handle error
          console.log(error);
        });
    },
    updateData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          console.log(this.tempForm.HeaderReport);
          Edit(this.tempForm)
            .then(response => {
              this.getdata();
              this.dialogFormVisible = false;
              this.$notify({
                title: "تم",
                message: "تم التعديل بنجاح",
                type: "success",
                duration: 2000
              });
            })
            .catch(error => {
              console.log(error);
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }
  }
};
</script>

<style scoped>
.editor-content {
  margin-top: 20px;
}
</style>

