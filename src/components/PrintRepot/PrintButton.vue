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
    <el-button v-if="Type == 'SaleInvoice'" icon="el-icon-document" @click="SaleInvoiceA4"
      >A4</el-button
    >
    <el-button
      v-if="Type == 'PurchaseInvoice'"
      icon="el-icon-document"
      @click="PurchaseInvoiceA4"
      >A4</el-button
    >
    <el-button v-if="Type == 'Item'" icon="el-icon-s-management" @click="ItemLabel"
      >Label</el-button
    >
    <el-button icon="el-icon-s-management" @click="ShawermaSheesh(Data)"
      >ShawermaSheesh
    </el-button>
    <el-button icon="el-icon-s-management" @click="OrderReceipt(Data)"
      >OrderReceipt
    </el-button>
    <el-button icon="el-icon-s-management" @click="OrderReceipt2(Data)"
      >OrderReceipt2
    </el-button>

    <img id="qr_code" style="display: none" />
    <el-button
      v-bind:style="Css"
      icon="el-icon-printer"
      type="info"
      slot="reference"
    ></el-button>
  </el-popover>
</template>
<script>
import { SaleInvoiceLabel } from "@/report/POSInvoice";
import { SaleInvoiceA4 } from "@/report/SaleInvoice";
import { PurchaseInvoiceA4 } from "@/report/PurchaseInvoice";
import printJS from "print-js";
import T1 from "raw-loader!@/report/Html/T1.txt";
import { OrderReceipt } from "@/report/OrderReceipt.js";
import { OrderReceipt2 } from "@/report/OrderReceipt2.js";
import { ShawermaSheesh } from "@/report/ShawermaSheesh";
export default {
  name: "PrintButton",

  props: {
    Type: String,
    Css: String,
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
      SaleInvoiceA4(this.Data, T1);
    },
    SaleInvoiceLabel() {
      printJS({
        printable: SaleInvoiceLabel(this.Data),
        type: "pdf",
        base64: true,
        showModal: true,
      });
    },

    ShawermaSheesh,
    OrderReceipt,
    OrderReceipt2,
  },
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
