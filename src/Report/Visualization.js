import jsPDF from "jspdf"
import { AmiriRegular } from "@/assets/custom-theme/fonts/Amiri-Regular.js";
import store from '@/store'
import JSPM from "jsprintmanager";
import printJS from "print-js";

export default function Visualization(Data, Keys, Html, printer) {

  Object.keys(JSON.parse(Keys)
  ).forEach(key => {
    Html = Html.replace('{{' + key + '}}', Data[key])
console.log(key)
  });



  let res = Html.slice(Html.search('<tr id="forach"'), Html.indexOf("</tr>", Html.search('<tr id="forach"')) + 5);

  let tabelInventoryMovements = "";
  Data.InventoryMovements.reverse().forEach(element => {
    tabelInventoryMovements += "<tr style='text-align: center;'>"
    tabelInventoryMovements += "<td>" + (element.SellingPrice * element.Qty).toFixed(store.getters.settings.ToFixed) + "</td>";
    tabelInventoryMovements += "<td>" + element.SellingPrice + "</td>";
    tabelInventoryMovements += "<td>" + element.Qty + "</td>";
    tabelInventoryMovements += "<td>" + element.Name + "</td>";
    tabelInventoryMovements += "</tr>"
  });
  Html = Html.replace(res, tabelInventoryMovements)



  let win = window.open("", "Title", "toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=780,height=600,top=" + (screen.height - 50) + ",left=" + (screen.width - 500));

  win.document.body.innerHTML = Html;
  win.print()

}