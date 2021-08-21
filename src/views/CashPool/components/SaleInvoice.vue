<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header">
        <Cash-Pool-Dialog
          :Total="Totals.Totals"
          Type="SaleInvoice"
          :Data="tableData"
          :Open="OpenCashPoolDialog"
          @Closed="
            () => {
              OpenCashPoolDialog = false;
            }
          "
          @Done="createData()"
        />
        <el-row type="flex">
          <el-col :span="12">
            <span>{{ $t("NewPurchaseInvoice.Box") }}</span>
            <Select-Cash-Accounts @Set="v => (CashAccount = v)" />
          </el-col>
          <el-col :span="12">
            <span>{{ $t("Account.InCome") }}</span>
            <Select-In-Come-Accounts @Set="v => (InComeAccount = v)" />
          </el-col>
        </el-row>
      </div>

      <el-divider direction="vertical"></el-divider>
      <span>{{ $t("CashPool.Invoice") }}</span>
      <el-divider direction="vertical"></el-divider>
      <span>{{ Selection.length }}</span>
      <el-divider direction="vertical"></el-divider>

      <span>{{ $t("CashPool.Cash") }}</span>
      <el-divider direction="vertical"></el-divider>
      <span
        >{{ Totals.Cash.toFixed($store.getters.settings.ToFixed) }} JOD</span
      >
      <el-divider direction="vertical"></el-divider>

      <span>{{ $t("CashPool.Visa") }}</span>
      <el-divider direction="vertical"></el-divider>
      <span
        >{{ Totals.Visa.toFixed($store.getters.settings.ToFixed) }} JOD</span
      >
      <el-divider direction="vertical"></el-divider>

      <span>{{ $t("CashPool.debt") }}</span>
      <el-divider direction="vertical"></el-divider>
      <span
        >{{
          Totals.Receivables.toFixed($store.getters.settings.ToFixed)
        }}
        JOD</span
      >
      <el-divider direction="vertical"></el-divider>
      <span>مجموع الخصم</span>
      <el-divider direction="vertical"></el-divider>
      <span
        >{{
          Totals.Discount.toFixed($store.getters.settings.ToFixed)
        }}
        JOD</span
      >
      <el-divider direction="vertical"></el-divider>

      <span>{{ $t("CashPool.Amount") }}</span>
      <el-divider direction="vertical"></el-divider>
      <span
        >{{ Totals.Totals.toFixed($store.getters.settings.ToFixed) }} JOD</span
      >
      <el-divider direction="vertical"></el-divider>
      <span>إجمالي التكلفة</span>
      <el-divider direction="vertical"></el-divider>
      <span
        >{{
          Totals.TotalCost.toFixed($store.getters.settings.ToFixed)
        }}
        JOD</span
      >
      <el-divider direction="vertical"></el-divider>

      <span>صافي الربح</span>
      <el-divider direction="vertical"></el-divider>
      <span
        >{{ Totals.Profit.toFixed($store.getters.settings.ToFixed) }} JOD</span
      >
      <el-divider direction="vertical"></el-divider>
    </el-card>
    <el-card v-permission="['Admin']" class="box-card">
      <span>{{ $t("CashPool.Note") }}</span>
      <el-table
        height="250"
        :data="ItemsMovements"
        fit
        border
        highlight-current-row
      >
        <el-table-column
          prop="Name"
          label="الصنف"
          align="center"
        ></el-table-column>
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
            {{ Totals.Profit.toFixed($store.getters.settings.ToFixed) }}
          </template>
          <template slot-scope="scope">{{
            (
              (scope.row.AvgPrice - scope.row.CostPrice) *
              scope.row.TotalCount
            ).toFixed($store.getters.settings.ToFixed)
          }}</template>
        </el-table-column>
        <el-table-column align="center">
          <template slot="header" slot-scope="{}">
            المجموع بيع
            {{
              (Totals.Cash + Totals.Receivables + Totals.Visa).toFixed(
                $store.getters.settings.ToFixed
              )
            }}
            <el-button
              style="float: left"
              icon="el-icon-printer"
              type="success"
              @click="printAllItemSale(ItemsMovements)"
            ></el-button>
            <el-button
              style="float: left"
              icon="el-icon-printer"
              type="success"
              @click="printItemsIngredients(ItemsIngredients)"
            ></el-button>
          </template>
          <template slot-scope="scope">{{
            (scope.row.AvgPrice * scope.row.TotalCount).toFixed(
              $store.getters.settings.ToFixed
            )
          }}</template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-card class="box-card">
      <el-table
        height="250"
        :data="tableData"
        fit
        border
        highlight-current-row
        ref="multipleTable"
        @row-dblclick="
          row => {
            $router.replace({
              path: '/Sales/Edit/' + row.Id
            });
          }
        "
      >
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
            <strong style="font-size: 10px; cursor: pointer">{{
              scope.row.Name
            }}</strong>
          </template>
        </el-table-column>
        <el-table-column
          v-bind:label="$t('Type')"
          width="80"
          align="center"
          prop="Type"
        >
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
          <template slot-scope="scope">{{
            scope.row.Discount.toFixed($store.getters.settings.ToFixed)
          }}</template>
        </el-table-column>
        <el-table-column
          v-bind:label="$t('CashPool.Amountv')"
          width="120"
          align="center"
        >
          <template slot-scope="scope">
            {{
              scope.row.InventoryMovements.reduce((prev, cur) => {
                return prev + cur.Qty * cur.SellingPrice;
              }, 0).toFixed($store.getters.settings.ToFixed)
            }}
            JOD
          </template>
        </el-table-column>
        <el-table-column width="60" align="center">
          <template slot="header" slot-scope="{}">
            <el-button
              icon="el-icon-printer"
              type="success"
              @click="
                SaleInvoicesList({
                  Totals: Totals,
                  Items: Selection,
                  Dates: [new Date(), new Date()]
                })
              "
            ></el-button>
          </template>
          <template slot-scope="scope">
            <Drawer-Print Type="SaleInvoice" :Data="scope.row" />
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
              <el-table-column
                v-bind:label="$t('CashPool.Price')"
                align="center"
              >
                <template slot-scope="scope">{{
                  scope.row.SellingPrice.toFixed(
                    $store.getters.settings.ToFixed
                  )
                }}</template>
              </el-table-column>
              <el-table-column
                v-bind:label="$t('CashPool.Total')"
                align="center"
              >
                <template slot-scope="scope"
                  >{{
                    (scope.row.SellingPrice * scope.row.Qty).toFixed(
                      $store.getters.settings.ToFixed
                    )
                  }}
                  JOD</template
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
import { GetByListQ } from "@/api/SaleInvoice";

import { CreateEntry } from "@/api/EntryAccounting";
import { ChangeArrObjStatus } from "@/api/Oprationsys";
import DrawerPrint from "@/components/PrintRepot/DrawerPrint";
import { SaleInvoicesList } from "@/Report/SaleInvoice";
import permission from "@/directive/permission/index.js";
import checkPermission from "@/utils/permission";
import CashPoolDialog from "./CashPoolDialog.vue";
import printJS from "print-js";
import SelectCashAccounts from "@/components/TreeAccount/SelectCashAccounts.vue";
import SelectInComeAccounts from "@/components/TreeAccount/SelectInComeAccounts.vue";

export default {
  name: "SaleInvoice",
  components: {
    DrawerPrint,
    CashPoolDialog,
    SelectCashAccounts,
    SelectInComeAccounts
  },
  directives: { permission },
  data() {
    return {
      OpenCashPoolDialog: false,
      tableData: [],
      Selection: [],
      tempForm: {},
      CashAccount: undefined,
      InComeAccount: undefined,
      Totals: {
        Rows: 0,
        Totals: 0,
        Cash: 0,
        Receivables: 0,
        Visa: 0,
        Profit: 0,
        TotalCost: 0,
        Discount: 0
      },
      ItemsMovements: [],
      ItemsIngredients: []
    };
  },
  mounted() {
    this.getdata();
  },
  methods: {
    checkPermission,
    SaleInvoicesList,

    getdata() {
      const loading = this.$loading({
        lock: true,
        text: "Get Data",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      GetByListQ({
        Page: 1,
        Any: "",
        limit: this.$store.getters.settings.LimitGetInvoice,
        Sort: "-id",
        Status: 0
      })
        .then(response => {
          // handle success
          console.log(response);
          this.tableData = response.items;
          this.Totals = response.Totals;
          this.ItemsMovements = [];
          this.tableData.map(a => {
            return a.InventoryMovements.map(m => {
              var find = this.ItemsMovements.findIndex(
                value => value.Name == m.Name
              );
              if (find != -1) this.ItemsMovements[find].TotalCount += m.Qty;
              else {
                this.ItemsMovements.push({
                  Name: m.Name,
                  TotalCount: m.Qty,
                  AvgPrice: m.SellingPrice.toFixed(
                    this.$store.getters.settings.ToFixed
                  ),
                  CostPrice: m.CostPrice,
                  Ingredients: JSON.parse(m.Ingredients) || []
                });
              }
            });
          });

          this.ItemsIngredients = [];
          this.ItemsMovements.map(a => {
            return a.Ingredients.map(m => {
              var find = this.ItemsIngredients.findIndex(
                value => value.Name == m.Name
              );
              if (find != -1)
                this.ItemsIngredients[find].TotalCount += a.TotalCount * m.Qty;
              else {
                this.ItemsIngredients.push({
                  Name: m.Name,
                  TotalCount: a.TotalCount * m.Qty
                });
              }
            });
          });
          loading.close();
          this.OpenCashPoolDialog = true;
        })
        .catch(error => {
          // handle error
          console.log(error);
        });
    },
    createData() {
      CreateEntry(this.tempForm)
        .then(res => {
          if (res) {
            ChangeArrObjStatus({
              ObjsId: this.Selection.map(x => x.Id),
              TableName: "SalesInvoice",
              Status: 1,
              Description: "فاتورة مؤكدة"
            }).then(response => {
              console.log(response);
              this.$notify({
                title: "تم الإضافة بنجاح",
                message: "تم الإضافة بنجاح",
                type: "success",
                position: "top-left",
                duration: 3000,
                onClose: () => {
                  Object.assign(this.$data, this.$options.data());
                  this.getdata();
                }
              });
            });
          } else {
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    printItemsIngredients(data) {
      data = data.map(Item => ({
        العدد: Item.TotalCount,
        الصنف: Item.Name
      }));
      printJS({
        printable: data,
        properties: ["العدد", "الصنف"],
        type: "json",
        header:
          "<h3 style='float:right'>  التاريخ  : " +
          this.formatDate(new Date()) +
          "</h3>",
        gridHeaderStyle: "color: red;  border: 2px solid #3971A5;",
        gridStyle: "border: 2px solid #3971A5; text-align: center;"
      });
    },
    printAllItemSale(data) {
      data = data.map(Item => ({
        "المجموع البيع": (Item.TotalCount * Item.AvgPrice).toFixed(
          this.$store.getters.settings.ToFixed
        ),
        "سعر البيع": Item.AvgPrice,
        "المجموع التكلفة": (Item.TotalCount * Item.CostPrice).toFixed(
          this.$store.getters.settings.ToFixed
        ),
        "سعر التكلفة": Item.CostPrice,
        العدد: Item.TotalCount,
        الصنف: Item.Name
      }));
      printJS({
        printable: data,
        properties: [
          "المجموع البيع",
          "سعر البيع",
          "المجموع التكلفة",
          "سعر التكلفة",
          "العدد",
          "الصنف"
        ],
        type: "json",
        header:
          "<center> <h2>" +
          this.InComeAccounts.find(obj => {
            return obj.value == this.InComeAccount;
          }).label +
          "</h2></center><h3 style='float:right'> الاجمالي النقدي " +
          this.Totals.Cash.toFixed(this.$store.getters.settings.ToFixed) +
          " - الاجمالي الفيزا : " +
          this.Totals.Visa.toFixed(this.$store.getters.settings.ToFixed) +
          " - الاجمالي الاجل : " +
          this.Totals.Receivables.toFixed(
            this.$store.getters.settings.ToFixed
          ) +
          //  " - صافي الربح : " +
          //  this.Totals.Profit.toFixed(this.$store.getters.settings.ToFixed) +
          " - الاجمالي خصم : " +
          this.Totals.Discount.toFixed(this.$store.getters.settings.ToFixed) +
          " - الاجمالي التكلفة : " +
          this.Totals.TotalCost.toFixed(this.$store.getters.settings.ToFixed) +
          " - الاجمالي :  " +
          (
            this.Totals.Cash +
            this.Totals.Receivables +
            this.Totals.Visa
          ).toFixed(this.$store.getters.settings.ToFixed) +
          "</h3><h3 style='float:right'>  التاريخ  : " +
          this.formatDate(new Date()) +
          "</h3>",
        gridHeaderStyle: "color: red;  border: 2px solid #3971A5;",
        gridStyle: "border: 2px solid #3971A5; text-align: center;"
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
    }
  }
};
</script>
