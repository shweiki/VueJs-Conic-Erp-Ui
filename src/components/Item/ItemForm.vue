<template>
  <div>
    <el-col :span="4">
      <el-button
        icon="fa fa-save"
        style="float: left"
        type="primary"
        @click="confirmData()"
      />
    </el-col>

    <el-form ref="dataForm" :rules="rulesForm" :model="tempForm">
      <el-row type="flex">
        <el-col :span="16">
          <el-form-item v-bind:label="$t('Items.ItemName')" prop="Name">
            <el-input ref="ItemName" type="text" v-model="tempForm.Name"></el-input>
            <el-checkbox v-model="tempForm.IsPrime">اظهار على شاشة المبيعات</el-checkbox>
            <el-checkbox v-model="tempForm.TakeBon">تتبع جمركي</el-checkbox>
          </el-form-item>
        </el-col>
        <el-col v-if="isEdit" :span="8">
          <pan-thumb
            v-if="tempForm"
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
            <web-cam TableName="Item" :ObjectId="tempForm.Id" />
            <image-cropper
              v-show="imagecropperShow"
              :key="imagecropperKey"
              :width="150"
              :height="150"
              lang-type="ar"
              TableName="Item"
              :ObjectId="tempForm.Id"
              @close="close"
              @crop-upload-success="cropSuccess"
            />
          </pan-thumb> </el-col
      ></el-row>

      <el-row type="flex">
        <el-col :span="8">
          <el-form-item v-bind:label="$t('Items.Cost')" prop="CostPrice">
            <el-input-number
              v-model="tempForm.CostPrice"
              :precision="2"
              :step="0.1"
              :min="0.0"
              :max="1500"
              @focus="$event.target.select()"
            ></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item v-bind:label="$t('Items.PurchaseCost')" prop="OtherPrice">
            <el-input-number
              v-model="tempForm.OtherPrice"
              :precision="2"
              :step="0.1"
              :min="0.0"
              :max="1500"
              @focus="$event.target.select()"
            ></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item v-bind:label="$t('Items.SellingPrice')" prop="SellingPrice">
            <el-input-number
              v-model="tempForm.SellingPrice"
              :precision="2"
              :step="0.1"
              :min="0.0"
              :max="1500"
              @focus="$event.target.select()"
            ></el-input-number>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex">
        <el-col :span="12">
          <el-form-item v-bind:label="$t('Items.LowerOrder')" prop="LowOrder">
            <el-input-number
              v-model="tempForm.LowOrder"
              :min="1"
              :max="100000000"
              @focus="$event.target.select()"
            ></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item v-bind:label="$t('Items.Tax')" prop="Tax">
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
      <el-row type="flex" justify="space-around">
        <el-col :span="10">
          <el-form-item v-bind:label="$t('Items.MenuItem')" prop="MenuItem">
            <Menu-Item
              :Value="tempForm.MenuItem"
              @Set="
                (v) => {
                  tempForm.MenuItem = v;
                }
              "
            />
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item v-bind:label="$t('Items.UnitItem')" prop="UnitItem">
            <Unit-Item
              :Value="tempForm.UnitItem"
              @Set="
                (v) => {
                  tempForm.UnitItem = v;
                }
              "
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex">
        <el-col :span="12">
          <el-form-item v-bind:label="$t('Items.Barcode')" prop="Barcode">
            <el-input v-model="tempForm.Barcode" suffix-icon="fa fa-barcode"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item v-bind:label="$t('Items.Notes')" prop="Description">
            <el-input type="textarea" v-model="tempForm.Description"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import { CreateItem as Create, Edit, GetItemById } from "@/api/Item";
import PanThumb from "@/components/PanThumb";
import WebCam from "@/components/WebCam";
import ImageCropper from "@/components/ImageCropper";
import { GetFileByObjId } from "@/api/File";
import permission from "@/directive/permission/index.js";
import MenuItem from "./MenuItem";
import UnitItem from "./UnitItem";

export default {
  name: "ItemForm",
  components: {
    PanThumb,
    WebCam,
    ImageCropper,
    MenuItem,
    UnitItem,
  },
  props: {
    ItemId: {
      type: Number,
      default: undefined,
    },
    isEdit: {
      type: Boolean,
      default: false,
    },
  },
  directives: { permission },
  mounted() {
    if (this.isEdit) {
      this.getdata(this.ItemId || this.$route.params.id);
    }
  },
  data() {
    return {
      activeNames: "Info",
      imagecropperShow: false,
      imagecropperKey: 0,
      tempForm: {
        Id: undefined,
        Name: "",
        CostPrice: 0.0,
        SellingPrice: 0.0,
        OtherPrice: 0.0,
        LowOrder: 0,
        Tax: 0.0,
        Rate: 0,
        IsPrime: false,
        TakeBon: false,
        Barcode: "",
        Description: "",
        Ingredients: null,
        UnitItem: "",
      },
      rulesForm: {
        Name: [
          {
            required: true,
            message: "يجب إدخال إسم ",
            trigger: "blur",
          },
          {
            min: 3,
            max: 50,
            message: "الرجاء إدخال إسم لا يقل عن 3 أحرف و لا يزيد عن 50 حرف",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    getdata(v) {
      GetItemById({ Id: v }).then((response) => {
        // handle success
        this.tempForm = response;
        console.log("this.tempForm.Id", this.$store.getters.CompanyInfo.Logo);
        this.GetImageItem(this.tempForm.Id);
      });
    },
    focus() {
      this.$emit("focus");
    },
    restTemp() {
      this.tempForm = {
        Id: undefined,
        Name: "",
        CostPrice: 0.0,
        SellingPrice: 0.0,
        OtherPrice: 0.0,
        LowOrder: 0,
        Tax: 0.0,
        Rate: 0,
        IsPrime: false,
        TakeBon: false,
        Barcode: "",
        Description: "",
        Ingredients: null,
        UnitItem: "",
      };
    },
    confirmData() {
      this.$refs["dataForm"].validate(async (valid) => {
        if (valid) {
          let Done;
          if (this.isEdit != true) {
            Done = await Create(this.tempForm)
              .then((res) => {
                if (res) {
                  return true;
                } else return false;
              })
              .catch((error) => {
                return false;
              });
          } else {
            Done = await Edit(this.tempForm)
              .then((res) => {
                if (res) return true;
                else return false;
              })
              .catch((error) => {
                return false;
              });
          }
          console.log(("done", this.isEdit));

          if (Done) {
            this.restTemp();
            this.$notify({
              title: "تم " + this.isEdit == true ? "تعديل" : "إضافة" + " ",
              message: "تم " + this.isEdit == true ? "تعديل" : "إضافة" + "   بنجاح",
              type: "success",
              position: "top-left",
              duration: 1000,
              showClose: false,
            });
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    GetImageItem(ID) {
      GetFileByObjId({ TableName: "Item", ObjId: ID })
        .then((response) => {
          if (response) this.tempForm.Avatar = response.FileUrl;
          else this.tempForm.Avatar = this.$store.getters.CompanyInfo.Logo || "";
        })
        .catch((err) => {
          console.log(err);
        });
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
<style scoped>
.el-collapse-item {
  display: block;
}
</style>
