<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header">
        <el-row type="flex">
          <el-col :span="10">
            <span>{{ $t("NewPurchaseInvoice.Box") }}</span>
            <Select-Cash-Accounts @Set="(v) => (CashAccountId = v.value)" />
          </el-col>
          <el-col :span="2">
            <el-switch
              v-bind:disabled="!checkPermission(['admin'])"
              v-model="AutoSent"
              active-color="#13ce66"
              inactive-color="#ff4949"
            ></el-switch>
          </el-col>
          <el-col :span="2">
            <el-button
              :size="$store.getters.size"
              v-bind:disabled="
                tableData.length <= 0 ||
                (this.$route.params && this.$route.params.id) != null
              "
              icon="fa fa-save"
              style="float: left"
              type="primary"
              @click="OpenCashPoolDialog = true"
            />
            <Drawer-Print
              v-permission="['admin']"
              style="float: left"
              Type="PaymentList"
              :Data="{
                Totals: Totals,
                Items: tableData,
                Dates: [new Date(), new Date()],
              }"
            />
          </el-col>
        </el-row>
      </div>
      <div v-permission="['admin']">
        <el-divider direction="vertical"></el-divider>
        <span>عدد مقبوضات</span>
        <el-divider direction="vertical"></el-divider>
        <span>{{ Totals.Rows }}</span>
        <el-divider direction="vertical"></el-divider>

        <span>{{ $t("CashPool.Cash") }}</span>
        <el-divider direction="vertical"></el-divider>
        <span>{{ Totals.Cash.toFixed($store.getters.settings.ToFixed) }} JOD</span>
        <el-divider direction="vertical"></el-divider>

        <span>{{ $t("CashPool.Visa") }}</span>
        <el-divider direction="vertical"></el-divider>
        <span>{{ Totals.Visa.toFixed($store.getters.settings.ToFixed) }} JOD</span>
        <el-divider direction="vertical"></el-divider>

        <span>شيكات</span>
        <el-divider direction="vertical"></el-divider>
        <span>{{ Totals.Cheque.toFixed($store.getters.settings.ToFixed) }} JOD</span>
        <el-divider direction="vertical"></el-divider>

        <span>{{ $t("CashPool.Amount") }}</span>
        <el-divider direction="vertical"></el-divider>
        <span>{{ Totals.Totals.toFixed($store.getters.settings.ToFixed) }} JOD</span>
        <el-divider direction="vertical"></el-divider>
      </div>
    </el-card>
    <el-card class="box-card">
      <span>{{ $t("CashPool.Note") }}</span>
      <el-table
        height="500"
        :data="tableData"
        fit
        border
        highlight-current-row
        ref="multipleTable"
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
          prop="ObjectId"
          label="رقم المشترك"
          align="center"
        ></el-table-column>
        <el-table-column prop="Name" label="الاسم" align="center">
          <template slot-scope="{ row }">
            <router-link v-if="row.MemberId != null" :to="'/Gym/Edit/' + row.ObjectId">
              <strong style="font-size: 10px; cursor: pointer">{{ row.Name }}</strong>
            </router-link>
            <router-link v-if="row.VendorId != null" :to="'/Vendor/Edit/' + row.ObjectId">
              <strong style="font-size: 10px; cursor: pointer">{{ row.Name }}</strong>
            </router-link>
          </template>
        </el-table-column>

        <el-table-column v-bind:label="$t('Sales.Date')" width="150px" align="center">
          <template slot-scope="{ row }">
            <span>{{ row.FakeDate | parseTime("{y}-{m}-{d} {h}:{i}") }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="PaymentMethod"
          v-bind:label="$t('CashPool.Pay')"
          width="100"
          align="center"
        >
          <template slot-scope="scope">
            <edit-payment-method
              :VendorId="scope.row.VendorId"
              :Value="scope.row.PaymentMethod"
              Type="Payment"
              :ID="scope.row.Id"
              @Done="
                (v) => {
                  getdata();
                }
              "
            />
            {{ $t("NewPurchaseInvoice." + scope.row.PaymentMethod + "") }}</template
          >
        </el-table-column>
        <el-table-column v-bind:label="$t('CashPool.Amountv')" width="120" align="center">
          <template slot-scope="{ row }">
            {{ row.TotalAmmount.toFixed($store.getters.settings.ToFixed) }}
            JOD
          </template>
        </el-table-column>
        <el-table-column label="#" align="center">
          <template slot-scope="scope">
            <Drawer-Print :Data="scope.row" Type="Payment" />
          </template>
        </el-table-column>
        <el-table-column align="center" v-if="checkPermission(['admin'])">
          <template slot-scope="scope">
            <Next-Oprations
              :ObjId="scope.row.Id"
              :Status="scope.row.Status"
              TableName="Payment"
              @Done="getdata"
            />
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <cash-pool-dialog
      :Totals="Totals"
      Type="Payment"
      :Data="tableData"
      :Open="OpenCashPoolDialog"
      @Closed="
        () => {
          OpenCashPoolDialog = false;
        }
      "
      @Done="(v) => createData(v)"
    />
  </div>
</template>
<script>
import checkPermission from "@/utils/permission";
import permission from "@/directive/permission/index.js";

import { GetPaymentByStatus, GetPaymentByListId } from "@/api/Payment";
import { Create as CreateCashPool, GetCashPoolById } from "@/api/CashPool";

import { CreateEntry } from "@/api/EntryAccounting";
import NextOprations from "@/components/Oprationsys/NextOprations.vue";
import CashPoolDialog from "./CashPoolDialog.vue";
import DrawerPrint from "@/components/PrintRepot/DrawerPrint.vue";
import SelectCashAccounts from "@/components/TreeAccount/SelectCashAccounts.vue";
import SelectInComeAccounts from "@/components/TreeAccount/SelectInComeAccounts.vue";
import { VisualizationReportHtml, PrintReport } from "@/Report/FunctionalityReport";
import { Send as SendEmail } from "@/api/Email";
import EditPaymentMethod from "@/components/PaymentMethod/EditPaymentMethod.vue";

import { ChangeArrObjStatus } from "@/api/Oprationsys";

export default {
  name: "Payment",
  components: {
    DrawerPrint,
    NextOprations,
    CashPoolDialog,
    SelectCashAccounts,
    SelectInComeAccounts,
    EditPaymentMethod,
  },
  directives: { permission },

  data() {
    return {
      OpenCashPoolDialog: false,
      tableData: [],
      CashPool: {},
      Data: undefined,
      AutoSent: false,
      CashAccountId: undefined,
      InComeAccountId: undefined,
      Totals: { Cash: 0, Cheque: 0, Rows: 0, Totals: 0, Visa: 0 },
    };
  },
  created() {
    if (this.$route.params && this.$route.params.id) {
      this.getdata(this.$route.params && this.$route.params.id);
    } else {
      this.getdata();
    }

    this.tempRoute = Object.assign({}, this.$route);
  },
  methods: {
    checkPermission,
    getdata(val = null) {
      const loading = this.$loading({
        lock: true,
        text: "Get Data",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      if (val != null) {
        GetCashPoolById({ Id: val }).then((res) => {
          this.CashPool = res;
          GetPaymentByListId({ listid: res.Fktable }).then((res) => {
            loading.text = "Calculate";
            console.log(res);
            this.tableData = res.items;
            this.CashPool.Totals = res.Totals;
            this.Totals = res.Totals;
            loading.close();
          });
        });
      } else {
        GetPaymentByStatus({
          Page: 1,
          limit: this.$store.getters.settings.LimitGetInvoice,
          Sort: "-id",
          Status: 0,
        })
          .then((response) => {
            loading.text = "Calculate";
            // handle success
            this.tableData = response.items;
            this.Totals = response.Totals;
            loading.close();
          })
          .catch((error) => {
            // handle error
            console.log(error);
          });
      }
    },
    createData(v) {
      const loading = this.$loading({
        lock: true,
        text: "Create Cash Pool",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      CreateCashPool(v)
        .then(async (res) => {
          if (res) {
            v.Id = res;
            this.CashPool = v;
            var Entry = {
              Id: undefined,
              FakeDate: new Date(),
              Description: "",
              Status: 0,
              Type: "PaymentCashPool",
              EntryMovements: [
                {
                  Id: undefined,
                  AccountId: this.CashAccountId,
                  Debit: 0.0,
                  Credit: this.Totals.Totals,
                  Description: "اغلاق صندوق رقم " + v.Id + " ",
                  EntryId: undefined,
                  TableName: "PaymentCashPool",
                  Fktable: v.Id,
                },
              ],
            };
            await this.tableData.forEach((x) => {
              Entry.EntryMovements.push({
                Id: undefined,
                AccountId: x.AccountId,
                Debit: x.TotalAmmount,
                Credit: 0.0,
                Description: "سند قبض رقم " + x.Id + " ",
                EntryId: undefined,
                TableName: "PaymentCashPool",
                Fktable: x.Id,
              });
            });
            loading.text = "Create Entry ";
            CreateEntry(Entry).then((res) => {
              if (res) {
                loading.text = "Change Arr Obj Status ";
                ChangeArrObjStatus({
                  ObjsId: this.tableData.map((x) => x.Id),
                  TableName: "Payment",
                  Status: 1,
                  Description: "دفعة مؤكدة",
                }).then(async (response) => {
                  this.OpenCashPoolDialog = false;
                  if (this.AutoSent) {
                    loading.text = "Send Report By Email";
                    const CashPoolHtml = await VisualizationReportHtml(
                      "CashPool",
                      this.CashPool
                    );
                    const PaymentList = await VisualizationReportHtml("PaymentList", {
                      Totals: this.Totals,
                      Items: this.tableData,
                      Dates: [new Date(), new Date()],
                    });
                    const ResolveSendEmail = await SendEmail({
                      to: this.$store.getters.CompanyInfo.Email,
                      subject:
                        "إغلاق صندوق " +
                        this.CashPool.Type +
                        " - " +
                        "من تاريخ " +
                        this.formatDate(new Date()) +
                        " - " +
                        "لغاية  " +
                        this.formatDate(new Date()),
                      body: CashPoolHtml + PaymentList,
                    });
                    this.$notify({
                      title: "تم الإضافة بنجاح",
                      message: "تم الإضافة بنجاح" + ResolveSendEmail,
                      type: "success",
                      position: "top-left",
                      duration: 3000,
                    });
                    loading.close();
                    PrintReport("CashPool", this.CashPool);
                    this.getdata();
                    Object.assign(this.$data, this.$options.data());
                  } else {
                    loading.close();
                    Object.assign(this.$data, this.$options.data());
                  }
                });
              } else {
              }
            });
          } else {
            loading.close();
          }
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
