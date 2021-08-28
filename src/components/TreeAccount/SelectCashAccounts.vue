<template>
  <el-select
    v-bind:disabled="!checkPermission(['Admin'])"
    v-model="value"
    @change="SetVal"
    placeholder="الصندوق"
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
import { GetActiveCash } from "@/api/Cash";
import permission from "@/directive/permission/index.js";
import checkPermission from "@/utils/permission";

export default {
  directives: { permission },
  props: ["CashId"],
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
    GetActiveCash()
      .then((response) => {
        this.options = response;
        this.SetVal(response[0].value);
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
