<template>
  <el-popover placement="top-start" width="200" trigger="hover">
    <el-button
      v-for="item in options"
      :key="item.Id"
      @click="SetOnDevice(item.Id, item.Name)"
      >send to {{ item.Name }}</el-button
    >
    <el-button
      v-for="item in options"
      :key="item.Id"
      @click="StartEnrollUserOnDevice(item.Id, item.Name)"
      >Start Enroll to {{ item.Name }}</el-button
    >
    <el-button type="info" slot="reference">ارسال الى جهاز البصمة</el-button>
  </el-popover>
</template>
<script>
import { GetDevice, SetUser, StartEnrollUser } from "@/api/Device";

export default {
  props: ["ObjectId"],
  data() {
    return {
      options: [],
    };
  },
  created() {
    GetDevice().then((response) => {
      this.options = response;
    });
  },
  methods: {
    SetOnDevice(DeviceId, Name) {
      SetUser({
        DeviceId: DeviceId,
        UserId: this.ObjectId,
      }).then((response) => {
        if (response) {
          this.$notify({
            title: "تم",
            message: "تم ارسال البيانات لاجهاز " + Name + "  " + response + " ",
            type: "success",
            duration: 3000,
            position: "top-right",
          });
        }
      });
    },
    StartEnrollUserOnDevice(DeviceId, Name) {
      StartEnrollUser({
        DeviceId: DeviceId,
        UserId: this.ObjectId,
      }).then((response) => {
        if (response) {
          this.$notify({
            title: "تم",
            message: "بدء " + Name + "  " + response + " ",
            type: "success",
            duration: 3000,
            position: "top-right",
          });
        }
      });
    },
  },
};
</script>
