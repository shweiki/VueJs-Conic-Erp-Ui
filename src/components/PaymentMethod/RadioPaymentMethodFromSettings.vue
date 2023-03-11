<template>
  <el-radio-group @change="SetVal" v-model="value" text-color="#f78123">
    <el-radio v-for="item in $store.getters.settings.PaymentMethods" :label="item" border>
    {{ $t("PaymentMethod."+item+"")
    }}</el-radio>
  </el-radio-group>
</template>
<script>
export default {
  props: ["VendorId", "Type", "Value"],
  data() {
    return {
      value: this.Value,
    };
  },
  watch: {
    value(v) {
      if (v != null && v != "") this.SetVal(v);
      else {
        this.SetVal("Cash");
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

.el-radio.is-bordered+.el-radio.is-bordered {
  margin-left: 1px;
}

.el-radio {
  margin-right: 5px;
}
</style>
