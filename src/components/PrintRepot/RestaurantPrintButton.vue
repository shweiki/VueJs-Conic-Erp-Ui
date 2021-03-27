<template>
  <div>
    <el-button
      v-bind:disabled="Data != null ? false : true"
      v-bind:style="Css"
      icon="el-icon-printer"
      type="info"
      @click="drawer = true"
    ></el-button>
    <el-drawer title="نماذج" :visible.sync="drawer" :direction="direction">
      <el-col :span="6" v-for="item in Reports" :key="item.Id">
        <el-form-item label="تلقائي">
          <el-switch
            v-model="item.AutoPrint"
            active-color="#13ce66"
            inactive-color="#ff4949"
            active-value="true"
            inactive-value="false"
          ></el-switch>
        </el-form-item>
        <printers
          :Value="item.Printer"
          @change="
            v => {
              item.Printer = v;
            }
          "
        /><el-button icon="el-icon-postcard" @click="eval(item.Name)">{{
          item.Name
        }}</el-button>
        <el-button
          icon="el-icon-postcard"
          @click="Visualization(Data, item.Keys, item.Html, item.Printer)"
          >{{ item.Name }}</el-button
        >
      </el-col>
      ></el-drawer
    >
  </div>
</template>
<script>
import { OrderReceipt } from "@/Report/OrderReceipt.js";
import { OrderReceipt2 } from "@/Report/OrderReceipt2.js";
import { SaleInvoiceLabel } from "@/Report/POSInvoice.js";
import Visualization from "@/Report/Visualization.js";

import Printers from "@/components/Printers/index.vue";
import { GetByListQ } from "@/api/Report";

export default {
  name: "PrintButton",
  components: {
    Printers
  },
  props: {
    Type: String,
    Css: String,
    AutoPrint: Boolean,
    Data: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      drawer: false,
      direction: "rtl",
      Reports: []
    };
  },
  watch: {
    Data(val) {
      if (val && this.AutoPrint) {
        this.Reports.forEach(i => {
          if (i.AutoPrint) this.eval(i.Name, i.Printer);
        });
      } else console.log(val);
    }
  },
  created() {
    GetByListQ({
      Page: 1,
      Any: "SaleInvoice",
      limit: 5,
      Sort: "-id",
      Status: 0
    }).then(r => (this.Reports = r.items));
  },
  methods: {
    SaleInvoiceLabel,
    OrderReceipt,
    OrderReceipt2,
    Visualization,
    eval(funName, printer) {
      eval(
        "this." +
          funName +
          "(" +
          JSON.stringify(this.Data) +
          (printer ? ",`" + printer + "`)" : ")")
      );
    },
    focus() {
      this.$emit("focus");
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
