<template>
  <div style="display: inline-block">
    <label class="radio-label">Book Type: </label>

    <el-radio-group v-model="bookType" text-color="#f78123">
      <el-radio
        v-for="item in options"
        :key="item"
        :label="item"
        :value="item"
        border
        >{{ item }}</el-radio
      >
    </el-radio-group>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      default: "xlsx",
    },
  },
  data() {
    return {
      options: ["xlsx", "csv", "txt"],
    };
  },
  computed: {
    bookType: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("input", val);
      },
    },
  },
};
</script>
