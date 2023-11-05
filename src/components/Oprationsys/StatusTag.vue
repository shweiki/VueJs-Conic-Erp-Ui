<template>
  <el-tag :color="Opration.Color" :type="Opration.ClassName">{{
    Opration.ArabicOprationDescription
  }}</el-tag>
</template>
<script>
export default {
  name: 'StatusTag',
  props: {
    status: {
      type: Number,
      required: true
    },
    tableName: {
      type: String,
      required: true
    }

  },
  data() {
    return {
      Opration: {}
    }
  },
  watch: {
    Status(val) {
      this.getdata()
    }
  },
  created() {
    this.getdata()
  },
  methods: {
    getdata() {
      //  console.log("  this.Opration ", this.Status);
      this.Opration = this.$store.getters.Oprations.find((obj) => {
        return obj.TableName === this.tableName && obj.Status === this.status
      })
      this.Opration = this.Opration === undefined
        ? (this.Opration = {
          ArabicOprationDescription: '-',
          ClassName: 'success',
          Color: null,
          ControllerName: '-',
          IconClass: 'el-icon-finished',
          Id: 0,
          OprationDescription: '- ',
          OprationName: '-',
          ReferenceStatus: null,
          RoleName: null,
          Status: 0,
          TableName: '-'
        })
        : this.Opration
    }
  }
}
</script>
<style scoped>
.price {
  font-size: 9px;
  color: #f78123;
}
</style>
