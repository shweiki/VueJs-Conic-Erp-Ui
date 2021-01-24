<template>
  <div>
    <el-button
      type="warning"
      icon="el-icon-circle-plus"
      @click="Visible = true"
    ></el-button>

    <el-dialog
      style="margin-top: -13vh"
      title="مشترك جديد"
      :visible.sync="Visible"
    >
      <el-form
        :model="tempForm"
        :rules="rulesForm"
        ref="dataForm"
        class="demo-form-inline"
        label-position="top"
      >
        <el-row type="flex">
          <el-col :span="12">
            <el-form-item v-bind:label="$t('CashDrawer.Name')" prop="Name">
              <el-input type="text" v-model="tempForm.Name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="تاريخ ميلاد"
              prop="DateofBirth"
              :rules="[
                {
                  required: true,
                  message: 'لايمكن ترك التاريخ فارغ',
                  trigger: 'blur'
                }
              ]"
            >
              <el-date-picker
                v-model="tempForm.DateofBirth"
                type="date"
                placeholder="تاريخ ميلاد"
              ></el-date-picker>
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
                  trigger: 'blur'
                }
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
                  trigger: 'blur'
                },
                {
                  type: 'email',
                  message: 'Please input correct email address',
                  trigger: ['blur', 'change']
                }
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
                  trigger: 'blur'
                }
              ]"
            >
              <VuePhoneNumberInput
                default-country-code="JO"
                v-model="tempForm.PhoneNumber1"
              /> </el-form-item
          ></el-col>
          <el-col :span="12">
            <el-form-item
              v-bind:label="$t('AddVendors.PhoneNumber2')"
              prop="PhoneNumber2"
            >
              <VuePhoneNumberInput
                default-country-code="JO"
                v-model="tempForm.PhoneNumber2"
              /> </el-form-item
          ></el-col>
        </el-row>

        <el-form-item
          v-bind:label="$t('AddVendors.Description')"
          prop="Description"
        >
          <el-input type="textarea" v-model="tempForm.Description"></el-input>
        </el-form-item>
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
import { Create } from "@/api/Member";
import store from "@/store";
import VuePhoneNumberInput from "vue-phone-number-input";
import "vue-phone-number-input/dist/vue-phone-number-input.css";

export default {
  name: "Member",
  components: { VuePhoneNumberInput },
  data() {
    return {
      Visible: false,
      tempForm: {
        ID: undefined,
        Name: "",
        Ssn: "",
        DateofBirth: "",
        Email: "",
        PhoneNumber1: "",
        PhoneNumber2: "",
        Description: "",
        Type: "New",
        Tag: null
      },
      rulesForm: {
        Name: [
          {
            required: true,
            message: "الرجاء ادخال الاسم",
            trigger: "blur"
          },
          {
            minlength: 3,
            maxlength: 50,
            message: "الرجاء إدخال إسم لا يقل عن 3 حروف و لا يزيد عن 50 حرف",
            trigger: "blur"
          }
        ]
      }
    };
  },
  created() {
    this.resetTempForm();
  },
  methods: {
    resetTempForm() {
      this.tempForm = {
        ID: undefined,
        Name: "",
        Ssn: "",
        DateofBirth: "",
        Email: "",
        PhoneNumber1: "",
        PhoneNumber2: "",
        Description: "",
        Type: "New"
      };
    },
    createData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          if (
            this.CheckMemberIsExist(
              this.tempForm.PhoneNumber1,
              this.tempForm.Ssn
            )
          ) {
            Create(this.tempForm)
              .then(response => {
                this.Visible = false;
                store.dispatch("Members/GetMember");
                this.$notify({
                  title: "تم ",
                  message: "تم الإضافة بنجاح",
                  type: "success",
                  duration: 2000
                });
                this.$nextTick(() => {
                  this.$router.replace({
                    path: "/Gym/Edit/" + response
                  });
                });
                this.SendHelloSms(
                  this.tempForm.PhoneNumber1,
                  this.tempForm.Name
                );
              })
              .catch(error => {
                console.log(error);
              });
          } else {
            this.$notify({
              position: "top-left",
              title: "تم ",
              message: "يوجد عضو يحمل نفس رقم الهاتف او الرقم الوطني",
              type: "warning",
              duration: 20000
            });
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    CheckMemberIsExist(phonenumber, ssn) {
      const found = this.$store.getters.Members.find(
        element => element.PhoneNumber1 === phonenumber || element.Ssn === ssn
      );
      if (found != undefined) return false;
      else return true;
    },
    SendHelloSms(phoneNumber, name) {
      if (phoneNumber.length == 10) phoneNumber.slice(1);
      axios({
        method: "get",
        url: "http://josmsservice.com/smsonline/msgservicejo.cfm",
        params: {
          numbers: "962" + phoneNumber,
          senderid: "High Fit",
          AccName: "highfit",
          AccPass: "D7!cT5!SgU0",
          msg:
            "عزيزي " + name + " نرحّب بك في High Fit ,تم تسجيل عضويتك بنجاح ",
          requesttimeout: 5000000
        }
      }).then(response => {});
    }
  }
};
</script>