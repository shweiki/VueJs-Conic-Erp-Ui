<template>
  <div class="New User">
    <el-button type="text" @click="Visible = true">New User?</el-button>
    <el-dialog
      style="margin-top: -13vh"
      title="سائق جديد"
      :visible.sync="Visible"
      @opened="$refs['DriverName'].focus()"
    >
      <el-form
        :model="tempForm"
        :rules="rulesForm"
        ref="dataForm"
        class="demo-form-inline"
        label-position="top"
      >
        <el-row type="flex">
          <el-col :span="24">
            <el-form-item v-bind:label="$t('CashDrawer.Name')" prop="Name">
              <el-input
                type="text"
                ref="DriverName"
                v-model="tempForm.Name"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex">
          <el-col :span="24">
            <el-form-item
              label="تاريخ ميلاد"
              prop="DateofBirth"
              :rules="[
                {
                  required: true,
                  message: 'لايمكن ترك التاريخ فارغ',
                  trigger: 'blur',
                },
              ]"
            >
              <el-date-picker
                v-model="tempForm.DateofBirth"
                type="date"
                placeholder="تاريخ ميلاد"
                :format="
                  $store.getters.settings.DateTimeFormat.replace(' HH:mm', '')
                "
              ></el-date-picker>

              <el-tag type="success" effect="dark">
                العمر
                {{ getAge(tempForm.DateofBirth) }}
              </el-tag>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex">
          <el-col :span="12">
            <el-form-item label="الرقم الوطني" prop="Ssn">
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
              <el-input
                type="text"
                v-model="tempForm.Email"
              ></el-input> </el-form-item
          ></el-col>
        </el-row>

        <el-row type="flex">
          <el-col :span="12">
            <el-form-item
              v-bind:label="$t('AddVendors.PhoneNumber1')"
              prop="PhoneNumber1"
              :rules="[
                {
                  required: true,
                  message: 'لايمكن ترك الرقم الهاتف فارغ',
                  trigger: 'blur',
                },
              ]"
            >
              <VuePhoneNumberInput
                :translations="{
                  countrySelectorLabel: 'رمز البلد',
                  countrySelectorError: 'تاكد من رقم',
                  phoneNumberLabel: 'رقم الهاتف',
                }"
                default-country-code="JO"
                v-model="tempForm.PhoneNumber1"
                :ignored-countries="['LI']"
              /> </el-form-item
          ></el-col>
          <el-col :span="12">
            <el-form-item
              v-bind:label="$t('AddVendors.PhoneNumber2')"
              prop="PhoneNumber2"
            >
              <VuePhoneNumberInput
                :translations="{
                  countrySelectorLabel: 'رمز البلد',
                  countrySelectorError: 'تاكد من رقم',
                  phoneNumberLabel: 'رقم الهاتف',
                }"
                default-country-code="JO"
                v-model="tempForm.PhoneNumber2"
                :ignored-countries="['LI']"
              /> </el-form-item
          ></el-col>
        </el-row>

        <el-form-item
          v-bind:label="$t('AddVendors.Description')"
          prop="Description"
        >
          <el-input type="textarea" v-model="tempForm.Description"></el-input>
        </el-form-item>
        <el-form-item label="password" prop="Pass">
          <el-input
            type="password"
            v-model="tempForm.Pass"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <!-- <el-form-item label="Confirm" prop="ConfirmPassword">
          <el-input
            type="password"
            v-model="userTempForm.ConfirmPassword"
            autocomplete="off"
          ></el-input>
        </el-form-item>  -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="Visible = false">{{
          $t("AddVendors.Cancel")
        }}</el-button>
        <el-button type="primary" @click="createData()">{{
          $t("AddVendors.Save")
        }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// import openWindow from '@/utils/open-window'
import { CreateCustomer, CheckIsExist, Register } from "@/api/Vendor";
import VuePhoneNumberInput from "vue-phone-number-input";
import "vue-phone-number-input/dist/vue-phone-number-input.css";
import birthDatepicker from "vue-birth-datepicker";
import "vue-birth-datepicker/dist/vueBirthDatepicker.css"; //into your styles
import { AddUserRouter } from "@/api/Role";
//import { UnLockout } from "@/api/User";
export default {
  name: "Driver",
  components: { VuePhoneNumberInput, birthDatepicker },
  data() {
    return {
      Visible: false,
      tempForm: {
        Id: undefined,
        Name: "",
        Ssn: "",
        DateofBirth: "",
        Email: "",
        Status: 0,
        PhoneNumber1: "",
        PhoneNumber2: "",
        Description: "",
        Type: "New",
        DriverUserId: "",
        Pass: "",
        Tag: null,
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
  created() {
    this.resetTempForm();
  },
  methods: {
    resetTempForm() {
      this.tempForm = {
        Id: undefined,
        Name: "",
        Ssn: "",
        DateofBirth: "",
        Email: "",
        Status: 0,
        PhoneNumber1: "",
        PhoneNumber2: "",
        Description: "",
        Type: "New",
        DriverUserId: "",
        Pass: "",
        Tag: null,
      };
    },
    createData() {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          CheckIsExist({
            Name: this.tempForm.Name,
            Ssn: this.tempForm.Ssn,
            PhoneNumber: this.tempForm.PhoneNumber1,
          }).then((res) => {
            console.log(res);
            if (!res) {
              this.tempForm.DateofBirth = new Date(this.tempForm.DateofBirth);
              //this.userTempForm.PhoneNumber = this.tempForm.PhoneNumber1;
              //this.userTempForm.Email = this.tempForm.Email;
              CreateCustomer(this.tempForm)
                .then((response) => {
                  this.Visible = false;
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
                message: "يوجد عضو يحمل نفس رقم الهاتف او الرقم الوطني",
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
    getAge(BD) {
      var today = new Date();
      var birthDate = new Date(BD);
      var age = today.getFullYear() - birthDate.getFullYear();
      var m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age = age - 1;
      }

      return age;
    },
  },
};
</script>

