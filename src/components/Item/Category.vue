<template>
  <div>
    <el-drag-select @change="SetVal" v-model="value" multiple placeholder="تصنيفات">
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
import { GetActiveMenuItem } from "@/api/MenuItem";
export default {
  props: ["Value"],
  components: { ElDragSelect },
  data() {
    return {
      value: [],
      options: [],
    };
  },
  created() {
    if (this.Value) this.value = Array.from(this.Value.split(","));
    GetActiveMenuItem()
      .then((response) => {
        // handle success
        console.log(response);
        this.options = response;
        this.loading = false;
      })
      .catch((error) => {
        // handle error
        console.log(error);
      });
  },
  methods: {
    SetVal(val) {
      this.$emit("Set", val.toString());
    },
  },
};
</script>
