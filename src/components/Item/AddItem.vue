<template>
  <div>
    <el-button
      type="warning"
      icon="el-icon-circle-plus"
      :size="$store.getters.size"
      @click="Open = true"
    ></el-button>
    <el-dialog
      style="margin-top: -13vh"
      :show-close="false"
      title="أضافة صنف"
      :visible.sync="Open"
      @opened="$refs['ItemName'].focus()"
      @closed="focus"
    >
      <el-form
        ref="dataForm"
        :rules="rulesForm"
        :model="tempForm"
        label-position="top"
        label-width="70px"
      >
        <el-form-item v-bind:label="$t('Items.ItemName')" prop="Name">
          <el-input ref="ItemName" type="text" v-model="tempForm.Name"></el-input>
        </el-form-item>
        <el-checkbox v-model="tempForm.IsPrime">اظهار على شاشة المبيعات</el-checkbox>
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
      <div slot="footer" class="dialog-footer">
        <el-button @click="Open = false">{{ $t("permission.cancel") }}</el-button>
        <el-button type="primary" @click="createData()">حفظ</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { CreateItem, CheckItemIsExist } from "@/api/Item";
import MenuItem from "./MenuItem.vue";

export default {
  components: { MenuItem },
  props: {
    visible: Boolean,
    barcode: String,
  },
  data() {
    return {
      Open: false,
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
        Barcode: "",
        Description: "",
        Ingredients: null,
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
  watch: {
    visible(val) {
      if (val) this.Open = val;
    },
    barcode(val) {
      if (val) this.tempForm.Barcode = val;
    },
  },
  methods: {
    focus() {
      this.resetTempForm();
      this.$emit("focus");
    },
    resetTempForm() {
      this.tempForm = {
        Id: undefined,
        Name: "",
        CostPrice: 0.0,
        SellingPrice: 0.0,
        OtherPrice: 0.0,
        LowOrder: 0,
        Tax: 0.0,
        Rate: 0,
        Barcode: "",
        IsPrime: false,
        Description: "",
        Status: 0,
        Ingredients: null,
      };
    },
    createData() {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          CheckItemIsExist({
            BarCode: this.tempForm.Barcode,
            Name: this.tempForm.Name,
          }).then((response) => {
            if (!response) {
              CreateItem(this.tempForm)
                .then((response) => {
                  this.Open = false;

                  this.focus();

                  this.$notify({
                    title: "تم ",
                    message: "تم الإضافة بنجاح",
                    type: "success",
                    duration: 2000,
                  });
                })
                .catch((error) => {
                  console.log(error);
                });
            } else {
              this.$notify({
                position: "top-left",
                title: "تم ",
                message: "يوجد صنف يحمل نفس الاسم / الباركود",
                type: "warning",
                duration: 20000,
              });
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
  },
};
</script>
