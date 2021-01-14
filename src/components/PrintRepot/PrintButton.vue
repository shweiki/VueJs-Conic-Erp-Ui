<template>
  <el-popover
    @after-enter="focus"
    @after-leave="focus"
    placement="top-start"
    title="نماذج"
    width="200"
    trigger="hover"
  >
    <div class="icon-item">
      <el-button
        v-if="Type == 'SaleInvoice'"
        icon="el-icon-postcard"
        @click="SaleInvoiceLabel"
        >Label</el-button
      >
      <el-button
        v-if="Type == 'SaleInvoice'"
        icon="el-icon-document"
        @click="SaleInvoiceA4"
        >A4</el-button
      >
      <el-button
        v-if="Type == 'PurchaseInvoice'"
        icon="el-icon-document"
        @click="PurchaseInvoiceA4"
        >A4</el-button
      >
    </div>
    <el-button
      v-bind:style="Css"
      icon="el-icon-printer"
      type="info"
      slot="reference"
    ></el-button>
  </el-popover>
</template>
<script>
import { SaleInvoiceLabel } from "@/Report/POSInvoice";
import { SaleInvoiceA4 } from "@/Report/SaleInvoice";
import { PurchaseInvoiceA4 } from "@/Report/PurchaseInvoice";

import printJS from "print-js";
import { string } from "clipboard";

export default {
  name: "PrintButton",
  props: {
    Type: string,
    Css: string,
    Data: {
      type: Object,
      default: {},
    },
  },
  methods: {
    focus() {
      this.$emit("focus");
    },
    PurchaseInvoiceA4() {
      PurchaseInvoiceA4(this.Data);
    },
    SaleInvoiceA4() {
      SaleInvoiceA4(this.Data);
    },
    SaleInvoiceLabel() {
      printJS({
        printable: SaleInvoiceLabel(this.Data),
        type: "pdf",
        base64: true,
        showModal: true,
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.icon-item {
  margin: 20px;
  height: 85px;
  text-align: center;
  width: 100px;
  float: left;
  font-size: 30px;
  color: #24292e;
  cursor: pointer;
}
</style>
