<template>
  <el-select
    v-model="value"
    placeholder="ضمن قائمة"
    clearable
    filterable
    class="filter-item"
    @change="SetVal"
  >
    <el-option
      v-for="item in options"
      :key="item.Code"
      v-bind:label="item.label + '  (' + item.Code + ')'"
      :value="item.Code"
    />
  </el-select>
</template>
<script>
import { GetMainAccount } from "@/api/Account";

export default {
  props: {
    Value: String,
  },
  data() {
    return {
      value: "",
      options: [],
    };
  },
  watch: {
    value(val) {
      this.SetVal(val);
    },
  },
  created() {
    GetMainAccount().then((res) => {
      this.options = res;
      console.log("val ", this.Value);
      this.value = this.Value;
    });
  },
  methods: {
    SetVal(val) {
      this.value = val;
      this.$emit(
        "Set",
        this.options.find((obj) => obj.Code == val)
      );
    },
  },
};
</script>
