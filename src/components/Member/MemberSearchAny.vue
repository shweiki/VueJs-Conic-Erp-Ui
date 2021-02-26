<template>
  <el-select
    style="width: 90%"
    v-model="search"
    :remote-method="querySearch"
    filterable
    default-first-option
    remote
    v-bind:placeholder="$t('Vendors.Search') + '/ هاتف / الرقم الوطني /  رقم العضوية'"
    @change="change"
  >
    <el-option v-for="item in options" :key="item.Id" :value="item" :label="item.Name">
      <span style="color: #8492a6; font-size: 12px">( {{ item.Id }} )</span>
      <span style="float: left">{{ item.Name }}</span>
      <span style="float: right; color: #8492a6; font-size: 13px">{{ item.Ssn }}</span>
      <span style="color: #8492a6; font-size: 13px">( {{ item.PhoneNumber1 }} )</span>
      <span style="color: #8492a6; font-size: 13px">( {{ item.Tag }} )</span>
    </el-option>
  </el-select>
</template>
<script>
import { GetMemberByAny } from "@/api/Member";

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
        GetMemberByAny({ Any: query }).then((res) => {
          this.options = res;
        });
      } else {
        this.options = [];
      }
    },
  },
};
</script>
