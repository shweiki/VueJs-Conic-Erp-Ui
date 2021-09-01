<template>
  <div>
    <el-tooltip class="item" effect="dark" :content="Type" placement="top-start">
      <el-button
        v-bind:disabled="Data != null ? false : true"
        v-bind:style="Css"
        icon="el-icon-printer"
        type="info"
        :size="$store.getters.size"
        @click="drawer = true"
      ></el-button>
    </el-tooltip>

    <el-drawer size="80%" :visible.sync="drawer" @opened="getdata()">
      <template slot="title">
        <el-row type="flex">
          <el-col :span="3">
            <el-button
              :size="$store.getters.size"
              type="primary"
              icon="el-icon-plus"
              @click="
                let r = $router.resolve({ path: '/Reports/Create' });
                window.open(r.href, r.route.name, $store.getters.settings.windowStyle);
              "
          /></el-col>
          <el-col :span="21">
            <ElTag type="success">{{ Type }}</ElTag>
          </el-col>
        </el-row>
      </template>
      <el-col v-bind:span="24 / Reports.length" v-for="item in Reports" :key="item.Id">
        <el-row type="flex">
          <el-col :span="2">
            <el-button type="success" icon="el-icon-printer" @click="Print(item)" />
          </el-col>
          <el-col v-permission="['Admin']" :span="2">
            <el-button
              class="filter-item"
              type="primary"
              icon="el-icon-download"
              @click="handleDownload(item)"
            >
            </el-button>
          </el-col>
          <el-col v-permission="['Admin']" :span="2">
            <el-button
              type="warning"
              icon="el-icon-edit"
              @click="
                let r = $router.resolve({
                  path: '/Reports/Edit/' + item.Id,
                });
                window.open(r.href, r.route.name, $store.getters.settings.windowStyle);
              "
            />
          </el-col>
          <el-col v-permission="['Admin']" :span="9">
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
          <el-col v-permission="['Admin']" :span="9">
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
        </el-row>
        <iframe
          height="800px"
          frameborder="0"
          style="overflow: hidden; width: 100%"
          v-bind:id="'Report-' + item.Id"
          class="iframeR"
          :srcdoc="'<head><style> body {zoom: 60%;}</style></head>' + item.Html"
          :title="item.Name"
        ></iframe>
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

import JSPM from "jsprintmanager";
import * as htmlToImage from "html-to-image";
import { GetReportByType } from "@/api/Report";
import { SendEmail } from "@/api/StmpEmail";
import permission from "@/directive/permission/index.js";

export default {
  name: "PrintButton",
  props: ["Data", "Type", "Css"],
  directives: { permission },
  data() {
    return {
      drawer: false,
      Reports: [],
      PhoneNumber: "",
    };
  },
  watch: {
    Data(val) {
      if (val != null && val != undefined) {
        this.Reports.forEach((item, index) => {
          item.Html = this.Visualization(val, item.Html, "Set");
        });
      }
    },
  },
  methods: {
    getdata() {
      GetReportByType({
        Type: this.Type,
      }).then((res) => {
        this.Reports = res;
        this.Reports.forEach((item, index) => {
          item.Html = this.Visualization(this.Data, item.Html, "Set");
        });
      });
    },
    Visualization,
    ShawermaSheesh,
    OrderReceipt,
    OrderReceipt2,
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
    async SendEmail(item) {
      ///  To , Subject , Body
      const loading = this.$loading({
        lock: true,
        text: "Send Report By Email",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      const ResolveSendEmail = await SendEmail(
        item.EmailSent,
        "From Conic Erp App " + item.Name + "",
        item.Html
      );
      this.$notify({
        title: "تم ",
        message: "تم ارسال " + ResolveSendEmail,
        type: "success",
        duration: 20000,
      });
      loading.close();
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
        .then((dataUrl) => {
          window.open(
            "https://wa.me/962" +
              this.PhoneNumber +
              "?public.image=" +
              //dataUrl +
              ""
          );
        })
        .catch((error) => {
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
        .then((dataUrl) => {
          var pdf = new jsPDF("p", "mm", "a4");
          var width = pdf.internal.pageSize.getWidth();
          var height = pdf.internal.pageSize.getHeight();
          pdf.addImage(dataUrl, "PNG", 0, 0, width, height);
          pdf.save("Invoice #" + this.Data.Id + ".pdf");
          oDoc.close();
        })
        .catch((error) => {
          console.error("oops, something went wrong!", error);
        });
    },
    JSPM(printer, item) {
      if (printer) {
        var oIframe = document.getElementById("ifrmPrint");
        var oDoc = oIframe.contentWindow || oIframe.contentDocument;
        if (oDoc.document) oDoc = oDoc.document;
        oDoc.write("<head><title>title</title>");
        oDoc.write("</head><body >");
        oDoc.write(item.Html + "</body>");
        console.log(oDoc.body);
        htmlToImage
          .toPng(oDoc.body)
          .then((dataUrl) => {
            const doc = new jsPDF();
            doc.addImage(dataUrl, "PNG", 0, 0);
            let cpj = new JSPM.ClientPrintJob();
            cpj.clientPrinter = new JSPM.InstalledPrinter(printer);
            var my_file = new JSPM.PrintFilePDF(
              doc.output("blob"),
              JSPM.FileSourceType.BLOB,
              this.Data.Id + ".pdf",
              1
            );
            cpj.files.push(my_file);
            cpj.sendToClient();
            oDoc.close();
          })
          .catch((error) => {
            console.error("oops, something went wrong!", error);
          });
      }
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
