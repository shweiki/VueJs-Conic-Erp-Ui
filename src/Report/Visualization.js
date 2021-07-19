
export default function Visualization(Data, Html, Type) {
  Object.keys(Data).forEach(key => {
    Html = Html.replace("{{" + key + "}}", Data[key]);
  });
  let res = Html.slice(
    Html.search('<tr id="InventoryMovements"'),
    Html.indexOf("</tr>", Html.search('<tr id="InventoryMovements"')) + 5
  );
  let tabelInventoryMovements = "";
  Data.InventoryMovements.forEach(element => {
    let row = res
    Object.keys(element).forEach(key => {

     row = row.replace("{{item." + key + "}}", element[key]);
      console.log(row);
    });
    tabelInventoryMovements += row

  });
  Html = Html.replace(Html.slice(
    Html.search('<tr id="InventoryMovements"'),
    Html.indexOf("</tr>", Html.search('<tr id="InventoryMovements"')) + 5
  ), tabelInventoryMovements);

  if (Type == "Set") {
    return Html;
  }
}