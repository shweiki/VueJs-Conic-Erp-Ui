import store from "@/store";
import { nArabicWords } from "./nArabicWords.js";
import i18n from "@/lang";
import QRCode from 'qrcode'
import checkPermission from "@/utils/permission";
import {  TimeConvert as TimeConvertX, MinutesConvert as MinutesConvertX } from "@/utils";

let toFixed = store.getters.settings.ToFixed;
var JsBarcode = require('jsbarcode');
var { createCanvas } = require("canvas");
var days = ["الاحد", "الاثنين", "الثلاثاء", "الاربعاء", "الخميس", "الجمعة", "السبت"]

export default function Visualization(Data, Html, Type) {
  console.log("Visualization Data : =>", Data);
  let ConvetNumberToArabicWords = nArabicWords;
  let formatDate = formatDateX;
  let TimeConvert = TimeConvertX;
  let MinutesConvert = MinutesConvertX;

  let ToFixed = ToFixedX;
  let tr = (v) => i18n.t(v);
  let Days = (v) => days[v];
  let Absent = (v) => { return v.toString().toLowerCase() === "true" ? "غياب" : "حضور" };
  let Barcode = (v) => {
    var canvas = createCanvas();
    JsBarcode(canvas, v, {
      format: "CODE128",
      lineColor: "#000000",
      width: 4,
      height: 40,
      displayValue: false
    });
    return '<img src="' + canvas.toDataURL() + '" />'
  }
  let QRcode = (v, w = 50, h = 50) => {
    var opts = {
      errorCorrectionLevel: 'H',
      type: 'image/png',
      quality: 1,
      margin: 1,
      width: w,
      height: h,
    }
    var imgurl = '';
    QRCode.toDataURL(
      v,
      opts
      , (err, url) => {
        if (err) throw err
        imgurl = url
      })
    return '<img src="' + imgurl + '"  width="' + w + '" height="' + h + '" />'
  }
  let checkpermission = (v) => {
    if (!checkPermission(v)) {
      return "display: none;"
    }
  }
  Object.keys(Data).forEach(key => {
    if (typeof Data[key] == "function") { Data[key] = Data[key]() }
    Html = Html.replaceAll("{{" + key + "}}", Data[key]);
    if (Data[key] != null && typeof Data[key] == "object") {
      Object.keys(Data[key]).forEach(keyo => {
        Html = Html.replaceAll("{{" + key + "." + keyo + "}}", Data[key][keyo] == null ? "" :  Data[key][keyo] );
      })
    }
    if (Array.isArray(Data[key])) {
      //  console.log("isArray", key, Data[key])
      let res = Html.slice(
        Html.search('<tr id="' + key + '"'),
        Html.indexOf("</tr>", Html.search('<tr id="' + key + '"')) + 5
      );
      let tabelArray = "";
      Data[key].forEach(element => {
        let row = res;
        Object.keys(element).forEach(keya => {
          // replace All keys to values
          row = row.replaceAll("{{" + key + "." + keya + "}}", element[keya]== null ? "" :  element[keya]);
          // find if have Equation {#  /}
          var searchKeyword = "{#";
          var startingIndices = [];
          var indexOccurence = row.indexOf(searchKeyword, 0);
          while (indexOccurence >= 0) {
            startingIndices.push(indexOccurence);
            let Equation = row.slice(
              row.search("{#"),
              row.indexOf("/}", row.search("{#")) + 2
            );
            if (Equation != "" && Equation.search("{{") <= -1) {
              let evalV = Equation.replace("{#", "");
              evalV = evalV.replace("/}", "");
              row = row.replace(Equation, eval(evalV));
            }
            indexOccurence = row.indexOf(searchKeyword, indexOccurence + 1);
          }
        });
        tabelArray += row;
      });
      Html = Html.replaceAll(
        Html.slice(
          Html.search('<tr id="' + key + '"'),
          Html.indexOf("</tr>", Html.search('<tr id="' + key + '"')) + 5
        ),
        tabelArray
      );
    }
  });

  var searchKeyword = "{#";
  var startingIndices = [];
  var indexOccurence = Html.indexOf(searchKeyword, 0);
  while (indexOccurence >= 0) {
    startingIndices.push(indexOccurence);
    let Equation = Html.slice(
      Html.search("{#"),
      Html.indexOf("/}", Html.search("{#")) + 2
    );
    if (Equation != "" && Equation.search("{{") <= -1) {
      let evalV = Equation.replace("{#", "");
      evalV = evalV.replace("/}", "");
      Html = Html.replace(Equation, eval(evalV));
    }
    indexOccurence = Html.indexOf(searchKeyword, indexOccurence + 1);
  }
  if (Type == "Set") {
    //  Html += nArabicWords(2000)
    return Html;
  }
}

export function ToFixedX(num) {
  return num.toFixed(3);
}

export function formatDateX(date) {
  let d = new Date(date),
    day = "" + d.getDate(),
    month = "" + (d.getMonth() + 1),
    year = d.getFullYear();
  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [day, month, year].join("/");
}
