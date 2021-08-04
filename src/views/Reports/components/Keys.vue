<template>
  <div>
    <el-radio-group v-model="tabPosition" style="margin-bottom: 30px;">
      <el-radio-button label="top">top</el-radio-button>
      <el-radio-button label="right">right</el-radio-button>
      <el-radio-button label="bottom">bottom</el-radio-button>
      <el-radio-button label="left">left</el-radio-button>
    </el-radio-group>
    <el-tabs
      v-model="activeName"
      :tab-position="tabPosition"
      type="border-card"
      style="height: 200px;"
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
              name: "FakeDate",
              value: "FakeDate : {{FakeDate}}"
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
              name: "Total",
              value: "Total : {{Total}}"
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
            }
          ]
        }
      ]
    };
  }
};
</script>