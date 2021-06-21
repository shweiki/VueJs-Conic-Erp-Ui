import jsPDF from "jspdf"
import { AmiriRegular } from "@/assets/custom-theme/fonts/Amiri-Regular.js";
import store from '@/store'
import JSPM from "jsprintmanager";
import printJS from "print-js";

export function InBody(temp, printer = undefined) {
  let startX = 1, startY = 0
  let doc = new jsPDF("p", "mm", "80", { filters: ["ASCIIHexEncode"] });
  let timein = new Date();
  let InventoryMovements = temp.InventoryMovements.filter(obj => obj.Status == 1);
  let InventoryMovement = InventoryMovements[0];
  console.log(temp)
  doc.addFileToVFS('Amiri-Regular-normal.ttf', AmiriRegular());
  doc.addFont('Amiri-Regular-normal.ttf', 'Amiri-Regular', 'normal');
  doc.setFont("Amiri-Regular");

  //Logo
  doc.addImage(store.getters.CompanyInfo.Logo, "jpeg", startX, startY, 12, 12);

  //Name

  doc.setFontSize(24);
  doc.setFontType("normal");
  doc.text(store.getters.CompanyInfo.Name, startX + 24, startY += 9);
  doc.setLineWidth(1);
  doc.line(0, startY + 5, 70, startY += 5);
  doc.text(InventoryMovement.Name, startX + 22, startY += 10);
  doc.setFontSize(12);

  doc.text(":رقم الكوبون", 70, startY += 6, { align: 'right' });
  doc.text("" + InventoryMovement.Id + "", 5, startY);

  doc.setLineWidth(1);
  doc.line(0, startY += 5, 80, startY);
  doc.text(":رقم المشترك", 70, startY += 6, { align: 'right' });
  doc.text("" + temp.MemberId + "", 5, startY);
  doc.text("" + temp.Name + "", 5, startY += 6);
  doc.setLineWidth(1);
  doc.line(0, startY += 5, 80, startY);
  doc.text(" :تاريخ ", 70, startY += 5, { align: 'right' });
  doc.text("" + formatDate(timein, "no") + " - " + tConvert(timein), 5, startY);

  doc.setLineWidth(1);
  doc.line(0, startY += 5, 80, startY);

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