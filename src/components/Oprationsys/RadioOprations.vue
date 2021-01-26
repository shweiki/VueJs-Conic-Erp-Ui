<template>
  <div style="float : left">
    <el-radio-group v-model="Status" @change="SetStatus">
      <el-radio-button
        v-for="op in Oprations"
        :key="op.Id"
        v-bind:label="op.Status"
        >{{ op.OprationDescription }}</el-radio-button
      >
    </el-radio-group>
  </div>
</template>
<script>
import { GetOprationByTable } from "@/api/Oprationsys";

export default {
  props: {
    TableName: String
  },
  data() {
    return {
      Oprations: [],
      Status: 1
    };
  },
  mounted() {
    this.getdata();
    this.$emit("Change", this.Status);
  },
  methods: {
    SetStatus() {
      this.$emit("Change", this.Status);
    },
    getdata() {
      GetOprationByTable({ Name: this.TableName }).then(response => {
        this.Oprations = response;
      });
    }
  }
};
</script>