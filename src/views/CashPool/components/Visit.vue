<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header">
        <el-button
          :size="$store.getters.size"
          v-bind:disabled="
            tableData.length <= 0 || (this.$route.params && this.$route.params.id) != null
          "
          icon="fa fa-save"
          style="float: left"
          type="primary"
          @click="OpenCashPoolDialog = true"
        />
        <Drawer-Print style="float: left" Type="CashPool" :Data="CashPool" />
        <Drawer-Print
          v-permission="['admin']"
          style="float: left"
          Type="VisitsList"
          :Data="{
            Totals: Totals,
            Items: tableData,
            Dates: [new Date(), new Date()],
          }"
        />

        <el-col :span="6">
          <el-switch
            v-bind:disabled="!checkPermission(['admin'])"
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
      <div v-permission="['admin']">
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

        <span>{{ $t("CashPool.Coupon") }}</span>
        <el-divider direction="vertical"></el-divider>
        <span>{{ Totals.Coupon.toFixed($store.getters.settings.ToFixed) }} JOD</span>
        <el-divider direction="vertical"></el-divider>
        <span>مجموع الخصم</span>
        <el-divider direction="vertical"></el-divider>
        <span>{{ Totals.Discount.toFixed($store.getters.settings.ToFixed) }} JOD</span>
        <el-divider direction="vertical"></el-divider>

        <span>{{ $t("CashPool.Amount") }}</span>
        <el-divider direction="vertical"></el-divider>
        <span>{{ Totals.Totals.toFixed($store.getters.settings.ToFixed) }} JOD</span>
        <el-divider direction="vertical"></el-divider>
      </div>
    </el-card>
    <el-card class="box-card">
      <el-table
        height="600"
        :data="tableData"
        fit
        border
        highlight-current-row
        ref="multipleTable"
        @row-dblclick="
          (row) => {
            $router.replace({
              path: '/Visit/Edit/' + row.Id,
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
        <el-table-column v-bind:label="$t('Sales.Date')" width="150px" align="center">
          <template slot-scope="{ row }">
            <span>{{ row.FakeDate | parseTime("{y}-{m}-{d} {h}:{i}") }}</span>
          </template>
        </el-table-column>

        <el-table-column v-bind:label="$t('AddVendors.Name')" prop="Name" align="center">
        </el-table-column>

        <el-table-column
          v-bind:label="$t('CashPool.Pay')"
          width="120"
          align="center"
          prop="PaymentMethod"
        >
        </el-table-column>
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
          <template slot-scope="{ row }">
            {{ row.Total.toFixed($store.getters.settings.ToFixed) }}
            JOD
          </template>
        </el-table-column>

        <el-table-column width="60" label="#" align="center">
          <template slot-scope="scope">
            <Drawer-Print Type="Visit" :Data="scope.row" />
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <Cash-Pool-Dialog
      :Totals="Totals"
      Type="Visit"
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
import { GetByListQ, GetByListId as GetVisitByListId } from "@/api/Visit";
import { Create as CreateCashPool, GetCashPoolById } from "@/api/CashPool";

import { CreateEntry } from "@/api/EntryAccounting";
import { ChangeArrObjStatus } from "@/api/Oprationsys";
import DrawerPrint from "@/components/PrintRepot/DrawerPrint.vue";
import EditPaymentMethod from "@/components/PaymentMethod/EditPaymentMethod.vue";

import permission from "@/directive/permission/index.js";
import checkPermission from "@/utils/permission";
import CashPoolDialog from "./CashPoolDialog.vue";
import SelectCashAccounts from "@/components/TreeAccount/SelectCashAccounts.vue";
import SelectInComeAccounts from "@/components/TreeAccount/SelectInComeAccounts.vue";
import { parseTime } from "@/utils";
import { VisualizationReportHtml, PrintReport } from "@/report/FunctionalityReport";
import { Send as SendEmailTo } from "@/api/Email";

export default {
  name: "Visit",
  components: {
    DrawerPrint,
    CashPoolDialog,
    SelectCashAccounts,
    SelectInComeAccounts,
    EditPaymentMethod,
  },
  props: {
    isEdit: {
      type: Boolean,
      default: false,
    },
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
        Coupon: 0,
        TotalCost: 0,
        Discount: 0,
      },
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
          GetVisitByListId({ listid: res.Fktable }).then((res) => {
            loading.text = "Calculate";
            console.log(res);
            this.Data = res;
            this.tableData = res.items;
            this.CashPool.Totals = res.Totals;
            this.Totals = res.Totals;
            loading.close();
          });
        });
      } else {
        GetByListQ({
          Page: 1,
          Any: "",
          limit: this.$store.getters.settings.LimitGetInvoice,
          Sort: "-id",
          Status: 1,
        })
          .then((res) => {
            // handle success
            loading.text = "Calculate";
            console.log(res);
            this.Data = res;
            this.tableData = res.items;
            this.Totals = res.Totals;
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
      CreateCashPool(v).then(async (res) => {
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
                TableName: "VisitCashPool",
                Fktable: v.Id,
              },
              {
                Id: undefined,
                AccountId: this.InComeAccountId,
                Debit: this.Totals.Totals,
                Credit: 0.0,
                Description: "اغلاق صندوق رقم" + v.Id + " ",
                EntryId: undefined,
                TableName: "VisitCashPool",
                Fktable: v.Id,
              },
            ],
          };
          loading.text = "Create Entry ";
          CreateEntry(Entry)
            .then((res) => {
              if (res) {
                loading.text = "Change Arr Obj Status ";
                ChangeArrObjStatus({
                  ObjsId: this.tableData.map((x) => x.Id),
                  TableName: "Visit",
                  Status: 2,
                  Description: "زيارة مؤكدة",
                }).then(async (response) => {
                  console.log(response);
                  this.OpenCashPoolDialog = false;
                  if (this.AutoSent) {
                    loading.text = "Send Report By Email";
                    const CashPool = await VisualizationReportHtml(
                      "CashPool",
                      this.CashPool
                    );

                    const VisitsList = await VisualizationReportHtml("VisitsList", {
                      Totals: this.Totals,
                      Items: this.tableData,
                      Dates: [new Date(), new Date()],
                    });

                    const ResolveSendEmail = await SendEmailTo({
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
                      body: CashPool + VisitsList,
                    });
                    this.$notify({
                      title: "تم الإضافة بنجاح",
                      message: "تم الإضافة بنجاح  " + ResolveSendEmail,
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
            })
            .catch((error) => {
              console.log(error);
            });
        } else {
          loading.close();
        }
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
    setTagsViewTitle() {
      const title = "Edit Sales";
      const route = Object.assign({}, this.tempRoute, {
        title: `${title}-${this.tempForm.Id}`,
      });
      this.$store.dispatch("tagsView/updateVisitedView", route);
    },
    setPageTitle() {
      const title = "Edit Sales";
      document.title = `${title} - ${this.tempForm.Id}`;
    },
  },
};
</script>
