<template>
  <div>
    <el-drag-select
      @change="SetVal"
      v-model="value"
      multiple
      placeholder="تصنيفات"
    >
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-drag-select>
  </div>
</template>

<script>
import ElDragSelect from "@/components/DragSelect"; // base on element-ui

export default {
  props: ["Value"],
  components: { ElDragSelect },
  data() {
    return {
      value: [],
      options: [
        {
          value: "ساندويش",
          label: "ساندويش"
        },
        {
          value: "وجبات",
          label: "وجبات"
        },
        {
          value: "مشروبات",
          label: "مشروبات"
        },
        {
          value: "إضافات",
          label: "إضافات"
        },
        { value: "لحم", label: "لحم" },
        { value: "دجاج", label: "دجاج" }
      ]
    };
  },
  created() {
    if (this.Value) this.value = Array.from(this.Value.split(","));
  },
  methods: {
    SetVal(val) {
      this.$emit("Set", val.toString());
    }
  }
};
</script>
