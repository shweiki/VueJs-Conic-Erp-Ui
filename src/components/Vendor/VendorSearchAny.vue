<template>
  <div>
    <el-col :span="4">
      <add-vendor
        @Set="
          (v) => {
            change(v);
          }
        "
      />
    </el-col>
    <el-col :span="4">
      <dialog-search-vendor @add="Add" />
    </el-col>
    <el-col :span="12">
      <el-input :disabled="true" v-model="Vendor.Name"> </el-input>
    </el-col>

    <el-col :span="4">
      <edit-vendor :VendorId="Id" />
    </el-col>
  </div>
</template>
<script>
import { GetById } from "@/api/Vendor";

import AddVendor from "@/components/Vendor/AddVendor.vue";
import EditVendor from "@/components/Vendor/EditVendor.vue";
import DialogSearchVendor from "@/components/Vendor/DialogSearchVendor.vue";
export default {
  components: { AddVendor, EditVendor, DialogSearchVendor },
  props: {
    Id: {
      type: Number,
      default: undefined,
    },
  },
  watch: {
    Id(value) {
      if (value != undefined) {
        GetById({ Id: value }).then((res) => {
          this.change(res);
        });
      }
    },
  },
  data() {
    return {
      Vendor: { Id: undefined, Name: "", AccountId: 0 },
    };
  },

  methods: {
    change(val) {
      this.Vendor = val;
      this.$emit("Set", val);
    },

    Add(v) {
      console.log("Add", v);

      this.change(v);
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

    .el-input__inner {
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
