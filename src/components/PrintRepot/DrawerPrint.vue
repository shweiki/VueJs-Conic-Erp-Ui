<template>
  <div>
    <el-button
      v-bind:disabled="Data != null ? false : true"
      v-bind:style="Css"
      icon="el-icon-printer"
      type="info"
      @click="drawer = true"
    ></el-button>
    <el-drawer
      size="50%"
      title="نماذج"
      :visible.sync="drawer"
      :direction="direction"
      @opened="getdata()"
    >
      <el-col
        v-bind:span="24 / Reports.length"
        v-for="item in Reports"
        :key="item.Id"
      >
        <el-button
          type="success"
          icon="el-icon-printer"
          @click="printJS('Report-' + item.Id, 'html')"
        />
        <el-button
          type="danger"
          icon="el-icon-printer"
          @click="PrintNewWin(item.Html)"
        />

        <el-button
          type="warning"
          icon="el-icon-edit"
          @click="
            let r = $router.resolve({
              path: '/Reports/Edit/' + item.Id
            });
            window.open(
              r.href,
              r.route.name,
              $store.getters.settings.windowStyle
            );
          "
        />
        <div
          style="direction: ltr;"
          v-bind:id="'Report-' + item.Id"
          class="editor-content"
          v-html="item.Html"
        />
      </el-col>
    </el-drawer>
    <img id="qr_code" style="display: none" />
  </div>
</template>
<script>
import { OrderReceipt } from "@/Report/OrderReceipt.js";
import { OrderReceipt2 } from "@/Report/OrderReceipt2.js";
import { ShawermaSheesh } from "@/Report/ShawermaSheesh";
import  Visualization  from "@/Report/Visualization.js";

import printJS from "print-js";
import JSPM from "jsprintmanager";
import * as htmlToImage from "html-to-image";
import { GetByListQ } from "@/api/Report";

export default {
  name: "PrintButton",

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
      console.log("Data Report = ", val);
      this.Reports.forEach((item, index) => {
        item.Html = this.Visualization(val, item.Html, "Set");

        if (item.AutoPrint && this.AutoPrint) {
          this.eval(item.Name, item.Printer);
        }
      });
    }
  },
  methods: {
    getdata() {
      GetByListQ({
        Page: 1,
        Any: this.Type,
        limit: 5,
        Sort: "-id",
        Status: 0
      }).then(r => {
        this.Reports = r.items;
        this.Reports.forEach((item, index) => {
          item.Html = this.Visualization(this.Data, item.Html, "Set");

          if (item.AutoPrint && this.AutoPrint) {
            this.eval(item.Name, item.Printer);
          }
        });
      });
    },
    Visualization,
    ShawermaSheesh,
    OrderReceipt,
    OrderReceipt2,
    printJS,
    eval(funName, printer) {
      eval(
        "this." +
          funName +
          "(" +
          JSON.stringify(this.Data) +
          (printer ? ",`" + printer + "`)" : ")")
      );
    },
    PrintNewWin(Html) {
      let win = window.open(
        "",
        "Title",
        "toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=780,height=600,top=" +
          (screen.height - 50) +
          ",left=" +
          (screen.width - 500)
      );
      win.document.body.innerHTML = Html;

      setTimeout(() => {
        win.print();
      }, 1000);
    },
    JSPM(printer, el) {
      if (printer) {
        let cpj = new JSPM.ClientPrintJob();
        cpj.clientPrinter = new JSPM.InstalledPrinter(printer);
        htmlToImage
          .toBlob(document.getElementById(el))
          .then(function(dataUrl) {
            console.log(dataUrl);

            cpj.files.push(
              new JSPM.PrintFile(
                dataUrl,
                JSPM.FileSourceType.BLOB,
                el + ".png",
                1
              )
            );
            cpj.sendToClient();
          })
          .catch(function(error) {
            console.error("oops, something went wrong!", error);
          });
      }
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
.editor-content {
  color: black;
}
</style>
