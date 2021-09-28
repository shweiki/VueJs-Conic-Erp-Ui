<template>
  <el-select @change="SetVal" filterable v-model="Device" placeholder="اسم الجهاز">
    <el-option v-for="item in Devices" :key="item.Id" :label="item.Name" :value="item.Id">
      <span style="color: #8492a6; font-size: 16px">{{ item.Name }}</span>
      <span style="">{{ item.Id }}</span>
    </el-option>
  </el-select>
</template>
<script>
import { GetDevice } from "@/api/Device";

export default {
  props: ["Value"],
  data() {
    return {
      Device: 2,
      Devices: [],
    };
  },
  created() {
    GetDevice().then((res) => {
      this.Devices = res;
      this.Device =
        res.find((x) => x.Id == this.Value) == undefined
          ? (this.Device = res[0].Id)
          : res.find((x) => x.Id == this.Value).Id;

      this.SetVal(this.Device);
    });
  },
  methods: {
    SetVal(val) {
      this.$emit(
        "Set",
        this.Devices.find((x) => x.Id == val)
      );
    },
  },
};
</script>
