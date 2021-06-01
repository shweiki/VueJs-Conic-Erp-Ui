<template>
  <el-select @change="SetVal" filterable v-model="Driver" placeholder="السائق">
    <el-option
      v-for="item in Drivers"
      :key="item.value"
      :label="item.label"
      :value="item"
    >
      <span style="color: #8492a6; font-size: 16px"
        >{{ item.Company }}-------</span
      >
      <span style="">{{ item.label }}-------</span>
      <span style="color: #8492a6; font-size: 13px">{{ item.phone }}</span>
    </el-option>
  </el-select>
</template>
<script>
import { GetActiveDriver } from "@/api/Driver";

export default {
  data() {
    return {
      Driver: "اسم السائق",
      Drivers: []
    };
  },
  created() {
    GetActiveDriver().then(res => {
      this.Drivers = res;
    });
    this.SetVal(this.Driver);
  },
  methods: {
    SetVal(val) {
      this.$emit(
        "SetDriver",
        val.Company + " - " + val.label + " - " + val.phone
      );
    }
  }
};
</script>