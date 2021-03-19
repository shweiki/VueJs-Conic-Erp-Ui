<template>
  <el-popover
    @after-enter="focus"
    @after-leave="focus"
    placement="top-start"
    title="نماذج"
    width="300"
    trigger="hover"
  >
    <el-checkbox-group v-model="checkList">
      <el-checkbox label="Option A">
        <printers
          selected="XP-80C2"
          :printer_list="$store.getters.printers"
          @change="onPrinterChange"
        /><el-button icon="el-icon-postcard" @click="SaleInvoiceLabel"
          >Receipt</el-button
        ></el-checkbox
      >
      <el-checkbox label="Option B">
        <printers
          selected="XP-80C2"
          :printer_list="$store.getters.printers"
          @change="onPrinterChange"
        /><el-button icon="el-icon-s-management" @click="DirectlyPrint"
          >OrderReceipt
        </el-button></el-checkbox
      >
      <el-checkbox label="Option C">
        <printers
          selected="XP-80C2"
          :printer_list="$store.getters.printers"
          @change="onPrinterChange"
      /></el-checkbox>
    </el-checkbox-group>
    <printers
      selected="XP-80C2"
      :printer_list="$store.getters.printers"
      @change="onPrinterChange"
    />
    <el-button
      v-bind:disabled="Data != null ? false : true"
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
import JSPM from "jsprintmanager";
import printJS from "print-js";
import Printers from "./Printers";

export default {
  name: "PrintButton",
  components: {
    Printers
  },
  props: {
    Type: String,
    Css: String,
    Data: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      print2default: false,
      selected_printer: "",
      checkList: ["selected and disabled", "Option A"]
    };
  },
  mounted() {
    this.onInit();
  },
  methods: {
    onPrinterChange(value) {
      this.selected_printer = value;
      console.info("Selected printer:", value);
    },
    onInit() {
      JSPM.JSPrintManager.auto_reconnect = true;
      JSPM.JSPrintManager.start();
      JSPM.JSPrintManager.WS.onStatusChanged = () => {
        this.$store.dispatch("app/setPrinters");
      };
    },
    DirectlyPrint() {
      OrderReceipt(this.Data, "XP-80C2");
    },
    focus() {
      this.$emit("focus");
    },
    SaleInvoiceLabel() {
      printJS({
        printable: SaleInvoiceLabel(this.Data),
        type: "pdf",
        base64: true,
        showModal: true
      });
    },

    getPrinters() {
      return new Promise((ok, err) => {
        let printers = [];
        if (JSPM.JSPrintManager.websocket_status == JSPM.WSStatus.Open) {
          JSPM.JSPrintManager.getPrinters()
            .then(function(myPrinters) {
              printers = myPrinters;
              console.log(printers);
              ok(printers);
            })
            .catch(e => err(e));
        } else {
          console.warn("JSPM WS not open");
          ok(printers);
        }
      });
    }
  }
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
