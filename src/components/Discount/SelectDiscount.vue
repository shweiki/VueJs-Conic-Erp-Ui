<template>
  <el-select v-model="value" clearable @change="SetVal" placeholder="خصم">
    <el-option
      v-for="Discount in options"
      :key="Discount.label"
      :label="Discount.label"
      :value="Discount.label"
    >
      <span style="float: left">{{ Discount.label }}</span>
      <span style="float: right; color: #8492a6; font-size: 13px"
        >{{ Discount.value
        }}{{ Discount.type == "Percentage" ? "%" : "-" }}</span
      >
    </el-option>
  </el-select>
</template>
<script>
import { GetActiveDiscount } from "@/api/Discount";

export default {
  props: ["Price"],
  data() {
    return {
      options: [],
      value: "لا يوجد خصم",
    };
  },
  watch: {
    Price(val) {
      if (val > 0) {
        console.log(val)
        this.Price = val;
        this.SetVal(this.value);
      } else this.Price = 0;
    }
  },
  created() {
    GetActiveDiscount().then(response => {
      this.options = response;
    });
  },
  methods: {
    SetVal(val) {
      let dis = this.options.find(obj => obj.label == val);
      if (dis)
        this.$emit(
          "Set",
          dis.type == "Percentage" ? (dis.value / 100) * this.Price : dis.value
        );
    }
  }
};
</script>