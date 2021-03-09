<template>
  <el-select v-model="value" @change="SetVal" placeholder="محرر السند">
    <el-option
      v-for="item in options"
      :key="item.Id"
      :label="item.Name"
      :value="item.Name"
    ></el-option>
  </el-select>
</template>
<script>
import { GetEditorsUser } from "@/api/EditorsUser";

export default {
  data() {
    return {
      options: [],
      value: ""
    };
  },
  created() {
    GetEditorsUser()
      .then(response => {
        this.options = response;
      })
      .catch(error => {
        reject(error);
      });
  },
  methods: {
    SetVal(val) {
      this.$emit("Set", val);
    }
  }
};
</script>