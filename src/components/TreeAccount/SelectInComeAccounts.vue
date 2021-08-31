<template>
  <el-select
    v-bind:disabled="!checkPermission(['Admin'])"
    v-model="value"
    @change="SetVal"
    placeholder="إيراد"
  >
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value"
    ></el-option>
  </el-select>
</template>
<script>
import { GetInComeAccounts } from "@/api/Account";
import checkPermission from "@/utils/permission";

export default {
  props: ["CashId", "Value"],
  data() {
    return {
      options: [],
      value: 2,
    };
  },
  watch: {
    CashId(val) {
      if (val) this.SetVal(val);
    },
  },
  created() {
    GetInComeAccounts()
      .then((response) => {
        this.options = response;
        this.SetVal(this.options[0]);
      })
      .catch((error) => {
        reject(error);
      });
  },
  methods: {
    checkPermission,
    SetVal(val) {
      this.$emit(
        "Set",
        this.options.find((obj) => obj.value == val)
      );
      this.value = val;
    },
  },
};
</script>
