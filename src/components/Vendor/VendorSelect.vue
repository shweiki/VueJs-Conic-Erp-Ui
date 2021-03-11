<template>
  <el-select
    v-model="VendorId"
    filterable
    v-bind:placeholder="$t('NewPurchaseInvoice.Acc')"
    autocomplete="off"
    default-first-option
    @change="SetVal">
    <el-option
      v-for="item in Vendors"
      :key="item.value"
      :label="item.label"
      :value="item.value"
    >
      <span style="float: right">{{ item.label }}</span>
      <span>{{ item.value }}</span>
    </el-option>
  </el-select>
</template>
<script>
import { GetActiveVendor } from "@/api/Vendor";

export default {
  data() {
    return {
      VendorId: 2,
      Vendors: []
    };
  },
  created() {
    GetActiveVendor().then(res => {
      this.Vendors = res;
    });
  },
  methods: {
    SetVal(v) {
      this.$emit("Set", v);
    }
  }
};
</script>