<template>
  <el-popover placement="right" width="400" trigger="click">
    <el-radio-group v-model="value" text-color="#f78123">
      <el-radio label="Cash" border>{{ $t("NewPurchaseInvoice.Cash") }}</el-radio>
      <el-radio label="Visa" border>{{ $t("NewPurchaseInvoice.Visa") }}</el-radio>
    </el-radio-group>
    <el-button
      :size="$store.getters.size"
      icon="fa fa-save"
      type="primary"
      @click="SetVal(value)"
    />
    <el-button slot="reference" circle icon="el-icon-edit" />
  </el-popover>
</template>
<script>
import { EditPaymentMethod as EditSalePaymentMethod } from '@/api/SaleInvoice'
import { EditPaymentMethod as EditPaymentPaymentMethod } from '@/api/Payment'

export default {
  props: ['ID', 'Type', 'Value', 'VendorId'],
  data() {
    return {
      value: ''
    }
  },
  created() {
    this.value = this.Value
  },
  methods: {
    SetVal(val) {
      if (this.Type === 'SaleInvoice') {
        EditSalePaymentMethod({
          ID: this.ID,
          PaymentMethod: val
        })
          .then((response) => {
            if (response) this.$emit('Done', val)
          })
      }
      if (this.Type === 'Payment') {
        EditPaymentPaymentMethod({
          ID: this.ID,
          PaymentMethod: val
        })
          .then((response) => {
            if (response) this.$emit('Done', val)
          })
      }
    }
  }
}
</script>
