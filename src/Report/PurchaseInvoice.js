import store from '@/store'

export function PurchaseInvoiceA4(Data) {
  let TotalAmmount = (
    Data.InventoryMovements.reduce((prev, cur) => {
      return prev + cur.Qty * cur.SellingPrice;
    }, 0) - Data.Discount
  ).toFixed(store.getters.settings.ToFixed);

  //Logo
  //doc.addImage(store.getters.CompanyInfo.Logo, "jpeg", startX, startY, 12, 12);


  store.getters.CompanyInfo.HeaderReport = store.getters.CompanyInfo.HeaderReport.replace('{{Vendor.Name}}', Data.Name)
  store.getters.CompanyInfo.HeaderReport = store.getters.CompanyInfo.HeaderReport.replace('{{PaymentMethod}}', Data.PaymentMethod == 'Cash' ? "ذمم" : "كاش")
  store.getters.CompanyInfo.HeaderReport = store.getters.CompanyInfo.HeaderReport.replace('{{FakeDate}}', Data.FakeDate)
  store.getters.CompanyInfo.HeaderReport = store.getters.CompanyInfo.HeaderReport.replace('{{Discount}}', Data.Discount)
  store.getters.CompanyInfo.HeaderReport = store.getters.CompanyInfo.HeaderReport.replace('{{Tax}}', Data.Tax)
  store.getters.CompanyInfo.HeaderReport = store.getters.CompanyInfo.HeaderReport.replace('{{Description}}', Data.Description)
  store.getters.CompanyInfo.HeaderReport = store.getters.CompanyInfo.HeaderReport.replace('{{TotalAmmount}}', TotalAmmount)


  let res = store.getters.CompanyInfo.HeaderReport.slice(store.getters.CompanyInfo.HeaderReport.search('<tr id="forach"'), store.getters.CompanyInfo.HeaderReport.indexOf("</tr>", store.getters.CompanyInfo.HeaderReport.search('<tr id="forach"')) + 5);

  let tabelInventoryMovements = "";
  Data.InventoryMovements.reverse().forEach(element => {
    tabelInventoryMovements += "<tr style='text-align: center;'>"
    tabelInventoryMovements += "<td>" + (element.SellingPrice * element.Qty).toFixed(store.getters.settings.ToFixed) + "</td>";
    tabelInventoryMovements += "<td>" + element.SellingPrice + "</td>";
    tabelInventoryMovements += "<td>" + element.Qty + "</td>";
    tabelInventoryMovements += "<td>" + element.Name + "</td>";
    tabelInventoryMovements += "</tr>"
  });
  store.getters.CompanyInfo.HeaderReport = store.getters.CompanyInfo.HeaderReport.replace(res, tabelInventoryMovements)


  //  store.getters.CompanyInfo.HeaderReport =store.getters.CompanyInfo.HeaderReport.replace('{{item.name}}',Data.InventoryMovements[0].name)
  // store.getters.CompanyInfo.HeaderReport =store.getters.CompanyInfo.HeaderReport.replace('{{item.qty}}',Data.InventoryMovements[0].Qty)
  // store.getters.CompanyInfo.HeaderReport =store.getters.CompanyInfo.HeaderReport.replace('{{item.SellingPrice}}',Data.InventoryMovements[0].SellingPrice)
  //store.getters.CompanyInfo.HeaderReport =store.getters.CompanyInfo.HeaderReport.replace('{{item.total}}',(Data.InventoryMovements[0].SellingPrice*Data.InventoryMovements[0].Qty).toFixed(store.getters.settings.ToFixed))

  let win = window.open("", "Title", "toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=780,height=600,top=" + (screen.height - 50) + ",left=" + (screen.width - 500));

  win.document.body.innerHTML = store.getters.CompanyInfo.HeaderReport;
  win.print()

}