import jsPDF from "jspdf"
import { AmiriRegular } from "@/assets/custom-theme/fonts/Amiri-Regular.js";
import store from '@/store'
import JSPM from "jsprintmanager";
import printJS from "print-js";
import QRCode from 'qrcode'


export function ShawermaSheesh(temp, printer = undefined) {
  let startX = 1, startY = 0
  let doc = new jsPDF("p", "mm", "80", { filters: ["ASCIIHexEncode"] });
  let timein = new Date(temp.FakeDate);
  let TotalAmmount = (
    temp.InventoryMovements.reduce((prev, cur) => {
      return prev + cur.Qty * cur.SellingPrice;
    }, 0) - temp.Discount
  ).toFixed(store.getters.settings.ToFixed);
  doc.addFileToVFS('Amiri-Regular-normal.ttf', AmiriRegular());
  doc.addFont('Amiri-Regular-normal.ttf', 'Amiri-Regular', 'normal');
  doc.setFont("Amiri-Regular");
  doc.setFontSize(18);
  //Logo
  doc.addImage(store.getters.CompanyInfo.Logo, "jpeg", startX + 10, startY, 50, 25);
  //Name
  doc.setFontSize(24);
  doc.setFontType("normal");
  doc.setLineWidth(0.4);
  startY += 15
  doc.line(0, startY + 5, 70, startY += 5);
  doc.setFontSize(18);
  doc.text(temp.Type, 45, startY += 6, { align: 'right' });

  doc.setFontSize(12);

  doc.text(":رقم الطلب", 70, startY += 6, { align: 'right' });
  //doc.text("" + temp.Id.toString().slice(-2) + "", 5, startY);
  doc.setFontSize(16);

  doc.text("" + temp.Id + "", 5, startY);
  doc.setFontSize(12);

  doc.setLineWidth(0.4);
  doc.line(0, startY += 5, 80, startY);
  //doc.text(":عدد الاصناف", 50, startY+=6);
  // doc.text("" + ItemQty + "", 5, startY);

  doc.text("الصنف", 70, startY += 6, { align: 'right' });
  doc.text("عدد", 19, startY);
  //doc.text("سعر", 19, startY);
  doc.text("الاجمالي", 2, startY);

  temp.InventoryMovements.forEach(element => {
    doc.text("" + element.Name + "", 70, startY += 6, { align: 'right' });
    doc.text("" + element.Qty + "", 20, startY);
    // doc.text("" + (element.SellingPrice).toFixed(store.getters.settings.ToFixed) + "", 18, startY);
    doc.text("" + (element.SellingPrice * element.Qty).toFixed(store.getters.settings.ToFixed) + "", 3, startY);
    if (element.Description) doc.text("" + element.Description + "", 65, startY += 6, { align: 'right' });

  });

  doc.line(0, startY += 5, 80, startY);
  doc.text("طريقة الدفع", 70, startY += 5, { align: 'right' });
  doc.text(temp.PaymentMethod, 5, startY);

  if (temp.Type.toLowerCase() == "delivery".toLowerCase()) {
    doc.setLineWidth(0.4);
    doc.line(0, startY += 5, 80, startY);
    doc.text(" المبلغ", 70, startY += 6, { align: 'right' });
    doc.text(" " + TotalAmmount + "  ", 5, startY);

    doc.text(" التوصيل", 70, startY += 6, { align: 'right' });
    doc.text(" " + temp.DeliveryPrice + "  ", 5, startY);
  }

  doc.text(" الاجمالي", 70, startY += 6, { align: 'right' });
  doc.text(" " + (parseFloat(temp.DeliveryPrice) + parseFloat(TotalAmmount)) + "  ", 5, startY);

  if (temp.Description) {
    doc.setLineWidth(0.4);
    doc.line(0, startY += 5, 80, startY);
    doc.text(" : *", 70, startY += 5, { align: 'right' });
    doc.text("" + temp.Description, 1, startY);
  }
  if (temp.Type.toLowerCase() == "delivery".toLowerCase()) {

    doc.setLineWidth(0.4);
    doc.line(0, startY += 5, 80, startY);
    doc.text("الاسم", 70, startY += 5, { align: 'right' });
    doc.text("" + temp.Name + "", 5, startY);

    doc.text("هاتف", 70, startY += 5, { align: 'right' });
    doc.text("" + temp.PhoneNumber + "", 5, startY);

    doc.text("المنطقة", 70, startY += 5, { align: 'right' });
    doc.text("" + temp.Region + "", 5, startY);

  }
  doc.setLineWidth(0.4);
  doc.line(0, startY += 5, 80, startY);
  doc.text("هاتف :" + store.getters.CompanyInfo.PhoneNumber1 + "", 70, startY += 5, { align: 'right' });

  doc.setFontSize(6);
  doc.text(store.getters.name, 5, startY);
  doc.setFontSize(12);

  doc.text("العنوان :" + store.getters.CompanyInfo.Address + "", 70, startY += 5, { align: 'right' });
  doc.setLineWidth(0.4);
  doc.line(0, startY += 5, 80, startY);
  doc.text(" :تاريخ و وقت", 70, startY += 5, { align: 'right' });
  doc.text("" + formatDate(timein, "no") + " - " + tConvert(timein), 5, startY);
  /// QR 
  var opts = {
    errorCorrectionLevel: 'H',
    type: 'image/jpeg',
    quality: 1,
    margin: 1,
    color: {
      dark: "#010599FF",
      light: "#FFBF60FF"
    }
  }
  QRCode.toDataURL("\n" +
    "" + temp.PhoneNumber + "\n\n\n" +
    store.getters.CompanyInfo.Website +""
    ,  (err, url) => {
    if (err) throw err
    document.getElementById("qr_code").src = url
  })
  if (temp.Type.toLowerCase() == "delivery".toLowerCase()) {

    doc.addImage(document.querySelector('img#qr_code'), "jpeg", 22, startY += 5, 35, 35)
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