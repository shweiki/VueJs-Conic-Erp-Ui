<template>
  <el-radio-group v-model="value" text-color="#f78123" @change="SetVal">
    <el-radio label="Cash" border>{{ $t("NewPurchaseInvoice.Cash") }}</el-radio>
    <el-radio v-if="VendorId != 2" label="Cheque" border>{{
      $t("NewPurchaseInvoice.Cheque")
    }}</el-radio>
  </el-radio-group>
</template>
<script>
export default {
  props: ['VendorId', 'Type'],
  data() {
    return {
      value: 'Cash'
    }
  },
  watch: {
    value(v) {
      this.SetVal(v)
    }
  },
  created() {
    this.SetVal(this.value)
  },
  methods: {
    SetVal(val) {
      this.$emit('Set', val)
      this.value = val
    }
  }
}
</script>
<style scoped>
.el-radio.is-bordered {
  margin-left: 1px;
}
.el-radio.is-bordered + .el-radio.is-bordered {
  margin-left: 1px;
}
.el-radio {
  margin-right: 5px;
}
</style>
