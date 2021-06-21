<template>
  <div>
    <el-col :span="2">
      <add-vendor
        :Phone="NewPhone"
        @Set="
          v => {
            change(v);
          }
        "
      />
    </el-col>
    <el-col :span="16">
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
    </el-col>
    <el-col :span="6">
      <edit-vendor v-if="VendorId != 2" :VendorId="VendorId" />
    </el-col>
  </div>
</template>
<script>
import { GetVendorByAny } from "@/api/Vendor";
import AddVendor from "@/components/Vendor/AddVendor.vue";
import EditVendor from "@/components/Vendor/EditVendor.vue";

export default {
  props: ["Value"],
  components: { AddVendor, EditVendor },
  data() {
    return {
      search: "",
      options: [],
      NewPhone: "",
      VendorId: 2
    };
  },
  watch: {
    Value(val) {
      if (val != "") this.search = val;
      //else this.SetVal(new Date());
    }
  },
  methods: {
    change(val) {
      this.search = "";
      this.options = [];
      this.VendorId = val.Id;

      this.$emit("Set", val);
    },

    querySearch(query) {
      if (query !== "" && query.length > 1) {
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
