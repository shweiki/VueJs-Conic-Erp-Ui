<template>
  <el-tag :type="Opration.ClassName">{{ Opration.ArabicOprationDescription }}</el-tag>
</template>
<script>
import { GetOprationByStatusTable } from "@/api/Oprationsys";

export default {
  name: "StatusTag",
  props: {
    Status: {
      type: Number,
      default: undefined,
    },
    TableName: {
      type: String,
    },
  },
  data() {
    return {
      Opration: {},
    };
  },
  mounted() {
    this.getdata();
  },
  methods: {
    getdata() {
      GetOprationByStatusTable({
        TableName: this.TableName,
        Status: this.Status,
      }).then((response) => {
        this.Opration = response;
      });
    },
  },
};
</script>
<style scoped>
.price {
  font-size: 9px;
  color: #f78123;
}
</style>
