<template>
  <el-select
    v-model="value"
    placeholder="ضمن قائمة"
    clearable
    class="filter-item"
    @change="SetVal"
  >
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value"
    />
  </el-select>
</template>
<script>
import { GetMainAccount } from "@/api/Account";

export default {
  props: {
    Value: Number
  },
  data() {
    return {
      value: "",
      options: []
    };
  },
  watch: {
    Value(val) {
      this.SetVal(val);
    }
  },
  created() {
    GetMainAccount().then(res => {
      this.options = res;
      this.value = this.Value;
      //   this.SetVal(response[0].UserName);
    });
  },
  methods: {
    SetVal(val) {
      this.value = val;
      this.$emit("Set", this.options.find(obj => obj.value == val).value);
    }
  }
};
</script>
