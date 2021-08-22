const x =
    `<hr dir="rtl" />
    <p dir="rtl" style="text-align: center;"><strong><span style="font-size: 24pt;">مكونات الاصناف</span></strong></p>
    <hr dir="rtl" />
    <p dir="rtl" style="text-align: center;"><span style="font-size: 12pt; font-family: 'arial black', 'avant garde';">من تاريخ : &nbsp;{#formatDate('{{Dates.0}}')/}&nbsp; -&nbsp; &nbsp;الى تاريخ : {#formatDate('{{Dates.1}}')/}</span></p>
    <table dir="rtl" style="width: 307px; border-color: #000000; margin-left: auto; margin-right: auto;" border="1">
    <tbody>
    <tr>
    <td style="width: 130.016px; text-align: center;"><span style="font-size: 14pt;"><strong>اسم</strong></span></td>
    <td style="width: 160.984px; text-align: center;"><span style="font-size: 14pt;"><strong>العدد</strong></span></td>
    </tr>
    <tr id="Items">
    <td style="width: 130.016px; text-align: center;">{{Items.Name}}</td>
    <td style="width: 160.984px; text-align: center;">{{Items.TotalCount}}</td>
    </tr>
    </tbody>
    </table>`
export default x