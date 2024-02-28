<template>
  <el-form ref="dataForm" :model="Member" label-position="top">
    <el-row type="flex">
      <el-col :span="8">
        <el-form-item
          :label="$t('CashDrawer.Name')"
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
            v-model="Member.Name"
            type="text"
            :placeholder="$t('CashDrawer.Name')"
          /> </el-form-item></el-col>
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
            v-model="Member.Ssn"
            type="text"
            placeholder="الرقم الوطني"
          />
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
            v-model="Member.DateofBirth"
            :format="
              $store.getters.settings.DateTimeFormat.replace(' HH:mm', '')
            "
            type="date"
            placeholder="تاريخ ميلاد"
          />
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
            v-model="Member.PhoneNumber1"
            default-country-code="JO"
            :ignored-countries="['LI']"
          />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="رقم الهاتف" prop="PhoneNumber2">
          <VuePhoneNumberInput
            v-model="Member.PhoneNumber2"
            default-country-code="JO"
            :ignored-countries="['LI']"
          />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row type="flex">
      <el-col :span="8">
        <el-form-item label="البريد الالكتروني" prop="Email">
          <el-input
            v-model="Member.Email"
            type="text"
            :placeholder="$t('AddVendors.Email')"
          /> </el-form-item></el-col>
      <el-col :span="8">
        <el-form-item label="ملاحظات" prop="Description">
          <el-input
            v-model="Member.Description"
            type="textarea"
            :placeholder="$t('AddVendors.Description')"
          />
        </el-form-item>
      </el-col>
      <el-col :span="3">
        <el-button
          type="primary"
          icon="el-icon-save"
          @click="Member.Id != null ? updateData() : createData()"
        >{{ $t("AddVendors.Save") }}</el-button>
      </el-col>
      <el-col :span="3">
        <Drawer-Print
          :disabled="Member == null ? false : true"
          type="MemberAgreement"
          :data="Member"
        />
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
import { Edit } from '@/api/Member'
import DrawerPrint from '@/components/PrintRepot/DrawerPrint.vue'
import VuePhoneNumberInput from 'vue-phone-number-input'
import 'vue-phone-number-input/dist/vue-phone-number-input.css'
export default {
  components: { VuePhoneNumberInput, DrawerPrint },
  props: {
    Member: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  methods: {
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          Edit(this.Member)
            .then((response) => {
              this.dialogFormVisible = false
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
    }
  }
}
</script>
