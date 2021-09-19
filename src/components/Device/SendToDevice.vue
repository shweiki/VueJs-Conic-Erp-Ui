<template>
  <el-popover placement="left-start" width="500" trigger="hover">
    <el-button-group v-for="item in options" :key="item.Id">
      <el-button
        :loading="loading"
        @click="SetOnDevice(item.Id, item.Name)"
        type="info"
        icon="el-icon-arrow-left"
        >تحديث البيانات الى{{ item.Name }}</el-button
      >
      <el-button
        :loading="loading"
        @click="StartEnrollUserOnDevice(item.Id, item.Name)"
        type="primary"
        icon="el-icon-arrow-right"
        >انشاء بصمة وجه {{ item.Name }}</el-button
      >
      <el-button
        :loading="loading"
        @click="RestartDevice(item.Id, item.Name)"
        :size="$store.getters.size"
        type="success"
        >اعادة تشغيل الجهاز</el-button
      >
    </el-button-group>

    <el-button type="info" slot="reference"> جهاز البصمة</el-button>
  </el-popover>
</template>
<script>
import { GetDevice, SetUser, StartEnrollUser, RestartDevice } from "@/api/Device";

export default {
  props: ["ObjectId", "TableName", "Name"],
  data() {
    return {
      loading: false,
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
      this.loading = true;
      SetUser({
        DeviceId: DeviceId,
        UserId: this.ObjectId,
        Name: this.Name,
        TableName: this.TableName,
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
        this.loading = false;
      });
    },
    StartEnrollUserOnDevice(DeviceId, Name) {
      this.loading = true;
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
        this.loading = false;
      });
    },
    RestartDevice(id, Name) {
      this.loading = true;
      RestartDevice({ DeviceId: id }).then((response) => {
        // handle success
        this.$notify({
          title: "تم",
          message: "اعادة تشغيل  " + Name + "  " + response + " ",
          type: "success",
          duration: 3000,
          position: "top-right",
        });
        this.loading = false;
      });
    },
  },
};
</script>
