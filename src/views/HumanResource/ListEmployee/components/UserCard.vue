<template>
  <el-form :model="Employee" ref="dataForm" label-position="top">
    <el-row type="flex">
      <el-col :span="8">
        <el-form-item
          v-bind:label="$t('CashDrawer.Name')"
          prop="Name"
          :rules="[
            {
              required: true,
              message: 'لايمكن ترك الاسم فارغ',
              trigger: 'blur'
            }
          ]"
        >
          <el-input
            type="text"
            v-model="Employee.Name"
            v-bind:placeholder="$t('CashDrawer.Name')"
          ></el-input> </el-form-item
      ></el-col>
      <el-col :span="8">
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
            v-model="Employee.Ssn"
            placeholder="الرقم الوطني"
          ></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
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
            format="dd/MM/yyyy"
            v-model="Employee.DateofBirth"
            type="date"
            placeholder="تاريخ ميلاد"
          ></el-date-picker>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row type="flex">
      <el-col :span="12">
        <el-form-item
          label="رقم الهاتف"
          prop="PhoneNumber1"
          :rules="[
            {
              required: true,
              message: 'لايمكن ترك رقم الهاتف فارغ',
              trigger: 'blur'
            }
          ]"
        >
          <VuePhoneNumberInput
            default-country-code="JO"
            v-model="Employee.PhoneNumber1"
            :ignored-countries="['LI']"
          />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="رقم الهاتف" prop="PhoneNumber2">
          <VuePhoneNumberInput
            default-country-code="JO"
            v-model="Employee.PhoneNumber2"
            :ignored-countries="['LI']"
          />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row type="flex">
      <el-col :span="8">
        <el-form-item label="البريد الالكتروني" prop="Email">
          <el-input
            type="text"
            v-model="Employee.Email"
            v-bind:placeholder="$t('AddVendors.Email')"
          ></el-input> </el-form-item
      ></el-col>
      <el-col :span="8">
        <el-form-item label="ملاحظات" prop="Description">
          <el-input
            type="textarea"
            v-model="Employee.Description"
            v-bind:placeholder="$t('AddVendors.Description')"
          ></el-input>
        </el-form-item>
      </el-col>

       <el-col :span="8">
        <el-form-item label="المسمى الوظيفي" prop="JobTitle">
          <el-input
            type="textarea"
            v-model="Employee.JobTitle"
            placeholder="المسمى الوظيفي"
          ></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row type="flex">
      <el-col>
      <el-col :span="3">
        <el-button
          type="primary"
          icon="el-icon-save"
          @click="Employee.Id != null ? updateData() : createData()"
          >{{ $t("AddVendors.Save") }}</el-button
        >
      </el-col>
      <el-col :span="3">
        <el-button
          @click="Print()"
          type="primary"
          icon="el-icon-printer"
        ></el-button
      ></el-col>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
import { Edit } from "@/api/Employee";
import printJS from "print-js";
import { MemberAgreement } from "@/Report/MemberAgreement";
import VuePhoneNumberInput from "vue-phone-number-input";
import "vue-phone-number-input/dist/vue-phone-number-input.css";
export default {
  components: { VuePhoneNumberInput },
  props: {
    Employee: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  methods: {
    updateData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
 
          Edit(this.Employee)
            .then(response => {
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
    },
    Print() {
      printJS({
        printable: MemberAgreement(this.Member),
        type: "pdf",
        base64: true,
        showModal: true
      });
    },

  }
};
</script>
