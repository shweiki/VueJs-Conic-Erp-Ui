<template>
  <div>
    <el-button
      v-permission="['admin']"
      icon="el-icon-edit"
      @click="getdata()"
    />

    <el-dialog
      v-el-drag-dialog
      :visible.sync="Visibles"
      @opened="$refs['ItemName'].focus()"
      @closed="focus"
    >
      <div slot="title" class="dialog-footer">
        <el-col :span="4">
          <el-button
            icon="fa fa-save"
            style="float: left"
            type="primary"
            @click="updateData()"
          />
        </el-col>
        <el-col :span="20">
          <el-divider> تعديل صنف {{ tempForm.Id }}</el-divider>
        </el-col>
      </div>

      <el-form ref="dataForm" :rules="rulesForm" :model="tempForm">
        <el-row type="flex">
          <el-col :span="16">
            <el-form-item :label="$t('Items.ItemName')" prop="Name">
              <el-input ref="ItemName" v-model="tempForm.Name" type="text" />
              <el-checkbox
                v-model="tempForm.IsPrime"
              >اظهار على شاشة المبيعات</el-checkbox>
              <el-checkbox v-model="tempForm.TakeBon">تتبع جمركي</el-checkbox>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <pan-thumb
              :image="tempForm.avatar"
              :height="'100px'"
              :width="'100px'"
              :hoverable="false"
            >
              <el-button
                type="primary"
                icon="el-icon-upload"
                @click="imagecropperShow = true"
              />
              <image-cropper
                v-show="imagecropperShow"
                :key="imagecropperKey"
                :width="150"
                :height="150"
                lang-type="ar"
                table-name="Item"
                :object-id="tempForm.Id"
                @close="close"
                @crop-upload-success="cropSuccess"
              />
              <WebCam table-name="Item" :object-id="tempForm.Id" /> </pan-thumb></el-col></el-row>

        <el-row type="flex">
          <el-col :span="8">
            <el-form-item :label="$t('Items.Cost')" prop="CostPrice">
              <el-input-number
                v-model="tempForm.CostPrice"
                :precision="2"
                :step="0.1"
                :min="0.0"
                :max="1500"
                @focus="$event.target.select()"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('Items.PurchaseCost')" prop="OtherPrice">
              <el-input-number
                v-model="tempForm.OtherPrice"
                :precision="2"
                :step="0.1"
                :min="0.0"
                :max="1500"
                @focus="$event.target.select()"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('Items.SellingPrice')" prop="SellingPrice">
              <el-input-number
                v-model="tempForm.SellingPrice"
                :precision="2"
                :step="0.1"
                :min="0.0"
                :max="1500"
                @focus="$event.target.select()"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex">
          <el-col :span="12">
            <el-form-item :label="$t('Items.LowerOrder')" prop="LowOrder">
              <el-input-number
                v-model="tempForm.LowOrder"
                :min="1"
                :max="100000000"
                @focus="$event.target.select()"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('Items.Tax')" prop="Tax">
              <el-input-number
                v-model="tempForm.Tax"
                :precision="2"
                :step="0.01"
                :min="0.0"
                :max="1"
                @focus="$event.target.select()"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex">
          <el-col :span="12">
            <el-form-item :label="$t('Items.Barcode')" prop="Barcode">
              <el-input v-model="tempForm.Barcode" suffix-icon="fa fa-barcode" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('Items.Notes')" prop="Description">
              <el-input v-model="tempForm.Description" type="textarea" />
            </el-form-item>
          </el-col>
        </el-row>
        <Inventory-Qty :item-id="tempForm.Id" />
        <Menu-Item
          :value="tempForm.MenuItem"
          @Set="
            (v) => {
              tempForm.MenuItem = v;
            }
          "
        />
        <el-tag
          v-for="item of Array.from((tempForm.MenuItem || '').split(','))"
          :key="item"
        >
          {{ item }}
        </el-tag>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { Edit, GetItemById } from '@/api/Item'
import InventoryQty from '@/components/Item/InventoryQty.vue'
import PanThumb from '@/components/PanThumb'
import WebCam from '@/components/WebCam'
import ImageCropper from '@/components/ImageCropper'
import { GetFileByObjId } from '@/api/File'
import permission from '@/directive/permission/index.js'
import MenuItem from './MenuItem.vue'
import elDragDialog from '@/directive/el-drag-dialog' // base on element-ui

export default {
  components: { InventoryQty, PanThumb, WebCam, ImageCropper, MenuItem },
  directives: { permission, elDragDialog },
  props: {
    ItemId: {
      type: Number,
      default: undefined
    }
  },
  data() {
    return {
      Visibles: false,
      activeNames: 'Info',
      tempForm: {},
      imagecropperShow: false,
      imagecropperKey: 0,
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
  methods: {
    getdata() {
      GetItemById({ Id: this.ItemId }).then((response) => {
        // handle success
        response.Avatar = ''
        this.tempForm = response
        this.GetImageItem(this.tempForm.Id)

        this.Visibles = true
      })
    },
    focus() {
      this.$emit('focus')
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          Edit(this.tempForm)
            .then((response) => {
              this.Visibles = false
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
    },
    GetImageItem(ID) {
      GetFileByObjId({ TableName: 'Item', ObjId: ID })
        .then((response) => {
          if (response) this.tempForm.Avatar = response.FileUrl
          else this.tempForm.Avatar = this.$store.getters.CompanyInfo.Logo
        })
        .catch((err) => {
          console.log(err)
        })
    },
    cropSuccess(resData) {
      this.imagecropperShow = false
      this.imagecropperKey = this.imagecropperKey + 1
    },
    close() {
      this.imagecropperShow = false
    }
  }
}
</script>
<style scoped>
.el-collapse-item {
  display: block;
}
</style>
