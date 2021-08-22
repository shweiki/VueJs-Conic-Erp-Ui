const x =
    `<p style="text-align: center;"><span style="font-size: 12pt; font-family: 'arial black', sans-serif;">******************************</span></p>
    <p style="text-align: center;"><span style="font-size: 24pt; font-family: impact, sans-serif;"><strong><em>VILLAGGIO LAND</em></strong></span></p>
    <p style="text-align: center;"><span style="font-size: 12pt; font-family: 'arial black', sans-serif;">******************************</span></p>
    <p style="text-align: center;"><span style="font-size: 12pt; font-family: 'arial black', sans-serif;">Tel: 0787810363</span></p>
    <p style="text-align: center;"><span style="font-size: 12pt; font-family: 'arial black', sans-serif;"> {#formatDate('{{FakeDate}}')/}&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; {#TimeConvert('{{FakeDate}}')/}</span></p>
    <p style="text-align: center;"><span style="font-size: 12pt; font-family: 'arial black', sans-serif;"><span style="font-family: 'arial black', sans-serif;">Bill NO: {{Id}}</span></span></p>
    <p style="text-align: center;">&nbsp;</p>
    <table style="width: 361px; border-style: hidden; border-collapse: collapse; margin-left: auto; margin-right: auto;" border="1">
    <tbody>
    <tr>
    <td style="width: 200.797px; text-align: center;"><span style="font-size: 12pt;">السعر الاجمالي<br /></span></td>
    <td style="width: 96.7188px; text-align: center;"><span style="font-size: 12pt;">الكمية</span></td>
    <td style="width: 201.766px; text-align: center;"><span style="font-size: 12pt;">اسم الصنف<br /></span></td>
    </tr>
    <tr id="InventoryMovements">
    <td style="width: 200.797px; text-align: center;"><strong><span style="font-size: 12pt;">{#ToFixed({{InventoryMovements.SellingPrice}}*{{InventoryMovements.Qty}})/}</span></strong></td>
    <td style="width: 96.7188px; text-align: center;"><span style="font-size: 12pt;">{{InventoryMovements.Qty}}</span></td>
    <td style="width: 200.766px; text-align: center;"><span style="font-size: 12pt;">{{InventoryMovements.Name}}<br /></span></td>
    </tr>
    </tbody>
    </table>
    <table style="width: 100%; border-collapse: collapse;">
    <tbody>
    <tr>
    <td style="width: 33.3333%; text-align: center;">
    <p>&nbsp;</p>
    <p><span style="font-size: 14pt;"><strong>{#ToFixed({{Total}})/} : المجموع</strong></span></p>
    </td>
    <td style="width: 16.6667%; text-align: left;">&nbsp;</td>
    <td style="width: 16.6667%; text-align: center;">&nbsp;</td>
    <td style="width: 16.6667%;">&nbsp;</td>
    <td style="width: 16.6667%;">&nbsp;</td>
    </tr>
    </tbody>
    </table>
    <p style="text-align: center;"><span style="font-size: 10pt;">--------------------------------------------------------------------</span></p>
    <p style="text-align: center;"><span style="font-size: 14pt; font-family: 'arial black', sans-serif;">{{PhoneNumber}}</span></p>
    <p style="text-align: center;"><span style="font-size: 14pt; font-family: 'arial black', sans-serif;">{{Region}}</span></p>
    <p style="text-align: center;">المبلغ : {#ConvetNumberToArabicWords({{Total}})/}</p>
    <p style="text-align: center;"><span style="font-size: 10pt;">--------------------------------------------------------------------</span></p>
    <p style="text-align: center;"><strong><span style="font-size: 14pt; font-family: 'arial black', sans-serif;">********Thank You********</span></strong></p>
    <p style="text-align: center;"><span style="font-size: 10pt;">*******************************************************</span></p>`
export default x