import jsPDF from "jspdf"
import {AmiriRegular} from "@/assets/custom-theme/fonts/Amiri-Regular.js";

import { GetCompanyInfo } from "@/api/CompanyInfo";
let ComapnyInfo = null;
GetCompanyInfo().then(response => {
  ComapnyInfo = response;
})
export function Invoice1(temp) {
  let startX = 1 , startY = 0
  let doc = new jsPDF("p", "mm", "80", { filters: ["ASCIIHexEncode"] });
console.log(temp)
  let timein = new Date(temp.FakeDate);

  let TotalAmmount = (
    temp.InventoryMovements.reduce((prev, cur) => {
      return prev + cur.Qty * cur.SellingPrice;
    }, 0) - temp.Discount
  ).toFixed(2);
  doc.addFileToVFS('Amiri-Regular-normal.ttf',  AmiriRegular());
  doc.addFont('Amiri-Regular-normal.ttf', 'Amiri-Regular', 'normal');
  doc.setFont("Amiri-Regular");

  //Logo
  doc.addImage(ComapnyInfo.Logo, "jpeg", startX, startY, 12, 12);

  //Name

  doc.setFontSize(24);
  doc.setFontType("normal");
  doc.text(ComapnyInfo.Name, startX +24, startY +=9);
  doc.setLineWidth(1);
  doc.line(0, startY +5, 78, startY += 5);
  doc.setFontSize(12);

  doc.text(":رقم الفاتورة", 78, startY+=6, {align:'right'});
  doc.text("" + temp.Id + "", 5, startY);
  doc.setLineWidth(1);
  doc.line(0, startY+=5, 80, startY);
  //doc.text(":عدد الاصناف", 50, startY+=6);
 // doc.text("" + ItemQty + "", 5, startY);

  doc.text("الصنف", 78, startY+=6 , {align:'right'});
  doc.text("عدد" , 40, startY);
  doc.text("سعر" , 27, startY);
  doc.text("الاجمالي" , 5, startY);

  
  temp.InventoryMovements.forEach(element => {
    doc.text(""+element.Itemx.Name+"", 78, startY+=6, {align:'right'});
    doc.text("" + element.Qty + "", 42, startY);
    doc.text("" + (element.SellingPrice).toFixed(1) + "", 25, startY);
    doc.text("" + (element.SellingPrice*element.Qty).toFixed(2) + "", 6, startY);

    });
    doc.setLineWidth(1);
    doc.line(0, startY+=5, 80, startY);
  doc.text("(JOD) المبلغ الاجمالي", 78, startY+=6, {align:'right'});
  doc.text(" " + TotalAmmount + "  ", 5, startY);

  doc.setLineWidth(1);
  doc.line(0, startY+=5, 80, startY);
  doc.text(" :تاريخ الفاتورة", 78, startY+=5 , {align:'right'});
  doc.text("" + formatDate(timein, "no") + " - " + tConvert(timein), 5, startY);

  doc.setLineWidth(1);
  doc.line(0, startY+=5, 80, startY);


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