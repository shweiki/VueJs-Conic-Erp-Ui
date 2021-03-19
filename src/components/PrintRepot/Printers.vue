<template>
    <select name="printer" id="printer" v-model="selected_printer">
      <option v-for="printer in printer_list" :key="printer">{{
        printer
      }}</option>
    </select>
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
selected(v){v ? this.selected_printer = v : null},
    selected_printer(value) {
      this.$emit("change", value);
    }
  }
};
</script>