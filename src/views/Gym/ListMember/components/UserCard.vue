<template>
  <el-form :model="Member" ref="dataForm" label-position="top">
    <el-row type="flex">
      <el-col :span="8">
        <el-form-item
          v-bind:label="$t('CashDrawer.Name')"
          prop="Name"
          :rules="[
            {
              required: true,
              message: 'لايمكن ترك الاسم فارغ',
              trigger: 'blur',
            },
          ]"
        >
          <el-input
            type="text"
            v-model="Member.Name"
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
              trigger: 'blur',
            },
          ]"
        >
          <el-input
            type="text"
            v-model="Member.Ssn"
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
              trigger: 'blur',
            },
          ]"
        >
          <el-date-picker
            :format="
              $store.getters.settings.DateTimeFormat.replace(' HH:mm', '')
            "
            v-model="Member.DateofBirth"
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
              trigger: 'blur',
            },
          ]"
        >
          <VuePhoneNumberInput
            default-country-code="JO"
            v-model="Member.PhoneNumber1"
            :ignored-countries="['LI']"
          />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="رقم الهاتف" prop="PhoneNumber2">
          <VuePhoneNumberInput
            default-country-code="JO"
            v-model="Member.PhoneNumber2"
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
            v-model="Member.Email"
            v-bind:placeholder="$t('AddVendors.Email')"
          ></el-input> </el-form-item
      ></el-col>
      <el-col :span="8">
        <el-form-item label="ملاحظات" prop="Description">
          <el-input
            type="textarea"
            v-model="Member.Description"
            v-bind:placeholder="$t('AddVendors.Description')"
          ></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="3">
        <el-button
          type="primary"
          icon="el-icon-save"
          @click="Member.Id != null ? updateData() : createData()"
          >{{ $t("AddVendors.Save") }}</el-button
        >
      </el-col>
      <el-col :span="3">
        <Drawer-Print
          v-bind:disabled="Member == null ? false : true"
          Type="MemberAgreement"
          :Data="Member"
        />
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
import { Edit } from "@/api/Member";
import DrawerPrint from "@/components/PrintRepot/DrawerPrint.vue";
import VuePhoneNumberInput from "vue-phone-number-input";
import "vue-phone-number-input/dist/vue-phone-number-input.css";
export default {
  components: { VuePhoneNumberInput, DrawerPrint },
  props: {
    Member: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  methods: {
    updateData() {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          Edit(this.Member)
            .then((response) => {
              this.dialogFormVisible = false;
              this.$notify({
                title: "تم",
                message: "تم التعديل بنجاح",
                type: "success",
                duration: 2000,
              });
            })
            .catch((error) => {
              console.log(error);
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
