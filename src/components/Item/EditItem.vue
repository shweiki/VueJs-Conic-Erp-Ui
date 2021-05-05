<template>
  <div>
    <el-button
      icon="el-icon-edit"
      v-permission="['Admin']"
      circle
      @click="getdata()"
    ></el-button>

    <el-dialog
      v-el-drag-dialog
      :visible.sync="Visibles"
      @opened="$refs['ItemName'].focus()"
      @closed="focus"
    >
      <div slot="title" class="dialog-footer">
        <el-col :span="4">
          <el-button
            icon="el-icon-finished"
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
        <el-collapse
          style="display:  table-row-group;"
          v-model="activeNames"
          accordion
        >
          <el-collapse-item title="Info" name="Info">
            <el-row>
              <el-col :span="16">
                <el-form-item v-bind:label="$t('Items.ItemName')" prop="Name">
                  <el-input
                    ref="ItemName"
                    type="text"
                    v-model="tempForm.Name"
                  ></el-input>
                  <el-checkbox v-model="tempForm.IsPrime"
                    >اظهار على شاشة المبيعات</el-checkbox
                  >
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <pan-thumb
                  :image="tempForm.Avatar"
                  :height="'100px'"
                  :width="'100px'"
                  :hoverable="false"
                >
                  <el-button
                    type="primary"
                    icon="el-icon-upload"
                    @click="imagecropperShow = true"
                  ></el-button>
                  <web-cam TableName="Item" :ObjectID="tempForm.Id" />
                </pan-thumb>
                <image-cropper
                  v-show="imagecropperShow"
                  :key="imagecropperKey"
                  :width="150"
                  :height="150"
                  lang-type="ar"
                  TableName="Item"
                  :ObjectID="tempForm.Id"
                  @close="close"
                  @crop-upload-success="cropSuccess"
                /> </el-col
            ></el-row>

            <el-row>
              <el-col :span="8">
                <el-form-item v-bind:label="$t('Items.Cost')" prop="CostPrice">
                  <el-input-number
                    v-model="tempForm.CostPrice"
                    :precision="2"
                    :step="0.1"
                    :min="0.0"
                    :max="1500"
                  ></el-input-number>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item
                  v-bind:label="$t('Items.PurchaseCost')"
                  prop="OtherPrice"
                >
                  <el-input-number
                    v-model="tempForm.OtherPrice"
                    :precision="2"
                    :step="0.1"
                    :min="0.0"
                    :max="1500"
                  ></el-input-number>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item
                  v-bind:label="$t('Items.SellingPrice')"
                  prop="SellingPrice"
                >
                  <el-input-number
                    v-model="tempForm.SellingPrice"
                    :precision="2"
                    :step="0.1"
                    :min="0.0"
                    :max="1500"
                  ></el-input-number>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item
                  v-bind:label="$t('Items.LowerOrder')"
                  prop="LowOrder"
                >
                  <el-input-number
                    v-model="tempForm.LowOrder"
                    :min="1"
                    :max="100000000"
                  ></el-input-number>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item v-bind:label="$t('Items.Tax')" prop="Tax">
                  <el-input-number
                    v-model="tempForm.Tax"
                    :precision="2"
                    :step="0.01"
                    :min="0.01"
                    :max="1"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item v-bind:label="$t('Items.Barcode')" prop="Barcode">
                  <el-input
                    v-model="tempForm.Barcode"
                    suffix-icon="fa fa-barcode"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item
                  v-bind:label="$t('Items.Notes')"
                  prop="Description"
                >
                  <el-input
                    type="textarea"
                    v-model="tempForm.Description"
                  ></el-input>
                </el-form-item>
              </el-col> </el-row
          ></el-collapse-item>
          <el-collapse-item title="Qty" name="Qty">
            <inventory-qty :ItemID="tempForm.Id" />
          </el-collapse-item>
          <el-collapse-item title="Category" name="Category">
            <category
              :Value="tempForm.Category"
              @Set="
                v => {
                  tempForm.Category = v;
                }
              "
            />
            <el-tag
              v-for="item of Array.from((tempForm.Category || '').split(','))"
              :key="item"
            >
              {{ item }}
            </el-tag>
          </el-collapse-item>
        </el-collapse>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { Edit, GetItemByID } from "@/api/Item";
import InventoryQty from "@/components/Item/InventoryQty";
import PanThumb from "@/components/PanThumb";
import WebCam from "@/components/WebCam";
import ImageCropper from "@/components/ImageCropper";
import { GetFileByObjID } from "@/api/File";
import permission from "@/directive/permission/index.js";
import Category from "./Category";
import elDragDialog from "@/directive/el-drag-dialog"; // base on element-ui

export default {
  components: { InventoryQty, PanThumb, WebCam, ImageCropper, Category },
  props: {
    ItemId: {
      type: Number,
      default: undefined
    }
  },
  directives: { permission, elDragDialog },
  data() {
    return {
      Visibles: false,
      activeNames: "Info",
      tempForm: {},
      imagecropperShow: false,
      imagecropperKey: 0,
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
  methods: {
    getdata() {
      GetItemByID({ ID: this.ItemId }).then(response => {
        // handle success
        this.tempForm = response;
        this.GetImageItem(this.tempForm.Id);

        this.Visibles = true;
      });
    },
    focus() {
      this.$emit("focus");
    },
    updateData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          Edit(this.tempForm)
            .then(response => {
              this.Visibles = false;
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
    },
    GetImageItem(ID) {
      GetFileByObjID({ TableName: "Item", ObjID: ID })
        .then(response => {
          if (response) this.tempForm.Avatar = response.File;
          else this.tempForm.Avatar = this.$store.getters.CompanyInfo.Logo;
        })
        .catch(err => {
          console.log(err);
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
<style scoped>
.el-collapse-item {
  display: block;
}
</style>