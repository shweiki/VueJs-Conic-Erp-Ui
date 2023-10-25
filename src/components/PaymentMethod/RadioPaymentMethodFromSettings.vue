<template>
  <el-radio-group v-model="value" text-color="#f78123" @change="SetVal">
    <el-radio
      v-for="item in $store.getters.settings.PaymentMethods"
      :key="item"
      :label="item"
      border
    >
      {{ $t("PaymentMethod." + item + "") }}</el-radio>
  </el-radio-group>
</template>
<script>
export default {
  props: ['value'],
  watch: {
    value(v) {
      if (v != null && v !== '') this.SetVal(v)
      else {
        this.SetVal('Cash')
      }
    }
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
