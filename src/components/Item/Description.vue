<template>
  <div>
    <el-popover width="400" trigger="click">
      <el-drag-select
        @change="SetVal"
        v-model="value"
        multiple
        placeholder="ملاحظات"
      >
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-drag-select>

      <el-button type="info" icon="el-icon-s-order" slot="reference" />
    </el-popover>
  </div>
</template>

<script>
import ElDragSelect from "@/components/DragSelect"; // base on element-ui

export default {
  components: { ElDragSelect },
  data() {
    return {
      value: [],
      options: [
        {
          value: "مع بصل",
          label: "مع بصل"
        },
        {
          value: "Banana",
          label: "Banana"
        },
        {
          value: "Orange",
          label: "Orange"
        },
        {
          value: "Pear",
          label: "Pear"
        },
        {
          value: "Strawberry",
          label: "Strawberry"
        }
      ]
    };
  },
  watch: {
    Value(val) {
      if (val) this.SetVal(val);
      else this.SetVal("");
    }
  },
  methods: {
    SetVal(val) {
      this.$emit("Set", val.toString());
    }
  }
};
</script>
