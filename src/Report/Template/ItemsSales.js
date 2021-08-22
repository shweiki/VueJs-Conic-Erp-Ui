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
    <table dir="rtl" style="width: 750px; border-color: #000000; margin-left: auto; margin-right: auto;" border="1">
    <tbody>
    <tr>
    <td style="width: 125.562px; text-align: center;"><strong><span style="font-size: 14pt;">الصنف</span></strong></td>
    <td style="width: 156.906px; text-align: center;"><strong><span style="font-size: 14pt;">العدد</span></strong></td>
    <td style="width: 108.172px; text-align: center;"><strong><span style="font-size: 14pt;">سعر التكلفة</span></strong></td>
    <td style="width: 104.562px; text-align: center;"><strong><span style="font-size: 14pt;">المجموع التكلفة<br /></span></strong></td>
    <td style="width: 98.9844px; text-align: center;"><strong><span style="font-size: 14pt;">سعر البيع</span></strong></td>
    <td style="width: 96.8125px; text-align: center;"><strong><span style="font-size: 14pt;">المجموع البيع</span></strong></td>
    </tr>
    <tr id="Items">
    <td style="width: 125.562px; text-align: center;">{{Items.Name}}</td>
    <td style="width: 156.906px; text-align: center;">{#ToFixed({{Items.TotalCount}})/}</td>
    <td style="width: 108.172px; text-align: center;">{#ToFixed({{Items.CostPrice}})/}</td>
    <td style="width: 104.562px; text-align: center;">{#ToFixed({{Items.CostPrice}}*{{Items.TotalCount}})/}</td>
    <td style="width: 98.9844px; text-align: center;">{#ToFixed({{Items.AvgPrice}})/}</td>
    <td style="width: 96.8125px; text-align: center;">{#ToFixed({{Items.AvgPrice}}*{{Items.TotalCount}})/}</td>
    </tr>
    </tbody>
    </table>`
export default x