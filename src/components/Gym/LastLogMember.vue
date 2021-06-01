<template>
  <el-input disabled v-model="lastLog"></el-input>
</template>
<script>
import { GetlastLogByMemberId } from "@/api/MemberLog";
export default {
  props: {
    MemberId: {
      type: Number,
      default: () => {
        return undefined;
      }
    }
  },
  data() {
    return {
      lastLog: ""
    };
  },
  mounted() {
    GetlastLogByMemberId({ MemberId: this.MemberID }).then(res => {
      this.lastLog = res;
    });
  }
};
</script>
