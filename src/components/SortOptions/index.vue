<template>
  <el-select v-model="Sort" class="filter-item" @change="SetVal">
    <el-option
      v-for="item in sortOptions"
      :key="item.key"
      v-bind:label="$t('SortOptions.' + item.label + '')"
      :value="item.key"
    />
  </el-select>
</template>

<script>
export default {
  props: ["Value"],
  data() {
    return {
      Sort: this.Value,
      sortOptions: [
        { label: "Ascending", key: "+id" },
        { label: "Descending", key: "-id" },
      ],
    };
  },
  watch: {
    Value(val) {
      console.log("Sort", val);
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
