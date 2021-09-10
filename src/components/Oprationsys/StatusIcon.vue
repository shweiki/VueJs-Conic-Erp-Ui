<template>
  <i
    v-bind:style="'color: ' + Opration.Color + ';'"
    v-if="Opration.IconClass != null"
    :class="Opration.IconClass"
  ></i>
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

      this.Opration == undefined
        ? (this.Opration = {
            ArabicOprationDescription: "-",
            ClassName: "success",
            Color: null,
            ControllerName: "-",
            IconClass: "el-icon-finished",
            Id: 0,
            OprationDescription: "- ",
            OprationName: "-",
            ReferenceStatus: null,
            RoleName: null,
            Status: 0,
            TableName: "-",
          })
        : this.Opration;
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
