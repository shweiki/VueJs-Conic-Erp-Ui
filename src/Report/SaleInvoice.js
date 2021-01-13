
import { GetCompanyInfo } from "@/api/CompanyInfo";
let ComapnyInfo = null;
GetCompanyInfo().then(response => {
  ComapnyInfo = response;
})
export function SaleInvoiceA4(temp) {


  let TotalAmmount = (
    temp.InventoryMovements.reduce((prev, cur) => {
      return prev + cur.Qty * cur.SellingPrice;
    }, 0) - temp.Discount
  ).toFixed(2);


  ComapnyInfo.HeaderReport = ComapnyInfo.HeaderReport.replace('{{Vendor.Name}}', temp.Name)
  ComapnyInfo.HeaderReport = ComapnyInfo.HeaderReport.replace('{{PaymentMethod}}', temp.PaymentMethod == 'Cash' ? "ذمم" : "كاش")
  ComapnyInfo.HeaderReport = ComapnyInfo.HeaderReport.replace('{{FakeDate}}', temp.FakeDate)
  ComapnyInfo.HeaderReport = ComapnyInfo.HeaderReport.replace('{{Discount}}', temp.Discount)
  ComapnyInfo.HeaderReport = ComapnyInfo.HeaderReport.replace('{{Tax}}', temp.Tax)
  ComapnyInfo.HeaderReport = ComapnyInfo.HeaderReport.replace('{{Description}}', temp.Description)
  ComapnyInfo.HeaderReport = ComapnyInfo.HeaderReport.replace('{{TotalAmmount}}', TotalAmmount)


  let res = ComapnyInfo.HeaderReport.slice(ComapnyInfo.HeaderReport.search('<tr id="forach"'), ComapnyInfo.HeaderReport.indexOf("</tr>", ComapnyInfo.HeaderReport.search('<tr id="forach"')) + 5);

  let tabelInventoryMovements = "";
  temp.InventoryMovements.reverse().forEach(element => {
    tabelInventoryMovements += "<tr style='text-align: center;'>"
    tabelInventoryMovements += "<td>" + (element.SellingPrice * element.Qty).toFixed(2) + "</td>";
    tabelInventoryMovements += "<td>" + element.SellingPrice + "</td>";
    tabelInventoryMovements += "<td>" + element.Qty + "</td>";
    tabelInventoryMovements += "<td>" + element.Name + "</td>";
    tabelInventoryMovements += "</tr>"
  });
  ComapnyInfo.HeaderReport = ComapnyInfo.HeaderReport.replace(res, tabelInventoryMovements)

  let win = window.open("", "Title", "toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=780,height=600,top=" + (screen.height - 50) + ",left=" + (screen.width - 500));

  win.document.body.innerHTML = ComapnyInfo.HeaderReport;
  win.print()



}