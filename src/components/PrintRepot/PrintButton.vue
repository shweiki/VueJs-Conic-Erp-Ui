<template>
  <el-popover
    @after-enter="focus"
    @after-leave="focus"
    placement="top-start"
    title="نماذج"
    width="200"
    trigger="hover"
  >
    <el-button
      v-if="Type == 'SaleInvoice'"
      icon="el-icon-postcard"
      @click="SaleInvoiceLabel"
      >Receipt</el-button
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
    <el-button
      v-if="Type == 'Item'"
      icon="el-icon-s-management"
      @click="ItemLabel"
      >Label</el-button
    >
    <el-button icon="el-icon-s-management" @click="DirectlyPrint"
      >OrderReceipt
    </el-button>
    <img id="barcodeV" style="display: none" />

    <el-button
      v-bind:style="Css"
      icon="el-icon-printer"
      type="info"
      slot="reference"
    ></el-button>
  </el-popover>
</template>
<script>
import { OrderReceipt } from "@/Report/OrderReceipt";
import { SaleInvoiceLabel } from "@/Report/POSInvoice";
import { SaleInvoiceA4 } from "@/Report/SaleInvoice";
import { PurchaseInvoiceA4 } from "@/Report/PurchaseInvoice";
import { Label1 } from "@/Report/ItemLabel";
import printJS from "print-js";
import T1 from "raw-loader!@/Report/Html/T1.txt";

export default {
  name: "PrintButton",

  props: {
    Type: String,
    Css: String,
    Data: {
      type: Object,
      default: {}
    }
  },

  methods: {
    focus() {
      this.$emit("focus");
    },
    PurchaseInvoiceA4() {
      PurchaseInvoiceA4(this.Data);
    },
    SaleInvoiceA4() {
      SaleInvoiceA4(this.Data, T1);
    },
    SaleInvoiceLabel() {
      printJS({
        printable: SaleInvoiceLabel(this.Data),
        type: "pdf",
        base64: true,
        showModal: true
      });
    },
    ItemLabel() {
      printJS({
        printable: Label1(this.Data),
        type: "pdf",
        base64: true,
        showModal: true
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.icon-item {
  text-align: center;
  float: left;
  color: #24292e;
  cursor: pointer;
}
</style>
