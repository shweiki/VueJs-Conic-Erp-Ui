import jsPDF from "jspdf"
import { AmiriRegular } from "@/assets/custom-theme/fonts/Amiri-Regular.js";

import { GetCompanyInfo } from "@/api/CompanyInfo";
let ComapnyInfo = null;
GetCompanyInfo().then(response => {
  ComapnyInfo = response;
})
export function MemberAgreement(temp) {
  let startX = 1, startY = 0
  let doc = new jsPDF('p', 'mm', "a4", { filters: ["ASCIIHexEncode"] });

  console.log(temp)


  doc.addFileToVFS('Amiri-Regular-normal.ttf', AmiriRegular());
  doc.addFont('Amiri-Regular-normal.ttf', 'Amiri-Regular', 'normal');
  doc.setFont("Amiri-Regular");

  //Logo
  doc.addImage(ComapnyInfo.Logo, "jpeg", startX, startY, 12, 12);

  //Name

  doc.setFontSize(24);
  doc.setFontType("normal");
  doc.text(ComapnyInfo.name, startX + 90, startY += 9);
  doc.setFontSize(14);

  doc.text(' : التاريخ', startX + 200, startY, { align: 'right' });
  doc.text( formatDate(new Date()) , startX + 160, startY);

  doc.setLineWidth(1);
  doc.line(0, startY + 5, 200, startY += 5);

  doc.rect(5, 20, 200, 130);
  doc.setFontSize(16);

  doc.text("Medical Questionaire", 7, 27);
  doc.text("إستبيان الحالة الصحية ", 200, 27, { align: 'right' });

  doc.setFontSize(14);

  doc.text("Name : ", 7, 35);
  doc.text(temp.name, 25, 35);

  doc.text("Date Of Birth : ", 7, 40);
  doc.text(formatDate(temp.DateofBirth), 43, 40);

  doc.text("Mobile : ", 7, 45);
  doc.text(temp.phoneNumber1, 30, 45);


  doc.text(" : الاسم", 200, 35, { align: 'right' });

  doc.text(" : تاريخ الميلاد", 200, 40, { align: 'right' });

  doc.text(" : الهاتف", 200, 45, { align: 'right' });

  doc.setLineWidth(1);
  doc.line(5, 50, 205, 50);
  doc.line(85, 50, 85, 150);
  doc.line(105, 50, 105, 150);
  doc.line(125, 50, 125, 150);

  doc.setFontSize(12);

  doc.text("Are you now, or have you ever suffered from \n any of the following ?", 7, 55);
  doc.text("نعم \n YES", 90, 55);
  doc.text("لا \n NO", 110, 55);
  doc.text("هل تعاني من اصابة حالياً او سبق ان عانيت من \n  الاصابة بأي من المشاكل التالية ؟", 200, 55, { align: 'right' });

  doc.setLineWidth(1);
  doc.line(5, 80, 205, 80);


  doc.text("Heart conditions ( heart attack,angina, \n irregular  heartbeat,hole in heart, ..Etc)", 7, 70);

  doc.text("مشاكل في القلب( نوبة قلبية,ذبحة صدرية,عدم  \nالانتظام في ضربات  القلب,ثقب في القلب...)", 200, 70, { align: 'right' });


  doc.setLineWidth(1);
  doc.line(5, 65, 205, 65);

  doc.text("High flow blood pressure", 7, 85);

  doc.text("ارتفاع او انخفاض في ضغط الدم", 200, 85, { align: 'right' });


  doc.setLineWidth(1);
  doc.line(5, 90, 205, 90);

  doc.text("Back or joint problems", 7, 95);

  doc.text("مشاكل في الظهر أو المفاصل", 200, 95, { align: 'right' });


  doc.setLineWidth(1);
  doc.line(5, 100, 205, 100);

  doc.text("Diabetes", 7, 105);

  doc.text("سكري", 200, 105, { align: 'right' });


  doc.setLineWidth(1);
  doc.line(5, 110, 205, 110);

  doc.text("Respiratory illness ( asthma,bronchitis, \n emphysema)", 7, 115);

  doc.text("مشاكل في التنفس ( أزمة,التهاب قصبات \n هوائية,انتفاخ الرئة )", 200, 115, { align: 'right' });


  doc.setLineWidth(1);
  doc.line(5, 125, 205, 125);

  doc.text("Fainting , Dizziness", 7, 130);

  doc.text("حدوث دوخة أو دوار أو إغماء", 200, 130, { align: 'right' });


  doc.setLineWidth(1);
  doc.line(5, 135, 205, 135);

  doc.text("Had any serious injury or operation\n within the  last 18 months , If Yes ,mention :", 7, 140);

  doc.text("قد عانيت من اي اصابة خطيرة أو عملية \nخلال 18 شهر الماضية , أذا نعم اذكرها :", 200, 140, { align: 'right' });
  doc.setFontSize(14);

  doc.text(": أحكام و شروط العضوية", 200, 160, { align: 'right' });

  doc.setFontSize(12);

  doc.text("عدم القيام بأي أعمال غير قانونية في هذا المرفق بما في ذلك الافراط في الضوضاء أو تعطيل الاعضاء في مركز اللياقة-\n \n" +
    ".العضوية هي غير قابلة للاسترداد وغير قابلة للتحويل -\n \n" +
    ".احترام الاعضاء الاخرين عند استخدام أي مرفق من حيث المعدات و شغل الوقت -\n \n" +
    ".مركز اللياقة و موظفيه لن يكون مسؤولا عن إي تلف أو ضرر يصيب ألاشخاص أو الممتلكات في حين استخدام هذه المعدات - \n \n" +
    "يجب على الاعضاء أن تمتثل للأنظمة والقواعد المالية لمركز اللياقة . الانتهاكات المتكررة من هذه الانظمة يمكن ان يؤدي الى - \nالغاء العضوية و مصادرة الرسوم.\n \n" +
    ".الادارة لا تقبل تحمل المسؤولية عن إي ضياع أو سرقة أو إضرار من الاشياء الثمينة والامتعة الشخصية - \n \n" +
    ".يطلب من جميع الأشخاص ارتداء الملابس الرياضية المناسبة -\n \n" +
    ".اذا قام العضو بأي نشاط تعتبره الشركة مؤذي أو فيه خرق لهذه البنود و الشروط تحتفظ الشركة لنفسها بالحق في أن تطلب من الاعضاء -\nالمغادرة فورا وينتهي هذا العقد , وفي مثل هذه الظروف لا يتمكن العضو من استرداد أي من رسوم \n \n" +
    ".يحق للنادي تغيير أوقات الدوام في أي وقت -\n \n" +
    ".إدارة المركز غير مسؤولة عن أي منشطات او هورمونات يتناولها الاعضاء و يمنع تناول اي منها داخل المركز - \n", 200, 170, { align: 'right' });
  doc.setFontSize(14);

  doc.text(".لقد قرأت وفهمت الشروط المنصوص عليها في هذه العضوية وأوافق عل الشروط المنصوص عليها في هذا العقد", 200, 280, { align: 'right' });
  doc.text("---------------------------------------أسم و توقيع المشترك", 85, 290, { align: 'right' });

  return doc.output('datauristring').replace(/^data:application\/pdf;filename=generated.pdf;base64,/, '')

}

export function tConvert(date) {
  let hours = date.getHours();
  let minutes = date.getMinutes();
  let ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? "0" + minutes : minutes;
  let strTime = " " + hours + ":" + minutes + "  " + ampm;
  return strTime;
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