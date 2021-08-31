import store from "@/store";
import { GetReportByType } from "@/api/Report";
import Visualization from "./Visualization";
import * as htmlToImage from "html-to-image";
import JSPM from "jsprintmanager";
import jsPDF from "jspdf";
import { SendEmail } from "@/api/StmpEmail";

import { ShawermaSheesh as ShawermaSheeshx } from "@/Report/ShawermaSheesh";
import { OrderReceipt as OrderReceiptx } from "@/Report/OrderReceipt";

export function PrintReport(Type, Data, JSPM = false) {
  GetReportByType({
    Type: Type,
  }).then((res) => {
    res.forEach((item, index) => {
      if (!JSPM) {
        item.Html = Visualization(Data, item.Html, "Set");
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
      } else {
        var ShawermaSheesh = ShawermaSheeshx
        var OrderReceipt = OrderReceiptx
        eval(
          "" +
          item.Name +
          "(" +
          JSON.stringify(Data) +
          (item.Printer ? ",`" + item.Printer + "`)" : ")")
        );

      }
    });
  });
}
export function JSPMPrintReport(Type, Data) {
  GetReportByType({
    Type: Type,
  }).then((res) => {
    res.forEach((item, index) => {

    });
  });
}
export function SendReportByEmail(Email, Type, Data, Subject = "") {
  GetReportByType({
    Type: Type,
  }).then( (res) => {
    res.forEach(async(item, index) => {
      item.Html = Visualization(Data, item.Html, "Set");
      const ResolveSendEmail = await SendEmail(Email, item.Name + " - " + Subject, item.Html)
      this.$notify({
        title: "تم الإضافة بنجاح",
        message: "تم ارسال " + ResolveSendEmail,
        type: "success",
        position: "top-left",
        duration: 3000,
      });
    });
  });
}
export function VisualizationReportHtml(Type, Data) {
  return new Promise((resolve, reject) => {
    GetReportByType({
      Type: Type,
    }).then((res) => {
      res.forEach((item, index) => {
        item.Html = Visualization(Data, item.Html, "Set");
      });
      resolve(res.map(x => x.Html))
    }).catch(err => { reject(err) });
  })
}