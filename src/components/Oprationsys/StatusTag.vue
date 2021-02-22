<template>
  <el-tag :color="Opration.Color" :type="Opration.ClassName">{{
    Opration.ArabicOprationDescription
  }}</el-tag>
</template>
<script>
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
  watch: {
    Status(val) {
      this.Status = val;
    },
  },
  created() {
    this.getdata();
  },
  methods: {
    getdata() {
      this.Opration = this.$store.getters.Oprations.find((obj) => {
        return obj.TableName == this.TableName && obj.Status == this.Status;
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
