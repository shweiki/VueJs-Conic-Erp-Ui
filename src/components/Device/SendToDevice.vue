<template>
  <el-popover placement="top-start"  width="200" trigger="hover">
    <el-button v-for="item in $store.getters.Devices" :key="item.Id"
    @click="SetOnDevice(item.Id, item.Name)">{{
      item.Name
    }}</el-button>

    <el-button type="info" slot="reference">ارسال الى جهاز البصمة</el-button>
  </el-popover>
</template>
<script>
import { SetUser } from "@/api/Device";

export default {
  props: ["ObjectId"],
  methods: {
    SetOnDevice(DeviceId, Name) {
      SetUser({
        DeviceId: DeviceId,
        UserId: this.ObjectId
      }).then(response => {
        if (response) {
          this.$notify({
            title: "تم",
            message: "تم ارسال البيانات لاجهاز " + Name + "  " + response + " ",
            type: "success",
            duration: 3000,
            position: "top-right"
          });
        }
      });
    }
  }
};
</script>