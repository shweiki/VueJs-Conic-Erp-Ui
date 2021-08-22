<template>
  <div>
    <el-radio-group v-model="tabPosition">
      <el-radio-button label="top">top</el-radio-button>
      <el-radio-button label="right">right</el-radio-button>
      <el-radio-button label="bottom">bottom</el-radio-button>
      <el-radio-button label="left">left</el-radio-button>
    </el-radio-group>
    <el-tabs
      v-model="activeName"
      :tab-position="tabPosition"
      type="border-card"
    >
      <el-tab-pane
        v-for="(item, index) in Keys"
        :key="index"
        :label="item.name"
        :name="item.name"
      >
        <el-button type="success" @click="Add(item.value)">Add</el-button>
        <div v-html="item.value"></div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import SaleInvoiceReceipt from "@/Report/Template/SaleInvoiceReceipt.js";
import ItemsIngredients from "@/Report/Template/ItemsIngredients.js";
import ItemsSales from "@/Report/Template/ItemsSales.js";
import SaleInvoicesList from "@/Report/Template/SaleInvoicesList.js";

export default {
  methods: {
    Add(v) {
      this.$emit("Add", v);
    }
  },
  data() {
    return {
      tabPosition: "top",
      activeName: "SaleInvoiceReceipt",
      Keys: [
        {
          name: "SaleInvoiceReceipt",
          value: SaleInvoiceReceipt
        },
        {
          name: "ItemsIngredients",
          value: ItemsIngredients
        },
        {
          name: "ItemsSales",
          value: ItemsSales
        },
        {
          name: "SaleInvoicesList",
          value: SaleInvoicesList
        }
      ]
    };
  }
};
</script>