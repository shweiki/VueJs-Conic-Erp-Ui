<template>
  <el-radio-group @change="SetVal" v-model="value" text-color="#f78123">
    <el-radio label="Cash" border>{{ $t("NewPurchaseInvoice.Cash") }}</el-radio>
    <el-radio label="Visa" border>{{ $t("NewPurchaseInvoice.Visa") }}</el-radio>
    <el-radio v-if="(VendorId != 2) & (Type != 'Payment')" label="Receivables" border>{{
      $t("NewPurchaseInvoice.Receivables")
    }}</el-radio>

    <el-radio v-if="VendorId != 2" label="Cheque" border>{{
      $t("NewPurchaseInvoice.Cheque")
    }}</el-radio>
  </el-radio-group>
</template>
<script>
export default {
  props: ["VendorId", "Type", "Value"],
  data() {
    return {
      value: "Cash",
    };
  },
  watch: {
    Value(v) {
      if (v == null || v != "") this.SetVal(v);
      else {
        this.SetVal(this.value);
      }
    },
  },

  methods: {
    SetVal(val) {
      this.$emit("Set", val);
      this.value = val;
    },
  },
};
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
