<template>
  <div>
    <el-col :span="2"> <add-vendor :Phone="NewPhone" /> </el-col>
    <el-select
      style="width: 90%"
      v-model="search"
      :remote-method="querySearch"
      filterable
      default-first-option
      remote
      v-bind:placeholder="$t('Vendors.Search') + '/ هاتف / الرقم الوطني /'"
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
          item.Ssn
        }}</span>
        <span style="color: #8492a6; font-size: 13px"
          >( {{ item.PhoneNumber1 }} )</span
        >
        <span style="color: #8492a6; font-size: 13px"
          >( {{ item.Region }} )</span
        >
      </el-option>
    </el-select>
  </div>
</template>
<script>
import { GetVendorByAny } from "@/api/Vendor";
import AddVendor from "@/components/Vendor/AddVendor";

export default {
  components: { AddVendor },
  data() {
    return {
      search: "",
      options: [],
      NewPhone: ""
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
        GetVendorByAny({ Any: query }).then(res => {
          this.options = res;
          if (res.length == 0) this.NewPhone = query;
        });
      } else {
        this.options = [];
      }
    }
  }
};
</script>
