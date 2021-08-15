import store from "@/store";
import { nArabicWords } from "./nArabicWords.js";

let toFixed = store.getters.settings.ToFixed;

export default function Visualization(Data, Html, Type) {
  let ConvetNumberToArabicWords = nArabicWords;
  let formatDate = formatDateX;
  let TimeConvert = TimeConvertX;
  let ToFixed = ToFixedX;
  //console.log(ConvetNumberToArabicWords)
  Object.keys(Data).forEach(key => {
    Html = Html.replaceAll("{{" + key + "}}", Data[key]);
  });

  if (Data.InventoryMovements) {
    let res = Html.slice(
      Html.search('<tr id="InventoryMovements"'),
      Html.indexOf("</tr>", Html.search('<tr id="InventoryMovements"')) + 5
    );
    let tabelInventoryMovements = "";
    Data.InventoryMovements.forEach(element => {
      let row = res;
      Object.keys(element).forEach(key => {
        // replace All keys to values
        row = row.replaceAll("{{item." + key + "}}", element[key]);
        // find if have Equation {#  /}
        var searchKeyword = "{#";
        var startingIndices = [];
        var indexOccurence = row.indexOf(searchKeyword, 0);
        while (indexOccurence >= 0) {
          startingIndices.push(indexOccurence);
          let Equation = row.slice(
            row.search("{#"),
            row.indexOf("/}", row.search("{#")) + 2
          );
          if (Equation != "" && Equation.search("{{") <= -1) {
            let evalV = Equation.replace("{#", "");
            evalV = evalV.replace("/}", "");
            row = row.replace(Equation, eval(evalV));
          }
          indexOccurence = row.indexOf(searchKeyword, indexOccurence + 1);
        }
      });
      tabelInventoryMovements += row;
    });
    Html = Html.replaceAll(
      Html.slice(
        Html.search('<tr id="InventoryMovements"'),
        Html.indexOf("</tr>", Html.search('<tr id="InventoryMovements"')) + 5
      ),
      tabelInventoryMovements
    );
  }
  var searchKeyword = "{#";
  var startingIndices = [];
  var indexOccurence = Html.indexOf(searchKeyword, 0);
  while (indexOccurence >= 0) {
    startingIndices.push(indexOccurence);
    let Equation = Html.slice(
      Html.search("{#"),
      Html.indexOf("/}", Html.search("{#")) + 2
    );
    if (Equation != "" && Equation.search("{{") <= -1) {
      let evalV = Equation.replace("{#", "");
      evalV = evalV.replace("/}", "");
      Html = Html.replace(Equation, eval(evalV));
    }
    indexOccurence = Html.indexOf(searchKeyword, indexOccurence + 1);
  }
  if (Type == "Set") {
    //  Html += nArabicWords(2000)
    return Html;
  }
}
export function ToFixedX(num) {
  console.log("cooFixed",toFixed);
  return num.toFixed(3);
  
}

export function formatDateX(date) {
  let d = new Date(date),
    day = "" + d.getDate(),
    month = "" + (d.getMonth() + 1),
    year = d.getFullYear();
  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [day, month, year].join("/");
}
export function TimeConvertX(date) {
  date = new Date(date);
  let hours = date.getHours();
  let minutes = date.getMinutes();
  let ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? "0" + minutes : minutes;
  let strTime = " " + hours + ":" + minutes + "  " + ampm;
  return strTime;
}
