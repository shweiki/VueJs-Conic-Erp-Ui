<template>
  <div>
    <el-row type="flex">
      <el-col :span="12">
        <Drawer-Print :data="OldPayment" type="Payment" />
      </el-col>
      <el-col :span="12">
        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="Visibles = true"
        >قبض</el-button></el-col></el-row>
    <el-dialog
      style="margin-top: -13vh"
      title="تسجيل قبض"
      :visible.sync="Visibles"
      @opened="resetTempForm()"
    >
      <el-form ref="Form" :model="tempForm" label-position="top" class="demo-form-inline">
        <el-row type="flex">
          <el-col :span="12">
            <el-form-item label="القيمة المقبوضة">
              <currency-input
                v-model="tempForm.TotalAmmount"
                :rules="[
                  {
                    required: true,
                    message: 'لايمكن ترك القيمة فارغ',
                    trigger: 'blur',
                  },
                ]"
                class="currency-input"
                :value-range="{ min: 0.01, max: 1000000 }"
                @focus="$event.target.select()"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="تاريخ "
              prop="FakeDate"
              :rules="[
                {
                  required: true,
                  message: 'لايمكن ترك التاريخ فارغ',
                  trigger: 'blur',
                },
              ]"
            >
              <Fake-Date
                :value="tempForm.FakeDate"
                @Set="(v) => (tempForm.FakeDate = v)"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex">
          <el-col :span="12">
            <el-form-item prop="PaymentMethod" label="طريقة الدفع">
              <radio-payment-method-from-settings
                type="Payment"
                :value="tempForm.PaymentMethod"
                :vendor-id="tempForm.MemberId"
                @Set="(v) => (tempForm.PaymentMethod = v)"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('AddVendors.Description')" prop="Description">
              <el-input v-model="tempForm.Description" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="Visibles = false">{{ $t("AddVendors.Cancel") }}</el-button>
        <el-button type="primary" @click="create()">{{
          $t("AddVendors.Save")
        }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { Create as CreatePayment } from '@/api/Payment'
// report
import DrawerPrint from '@/components/PrintRepot/DrawerPrint.vue'
import FakeDate from '@/components/Date/FakeDate'
import RadioPaymentMethodFromSettings from '@/components/PaymentMethod/RadioPaymentMethodFromSettings.vue'
import { SendSMS } from '@/api/SMS'

export default {
  components: { DrawerPrint, FakeDate, RadioPaymentMethodFromSettings },
  props: {
    memberId: {
      type: String,
      required: true
    },
    numberPhone1: {
      type: String,
      default: () => {
        return undefined
      }
    },
    name: {
      type: String,
      default: () => {
        return undefined
      }
    }
  },
  data() {
    return {
      OldPayment: null,
      tempForm: {
        Id: undefined,
        Name: '',
        FakeDate: '',
        PaymentMethod: 'Cash',
        TotalAmmount: 0,
        Description: '',
        Status: 0,
        VendorId: undefined,
        IsPrime: true,
        MemberId: undefined,
        Type: ''
      },
      Visibles: false
    }
  },
  methods: {
    resetTempForm() {
      this.tempForm = {
        Id: undefined,
        Name: '',
        FakeDate: '',
        PaymentMethod: 'Cash',
        TotalAmmount: 0,
        Description: '',
        Status: 0,
        VendorId: undefined,
        IsPrime: true,
        MemberId: undefined,
        Type: ''
      }
    },
    create() {
      this.$refs['Form'].validate((valid) => {
        if (valid) {
          this.tempForm.MemberId = this.memberId
          CreatePayment(this.tempForm)
            .then((response) => {
              this.tempForm.Name = this.name
              this.Visibles = false
              this.tempForm.Id = response
              this.OldPayment = this.tempForm
              this.OldPayment.ObjectId = this.memberId
              SendSMS(
                this.numberPhone1,
                'تم دفع مبلغ ' +
                  this.OldPayment.TotalAmmount.toFixed(
                    this.$store.getters.settings.ToFixed
                  ) +
                  ' بسند قبض رقم ' +
                  this.OldPayment.Id +
                  ' للمشترك رقم ' +
                  this.memberId
              )
              this.$notify({
                title: 'تم ',
                message: 'تم الإضافة بنجاح',
                type: 'success',
                duration: 2000
              })
            })
            .catch((error) => {
              console.log(error)
            })
        }
      })
    }
  }
}
</script>
