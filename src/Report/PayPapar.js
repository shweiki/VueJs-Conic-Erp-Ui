import jsPDF from "jspdf"
import {AmiriRegular} from "@/assets/custom-theme/fonts/Amiri-Regular.js";

import { GetCompanyInfo } from "@/api/CompanyInfo";
let ComapnyInfo = null;
GetCompanyInfo().then(response => {
  ComapnyInfo = response;
})
export function PaymentMember(temp) {
  let startX = 1 , startY = 0
  let doc = new jsPDF('p', 'mm', "a4", { filters: ["ASCIIHexEncode"] });
  console.log(temp)

  let timein = new Date(temp.FakeDate);
  temp.TotalAmmount =temp.TotalAmmount.toFixed(2)
  doc.addFileToVFS('Amiri-Regular-normal.ttf',  AmiriRegular());
  doc.addFont('Amiri-Regular-normal.ttf', 'Amiri-Regular', 'normal');
  doc.setFont("Amiri-Regular");

  //Logo
  doc.addImage(ComapnyInfo.Logo, "jpeg", startX, startY, 12, 12);

  //Name

  doc.setFontSize(24);
  doc.setFontType("normal");
  doc.text(ComapnyInfo.Name, startX + 90, startY += 9);

  doc.setLineWidth(1);
  doc.line(0, startY+=8, 200, startY);
  doc.setFontSize(14);

  doc.text(" :تاريخ قبض", 200, startY+=8 , {align:'right'});
  doc.text("" + formatDate(timein, "no") + " - " + tConvert(timein), 5, startY);

  doc.text(":رقم القبض", 200, startY+=8, {align:'right'});
  doc.text("" + temp.Id + "", 5, startY);


  doc.text(":رقم المشترك  ", 200, startY+=8, {align:'right'});
  doc.text("" + temp.ObjectID + "", 5, startY);
 doc.text(":الاسم  ", 200, startY+=8, {align:'right'});
 doc.text("" + temp.Name + "", 5, startY);


 doc.text(":ملاحظات  ", 200, startY+=8, {align:'right'});
 doc.text("" + temp.Description + "", 5, startY);

  
  doc.text(": (JOD) المبلغ الاجمالي ", 200, startY+=8, {align:'right'});
  doc.text(" " + temp.TotalAmmount + "  ", 5, startY);

  doc.text(":محرر السند  ", 200, startY+=8, {align:'right'});
  doc.text("" + temp.EditorName + "", 5, startY);

  doc.text("---------------------------------------أسم و توقيع ", 85, startY+=8, { align: 'right' });
  doc.setLineWidth(1);
  doc.line(0, startY+=8, 200, startY);


  startY+=10

  doc.setLineWidth(0.1);
doc.setDrawColor(0, 0, 0);

doc.setLineDash([2.5]);
doc.line(0,  startY, 210, startY);

startY+=10

doc.setLineDash([0]);

/// copy 2 
  //Logo
  doc.addImage(ComapnyInfo.Logo, "jpeg", startX, startY, 12, 12);

  //Name

  doc.setFontSize(24);
  doc.setFontType("normal");
  doc.text(ComapnyInfo.Name, startX + 90, startY += 9);

  doc.setLineWidth(1);
  doc.line(0, startY+=8, 200, startY);
  doc.setFontSize(14);

  doc.text(" :تاريخ قبض", 200, startY+=8 , {align:'right'});
  doc.text("" + formatDate(timein, "no") + " - " + tConvert(timein), 5, startY);

  doc.text(":رقم القبض", 200, startY+=8, {align:'right'});
  doc.text("" + temp.Id + "", 5, startY);


  doc.text(":رقم المشترك  ", 200, startY+=8, {align:'right'});
  doc.text("" + temp.ObjectID + "", 5, startY);
 doc.text(":الاسم  ", 200, startY+=8, {align:'right'});
 doc.text("" + temp.Name + "", 5, startY);


 doc.text(":ملاحظات  ", 200, startY+=8, {align:'right'});
 doc.text("" + temp.Description + "", 5, startY);

  
  doc.text(": (JOD) المبلغ الاجمالي ", 200, startY+=8, {align:'right'});
  doc.text(" " + temp.TotalAmmount + "  ", 5, startY);

  doc.text(":محرر السند  ", 200, startY+=8, {align:'right'});
  doc.text("" + temp.EditorName + "", 5, startY);

  doc.text("---------------------------------------أسم و توقيع ", 85, startY+=8, { align: 'right' });
  doc.setLineWidth(1);
  doc.line(0, startY+=8, 200, startY);



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