<template>
  <el-popover placement="left-start" width="500" trigger="hover">
    <el-button-group v-for="item in options" :key="item.Id">
      <el-button
        :loading="loading"
        @click="EnrollUserOnDevice(item.Ip)"
        type="info"
        icon="el-icon-arrow-left"
        >تحديث البيانات الى{{ item.Name }}</el-button
      >
      <el-button
        :loading="loading"
        @click="ConnectDevice(item.Ip)"
        :size="$store.getters.size"
        type="warning"
        >اتصال</el-button
      >
      <el-button
        :loading="loading"
        @click="RestartDevice(item.Ip)"
        :size="$store.getters.size"
        type="success"
        >اعادة تشغيل الجهاز</el-button
      >
    </el-button-group>

    <el-button type="info" slot="reference"> جهاز البصمة</el-button>
  </el-popover>
</template>
<script>
import { connection } from "@/utils/signalR";
import { GetDevice } from "@/api/Device";

export default {
  props: ["ObjectId", "TableName", "Name"],
  data() {
    return {
      loading: false,
      options: [],
      signalRConnection: null,
    };
  },
  created() {
    GetDevice().then((response) => {
      this.options = response;
      this.signalRConnection = connection();
    });
  },
  methods: {
    async EnrollUserOnDevice(Ip) {
      this.loading = true;
      try {
        await this.signalRConnection.invoke("EnrollUser", Ip, this.ObjectId, this.Name);
      } catch (err) {
        console.error(err);
      } finally {
        this.loading = false;
      }
    },
    async ConnectDevice(Ip) {
      this.loading = true;
      try {
        await this.signalRConnection.invoke("ConnectDevice", Ip);
      } catch (err) {
        console.error(err);
      } finally {
        this.loading = false;
      }
    },
    async RestartDevice(Ip) {
      this.loading = true;
      try {
        await this.signalRConnection.invoke("RestartDevice", Ip);
      } catch (err) {
        console.error(err);
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
