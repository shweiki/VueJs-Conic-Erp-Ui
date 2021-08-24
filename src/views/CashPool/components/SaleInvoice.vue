<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header">
        <el-button
          :size="$store.getters.size"
          v-bind:disabled="tableData.length <= 0"
          icon="fa fa-save"
          style="float: left"
          type="primary"
          @click="OpenCashPoolDialog = true"
        />
        <Drawer-Print style="float: left" Type="CashPool" :Data="CashPool" />
        <Drawer-Print
          style="float: left"
          Type="ItemsSales"
          :Data="{
            Totals: Totals,
            Items: ItemsSales,
            Dates: [new Date(), new Date()],
          }"
        />
        <Drawer-Print
          style="float: left"
          Type="ItemsIngredients"
          :Data="{
            Items: ItemsIngredients,
            Dates: [new Date(), new Date()],
          }"
        />
        <Cash-Pool-Dialog
          :Totals="Totals"
          Type="SaleInvoice"
          :Data="tableData"
          :Open="OpenCashPoolDialog"
          @Closed="
            () => {
              OpenCashPoolDialog = false;
            }
          "
          @Done="(v) => createData(v)"
        />
        <el-col :span="6">
          <el-switch
            v-model="AutoSent"
            active-color="#13ce66"
            inactive-color="#ff4949"
          ></el-switch>
        </el-col>
        <el-row type="flex">
          <el-col :span="12">
            <span>{{ $t("NewPurchaseInvoice.Box") }}</span>
            <Select-Cash-Accounts @Set="(v) => (CashAccountId = v.value)" />
          </el-col>
          <el-col :span="12">
            <span>{{ $t("Account.InCome") }}</span>
            <Select-In-Come-Accounts @Set="(v) => (InComeAccountId = v.value)" />
          </el-col>
        </el-row>
      </div>

      <el-divider direction="vertical"></el-divider>
      <span>{{ $t("CashPool.Invoice") }}</span>
      <el-divider direction="vertical"></el-divider>
      <span>{{ tableData.length }}</span>
      <el-divider direction="vertical"></el-divider>

      <span>{{ $t("CashPool.Cash") }}</span>
      <el-divider direction="vertical"></el-divider>
      <span>{{ Totals.Cash.toFixed($store.getters.settings.ToFixed) }} JOD</span>
      <el-divider direction="vertical"></el-divider>

      <span>{{ $t("CashPool.Visa") }}</span>
      <el-divider direction="vertical"></el-divider>
      <span>{{ Totals.Visa.toFixed($store.getters.settings.ToFixed) }} JOD</span>
      <el-divider direction="vertical"></el-divider>

      <span>{{ $t("CashPool.debt") }}</span>
      <el-divider direction="vertical"></el-divider>
      <span>{{ Totals.Receivables.toFixed($store.getters.settings.ToFixed) }} JOD</span>
      <el-divider direction="vertical"></el-divider>
      <span>مجموع الخصم</span>
      <el-divider direction="vertical"></el-divider>
      <span>{{ Totals.Discount.toFixed($store.getters.settings.ToFixed) }} JOD</span>
      <el-divider direction="vertical"></el-divider>

      <span>{{ $t("CashPool.Amount") }}</span>
      <el-divider direction="vertical"></el-divider>
      <span>{{ Totals.Totals.toFixed($store.getters.settings.ToFixed) }} JOD</span>
      <el-divider direction="vertical"></el-divider>
      <span>إجمالي التكلفة</span>
      <el-divider direction="vertical"></el-divider>
      <span>{{ Totals.TotalCost.toFixed($store.getters.settings.ToFixed) }} JOD</span>
      <el-divider direction="vertical"></el-divider>

      <span>صافي الربح</span>
      <el-divider direction="vertical"></el-divider>
      <span>{{ Totals.Profit.toFixed($store.getters.settings.ToFixed) }} JOD</span>
      <el-divider direction="vertical"></el-divider>
    </el-card>
    <el-card v-permission="['Admin']" class="box-card">
      <span>{{ $t("CashPool.Note") }}</span>
      <el-table height="250" :data="ItemsSales" fit border highlight-current-row>
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
            {{ Totals.Profit.toFixed($store.getters.settings.ToFixed) }}
          </template>
          <template slot-scope="scope">{{
            ((scope.row.AvgPrice - scope.row.CostPrice) * scope.row.TotalCount).toFixed(
              $store.getters.settings.ToFixed
            )
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
          (row) => {
            $router.replace({
              path: '/Sales/Edit/' + row.Id,
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
          width="140"
          align="center"
        >
          <template slot-scope="{ row }">
            <span>{{ row.FakeDate | parseTime("{y}-{m}-{d} {h}:{i}") }}</span>
          </template></el-table-column
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
        <el-table-column v-bind:label="$t('Type')" width="80" align="center" prop="Type">
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
        <el-table-column v-bind:label="$t('CashPool.Amountv')" width="120" align="center">
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
            <Drawer-Print
              style="float: left"
              Type="SaleInvoicesList"
              :Data="{
                Totals: Totals,
                Items: tableData,
                Dates: [new Date(), new Date()],
              }"
            />
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
              <el-table-column v-bind:label="$t('CashPool.Price')" align="center">
                <template slot-scope="scope">{{
                  scope.row.SellingPrice.toFixed($store.getters.settings.ToFixed)
                }}</template>
              </el-table-column>
              <el-table-column v-bind:label="$t('CashPool.Total')" align="center">
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
import { Create as CreateCashPool } from "@/api/CashPool";

import { CreateEntry } from "@/api/EntryAccounting";
import { ChangeArrObjStatus } from "@/api/Oprationsys";
import DrawerPrint from "@/components/PrintRepot/DrawerPrint.vue";
import permission from "@/directive/permission/index.js";
import checkPermission from "@/utils/permission";
import CashPoolDialog from "./CashPoolDialog.vue";
import SelectCashAccounts from "@/components/TreeAccount/SelectCashAccounts.vue";
import SelectInComeAccounts from "@/components/TreeAccount/SelectInComeAccounts.vue";
import { parseTime } from "@/utils";
import { SendReportByEmail } from "@/Report/FunctionalityReport";

export default {
  name: "SaleInvoice",
  components: {
    DrawerPrint,
    CashPoolDialog,
    SelectCashAccounts,
    SelectInComeAccounts,
  },
  directives: { permission },
  data() {
    return {
      OpenCashPoolDialog: false,
      tableData: [],
      CashPool: {},
      Data: undefined,
      AutoSent: true,
      CashAccountId: undefined,
      InComeAccountId: undefined,
      Totals: {
        Rows: 0,
        Totals: 0,
        Cash: 0,
        Receivables: 0,
        Visa: 0,
        Profit: 0,
        TotalCost: 0,
        Discount: 0,
      },
      ItemsSales: [],
      ItemsIngredients: [],
    };
  },
  mounted() {
    this.getdata();
  },
  methods: {
    checkPermission,
    getdata() {
      const loading = this.$loading({
        lock: true,
        text: "Get Data",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      GetByListQ({
        Page: 1,
        Any: "",
        limit: this.$store.getters.settings.LimitGetInvoice,
        Sort: "-id",
        Status: 0,
      })
        .then((response) => {
          // handle success
          loading.text = "Calculate";

          console.log(response);
          this.Data = response;

          this.tableData = response.items;
          this.Totals = response.Totals;
          this.ItemsSales = [];
          this.tableData.map((a) => {
            return a.InventoryMovements.map((m) => {
              var find = this.ItemsSales.findIndex((value) => value.Name == m.Name);
              if (find != -1) this.ItemsSales[find].TotalCount += m.Qty;
              else {
                this.ItemsSales.push({
                  Name: m.Name,
                  TotalCount: m.Qty,
                  AvgPrice: m.SellingPrice.toFixed(this.$store.getters.settings.ToFixed),
                  CostPrice: m.CostPrice,
                  Ingredients: JSON.parse(m.Ingredients) || [],
                });
              }
            });
          });

          this.ItemsIngredients = [];
          this.ItemsSales.map((a) => {
            return a.Ingredients.map((m) => {
              var find = this.ItemsIngredients.findIndex((value) => value.Name == m.Name);
              if (find != -1)
                this.ItemsIngredients[find].TotalCount += a.TotalCount * m.Qty;
              else {
                this.ItemsIngredients.push({
                  Name: m.Name,
                  TotalCount: a.TotalCount * m.Qty,
                });
              }
            });
          });

          loading.close();
        })
        .catch((error) => {
          // handle error
          console.log(error);
        });
    },
    createData(v) {
      const loading = this.$loading({
        lock: true,
        text: "Create Cash Pool",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      CreateCashPool(v).then((res) => {
        if (res) {
          v.Id = res;
          this.CashPool = v;
          var Entry = {
            Id: undefined,
            FakeDate: new Date(),
            Description: "",
            Status: 0,
            Type: "CashPool",
            EntryMovements: [
              {
                Id: undefined,
                AccountId: this.CashAccountId,
                Debit: 0.0,
                Credit: this.Totals.Cash,
                Description: "اغلاق صندوق رقم " + v.Id + " ",
                EntryId: undefined,
                TableName: "CashPool",
                Fktable: v.Id,
              },
              {
                Id: undefined,
                AccountId: this.InComeAccountId,
                Debit: this.Totals.Totals,
                Credit: 0.0,
                Description: "اغلاق صندوق رقم" + v.Id + " ",
                EntryId: undefined,
                TableName: "CashPool",
                Fktable: v.Id,
              },
            ],
          };
          this.tableData.forEach((x) => {
            if (x.PaymentMethod == "Receivables") {
              Entry.EntryMovements.push({
                Id: undefined,
                AccountId: x.AccountId,
                Debit: 0.0,
                Credit: x.Total,
                Description: "فاتورة مبيعات رقم " + x.Id + " ",
                EntryId: undefined,
                TableName: "SaleInvoice",
                Fktable: x.Id,
              });
            }
          });
          loading.text = "Create Entry ";
          CreateEntry(Entry)
            .then((res) => {
              if (res) {
                loading.text = "Change Arr Obj Status ";
                ChangeArrObjStatus({
                  ObjsId: this.tableData.map((x) => x.Id),
                  TableName: "SalesInvoice",
                  Status: 1,
                  Description: "فاتورة مؤكدة",
                }).then((response) => {
                  console.log(response);
                  this.$notify({
                    title: "تم الإضافة بنجاح",
                    message: "تم الإضافة بنجاح",
                    type: "success",
                    position: "top-left",
                    duration: 3000,
                  });
                  this.OpenCashPoolDialog = false;
                  if (this.AutoSent) {
                    loading.text = "Send Report By Email";
                    SendReportByEmail(
                      this.$store.getters.CompanyInfo.Email,
                      "CashPool",
                      this.CashPool
                    );
                    SendReportByEmail(
                      this.$store.getters.CompanyInfo.Email,
                      "ItemsSales",
                      {
                        Totals: this.Totals,
                        Items: this.ItemsSales,
                        Dates: [new Date(), new Date()],
                      }
                    );
                    SendReportByEmail(
                      this.$store.getters.CompanyInfo.Email,
                      "ItemsIngredients",
                      {
                        Items: this.ItemsIngredients,
                        Dates: [new Date(), new Date()],
                      }
                    );
                    SendReportByEmail(
                      this.$store.getters.CompanyInfo.Email,
                      "SaleInvoicesList",
                      {
                        Totals: Totals,
                        Items: tableData,
                        Dates: [new Date(), new Date()],
                      }
                    );
                  }
                  loading.close();

                  Object.assign(this.$data, this.$options.data());
                });
              } else {
              }
            })
            .catch((error) => {
              console.log(error);
            });
        } else {
          loading.close();
        }
      });
    },
  },
};
</script>
