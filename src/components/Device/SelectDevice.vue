<template>
  <el-select @change="SetVal" filterable v-model="Device" placeholder="السائق">
    <el-option
      v-for="item in Devices"
      :key="item.value"
      :label="item.label"
      :value="item"
    >
      <span style="color: #8492a6; font-size: 16px">{{ item.Company }}-------</span>
      <span style="">{{ item.label }}-------</span>
      <span style="color: #8492a6; font-size: 13px">{{ item.phone }}</span>
    </el-option>
  </el-select>
</template>
<script>
import { GetDevice } from "@/api/Device";

export default {
  data() {
    return {
      Device: {},
      Devices: [],
    };
  },
  created() {
    GetDevice().then((res) => {
      this.Devices = res;
      this.Device = res[0];
      this.SetVal(this.Device);
    });
  },
  methods: {
    SetVal(val) {
      this.$emit("Set", val);
    },
  },
};
</script>
