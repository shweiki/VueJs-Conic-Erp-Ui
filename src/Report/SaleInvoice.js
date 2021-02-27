
import store from '@/store'

export function SaleInvoiceA4(temp) {


  let TotalAmmount = (
    temp.InventoryMovements.reduce((prev, cur) => {
      return prev + cur.Qty * cur.SellingPrice;
    }, 0) - temp.Discount
  ).toFixed(store.getters.settings.ToFixed);


  store.getters.CompanyInfo.HeaderReport = store.getters.CompanyInfo.HeaderReport.replace('{{Vendor.Name}}', temp.Name)
  store.getters.CompanyInfo.HeaderReport = store.getters.CompanyInfo.HeaderReport.replace('{{PaymentMethod}}', temp.PaymentMethod == 'Cash' ? "ذمم" : "كاش")
  store.getters.CompanyInfo.HeaderReport = store.getters.CompanyInfo.HeaderReport.replace('{{FakeDate}}', temp.FakeDate)
  store.getters.CompanyInfo.HeaderReport = store.getters.CompanyInfo.HeaderReport.replace('{{Discount}}', temp.Discount)
  store.getters.CompanyInfo.HeaderReport = store.getters.CompanyInfo.HeaderReport.replace('{{Tax}}', temp.Tax)
  store.getters.CompanyInfo.HeaderReport = store.getters.CompanyInfo.HeaderReport.replace('{{Description}}', temp.Description)
  store.getters.CompanyInfo.HeaderReport = store.getters.CompanyInfo.HeaderReport.replace('{{TotalAmmount}}', TotalAmmount)


  let res = store.getters.CompanyInfo.HeaderReport.slice(store.getters.CompanyInfo.HeaderReport.search('<tr id="forach"'), store.getters.CompanyInfo.HeaderReport.indexOf("</tr>", store.getters.CompanyInfo.HeaderReport.search('<tr id="forach"')) + 5);

  let tabelInventoryMovements = "";
  temp.InventoryMovements.reverse().forEach(element => {
    tabelInventoryMovements += "<tr style='text-align: center;'>"
    tabelInventoryMovements += "<td>" + (element.SellingPrice * element.Qty).toFixed(store.getters.settings.ToFixed) + "</td>";
    tabelInventoryMovements += "<td>" + element.SellingPrice + "</td>";
    tabelInventoryMovements += "<td>" + element.Qty + "</td>";
    tabelInventoryMovements += "<td>" + element.Name + "</td>";
    tabelInventoryMovements += "</tr>"
  });
  store.getters.CompanyInfo.HeaderReport = store.getters.CompanyInfo.HeaderReport.replace(res, tabelInventoryMovements)

  let win = window.open("", "Title", "toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=780,height=600,top=" + (screen.height - 50) + ",left=" + (screen.width - 500));

  win.document.body.innerHTML = store.getters.CompanyInfo.HeaderReport;
  win.print()



}