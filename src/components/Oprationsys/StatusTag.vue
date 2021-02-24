<template>
  <el-tag :color="Opration.Color" :type="Opration.ClassName">{{
    Opration.ArabicOprationDescription
  }}</el-tag>
</template>
<script>
export default {
  name: "StatusTag",
  props: {
    Status: Number,
    TableName: String,
  },
  data() {
    return {
      Opration: {},
    };
  },
  watch: {
    Status(val) {
      this.getdata();
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
