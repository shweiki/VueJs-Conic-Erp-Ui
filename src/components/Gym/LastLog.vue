<template>
  <el-input disabled v-model="lastLog"></el-input>
</template>
<script>
import { GetlastLogByUserId } from "@/api/DeviceLog";
import { parseTime } from "@/utils";

export default {
  props: {
    UserId: {
      type: Number,
      required: true,
    },
    TableName: {
      type: String,
      required: true,
    },
  },
  watch: {
    UserId(val) {
      console.log("user id", val);
      if (val) this.GetlastLog(val);
    },
  },
  data() {
    return {
      lastLog: "لا يوجد",
    };
  },
  methods: {
    GetlastLog(val) {
      GetlastLogByUserId({
        UserId: val,// || this.UserId,
        TableName: this.TableName,
      }).then((res) => {
        if (res) this.lastLog = parseTime(res, "{y}-{m}-{d} {h}:{i}");
      });
    },
  },
};
</script>
