<template>
  <el-select name="printer" id="printer" v-model="selected_printer">
    <el-option v-for="printer in printer_list" :key="printer">{{
      printer
    }}</el-option>
  </el-select>
</template>
<script>
export default {
  name: "Printers",
  props: ["printer_list", "selected"],
  data: () => {
    return {
      selected_printer: ""
    };
  },
  watch: {
    selected(v) {
      console.log(v)
      this.selected_printer = v;
    },
    selected_printer(value) {
      this.$emit("change", value);
    }
  }
};
</script>