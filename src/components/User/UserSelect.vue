<template>
  <el-select
    v-model="Name"
    placeholder="Type"
    clearable
    class="filter-item"
    style="width: 130px"
    @change="SetVal"
  >
    <el-option
      v-for="item in UsersNames"
      :key="item.key"
      :label="item.UserName"
      :value="item.key"
    />
  </el-select>
</template>
<script>
import { GetUsersNames } from "@/api/User";

export default {
  data() {
    return {
      Name: "",
      UsersNames: [],
    };
  },
  created() {
    GetUsersNames().then((res) => {
      this.UsersNames = res;
    });
  },
  methods: {
    SetVal() {
      console.log(" eee  " + this.Name);
      this.$emit("Set", this.Name);
    },
  },
};
</script>
