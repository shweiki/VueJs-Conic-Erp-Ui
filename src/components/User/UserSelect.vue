<template>
  <el-select v-model="value" placeholder="Users" clearable class="filter-item" style="width: 130px" @change="SetVal">
    <el-option v-for="item in options" :key="item.key" :label="item.User.UserName" :value="item.User.UserName" />
  </el-select>
</template>
<script>
import { GetUsersNames } from "@/api/User";

export default {
  props: ["Value"],
  data() {
    return {
      value: "",
      options: [],
    };
  },
  watch: {
    Value(val) {
      if (val) this.SetVal(val);
    },
  },
  created() {
    GetUsersNames().then((res) => {
      this.options = res;
      //   this.SetVal(response[0].UserName);
    });
  },
  methods: {
    SetVal(val) {
      if (val && val != "" && val != null) {
        this.$emit("Set", this.options.find((obj) => obj.User.UserName === val).User.UserName);
      } else {
        this.$emit("Set", null);
      }
      this.value = val;
    },
  },
};
</script>
