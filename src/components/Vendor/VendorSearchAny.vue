<template>
  <div>
    <el-col :span="4">
      <add-vendor
        :Phone="NewPhone"
        @Set="
          (v) => {
            change(v);
          }
        "
      />
    </el-col>
    <el-col :span="16">
      <div :class="{ show: show }" class="vendor-search">
        <el-input :disabled="true" v-model="Vendor.Name" class="input-with-select">
          <svg-icon
            slot="append"
            class-name="search-icon"
            icon-class="search"
            @click.stop="click"
          />
        </el-input>
        <el-select
          ref="VendorSearchSelect"
          v-model="search"
          :remote-method="querySearch"
          filterable
          default-first-option
          remote
          v-bind:placeholder="$t('Vendors.Search') + '/ هاتف / الرقم الوطني /'"
          @change="change"
          class="vendor-search-select"
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
            <span style="color: #8492a6; font-size: 13px">( {{ item.Region }} )</span>
          </el-option>
        </el-select>
      </div>
    </el-col>
    <el-col :span="4">
      <edit-vendor :VendorId="Vendor.Id" />
    </el-col>
  </div>
</template>
<script>
import { GetVendorByAny, GetById } from "@/api/Vendor";

import AddVendor from "@/components/Vendor/AddVendor.vue";
import EditVendor from "@/components/Vendor/EditVendor.vue";

export default {
  props: ["VendorId"],
  components: { AddVendor, EditVendor },
  data() {
    return {
      search: "",
      options: [],
      NewPhone: "",
      show: false,
      Vendor: { Id: 2, Name: "زبون نقدي", AccountId: 6 },
    };
  },
  watch: {
    VendorId(value) {
      if (value != null && value != undefined && value != "" && value > 0) {
        GetById({ Id: value }).then((res) => {
          this.change(res);
        });
      }
    },
    show(value) {
      if (value) {
        document.body.addEventListener("click", this.close);
      } else {
        document.body.removeEventListener("click", this.close);
      }
    },
  },
  methods: {
    change(val) {
      this.search = "";
      this.options = [];
      this.Vendor = val;
      this.show = false;
      this.$emit("Set", val);
    },
    querySearch(query) {
      if (query !== "" && query.length > 1) {
        GetVendorByAny({ Any: query }).then((res) => {
          this.options = res;
          if (res.length == 0) this.NewPhone = query;
          //  if (res.length == 1) this.change(res[0]);
        });
      } else {
        this.options = [];
      }
    },
    click() {
      this.show = !this.show;
      if (this.show) {
        this.$refs.VendorSearchSelect && this.$refs.VendorSearchSelect.focus();
      }
    },
    close() {
      this.$refs.VendorSearchSelect && this.$refs.VendorSearchSelect.blur();
      this.options = [];
      this.show = false;
    },
  },
};
</script>
<style lang="scss" scoped>
.vendor-search {
  font-size: 0 !important;

  .search-icon {
    cursor: pointer;
    font-size: 18px;
    vertical-align: middle;
  }

  .vendor-search-select {
    font-size: 18px;
    transition: width 0.2s;
    width: 0;
    overflow: hidden;
    background: transparent;
    border-radius: 0;
    display: inline-block;
    vertical-align: middle;

    /deep/ .el-input__inner {
      border-radius: 0;
      border: 0;
      padding-left: 0;
      padding-right: 0;
      box-shadow: none !important;
      border-bottom: 1px solid #d9d9d9;
      vertical-align: middle;
    }
  }

  &.show {
    .vendor-search-select {
      width: 210px;
      margin-left: 10px;
    }
  }
}
</style>
