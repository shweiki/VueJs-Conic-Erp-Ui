<template>
  <el-select v-model="value" @change="SetVal" placeholder="اشتراكات">
    <el-option
      v-for="item in options"
      :key="item.Id"
      :label="item.Name"
      :value="item.Id"
    ></el-option>
  </el-select>
</template>
<script>
import { GetActiveMembership } from "@/api/Membership";

export default {
  data() {
    return {
      options: [],
      value: 2
    };
  },
  created() {
    GetActiveMembership()
      .then(response => {
        this.options = response;
        this.value = response[0].Id;
        this.SetVal(this.value);
      })
      .catch(error => {
        reject(error);
      });
  },
  methods: {
    SetVal(val) {
      this.$emit(
        "Set",
        this.options.find(obj => obj.Id == val)
      );
    }
  }
};
</script>