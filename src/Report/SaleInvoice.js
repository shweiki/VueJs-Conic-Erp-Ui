
import store from '@/store'
import printJS from "print-js";
let toFixed = store.getters.settings.ToFixed;
export function SaleInvoiceA4(temp, ReportTemp) {
  let TotalAmmount = (
    temp.InventoryMovements.reduce((prev, cur) => {
      return prev + cur.Qty * cur.SellingPrice;
    }, 0) - temp.Discount
  ).toFixed(toFixed);
  ReportTemp = ReportTemp.replace('{{Vendor.Name}}', temp.Name)
  ReportTemp = ReportTemp.replace('{{PaymentMethod}}', temp.PaymentMethod == 'Cash' ? "ذمم" : "كاش")
  ReportTemp = ReportTemp.replace('{{FakeDate}}', temp.FakeDate)
  ReportTemp = ReportTemp.replace('{{Discount}}', temp.Discount)
  ReportTemp = ReportTemp.replace('{{Tax}}', temp.Tax)
  ReportTemp = ReportTemp.replace('{{Description}}', temp.Description)
  ReportTemp = ReportTemp.replace('{{TotalAmmount}}', TotalAmmount)
  let res = ReportTemp.slice(ReportTemp.search('<tr id="forach"'), ReportTemp.indexOf("</tr>", ReportTemp.search('<tr id="forach"')) + 5);
  let tabelInventoryMovements = "";
  temp.InventoryMovements.forEach(element => {
    tabelInventoryMovements += "<tr style='text-align: center;'>"
    tabelInventoryMovements += "<td>" + (element.SellingPrice * element.Qty).toFixed(toFixed) + "</td>";
    tabelInventoryMovements += "<td>" + element.SellingPrice + "</td>";
    tabelInventoryMovements += "<td>" + element.Qty + "</td>";
    tabelInventoryMovements += "<td>" + element.Name + "</td>";
    tabelInventoryMovements += "</tr>"
  });
  ReportTemp = ReportTemp.replace(res, tabelInventoryMovements)
  let win = window.open("", "Title", "toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=780,height=600,top=" + (screen.height - 50) + ",left=" + (screen.width - 500));
  win.document.body.innerHTML = ReportTemp;
  win.print()
}
export function SaleInvoicesList(data) {
  let { Totals, Items } = data
  printJS({
    printable: Items.map(Item => ({
      المجموع: Item.Total.toFixed(toFixed),
      الخصم: Item.Discount,
      "طريقة الدفع ": Item.PaymentMethod,
      التاريخ: Item.FakeDate,
      الحساب: Item.Name,
      الرقم: Item.Id
    })),
    properties: [
      "المجموع",
      "الخصم",
      "طريقة الدفع ",
      "التاريخ",
      "الحساب",
      "الرقم"
    ],
    type: "json",
    header:
      "<center> <h2>" +

      "</h2></center><h3 style='float:right'> الاجمالي النقدي " +
      Totals.Cash.toFixed(toFixed) +
      " - الاجمالي الفيزا : " +
      Totals.Visa.toFixed(toFixed) +
      " - الاجمالي الاجل : " +
      Totals.Receivables.toFixed(toFixed) +
      " - صافي الربح : " +
      Totals.Profit.toFixed(toFixed) +
      " - الاجمالي خصم : " +
      Totals.Discount.toFixed(toFixed) +
      " - الاجمالي التكلفة : " +
      Totals.TotalCost.toFixed(toFixed) +
      " - الاجمالي :  " +
      (Totals.Totals).toFixed(
        toFixed
      ) +
      "</h3><h3 style='float:right'>  التاريخ  : " +
      formatDate(new Date()) +
      "</h3>",
    gridHeaderStyle: "color: red;  border: 2px solid #3971A5;",
    gridStyle: "border: 2px solid #3971A5; text-align: center;"
  });
}
export function SaleInvoicesItemsMovements(data) {
  console.log(data)
  let { Totals, Items } = data
  let ItemsMovements = [];
  Items.map(a => {
    return a.InventoryMovements.map(m => {
      var find = ItemsMovements.findIndex(
        value => value.Name == m.Name
      );
      if (find != -1) ItemsMovements[find].TotalCount += m.Qty;
      else {
        ItemsMovements.push({
          Name: m.Name,
          TotalCount: m.Qty,
          AvgPrice: m.SellingPrice.toFixed(toFixed),
          CostPrice: m.CostPrice,
          Ingredients: JSON.parse(m.Ingredients) || []
        });
      }
    });
  });
  printJS({
    printable: ItemsMovements.map(Item => ({
      "المجموع البيع": (Item.TotalCount * Item.AvgPrice).toFixed(
        toFixed
      ),
      "سعر البيع": Item.AvgPrice,
      "المجموع التكلفة": (Item.TotalCount * Item.CostPrice).toFixed(
        toFixed
      ),
      "سعر التكلفة": Item.CostPrice,
      "العدد": Item.TotalCount,
      "الصنف": Item.Name
    })),
    properties: [
      "المجموع البيع",
      "سعر البيع",
      "المجموع التكلفة",
      "سعر التكلفة",
      "العدد",
      "الصنف"
    ],
    type: "json",
    header:
      "<h3 style='float:right'> الاجمالي النقدي " +
      Totals.Cash.toFixed(toFixed) +
      " - الاجمالي الفيزا : " +
      Totals.Visa.toFixed(toFixed) +
      " - الاجمالي الاجل : " +
      Totals.Receivables.toFixed(toFixed) +
      //  " - صافي الربح : " +
      //  this.Totals.Profit.toFixed(this.$toFixed) +
      " - الاجمالي خصم : " +
      Totals.Discount.toFixed(toFixed) +
      " - الاجمالي التكلفة : " +
      Totals.TotalCost.toFixed(toFixed) +
      " - الاجمالي :  " +
      (
        Totals.Cash +
        Totals.Receivables +
        Totals.Visa
      ).toFixed(toFixed) +
      "</h3><h3 style='float:right'>  التاريخ  : " +
      formatDate(new Date()) +
      "</h3>",
    gridHeaderStyle: "color: red;  border: 2px solid #3971A5;",
    gridStyle: "border: 2px solid #3971A5; text-align: center;"
  });
}
export function SaleInvoicesItemsIngredients(data) {
  console.log(data)
  let { Totals, Items } = data
  let ItemsMovements = [];
  let ItemsIngredients = [];

  Items.map(a => {
    return a.InventoryMovements.map(m => {
      var find = ItemsMovements.findIndex(
        value => value.Name == m.Name
      );
      if (find != -1) ItemsMovements[find].TotalCount += m.Qty;
      else {
        ItemsMovements.push({
          Name: m.Name,
          TotalCount: m.Qty,
          AvgPrice: m.SellingPrice.toFixed(toFixed),
          CostPrice: m.CostPrice,
          Ingredients: JSON.parse(m.Ingredients) || []
        });
      }
    });
  });
  ItemsMovements.map(a => {
    return a.Ingredients.map(m => {
      var find = ItemsIngredients.findIndex(
        value => value.Name == m.Name
      );
      if (find != -1)
        ItemsIngredients[find].TotalCount += a.TotalCount * m.Qty;
      else {
        ItemsIngredients.push({
          Name: m.Name,
          TotalCount: a.TotalCount * m.Qty
        });
      }
    });
  });
  printJS({
    printable: ItemsIngredients.map(Item => ({
      العدد: Item.TotalCount,
      الصنف: Item.Name
    })),
    properties: ["العدد", "الصنف"],
    type: "json",
    header:
      "<h3 style='float:right'>  التاريخ  : " +
      formatDate(new Date()) +
      "</h3>",
    gridHeaderStyle: "color: red;  border: 2px solid #3971A5;",
    gridStyle: "border: 2px solid #3971A5; text-align: center;"
  });
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