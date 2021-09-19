<template>
  <el-select
    style="width: 90%"
    v-model="search"
    :remote-method="querySearch"
    filterable
    default-first-option
    remote
    v-bind:placeholder="$t('Vendors.Search') + '/ هاتف / الرقم الوطني /  رقم الوظيفي'"
    @change="change"
  >
    <el-option v-for="item in options" :key="item.Id" :value="item" :label="item.Name">
      <span style="color: #8492a6; font-size: 12px">( {{ item.Id }} )</span>
      <span style="float: left">{{ item.Name }}</span>
      <span style="float: right; color: #8492a6; font-size: 13px">{{ item.Ssn }}</span>
      <span style="color: #8492a6; font-size: 13px">( {{ item.PhoneNumber1 }} )</span>
    </el-option>
  </el-select>
</template>
<script>
import { GetEmployeeByAny } from "@/api/Employee";

export default {
  data() {
    return {
      search: "",
      options: [],
    };
  },
  methods: {
    change(val) {
      this.search = "";
      this.options = [];
      this.$emit("Set", val);
    },

    querySearch(query) {
      if (query !== "" && query.length > 2) {
        GetEmployeeByAny({ Any: query }).then((res) => {
          this.options = res;
          if (res.length == 1) this.change(res[0]);
        });
      } else {
        this.options = [];
      }
    },
  },
};
</script>
