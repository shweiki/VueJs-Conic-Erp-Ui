<template>
  <el-select
    v-bind:disabled="!checkPermission(['admin'])"
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
import { GetInComeAccounts, GetById } from "@/api/Account";
import checkPermission from "@/utils/permission";

export default {
  props: ["InComeAccountId"],
  data() {
    return {
      options: [],
      value: 2,
    };
  },
  watch: {
    InComeAccountId(value) {
      if (value != null && value != undefined && value != "" && value > 0) {
        GetById({ Id: value }).then((res) => {
          this.SetVal(res.Id);
        });
      }
    },
  },
  created() {
    GetInComeAccounts()
      .then((response) => {
        this.options = response;
        this.SetVal(this.options[0].value);
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
