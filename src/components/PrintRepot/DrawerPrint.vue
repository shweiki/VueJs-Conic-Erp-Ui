<template>
  <div>
    <el-button
      v-bind:disabled="Data != null ? false : true"
      v-bind:style="Css"
      icon="el-icon-printer"
      type="info"
      @click="drawer = true"
    ></el-button>
    <el-drawer size="80%" :visible.sync="drawer" @opened="getdata()">
      <template slot="title">
        <ElTag type="success">{{ Type }}</ElTag>
      </template>
      <el-col
        v-bind:span="24 / Reports.length"
        v-for="item in Reports"
        :key="item.Id"
      >
        <el-button type="success" icon="el-icon-printer" @click="Print(item)" />

        <el-button
          class="filter-item"
          type="primary"
          icon="el-icon-download"
          @click="handleDownload(item)"
        >
        </el-button>
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
        <el-col :span="6">
          <el-input
            placeholder="Please input Email"
            v-model="item.EmailSent"
            class="input-with-select"
          >
            <el-button
              @click="SendEmail(item)"
              slot="append"
              icon="el-icon-s-promotion"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="6">
          <el-input
            placeholder="Please input Number as 79xxxxxxx"
            v-model="PhoneNumber"
            class="input-with-select"
          >
            <el-button
              @click="SendWhatsApp(item)"
              slot="append"
              icon="el-icon-chat-round"
              type="success"
            ></el-button>
          </el-input>
        </el-col>
        <iframe
          height="500px"
          frameborder="0"
          style="overflow:hidden;width:100%"
          v-bind:id="'Report-' + item.Id"
          class="iframeR"
          :srcdoc="item.Html"
          :title="item.Name"
        ></iframe>
        <iframe id="ifrmPrint" class="iframeR" :title="item.Name"></iframe>
      </el-col>
    </el-drawer>
    <img id="qr_code" style="display: none" />
  </div>
</template>
<script>
import { OrderReceipt } from "@/Report/OrderReceipt.js";
import { OrderReceipt2 } from "@/Report/OrderReceipt2.js";
import { ShawermaSheesh } from "@/Report/ShawermaSheesh";
import Visualization from "@/Report/Visualization.js";
import jsPDF from "jspdf";

import printJS from "print-js";
import JSPM from "jsprintmanager";
import * as htmlToImage from "html-to-image";
import { GetByListQ } from "@/api/Report";
import { SendEmail } from "@/api/StmpEmail";

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
      Reports: [],
      PhoneNumber: ""
    };
  },
  watch: {
    Data(val) {
      console.log("Data Report = ", val);
      this.Reports.forEach((item, index) => {
        item.Html = this.Visualization(val, item.Html, "Set");
        if (item.AutoPrint && this.AutoPrint) {
         //   this.Print(item);
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
         //   this.Print(item);
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
    Print(item) {
      try {
        var oIframe = document.getElementById("ifrmPrint");
        var oDoc = oIframe.contentWindow || oIframe.contentDocument;
        if (oDoc.document) oDoc = oDoc.document;
        oDoc.write("<head><title>title</title>");
        oDoc.write('</head><body onload="this.focus(); this.print();">');
        oDoc.write(item.Html + "</body>");
        oDoc.close();
        setTimeout(() => {
          document.getElementById("ifrmPrint").src = "";
        }, 2000);
      } catch (e) {
        self.print();
      }
    },
    SendEmail(item) {
      ///  To , Subject , Body
      SendEmail(
        "tahashweiki@yahoo.com",
        "From Conic Erp App Invoice #" + item.Id + "",
        item.Html
      );
      this.$notify({
        title: "تم ",
        message: "تم ارسال بنجاح",
        type: "success",
        duration: 20000
      });
    },
    SendWhatsApp(item) {
      var oIframe = document.getElementById("Report-" + item.Id);
      var oDoc = oIframe.contentWindow || oIframe.contentDocument;
      if (oDoc.document) oDoc = oDoc.document;
      oDoc.write("<head><title>title</title>");
      oDoc.write("</head><body >");
      oDoc.write(item.Html + "</body>");
      console.log(oDoc.body);
      htmlToImage
        .toPng(oDoc.body)
        .then(dataUrl => {
          window.open(
            "https://wa.me/962" +
              this.PhoneNumber +
              "?public.image=" +
              dataUrl +
              ""
          );
        })
        .catch(error => {
          console.error("oops, something went wrong!", error);
        });
    },
    handleDownload(item) {
      var oIframe = document.getElementById("Report-" + item.Id);
      var oDoc = oIframe.contentWindow || oIframe.contentDocument;
      if (oDoc.document) oDoc = oDoc.document;
      oDoc.write("<head><title>title</title>");
      oDoc.write("</head><body >");
      oDoc.write(item.Html + "</body>");
      console.log(oDoc.body);
      htmlToImage
        .toPng(oDoc.body)
        .then(dataUrl => {
          const pdf = new jsPDF();
          pdf.addImage(dataUrl, "PNG", 0, 0);
          pdf.save("Invoice #" + item.Id + ".pdf");
          oDoc.close();
        })
        .catch(error => {
          console.error("oops, something went wrong!", error);
        });
    },
    JSPM(printer, el) {
      if (printer) {
        let cpj = new JSPM.ClientPrintJob();
        cpj.clientPrinter = new JSPM.InstalledPrinter(printer);
        htmlToImage
          .toPng(document.getElementById(el))
          .then(dataUrl => {
            console.log(dataUrl);
            cpj.files.push(
              new JSPM.PrintFile(
                dataUrl,
                JSPM.FileSourceType.URL,
                el + ".png",
                1
              )
            );
            cpj.sendToClient();
          })
          .catch(error => {
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
.iframeR {
  border: none;
}
</style>
