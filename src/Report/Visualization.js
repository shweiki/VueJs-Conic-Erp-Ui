
export default function Visualization(Data, Keys, Html, printer) {

  Object.keys(JSON.parse(Keys)
  ).forEach(key => {
    Html = Html.replace('{{' + key + '}}', Data[key])
  });
  let res = Html.slice(Html.search('<tr id="forach"'), Html.indexOf("</tr>", Html.search('<tr id="forach"')) + 5);
  let tabelInventoryMovements = "";
  Data.InventoryMovements.reverse().forEach(element => {
    Object.keys(element
    ).forEach(key => {
      Html = Html.replace('[InventoryMovements.' + key + ']', element[key])
    });

  });
  Html = Html.replace(res, tabelInventoryMovements)
  console.log(Html)
  let win = window.open("", "Title", "toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=780,height=600,top=" + (screen.height - 50) + ",left=" + (screen.width - 500));
  win.document.body.innerHTML = Html;
  win.print()
}