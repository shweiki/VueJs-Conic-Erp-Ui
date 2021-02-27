import jsPDF from "jspdf"
import { AmiriRegular } from "@/assets/custom-theme/fonts/Amiri-Regular.js";
import store from '@/store'

var JsBarcode = require('jsbarcode');

export function Label1(temp) {
  let startX = 1.5, startY = 1
  //Name
  JsBarcode("img#barcodeV", temp.Id, {
    format: "CODE128",
    lineColor: "#000000",
    width: 4,
    height: 40,
    displayValue: false
  });


  const img = document.querySelector('img#barcodeV');
  let doc = new jsPDF('l', 'mm', [500, 250], { filters: ["ASCIIHexEncode"] });
  doc.addFileToVFS('Amiri-Regular-normal.ttf', AmiriRegular());
  doc.addFont('Amiri-Regular-normal.ttf', 'Amiri-Regular', 'normal');
  doc.setFont("Amiri-Regular");

  //fa

  //doc.setFontSize(10);
  doc.rect(1, 1, 50, 25);

  doc.addImage(store.getters.CompanyInfo.Logo, "jpeg", startX, startY, 20, 6);
  doc.setFontSize(8);

  doc.text("" + store.getters.CompanyInfo.Name + "", startX + 3, startY + 9);

  doc.text("" + store.getters.CompanyInfo.NickName + "", startX + 3, startY + 12);

  doc.text("" + store.getters.CompanyInfo.PhoneNumber1 + "", startX + 3, startY + 15);


  doc.setFontSize(10);
  let price = temp.SellingPrice.toFixed(store.getters.settings.ToFixed)
  doc.text("" + temp.Name + "", 50, startY + 4, { align: 'right' });
  doc.setFontSize(12);

  doc.text("" + price + "", 30, startY + 13);
  console.log("img.src " + img.src)

  doc.addImage(img.src, "jpeg", startX, startY + 15, 50, 10);

  //doc.setLineWidth(1);
  //doc.line(0, startY += 5, 5, startY);


  return doc.output('datauristring').replace(/^data:application\/pdf;filename=generated.pdf;base64,/, '')

}

export function tConvert(date) {
  let hours = date.getHours();
  let minutes = date.getMinutes();
  let ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? "0" + minutes : minutes;
  let strTime = " " + hours + ":" + minutes + "  " + ampm;
  return strTime;
}

export function formatDate(date) {
  let d = new Date(date),
    day = "" + d.getDate(),
    month = "" + (d.getMonth() + 1),
    year = d.getFullYear();
  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [day, month, year].join("/");
}