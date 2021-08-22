const x =
    `<hr dir="rtl" />
    <p dir="rtl" style="text-align: center;"><strong><span style="font-size: 24pt;">ملخص الفواتير</span></strong></p>
    <hr dir="rtl" />
    <p dir="rtl" style="text-align: center;"><span style="font-size: 12pt; font-family: 'arial black', 'avant garde';">من تاريخ : &nbsp;{#formatDate('{{Dates.0}}')/}&nbsp; -&nbsp; &nbsp;الى تاريخ : {#formatDate('{{Dates.1}}')/}</span></p>
    <p dir="rtl" style="text-align: center;">&nbsp;</p>
    <table dir="rtl" style="border-collapse: collapse; width: 91.4741%; margin-left: auto; margin-right: auto;" border="1">
    <tbody>
    <tr>
    <td style="width: 16.6667%; text-align: center;"><strong><span style="font-size: 14pt;">الاجمالي النقدي</span></strong></td>
    <td style="width: 16.6667%; text-align: center;"><strong><span style="font-size: 14pt;">الاجمالي الفيزا</span></strong></td>
    <td style="width: 16.6667%; text-align: center;"><strong><span style="font-size: 14pt;">الاجمالي الاجل </span></strong></td>
    <td style="width: 16.6667%; text-align: center;"><strong><span style="font-size: 14pt;">الاجمالي خصم </span></strong></td>
    <td style="width: 16.6667%; text-align: center;"><strong><span style="font-size: 14pt;">الاجمالي التكلفة</span></strong></td>
    <td style="width: 8.33335%; text-align: center;"><strong><span style="font-size: 14pt;">الاجمالي</span></strong></td>
    </tr>
    <tr>
    <td style="width: 16.6667%; text-align: center;">{#ToFixed({{Totals.Cash}})/}</td>
    <td style="width: 16.6667%; text-align: center;">{#ToFixed({{Totals.Visa}})/}</td>
    <td style="width: 16.6667%; text-align: center;">{#ToFixed({{Totals.Receivables}})/}</td>
    <td style="width: 16.6667%; text-align: center;">{#ToFixed({{Totals.Discount}})/}</td>
    <td style="width: 16.6667%; text-align: center;">{#ToFixed({{Totals.TotalCost}})/}</td>
    <td style="width: 8.33335%; text-align: center;">{#ToFixed({{Totals.Totals}})/}</td>
    </tr>
    </tbody>
    </table>
    <p dir="rtl" style="text-align: center;">&nbsp;</p>
    <table dir="rtl" style="width: 783px; border-color: #000000; margin-left: auto; margin-right: auto;" border="1">
    <tbody>
    <tr>
    <td style="width: 122.156px; text-align: center;"><strong><span style="font-size: 14pt;">الرقم</span></strong></td>
    <td style="width: 257.203px; text-align: center;"><strong><span style="font-size: 14pt;">الاسم</span></strong></td>
    <td style="width: 247.281px; text-align: center;"><strong><span style="font-size: 14pt;">التاريخ</span></strong></td>
    <td style="width: 234.578px; text-align: center;"><strong><span style="font-size: 14pt;">النوع<br /></span></strong></td>
    <td style="width: 242.438px; text-align: center;"><strong><span style="font-size: 14pt;">طريقة الدفع</span></strong></td>
    <td style="width: 229.734px; text-align: center;"><strong><span style="font-size: 14pt;">الخصم</span></strong></td>
    <td style="width: 0px; text-align: center;"><strong><span style="font-size: 14pt;">الاجمالي</span></strong></td>
    </tr>
    <tr id="Items">
    <td style="width: 122.156px; text-align: center;">{{Items.Id}}</td>
    <td style="width: 257.203px; text-align: center;">{{Items.Name}}</td>
    <td style="width: 247.281px; text-align: center;">{#formatDate('{{Items.FakeDate}}')/}</td>
    <td style="width: 234.578px; text-align: center;">{{Items.Type}}</td>
    <td style="width: 242.438px; text-align: center;">{{Items.PaymentMethod}}</td>
    <td style="width: 229.734px; text-align: center;">{#ToFixed({{Items.Discount}})/}</td>
    <td style="width: 0px; text-align: center;">{#ToFixed({{Items.Total}})/}</td>
    </tr>
    </tbody>
    </table>`
export default x