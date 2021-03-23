<template>
  <el-form-item label="الطابعة">
    <el-select v-model="Printer" autocomplete="off" @change="SetVal">
      <el-option
        v-for="printer in printers"
        :key="printer"
        :label="printer"
        :value="printer"
      ></el-option>
    </el-select>
  </el-form-item>
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
  mounted() {
    this.printers = this.$store.getters.printers;
  },
  created() {
    this.Printer = this.Value;
  },
  watch: {
    Value(v) {
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