<template>
  <div>
    <el-button
      type="warning"
      icon="el-icon-circle-plus"
      @click="Visible = true"
      :size="$store.getters.size"
    ></el-button>

    <el-dialog
      style="margin-top: -13vh"
      :visible.sync="Visible"
      :show-close="false"
      @opened="$refs['Name'].focus()"
    >
      <div slot="title" class="dialog-footer">
        <el-col :span="4">
          <el-button
            icon="fa fa-save"
            style="float: left"
            type="primary"
            @click="createData()"
          />
        </el-col>
        <el-col :span="20">
          <el-divider> شخص جديد </el-divider>
        </el-col>
      </div>
      <el-form
        :model="tempForm"
        :rules="rulesForm"
        ref="dataForm"
        class="demo-form-inline"
        label-position="top"
      >
        <div>
          <el-radio v-model="tempForm.Type" label="Customer" border>{{
            $t("AddVendors.Customer")
          }}</el-radio>
          <el-radio v-model="tempForm.Type" label="Supplier" border>{{
            $t("AddVendors.Supplier")
          }}</el-radio>
        </div>
        <el-row type="flex">
          <el-col :span="24">
            <el-form-item v-bind:label="$t('CashDrawer.Name')" prop="Name">
              <el-input type="text" ref="Name" v-model="tempForm.Name"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex">
          <el-col :span="12">
            <el-form-item
              label="الرقم الوطني"
              prop="Ssn"
              :rules="[
                {
                  required: false,
                  message: 'لايمكن ترك الرقم الوطني فارغ',
                  trigger: 'blur',
                },
              ]"
            >
              <el-input
                type="text"
                v-model="tempForm.Ssn"
                placeholder="الرقم الوطني"
              ></el-input> </el-form-item
          ></el-col>
          <el-col :span="12">
            <el-form-item
              v-bind:label="$t('AddVendors.Email')"
              prop="Email"
              :rules="[
                {
                  required: false,
                  message: 'Please input email address',
                  trigger: 'blur',
                },
                {
                  type: 'email',
                  message: 'Please input correct email address',
                  trigger: ['blur', 'change'],
                },
              ]"
            >
              <el-input type="text" v-model="tempForm.Email"></el-input> </el-form-item
          ></el-col>
        </el-row>

        <el-row type="flex">
          <el-col :span="12">
            <el-form-item
              v-bind:label="$t('AddVendors.PhoneNumber1')"
              prop="PhoneNumber1"
              :rules="[
                {
                  required: false,
                  message: 'لايمكن ترك الرقم الهاتف فارغ',
                  trigger: 'blur',
                },
              ]"
            >
              <el-input v-model="tempForm.PhoneNumber1" placeholder="رقم الهاتف" />
              <!--
              <VuePhoneNumberInput
                :translations="{
                  countrySelectorLabel: 'رمز البلد',
                  countrySelectorError: 'تاكد من رقم',
                  phoneNumberLabel: 'رقم الهاتف'
                }"
                default-country-code="JO"
                v-model="tempForm.PhoneNumber1"
                :ignored-countries="['LI']"
              /> --></el-form-item
            ></el-col
          >
          <el-col :span="12">
            <el-form-item
              v-bind:label="$t('AddVendors.PhoneNumber2')"
              prop="PhoneNumber2"
            >
              <el-input v-model="tempForm.PhoneNumber2" placeholder="رقم الهاتف" />
              <!--   <VuePhoneNumberInput
                :translations="{
                  countrySelectorLabel: 'رمز البلد',
                  countrySelectorError: 'تاكد من رقم',
                  phoneNumberLabel: 'رقم الهاتف'
                }"
                default-country-code="JO"
                v-model="tempForm.PhoneNumber2"
                :ignored-countries="['LI']"
              />-->
            </el-form-item></el-col
          >
        </el-row>
        <el-form-item v-bind:label="$t('AddVendors.CreditLimit')" prop="CreditLimit">
          <el-input-number
            v-model="tempForm.CreditLimit"
            :precision="2"
            :step="1"
            :min="0.0"
            :max="10000000"
            @focus="$event.target.select()"
          ></el-input-number>
        </el-form-item>
        <el-form-item v-bind:label="$t('AddVendors.Region')" prop="Region">
          <el-input type="text" v-model="tempForm.Region"></el-input>
        </el-form-item>
        <el-form-item v-bind:label="$t('AddVendors.Fax')" prop="Fax">
          <el-input type="text" v-model="tempForm.Fax"></el-input>
        </el-form-item>
        <el-form-item v-bind:label="$t('AddVendors.Description')" prop="Description">
          <el-input type="textarea" v-model="tempForm.Description"></el-input>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { Create, CheckIsExist } from "@/api/Vendor";
import VuePhoneNumberInput from "vue-phone-number-input";
import "vue-phone-number-input/dist/vue-phone-number-input.css";
import "vue-birth-datepicker/dist/vueBirthDatepicker.css"; //into your styles
export default {
  name: "Vendor",
  props: ["Phone"],
  components: { VuePhoneNumberInput },
  data() {
    return {
      Visible: false,
      tempForm: {
        Id: undefined,
        Name: "",
        Ssn: "",
        Region: "",
        Email: "",
        PhoneNumber1: "",
        PhoneNumber2: "",
        Fax: "0",
        CreditLimit: 0.0,
        Description: "",
        IsPrime: false,
        Type: "Customer",
      },
      rulesForm: {
        Name: [
          {
            required: true,
            message: "الرجاء ادخال الاسم",
            trigger: "blur",
          },
          {
            min: 3,
            max: 50,
            message: "الرجاء إدخال إسم لا يقل عن 3 حروف و لا يزيد عن 50 حرف",
            trigger: "blur",
          },
        ],
      },
    };
  },
  watch: {
    Phone(val) {
      if (val) {
        this.tempForm.PhoneNumber1 = val;
      }
    },
  },
  created() {
    this.resetTempForm();
  },
  methods: {
    resetTempForm() {
      this.tempForm = {
        Id: undefined,
        Name: "",
        Ssn: "",
        Region: "",
        Email: "",
        PhoneNumber1: "",
        PhoneNumber2: "",
        Fax: "0",
        CreditLimit: 0.0,
        Description: "",
        IsPrime: false,
        Type: "Customer",
      };
    },
    createData() {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          CheckIsExist({
            Name: this.tempForm.Name,
            //  Ssn: this.tempForm.Ssn,
            PhoneNumber: this.tempForm.PhoneNumber1,
          }).then((res) => {
            if (!res) {
              Create(this.tempForm)
                .then((response) => {
                  this.Visible = false;
                  this.tempForm.Id = response;
                  this.$emit("Set", this.tempForm);

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
                message: " يوجد شخص يحمل نفس رقم الهاتف او الرقم الوطني او الاسم",
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
