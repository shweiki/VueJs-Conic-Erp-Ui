<template>
  <el-select v-model="Printer" placeholder="الطابعة" @change="SetVal">
    <el-option
      v-for="printer in printers"
      :key="printer"
      :label="printer"
      :value="printer"
    ></el-option>
  </el-select>
</template>
<script>
export default {
  name: "Printers",
  props: {
    Value: String
  },
  data: () => {
    return {
      printers: [],
      Printer: ""
    };
  },

  created() {
    this.Printer = this.Value;
    this.printers = this.$store.getters.printers;
  },
  watch: {
    value(v) {
      console.log(v);
      this.SetVal(v);
    }
  },
  methods: {
    SetVal(value) {
      this.Printer = value;
      this.$emit("change", value);
    }
  }
};
</script>
