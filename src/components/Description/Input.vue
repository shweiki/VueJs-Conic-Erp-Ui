<template>
  <el-input @change="SetVal(value)" type="textarea" v-model="value"></el-input>
</template>
<script>
export default {
  data() {
    return {
      value: "",
    };
  },

  methods: {
    SetVal(val) {
      this.$emit("Set", val);
    },
  },
};
</script>
