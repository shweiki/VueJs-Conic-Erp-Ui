<template>
  <div>
    <el-button
      type="warning"
      icon="el-icon-circle-plus"
      @click="Visible = true"
    ></el-button>
    <el-dialog
      style="margin-top: -13vh"
      :visible.sync="Visible"
      @opened="$refs['EmployeeName'].focus()"
    >
      <div slot="title" class="dialog-footer">
        <el-col :span="4">
          <el-button
            icon="fa fa-save"
            style="float: left"
            :loading="createLoading"
            type="primary"
            @click="createData()"
          />
        </el-col>
        <el-col :span="20">
          <el-divider>موظف جديد</el-divider>
        </el-col>
      </div>
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
              <el-input type="text" ref="EmployeeName" v-model="tempForm.Name"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex">
          <el-col :span="12">
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
                :format="$store.getters.settings.DateTimeFormat.replace(' HH:mm', '')"
              ></el-date-picker>
              <!--
              <birth-datepicker
                style="width :100%"
                attachment="bottom right"
                delimiter="/"
                v-model="tempForm.DateofBirth"
              />-->
              <el-tag type="success" effect="dark">
                العمر
                {{ getAge(tempForm.DateofBirth) }}
              </el-tag>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="JobTitle" prop="JobTitle">
              <el-input type="text" v-model="tempForm.JobTitle"></el-input>
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
                  required: true,
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
        <el-form-item v-bind:label="$t('AddVendors.Description')" prop="Description">
          <el-input type="textarea" v-model="tempForm.Description"></el-input>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { Create, CheckEmployeeIsExist } from "@/api/Employee";
import VuePhoneNumberInput, { async } from "vue-phone-number-input";
import "vue-phone-number-input/dist/vue-phone-number-input.css";
import birthDatepicker from "vue-birth-datepicker";
import "vue-birth-datepicker/dist/vueBirthDatepicker.css"; //into your styles

export default {
  name: "Employee",
  components: { VuePhoneNumberInput, birthDatepicker },
  data() {
    return {
      Visible: false,
      createLoading: false,
      tempForm: {
        Id: undefined,
        Name: "",
        DateofBirth: "",
        Email: "",
        PhoneNumber1: "",
        PhoneNumber2: "",
        JobTitle: "",
        Description: "",
        Ssn: "",
        Type: "New",
        Tag: null,
        Status: 0,
        EmployeeUserId: "",
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
        PhoneNumber1: "",
        PhoneNumber2: "",
        Description: "",
        Type: "New",
        Status: 0,
        JobTitle: "",
      };
    },
    createData() {
      this.$refs["dataForm"].validate(async (valid) => {
        if (valid) {
          this.createLoading = true;
          var IsExist = false;
          if (this.$store.getters.settings.Employee.CheckEmployeeIsExist) {
            var IsExist = await this.CheckEmployeeIsExist(
              this.tempForm.Ssn,
              this.tempForm.PhoneNumber1
            );
          }
          if (!IsExist) {
            this.tempForm.DateofBirth = new Date(this.tempForm.DateofBirth);
            Create(this.tempForm)
              .then((response) => {
                this.Visible = false;
                this.createLoading = false;
                this.$notify({
                  title: "تم ",
                  message: "تم الإضافة بنجاح",
                  type: "success",
                  duration: 2000,
                });
                this.$router.push({ path: `/HumanResource/Edit/${response}` });

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
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    CheckEmployeeIsExist(Ssn, PhoneNumber1) {
      return new Promise((resolve, reject) => {
        CheckEmployeeIsExist({
          Ssn: Ssn,
          PhoneNumber: PhoneNumber1,
        })
          .then((res) => {
            resolve(res);
          })
          .catch((err) => {
            reject(err);
          });
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
