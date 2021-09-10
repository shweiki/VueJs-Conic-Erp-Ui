<template>
  <el-select v-model="Sort" class="filter-item" @change="SetVal">
    <el-option
      v-for="item in sortOptions"
      :key="item.key"
      :label="item.label"
      :value="item.key"
    />
  </el-select>
</template>

<script>
export default {
  props: ["Value"],
  data() {
    return {
      Sort: "-id",
      sortOptions: [
        { label: "Id Ascending", key: "+id" },
        { label: "Id Descending", key: "-id" },
      ],
    };
  },

  watch: {
    Value(val) {
      if (val != null && val != "") {
        this.Sort = val;
        this.SetVal(val);
      } else {
        this.SetVal(this.Sort);
      }
    },
  },
  methods: {
    SetVal(val) {
      if (val) {
        this.$emit("Set", val);
      }
    },
  },
};
</script>
