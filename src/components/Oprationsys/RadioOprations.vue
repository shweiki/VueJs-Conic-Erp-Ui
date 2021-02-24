<template>
  <div style="float: left">
    <el-radio-group v-model="Status" @change="SetVal">
      <el-radio-button label="null">All</el-radio-button>
      <el-radio-button
        v-for="op in $store.getters.Oprations.filter((Item) => {
          return Item.TableName == TableName;
        })"
        :key="op.Id"
        v-bind:label="op.Status"
        >{{ op.OprationDescription }}</el-radio-button
      >
    </el-radio-group>
  </div>
</template>
<script>
export default {
  props: {
    TableName: String,
  },
  data() {
    return {
      Oprations: [],
      Status: null,
    };
  },
  created() {
    this.SetVal(this.Status);
  },
  methods: {
    SetVal(val) {
      this.Status = val;
      this.$emit("Set", this.Status);
    },
  },
};
</script>
