import store from "@/store";
import { nArabicWords } from "./nArabicWords.js";

let toFixed = store.getters.settings.ToFixed;

export default function Visualization(Data, Html, Type) {
  console.log("Data ", Data);

  let ConvetNumberToArabicWords = nArabicWords;
  let formatDate = formatDateX;
  let TimeConvert = TimeConvertX;
  let ToFixed = ToFixedX;
  Object.keys(Data).forEach(key => {
    if (typeof Data[key] == "function") { Data[key] = Data[key]() }
    Html = Html.replaceAll("{{" + key + "}}", Data[key]);
    if (Data[key] != null && typeof Data[key] == "object") {
      Object.keys(Data[key]).forEach(keyo => {
        Html = Html.replaceAll("{{" + key + "." + keyo + "}}", Data[key][keyo]);
      })
    }
    if (Array.isArray(Data[key])) {
      //  console.log("isArray", key, Data[key])
      let res = Html.slice(
        Html.search('<tr id="' + key + '"'),
        Html.indexOf("</tr>", Html.search('<tr id="' + key + '"')) + 5
      );
      let tabelArray = "";
      Data[key].forEach(element => {
        let row = res;
        Object.keys(element).forEach(keya => {
          // replace All keys to values
          row = row.replaceAll("{{" + key + "." + keya + "}}", element[keya]);
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
        tabelArray += row;
      });
      Html = Html.replaceAll(
        Html.slice(
          Html.search('<tr id="' + key + '"'),
          Html.indexOf("</tr>", Html.search('<tr id="' + key + '"')) + 5
        ),
        tabelArray
      );
    }
  });
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
