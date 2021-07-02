<template>
  <el-select
    style="width: 90%"
    v-model="search"
    :remote-method="querySearch"
    filterable
    default-first-option
    remote
    placeholder="البحث بحسب رقم / الاسم / الباركود  / التصنيف"
    @change="change"
  >
    <el-option
      v-for="item in options"
      :key="item.Id"
      :value="item"
      :label="item.Name"
    >
      <span style="color: #8492a6; font-size: 12px">( {{ item.Id }} )</span>
      <span style="float: left">{{ item.Name }}</span>
      <span style="float: right; color: #8492a6; font-size: 13px">{{
        item.BarCode
      }}</span>
      <span style="color: #8492a6; font-size: 13px"> {{ item.Category }} </span>
      <span style="color: #8492a6; font-size: 13px"
        >( {{ item.SellingPrice }} )</span
      >
      <span style="color: #8492a6; font-size: 13px"
        >( {{ item.CostPrice }} )</span
      >
    </el-option>
  </el-select>
</template>
<script>
import { GetItemByAny } from "@/api/Item";

export default {
  data() {
    return {
      search: "",
      options: []
    };
  },
  methods: {
    change(val) {
      this.$emit("Set", val);
      this.search = "";
      this.options = [];
    },

    querySearch(query) {
      if (query !== "" && query.length > 1) {
        GetItemByAny({ Any: query }).then(res => {
          this.options = res;
        });
      } else {
        this.options = [];
      }
    }
  }
};
</script>
