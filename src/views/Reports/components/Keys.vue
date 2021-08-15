<template>
  <div>
    <el-radio-group v-model="tabPosition">
      <el-radio-button label="top">top</el-radio-button>
      <el-radio-button label="right">right</el-radio-button>
      <el-radio-button label="bottom">bottom</el-radio-button>
      <el-radio-button label="left">left</el-radio-button>
    </el-radio-group>
    <el-tabs
      v-model="activeName"
      :tab-position="tabPosition"
      type="border-card"
    >
      <el-tab-pane
        v-for="(item, index) in Keys"
        :key="index"
        :label="item.name"
        :name="item.name"
      >
        <el-button
          v-for="(key, index) in item.keys"
          :key="index"
          @click="Add(key.value)"
          >{{ key.name }}</el-button
        >
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
export default {
  methods: {
    Add(v) {
      this.$emit("Add", v);
    }
  },
  data() {
    return {
      tabPosition: "left",
      activeName: "Dates",
      Keys: [
        {
          name: "Dates",
          keys: [
            {
              name: "DateTime",
              value: "FakeDate : {{FakeDate}}"
            },
            {
              name: "Date",
              value: "FakeDate : {#formatDate('{{FakeDate}}')/}"
            },
            {
              name: "Time",
              value: "FakeDate : {#TimeConvert('{{FakeDate}}')/}"
            },
            {
              name: "DateFrom - DateTime",
              value: "DateFrom : {{DateFrom}}"
            },
            {
              name: "DateFrom - Date",
              value: "DateFrom : {#formatDate('{{DateFrom}}')/}"
            },

            {
              name: "DateTo - DateTime",
              value: "DateTo : {{DateTo}}"
            },
            {
              name: "DateTo - Date",
              value: "DateTo : {#formatDate('{{DateTo}}')/}"
            }
          ]
        },
        {
          name: "Names",
          keys: [
            {
              name: "Name",
              value: "Name : {{Name}}"
            },
            {
              name: "Type",
              value: "Type : {{Type}}"
            },
            {
              name: "PaymentMethod",
              value: "PaymentMethod : {{PaymentMethod}}"
            },
            {
              name: "EditorName",
              value: "EditorName : {{EditorName}}"
            },
            {
              name: "Description",
              value: "Description : {{Description}}"
            },
            {
              name: "Status",
              value: "Status : {{Status}}"
            },
            {
              name: "Region",
              value: "Region : {{Region}}"
            },
            {
              name: "ConvetNumberToArabicWords",
              value:
                "المبلغ كتابة : {#ConvetNumberToArabicWords({{TotalAmmount}})/}"
            }
          ]
        },
        {
          name: "Numbers",
          keys: [
            {
              name: "Id",
              value: "Id : {{Id}}"
            },
            {
              name: "AccountId",
              value: "AccountId : {{AccountId}}"
            },
            {
              name: "ObjectId",
              value: "ObjectId : {{ObjectId}}"
            },
            {
              name: "VendorId",
              value: "VendorId : {{VendorId}}"
            },
            {
              name: "MemberId",
              value: "MemberId : {{MemberId}}"
            },
            {
              name: "Tax",
              value: "Tax : {{Tax}}"
            },
            {
              name: "Discount",
              value: "Discount : {{Discount}}"
            },
            {
              name: "TotalAmmount",
              value: "TotalAmmount : {{TotalAmmount}}"
            },
            {
              name: "Total",
              value: "Total : {{Total}}"
            },
            {
              name: "TotalCredit",
              value: "Total Credit : {{TotalCredit}}"
            },
            {
              name: "TotalDebit",
              value: "Total Debit : {{TotalDebit}}"
            },
            {
              name: "TotalDebitCredit",
              value: "Total Debit & Credit : {{TotalDebitCredit}}"
            },
            {
              name: "TotalRows",
              value: "Total Rows : {{TotalRows}}"
            },
            {
              name: "DeliveryPrice",
              value: "DeliveryPrice : {{DeliveryPrice}}"
            },

            {
              name: "PhoneNumber",
              value: "PhoneNumber : {{PhoneNumber}}"
            }
          ]
        },
        {
          name: "Tables",
          keys: [
            {
              name: "حركة اصناف",
              value:
                "<table>\
                    <tbody>\
                        <tr>\
                            <td>ملاحظات</td>\
                            <td>السعر الاجمالي</td>\
                            <td>السعر الافرادي</td>\
                            <td>تاريخ انتهاء</td>\
                            <td>العدد</td>\
                            <td>اسم الصنف</td>\
                            <td>رقم الصنف</td>\
                            <td>رقم طلب المخزون</td>\
                            <td>رقم فاتورة الشراء</td>\
                            <td>رقم فاتورة البيع</td>\
                            <td>نوع الحركة</td>\
                            <td>رقم الحركة</td>\
                            <td>اسم المخزن</td>\
                            <td>رقم المخزن</td>\
                        </tr>\
                        <tr id='InventoryMovements' >\
                            <td>{{item.Description}}</td>\
                            <td>{#{{item.SellingPrice}}*{{item.Qty}}/}</td>\
                            <td>{{item.SellingPrice}}</td>\
                            <td>{{item.EXP}}</td>\
                            <td>{{item.Qty}}</td>\
                            <td>{{item.Name}}</td>\
                            <td>{{item.ItemsId}}</td>\
                            <td>{{item.SalesInvoiceId}}</td>\
                            <td>{{item.PurchaseInvoiceId}}</td>\
                            <td>{{item.OrderInventoryId}}</td>\
                            <td>{{item.TypeMove}}</td>\
                            <td>{{item.Id}}</td>\
                            <td>{{item.InventoryItemName}}</td>\
                            <td>{{item.InventoryItemId}}</td>\
                        </tr>\
                    </tbody>\
                </table>"
            },
            {
              name: "حركة القيود",
              value:
                "<table>\
                    <tbody>\
                        <tr>\
                            <td>الرصيد</td>\
                            <td>الدائن</td>\
                            <td>المدين</td>\
                            <td>البيان</td>\
                            <td>التاريخ</td>\
                            <td>رقم الحركة</td>\
                        </tr>\
                        <tr id='InventoryMovements' >\
                            <td>{{item.TotalRow}}</td>\
                            <td>{{item.Debit}}</td>\
                            <td>{{item.Credit}}</td>\
                            <td>{{item.Description}}</td>\
                            <td>{{item.FakeDate}}</td>\
                            <td>{{item.Id}}</td>\
                        </tr>\
                    </tbody>\
                </table>"
            }
          ]
        }
      ]
    };
  }
};
</script>