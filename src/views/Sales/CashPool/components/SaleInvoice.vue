<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-button
          :disabled="EnableSave"
          style="float: left"
          type="success"
          icon="fa fa-save"
          @click="createData"
          >{{ $t("CashPool.Save") }}</el-button
        >
        <span class="demonstration">{{ $t("NewPurchaseInvoice.Box") }}</span>
        <el-select
          disabled
          v-model="CashAccount"
          default-first-option
          filterable
          placeholder="صندوق"
          autocomplete="off"
        >
          <el-option
            v-for="item in CashAccounts"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
            <span style="float: right">{{ item.label }}</span>
            <span style="float: left color: #8492a6 font-size: 12px">{{
              item.value
            }}</span>
          </el-option>
        </el-select>
        <span class="demonstration">إيراد</span>
        <el-select
          disabled
          v-model="InComeAccount"
          filterable
          placeholder="إيراد"
          autocomplete="off"
        >
          <el-option
            v-for="item in InComeAccounts"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
            <span style="float: right">{{ item.label }}</span>
            <span style="float: left color: #8492a6 font-size: 12px">{{
              item.value
            }}</span>
          </el-option>
        </el-select>
      </div>

      <el-divider direction="vertical"></el-divider>
      <span>{{ $t("CashPool.Invoice") }}</span>
      <el-divider direction="vertical"></el-divider>
      <span>{{ Selection.length }}</span>
      <el-divider direction="vertical"></el-divider>

      <span>{{ $t("CashPool.Cash") }}</span>
      <el-divider direction="vertical"></el-divider>
      <span>{{ TotalCash.toFixed(3) }} JOD</span>
      <el-divider direction="vertical"></el-divider>

      <span>{{ $t("CashPool.Visa") }}</span>
      <el-divider direction="vertical"></el-divider>
      <span>{{ TotalVisa.toFixed(3) }} JOD</span>
      <el-divider direction="vertical"></el-divider>

      <span>{{ $t("CashPool.debt") }}</span>
      <el-divider direction="vertical"></el-divider>
      <span>{{ TotalReceivables.toFixed(3) }} JOD</span>
      <el-divider direction="vertical"></el-divider>
      <span>مجموع الخصم</span>
      <el-divider direction="vertical"></el-divider>
      <span>{{ TotalDiscount.toFixed(3) }} JOD</span>
      <el-divider direction="vertical"></el-divider>

      <span>{{ $t("CashPool.Amount") }}</span>
      <el-divider direction="vertical"></el-divider>
      <span>{{ (TotalCash + TotalReceivables + TotalVisa).toFixed(3) }} JOD</span>
      <el-divider direction="vertical"></el-divider>
      <span>إجمالي التكلفة</span>
      <el-divider direction="vertical"></el-divider>
      <span>{{ TotalItemsCost.toFixed(3) }} JOD</span>
      <el-divider direction="vertical"></el-divider>

      <span>صافي الربح</span>
      <el-divider direction="vertical"></el-divider>
      <span>{{ TotalCost.toFixed(3) }} JOD</span>
      <el-divider direction="vertical"></el-divider>
    </el-card>
    <el-card class="box-card">
      <span>{{ $t("CashPool.Note") }}</span>
      <el-table height="250" :data="ItemsMovements" fit border highlight-current-row>
        <el-table-column prop="Name" label="الصنف" align="center"></el-table-column>
        <el-table-column
          prop="TotalCount"
          label="العدد المباع"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="CostPrice"
          label="سعر تكلفة"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="AvgPrice"
          label="سعر البيع"
          align="center"
        ></el-table-column>
        <el-table-column align="center">
          <template slot="header" slot-scope="{}">
            المجموع الربح
            {{ TotalCost.toFixed(3) }}
          </template>
          <template slot-scope="scope">{{
            ((scope.row.AvgPrice - scope.row.CostPrice) * scope.row.TotalCount).toFixed(3)
          }}</template>
        </el-table-column>
        <el-table-column align="center">
          <template slot="header" slot-scope="{}">
            المجموع بيع
            {{ (TotalCash + TotalReceivables + TotalVisa).toFixed(3) }}
            <el-button
              :disabled="EnableSave"
              style="float: left"
              icon="el-icon-printer"
              type="success"
              @click="printAllItemSale(ItemsMovements)"
            ></el-button>
          </template>
          <template slot-scope="scope">{{
            (scope.row.AvgPrice * scope.row.TotalCount).toFixed(3)
          }}</template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-card class="box-card">
      <el-table
        height="250"
        v-loading="loading"
        :data="tableData"
        fit
        border
        highlight-current-row
        ref="multipleTable"
        @row-dblclick="
          (row) => {
            $router.replace({
              path: '/Sales/Edit/' + row.Id,
            });
          }
        "
        @selection-change="handleSelectionChange"
        @expand-change="GetInventoryMovements"
      >
        <el-table-column type="selection" width="55" align="center"></el-table-column>
        <el-table-column label="#" prop="Id" width="120" align="center">
          <template slot="header" slot-scope="{}">
            <el-button
              type="primary"
              icon="el-icon-refresh"
              @click="getdata()"
            ></el-button>
          </template>
        </el-table-column>
        <el-table-column
          prop="FakeDate"
          v-bind:label="$t('CashPool.Date')"
          width="120"
          align="center"
        >
          <template slot-scope="{ row }">{{
            formatDate(row.FakeDate)
          }}</template></el-table-column
        >
        <el-table-column
          prop="Name"
          v-bind:label="$t('CashPool.Customer')"
          align="center"
        >
          <template slot-scope="scope">
            <strong style="font-size: 10px; cursor: pointer">{{ scope.row.Name }}</strong>
          </template>
        </el-table-column>
        <el-table-column
          prop="PaymentMethod"
          v-bind:label="$t('CashPool.Pay')"
          width="150"
          align="center"
        ></el-table-column>
        <el-table-column
          v-bind:label="$t('CashPool.Discount')"
          width="120"
          align="center"
        >
          <template slot-scope="scope">{{ scope.row.Discount.toFixed(3) }}</template>
        </el-table-column>
        <el-table-column v-bind:label="$t('CashPool.Amountv')" width="120" align="center">
          <template slot-scope="scope">
            {{
              scope.row.InventoryMovements.reduce((prev, cur) => {
                return prev + cur.Qty * cur.SellingPrice;
              }, 0).toFixed(3)
            }}
            JOD
          </template>
        </el-table-column>
        <el-table-column width="60" align="center">
          <template slot="header" slot-scope="{}">
            <el-button
              icon="el-icon-printer"
              type="success"
              @click="printAllInvoice(tableData)"
            ></el-button>
          </template>
          <template slot-scope="scope">
            <print-button Type="SaleInvoice" :Data="scope.row" />
          </template>
        </el-table-column>
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-table :data="props.row.InventoryMovements">
              <el-table-column
                prop="Name"
                v-bind:label="$t('CashPool.Items')"
                width="130"
                align="center"
              ></el-table-column>
              <el-table-column
                prop="Qty"
                v-bind:label="$t('CashPool.quantity')"
                align="center"
              ></el-table-column>
              <el-table-column v-bind:label="$t('CashPool.Price')" align="center">
                <template slot-scope="scope">{{
                  scope.row.SellingPrice.toFixed(3)
                }}</template>
              </el-table-column>
              <el-table-column v-bind:label="$t('CashPool.Total')" align="center">
                <template slot-scope="scope"
                  >{{ (scope.row.SellingPrice * scope.row.Qty).toFixed(3) }} JOD</template
                >
              </el-table-column>
            </el-table>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import { GetSaleInvoiceByStatus } from "@/api/SaleInvoice";

import { GetActiveCash } from "@/api/Cash";
import { GetInComeAccounts } from "@/api/Account";
import { CreateEntry } from "@/api/EntryAccounting";
import { ChangeArrObjStatus } from "@/api/Oprationsys";
import PrintButton from "@/components/PrintRepot/PrintButton";

import printJS from "print-js";

export default {
  name: "SaleInvoice",
  components: { PrintButton },
  data() {
    return {
      loading: true,
      EnableSave: true,
      tableData: [],
      Selection: [],
      tempForm: {},
      CashAccounts: [],
      InComeAccounts: [],
      CashAccount: undefined,
      InComeAccount: undefined,
      TotalCash: 0,
      TotalReceivables: 0,
      TotalVisa: 0,
      TotalCost: 0,
      TotalItemsCost: 0,
      TotalDiscount: 0,
      ItemsMovements: [],
    };
  },
  created() {
    this.getdata();
  },
  methods: {
    handleSelectionChange(val) {
      this.Selection = val;
      this.TotalReceivables = this.Selection.reduce(
        (a, b) =>
          a +
          (b["PaymentMethod"] == "Receivables"
            ? b.InventoryMovements.reduce((prev, cur) => {
                return prev + cur.Qty * cur.SellingPrice;
              }, 0) - b.Discount
            : 0),
        0
      );
      this.TotalCash = this.Selection.reduce(
        (a, b) =>
          a +
          (b["PaymentMethod"] == "Cash"
            ? b.InventoryMovements.reduce((prev, cur) => {
                return prev + cur.Qty * cur.SellingPrice;
              }, 0) - b.Discount
            : 0),
        0
      );
      this.TotalVisa = this.Selection.reduce(
        (a, b) =>
          a +
          (b["PaymentMethod"] == "Visa"
            ? b.InventoryMovements.reduce((prev, cur) => {
                return prev + cur.Qty * cur.SellingPrice;
              }, 0) - b.Discount
            : 0),
        0
      );
      this.TotalCost = this.Selection.reduce(
        (a, b) =>
          a +
          b.InventoryMovements.reduce((prev, cur) => {
            const foundItem = this.searchItem(cur.ItemsId);
            return prev + (cur.SellingPrice - foundItem.CostPrice) * cur.Qty;
          }, 0),
        0
      );
      this.TotalItemsCost = this.Selection.reduce(
        (a, b) =>
          a +
          b.InventoryMovements.reduce((prev, cur) => {
            const foundItem = this.searchItem(cur.ItemsId);
            return prev + foundItem.CostPrice * cur.Qty;
          }, 0),
        0
      );

      this.TotalDiscount = this.Selection.reduce((a, b) => a + b.Discount, 0);
      this.EnableSave = false;
    },
    searchItem(Id) {
      return this.$store.getters.AllItems.find((value) => value.Id == Id);
    },
    getdata() {
      this.loading = true;
      GetActiveCash().then((response) => {
        // handle success
        //   console.log(response)
        this.CashAccounts = response;
        this.CashAccount = this.CashAccounts[0].value;
        GetInComeAccounts().then((response) => {
          // handle success
          //   console.log(response)
          this.InComeAccounts = response;
          this.InComeAccount = this.InComeAccounts[0].value;
        });
      });
      GetSaleInvoiceByStatus({
        Status: 0,
      })
        .then((response) => {
          // handle success
          console.log(response);
          this.tableData = response;
          this.ItemsMovements = [];
          this.tableData.map((a) => {
            return a.InventoryMovements.map((m) => {
              var find = this.ItemsMovements.findIndex((value) => value.Name == m.Name);
              if (find != -1) this.ItemsMovements[find].TotalCount += m.Qty;
              else {
                const foundItem = this.$store.getters.AllItems.find(
                  (value) => value.Name == m.Name
                );
                this.ItemsMovements.push({
                  Name: foundItem.Name,
                  TotalCount: m.Qty,
                  AvgPrice: m.SellingPrice.toFixed(2),
                  CostPrice: foundItem.CostPrice,
                });
              }
            });
          });
        })
        .catch((error) => {
          // handle error
          console.log(error);
        });
      this.loading = false;
    },
    GetInventoryMovements(row) {
      //    console.trace(row);
    },

    printAllInvoice(data) {
      data = data.map((Item) => ({
        المجموع:
          Item.InventoryMovements.reduce((prev, cur) => {
            return prev + cur.Qty * cur.SellingPrice;
          }, 0) - Item.Discount.toFixed(3),
        الخصم: Item.Discount,
        "طريقة الدفع ": Item.PaymentMethod,
        التاريخ: Item.FakeDate,
        الحساب: Item.Name,
        الرقم: Item.Id,
      }));
      printJS({
        printable: data,
        properties: ["المجموع", "الخصم", "طريقة الدفع ", "التاريخ", "الحساب", "الرقم"],
        type: "json",
        gridHeaderStyle: "color: red;  border: 2px solid #3971A5;",
        gridStyle: "border: 2px solid #3971A5; text-align: center;",
      });
    },
    printAllItemSale(data) {
      data = data.map((Item) => ({
        "المجموع البيع": (Item.TotalCount * Item.AvgPrice).toFixed(3),
        "سعر البيع": Item.AvgPrice,
        "المجموع التكلفة": (Item.TotalCount * Item.CostPrice).toFixed(3),
        "سعر التكلفة": Item.CostPrice,
        العدد: Item.TotalCount,
        الصنف: Item.Name,
      }));
      printJS({
        printable: data,
        properties: [
          "المجموع البيع",
          "سعر البيع",
          "المجموع التكلفة",
          "سعر التكلفة",
          "العدد",
          "الصنف",
        ],
        type: "json",
        header:
          "<center> <h2>" +
          this.InComeAccounts.find((obj) => {
            return obj.value == this.InComeAccount;
          }).label +
          "</h2></center><h3 style='float:right'> الاجمالي النقدي " +
          this.TotalCash.toFixed(3) +
          " - الاجمالي الفيزا : " +
          this.TotalVisa.toFixed(3) +
          " - الاجمالي الاجل : " +
          this.TotalReceivables.toFixed(3) +
          " - صافي الربح : " +
          this.TotalCost.toFixed(3) +
          " - الاجمالي خصم : " +
          this.TotalDiscount.toFixed(3) +
          " - الاجمالي التكلفة : " +
          this.TotalItemsCost.toFixed(3) +
          " - الاجمالي :  " +
          (this.TotalCash + this.TotalReceivables + this.TotalVisa).toFixed(3) +
          "</h3><h3 style='float:right'>  التاريخ  : " +
          this.formatDate(new Date()) +
          "</h3>",
        gridHeaderStyle: "color: red;  border: 2px solid #3971A5;",
        gridStyle: "border: 2px solid #3971A5; text-align: center;",
      });
    },
    createData() {
      this.EnableSave = true;

      console.log(this.tempForm);
      CreateEntry(this.tempForm)
        .then((response) => {
          ChangeArrObjStatus({
            ObjsID: this.Selection.map((x) => x.Id),
            TableName: "SalesInvoice",
            Status: 1,
            Description: "فاتورة مؤكدة",
          }).then((response) => {
            console.log(response);
            this.EnableSave = false;
            this.$notify({
              title: "تم الإضافة بنجاح",
              message: "تم الإضافة بنجاح",
              type: "success",
              position: "top-left",
              duration: 3000,
              onClose: () => {
                Object.assign(this.$data, this.$options.data());
                this.getdata();
              },
            });
          });
        })
        .catch((error) => {
          console.log(error);
        });
    },
    formatDate(date) {
      let d = new Date(date),
        day = "" + d.getDate(),
        month = "" + (d.getMonth() + 1),
        year = d.getFullYear();
      if (month.length < 2) month = "0" + month;
      if (day.length < 2) day = "0" + day;

      return [day, month, year].join("/");
    },
  },
};
</script>
