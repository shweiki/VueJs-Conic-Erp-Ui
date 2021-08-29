<template>
  <el-select
    v-model="value"
    @change="SetVal"
    :v-bind:placeholder="$t('NewPurchaseInvoice.Inventory')"
  >
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value"
    ></el-option>
  </el-select>
</template>
<script>
import { GetActiveInventory } from "@/api/InventoryItem";

export default {
  props: ["ID", "Type"],
  data() {
    return {
      options: [],
      value: 2,
    };
  },
  watch: {
    InventoryId(val) {
      if (val) this.SetVal(val);
    },
  },
  created() {
    GetActiveInventory()
      .then((response) => {
        this.options = response;
        this.SetVal(response[0].value);
      })
      .catch((error) => {
        reject(error);
      });
  },
  methods: {
    SetVal(val) {
      this.$emit(
        "Set",
        this.options.find((obj) => obj.value == val)
      );
      this.value = val;
    },
  },
};
</script>
