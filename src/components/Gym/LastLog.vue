<template>
  <el-input disabled v-model="lastLog"></el-input>
</template>
<script>
import { GetlastLogByUserId } from "@/api/DeviceLog";
import { parseTime } from "@/utils";

export default {
  props: ["UserId", "TableName"],
  data() {
    return {
      lastLog: "",
    };
  },
  mounted() {
    GetlastLogByUserId({ UserId: this.UserId, TableName: this.TableName }).then(
      (res) => {
        this.lastLog = parseTime(res, "{y}-{m}-{d} {h}:{i}");
      }
    );
  },
};
</script>
