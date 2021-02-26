
import { GetCompanyInfo } from "@/api/CompanyInfo";
let ComapnyInfo = null;
GetCompanyInfo().then(response => {
  ComapnyInfo = response;
})
export function PurchaseInvoiceA4(Data) {
  let TotalAmmount = (
    Data.InventoryMovements.reduce((prev, cur) => {
      return prev + cur.Qty * cur.SellingPrice;
    }, 0) - Data.Discount
  ).toFixed(this.$store.getters.settings.ToFixed);

  //Logo
  //doc.addImage(ComapnyInfo.Logo, "jpeg", startX, startY, 12, 12);


  ComapnyInfo.HeaderReport = ComapnyInfo.HeaderReport.replace('{{Vendor.Name}}', Data.Name)
  ComapnyInfo.HeaderReport = ComapnyInfo.HeaderReport.replace('{{PaymentMethod}}', Data.PaymentMethod == 'Cash' ? "ذمم" : "كاش")
  ComapnyInfo.HeaderReport = ComapnyInfo.HeaderReport.replace('{{FakeDate}}', Data.FakeDate)
  ComapnyInfo.HeaderReport = ComapnyInfo.HeaderReport.replace('{{Discount}}', Data.Discount)
  ComapnyInfo.HeaderReport = ComapnyInfo.HeaderReport.replace('{{Tax}}', Data.Tax)
  ComapnyInfo.HeaderReport = ComapnyInfo.HeaderReport.replace('{{Description}}', Data.Description)
  ComapnyInfo.HeaderReport = ComapnyInfo.HeaderReport.replace('{{TotalAmmount}}', TotalAmmount)


  let res = ComapnyInfo.HeaderReport.slice(ComapnyInfo.HeaderReport.search('<tr id="forach"'), ComapnyInfo.HeaderReport.indexOf("</tr>", ComapnyInfo.HeaderReport.search('<tr id="forach"')) + 5);

  let tabelInventoryMovements = "";
  Data.InventoryMovements.reverse().forEach(element => {
    tabelInventoryMovements += "<tr style='text-align: center;'>"
    tabelInventoryMovements += "<td>" + (element.SellingPrice * element.Qty).toFixed(this.$store.getters.settings.ToFixed) + "</td>";
    tabelInventoryMovements += "<td>" + element.SellingPrice + "</td>";
    tabelInventoryMovements += "<td>" + element.Qty + "</td>";
    tabelInventoryMovements += "<td>" + element.Name + "</td>";
    tabelInventoryMovements += "</tr>"
  });
  ComapnyInfo.HeaderReport = ComapnyInfo.HeaderReport.replace(res, tabelInventoryMovements)


  //  ComapnyInfo.HeaderReport =ComapnyInfo.HeaderReport.replace('{{item.name}}',Data.InventoryMovements[0].name)
  // ComapnyInfo.HeaderReport =ComapnyInfo.HeaderReport.replace('{{item.qty}}',Data.InventoryMovements[0].Qty)
  // ComapnyInfo.HeaderReport =ComapnyInfo.HeaderReport.replace('{{item.SellingPrice}}',Data.InventoryMovements[0].SellingPrice)
  //ComapnyInfo.HeaderReport =ComapnyInfo.HeaderReport.replace('{{item.total}}',(Data.InventoryMovements[0].SellingPrice*Data.InventoryMovements[0].Qty).toFixed(this.$store.getters.settings.ToFixed))

  let win = window.open("", "Title", "toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=780,height=600,top=" + (screen.height - 50) + ",left=" + (screen.width - 500));

  win.document.body.innerHTML = ComapnyInfo.HeaderReport;
  win.print()

}