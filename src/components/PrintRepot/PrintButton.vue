<template>
  <el-popover placement="top-start" title="Title" width="200" trigger="hover">
    <el-button
      v-if="Type == 'PurchaseInvoice'"
      icon="el-icon-printer"
      type="primary"
      @click="PurchaseInvoiceA4"
    ></el-button>
    <el-button
      v-if="Type == 'SaleInvoice'"
      icon="el-icon-printer"
      type="success"
      @click="SaleInvoiceLabel"
    ></el-button>
    <el-button
      v-if="Type == 'SaleInvoice'"
      icon="el-icon-printer"
      type="success"
      @click="SaleInvoiceA4"
    ></el-button>
    <el-button icon="el-icon-printer" type="info" slot="reference"></el-button>
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
    Data: {
      type: Object,
      default: {},
    },
  },
  methods: {
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
