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
    >
      <el-col :span="8" v-for="item in Reports" :key="item.Id">
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
          icon="el-icon-send"
          type="primary"
          @click="JSPM(item.Printer, 'Report-' + item.Id)"
          >{{ item.Name }}</el-button
        >

        <el-button
          type="success"
          icon="el-icon-printer"
          @click="printJS('Report-' + item.Id, 'html')"
        />
          <el-button
          type="warning"
          icon="el-icon-edit"
          @click="$router.push({ path: `/Reports/Edit/${item.Id}` })
"
        />
        <div
          style="direction: ltr;"
          v-bind:id="'Report-' + item.Id"
          class="editor-content"
          v-html="item.Html"
        />
      </el-col>
      ></el-drawer
    >
    <img id="qr_code" style="display: none"/>

  </div>
</template>
<script>
import { OrderReceipt } from "@/Report/OrderReceipt.js";
import { OrderReceipt2 } from "@/Report/OrderReceipt2.js";
import { ShawermaSheesh } from "@/Report/ShawermaSheesh";
import printJS from "print-js";
import JSPM from "jsprintmanager";
import * as htmlToImage from "html-to-image";
import { toPng, toJpeg, toBlob, toPixelData, toSvg } from "html-to-image";
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
      this.Reports.forEach((item, index) => {
        if (item.AutoPrint && this.AutoPrint) {
          this.eval(item.Name, item.Printer);
        }
        this.Visualization(val, item.Keys, item.Html, index);
      });
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
    JSPM(printer, el) {
      if (printer) {
        let cpj = new JSPM.ClientPrintJob();
       cpj.clientPrinter = new JSPM.InstalledPrinter(printer);
        htmlToImage
          .toBlob(document.getElementById(el))
          .then(function(dataUrl) {
            console.log(dataUrl)
            
            cpj.files.push(
              new JSPM.PrintFile(dataUrl, JSPM.FileSourceType.BLOB, el + ".png", 1)
            );
            cpj.sendToClient();
          })
          .catch(function(error) {
            console.error("oops, something went wrong!", error);
          });
      }
    },
    Visualization(Data, Keys, Html, index) {
      Object.keys(JSON.parse(Keys)).forEach(key => {
        Html = Html.replace("{{" + key + "}}", Data[key]);
      });

      let res = Html.slice(
        Html.search('<tr id="forach"'),
        Html.indexOf("</tr>", Html.search('<tr id="forach"')) + 5
      );

      let tabelInventoryMovements = "";
      Data.InventoryMovements.forEach(element => {
        Object.keys(element).forEach(key => {
          Html = Html.replace("[InventoryMovements." + key + "]", element[key]);
        });
      });
      Html = Html.replace(res, tabelInventoryMovements);

      this.Reports[index].Html = Html;
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
.editor-content {
  color: black;
}
</style>
