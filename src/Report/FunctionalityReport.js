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
export function SendReportByEmail(Email, Type, Data) {
  GetReportByType({
    Type: Type,
  }).then((res) => {
    res.forEach((item, index) => {
      item.Html = Visualization(Data, item.Html, "Set");

      SendEmail(Email, item.Name, item.Html, {
        name: "smtpjs.png",
        path: "https://networkprogramming.files.wordpress.com/2017/11/smtpjs.png"
      })

    });
  });
}