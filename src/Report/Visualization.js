
import store from '@/store'
let toFixed = store.getters.settings.ToFixed;

export default function Visualization(Data, Html, Type) {

  Object.keys(Data).forEach(key => {
    Html = Html.replaceAll("{{" + key + "}}", Data[key]);
  });

  let res = Html.slice(
    Html.search('<tr id="InventoryMovements"'),
    Html.indexOf("</tr>", Html.search('<tr id="InventoryMovements"')) + 5
  );

  let tabelInventoryMovements = "";
  Data.InventoryMovements.forEach(element => {
    let row = res

    Object.keys(element).forEach(key => {
      // replace All keys to values
      row = row.replaceAll("{{item." + key + "}}", element[key]);

      // find if have Equation {#  /}

      let Equation = row.slice(
        row.search('{#'),
        row.indexOf('/}', row.search('{#')) + 2
      );

      if (Equation != "" && Equation.search("{{") <= -1) {
        let evalV = Equation.replace("{#", "")
        evalV = evalV.replace("/}", "")
        row = row.replace(Equation, eval(evalV).toFixed(
          toFixed
        ));
      }

    });
    tabelInventoryMovements += row
  });

  Html = Html.replaceAll(Html.slice(
    Html.search('<tr id="InventoryMovements"'),
    Html.indexOf("</tr>", Html.search('<tr id="InventoryMovements"')) + 5
  ), tabelInventoryMovements);

  if (Type == "Set") {
    return Html;
  }
}