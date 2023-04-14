import jsPDF from "jspdf"
import { AmiriRegular } from "@/report/Font/Amiri-Regular.js";
import store from '@/store'
import JSPM from "jsprintmanager";
import printJS from "print-js";

export function OrderReceipt(temp, printer = undefined) {
  let startX = 1, startY = 0
  let doc = new jsPDF();
  console.log(temp)
  let timein = new Date(temp.FakeDate);

  doc.addFileToVFS('Amiri-Regular-normal.ttf', AmiriRegular());
  doc.addFont('Amiri-Regular-normal.ttf', 'Amiri-Regular', 'normal');
  doc.setFont("Amiri-Regular");
  //Logo
  //Name
  doc.setFontSize(24);
  doc.text(store.getters.name, 45, startY += 6, { align: 'right' });

  doc.setLineWidth(0.65);
  doc.setFontSize(18);
  doc.text(temp.Type.charAt(0).toUpperCase() + temp.Type.slice(1), 45, startY += 25, { align: 'right' });
  doc.setFontSize(12);

  doc.text(":رقم الطلب", 70, startY += 5, { align: 'right' });
  //doc.text("" + temp.Id.toString().slice(-2) + "", 5, startY);
  doc.setFontSize(16);

  doc.text("" + temp.Id + "", 5, startY);
  doc.setFontSize(12);

  doc.setLineWidth(0.65);
  doc.line(0, startY += 5, 80, startY);
  //doc.text(":عدد الاصناف", 50, startY+=6);
  // doc.text("" + ItemQty + "", 5, startY);
  doc.text("الصنف", 70, startY += 6, { align: 'right' });
  doc.text("عدد", 10, startY);

  temp.InventoryMovements.forEach(element => {
    doc.line(0, startY += 5, 80, startY);
    doc.text("" + element.Name + "", 70, startY += 7, { align: 'right' });

    doc.text("" + element.Qty + "", 10, startY);
    if (element.Description) doc.text("" + element.Description + "", 65, startY += 7, { align: 'right' });


  });


  doc.setLineWidth(0.65);
  doc.line(0, startY += 5, 80, startY);
  doc.text(" :تاريخ الفاتورة", 70, startY += 5, { align: 'right' });
  doc.text("" + formatDate(timein, "no") + " - " + tConvert(timein), 5, startY);
  if(temp.Description !=""){
  doc.setLineWidth(0.65);
  doc.line(0, startY += 5, 80, startY);
  doc.text(" : *", 70, startY += 5, { align: 'right' });
  doc.text("" + temp.Description, 5, startY);
  }
  if (printer) {
    let cpj = new JSPM.ClientPrintJob();
    cpj.clientPrinter = new JSPM.InstalledPrinter(printer);
    var my_file = new JSPM.PrintFilePDF(
      doc.output('blob'),
      JSPM.FileSourceType.BLOB,
      temp.Id + ".pdf",
      1
    );
    cpj.files.push(my_file);
    cpj.sendToClient();

  } else {
    printJS({
      printable: doc.output('datauristring').replace(/^data:application\/pdf;filename=generated.pdf;base64,/, ''),
      type: "pdf",
      base64: true,
      showModal: true
    });
  }

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