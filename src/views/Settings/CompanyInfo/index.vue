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
            <pan-thumb :image="tempForm.Logo" :height="'100px'" :width="'100px'">
              <el-button
                type="primary"
                icon="el-icon-upload"
                @click="imagecropperShow = true"
              />
            </pan-thumb>

            <image-cropper
              v-show="imagecropperShow"
              :key="imagecropperKey"
              :width="150"
              :height="150"
              lang-type="ar"
              table-name="CompanyInfo"
              :object-id="1"
              @close="close"
              @crop-upload-success="cropSuccess"
              @SetImage="SetBaseImage"
            />
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('Company.NickName')" prop="nickName">
              <el-input v-model="tempForm.nickName" type="text" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('Company.Name')" prop="Name">
              <el-input v-model="tempForm.Name" type="text" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item :label="$t('Company.Fax')" prop="Fax">
              <el-input v-model="tempForm.Fax" type="text" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('Company.Address')" prop="address">
              <el-input v-model="tempForm.Address" type="text" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item :label="$t('Company.PhoneNumber2')" prop="PhoneNumber2">
              <el-input v-model="tempForm.PhoneNumber2" type="text" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('Company.PhoneNumber1')" prop="PhoneNumber1">
              <el-input v-model="tempForm.PhoneNumber1" type="text" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item :label="$t('Company.TaxNumber')" prop="TaxNumber">
              <el-input v-model="tempForm.TaxNumber" type="text" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('Company.RateNumber')" prop="RateNumber">
              <el-input v-model="tempForm.RateNumber" type="text" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item :label="$t('Company.Website')" prop="website">
              <el-input v-model="tempForm.Website" type="text" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('Company.Email')" prop="Email">
              <el-input v-model="tempForm.Email" type="text" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item
          :label="$t('Company.BusinessDescription')"
          prop="BusinessDescription"
        >
          <el-input v-model="tempForm.BusinessDescription" type="textarea" />
        </el-form-item>
      </el-form>

      <el-button type="primary" @click="updateData()">{{
        $t("AddVendors.Save")
      }}</el-button>
    </el-card>
  </div>
</template>

<script>
import { GetCompanyInfo, Edit } from '@/api/CompanyInfo'
import ImageCropper from '@/components/ImageCropper'
import PanThumb from '@/components/PanThumb'
export default {
  components: { ImageCropper, PanThumb },
  data() {
    return {
      imagecropperShow: false,
      imagecropperKey: 0,
      tempForm: {
        Id: undefined,
        Name: '',
        NickName: '',
        TaxNumber: '',
        Logo: '',
        BusinessDescription: '',
        RateNumber: '',
        Address: '',
        PhoneNumber1: '',
        PhoneNumber2: '',
        Fax: '',
        Email: '',
        Website: ''
      },
      rulesForm: {
        Name: [
          {
            required: true,
            message: 'يجب إدخال إسم ',
            trigger: 'blur'
          },
          {
            min: 3,
            max: 50,
            message: 'الرجاء إدخال إسم لا يقل عن 3 أحرف و لا يزيد عن 50 حرف',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  created() {
    this.getdata()
  },
  methods: {
    SetBaseImage(base) {
      console.log(base)
      this.tempForm.Logo = base
    },
    cropSuccess(resData) {
      console.log("i'm here " + resData)
      this.imagecropperShow = false
      this.imagecropperKey = this.imagecropperKey + 1
    },
    close() {
      this.imagecropperShow = false
    },
    getdata() {
      GetCompanyInfo()
        .then((response) => {
          // handle success
          if (response) this.tempForm = response
          this.loading = false
        })
        .catch((error) => {
          // handle error
          console.log(error)
        })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          Edit(this.tempForm)
            .then((response) => {
              this.getdata()
              this.dialogFormVisible = false
              this.$notify({
                title: 'تم',
                message: 'تم التعديل بنجاح',
                type: 'success',
                duration: 2000
              })
            })
            .catch((error) => {
              console.log(error)
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style scoped>
.editor-content {
  margin-top: 20px;
}
</style>
