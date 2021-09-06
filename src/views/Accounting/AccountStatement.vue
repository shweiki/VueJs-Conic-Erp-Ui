<template>
  <div class="app-container">
    <el-card class="box-card">
      <div class="filter-container">
        <el-row type="flex"
          ><el-col :span="18">
            <Account-Search-Any
              :AccountId="listQuery.AccountId"
              @Set="
                (v) => {
                  Account = v;
                  listQuery.AccountId = v.Id;
                }
              "
          /></el-col>
        </el-row>
        <el-row type="flex">
          <el-col :span="10">
            <Search-By-Date
              :Value="[listQuery.DateFrom, listQuery.DateTo]"
              @Set="
                (v) => {
                  listQuery.DateFrom = v[0];
                  listQuery.DateTo = v[1];
                  handleFilter();
                }
              "
            />
          </el-col>

          <el-col :span="9">
            <el-button
              v-waves
              :loading="downloadLoading"
              class="filter-item"
              type="primary"
              icon="el-icon-download"
              @click="handleDownload"
            >
              Export </el-button
            ><el-button
              v-waves
              class="filter-item"
              type="primary"
              icon="el-icon-search"
              @click="handleFilter"
            >
              Search
            </el-button>
          </el-col>
          <el-col :span="1">
            <Drawer-Print
              Type="AccountStatement"
              :Data="{
                Name: Account.Name,
                Id: Account.Id,
                Code: Account.Code,
                DateFrom: listQuery.DateFrom,
                DateTo: listQuery.DateTo,
                EntryMovement: list,
                TotalCredit: Totals.Credit,
                TotalDebit: Totals.Debit,
                TotalDebitCredit: Totals.Totals,
                TotalRows: Totals.Rows,
              }"
          /></el-col>
        </el-row>
      </div>

      <el-divider direction="vertical"></el-divider>
      <span>عدد القيود</span>
      <el-divider direction="vertical"></el-divider>
      <span>{{ Totals.Rows }}</span>
      <el-divider direction="vertical"></el-divider>

      <span>مجموع المدين</span>
      <el-divider direction="vertical"></el-divider>
      <span>{{ Totals.Credit.toFixed($store.getters.settings.ToFixed) }} JOD</span>
      <el-divider direction="vertical"></el-divider>

      <span>مجموع الدائن</span>
      <el-divider direction="vertical"></el-divider>
      <span>{{ Totals.Debit.toFixed($store.getters.settings.ToFixed) }} JOD</span>
      <el-divider direction="vertical"></el-divider>

      <span>الرصيد</span>
      <el-divider direction="vertical"></el-divider>
      <span>{{ Totals.Totals.toFixed($store.getters.settings.ToFixed) }} JOD</span>
      <el-divider direction="vertical"></el-divider>

      <el-table
        v-loading="listLoading"
        :data="list"
        fit
        border
        highlight-current-row
        style="width: 100%"
      >
        <el-table-column
          v-bind:label="$t('Accounting.EntryId')"
          prop="EntryId"
          width="120"
          align="center"
        >
        </el-table-column>
        <el-table-column label="التاريخ" align="center" width="140">
          <template slot-scope="{ row }">
            <span>{{ row.FakeDate | parseTime("{y}-{m}-{d} {h}:{i}") }}</span>
          </template>
        </el-table-column>
        <el-table-column
          v-bind:label="$t('Accounting.Notes')"
          prop="Description"
          align="center"
        ></el-table-column>
        <el-table-column
          label="رقم الحركة"
          prop="Fktable"
          align="center"
        ></el-table-column>
        <el-table-column label="نوع الحركة" prop="TableName" align="center">
          <template slot-scope="{ row }">
            <router-link
              v-if="row.TableName == 'Manual'"
              :to="'/EntryAccounting/Edit/' + row.EntryId"
            >
              <strong style="font-size: 10px; cursor: pointer">{{
                $t("AccountStatement." + row.TableName)
              }}</strong>
            </router-link>
            <router-link
              v-if="row.TableName == 'Receive'"
              :to="'/Receive/Edit/' + row.Fktable"
            >
              <strong style="font-size: 10px; cursor: pointer">{{
                $t("AccountStatement." + row.TableName)
              }}</strong>
            </router-link>
            <router-link
              v-if="row.TableName == 'Payment'"
              :to="'/Payment/Edit/' + row.Fktable"
            >
              <strong style="font-size: 10px; cursor: pointer">{{
                $t("AccountStatement." + row.TableName)
              }}</strong>
            </router-link>
            <router-link
              v-if="row.TableName == 'SaleInvoice'"
              :to="'/Sales/Edit/' + row.Fktable"
            >
              <strong style="font-size: 10px; cursor: pointer">{{
                $t("AccountStatement." + row.TableName)
              }}</strong>
            </router-link>
          </template></el-table-column
        >
        <el-table-column label="مدين" prop="Credit" width="100" align="center">
          <template slot-scope="scope">{{
            scope.row.Credit.toFixed($store.getters.settings.ToFixed)
          }}</template>
        </el-table-column>
        <el-table-column label="دائن" prop="Debit" width="100" align="center">
          <template slot-scope="scope">{{
            scope.row.Debit.toFixed($store.getters.settings.ToFixed)
          }}</template>
        </el-table-column>
        <el-table-column label="الرصيد" prop="TotalRow" width="100" align="center">
          <template slot-scope="scope">{{
            scope.row.TotalRow.toFixed($store.getters.settings.ToFixed)
          }}</template>
        </el-table-column>
        <el-table-column v-bind:label="$t('Sales.Status')" width="120" align="center">
          <template slot-scope="scope">
            <Status-Tag :Status="scope.row.Status" TableName="EntryAccounting" />
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
<script>
import { GetAccountStatement } from "@/api/EntryAccounting";
import SearchByDate from "@/components/Date/SearchByDate";
import StatusTag from "@/components/Oprationsys/StatusTag";
import DrawerPrint from "@/components/PrintRepot/DrawerPrint.vue";
import permission from "@/directive/permission/index.js";
import AccountSearchAny from "@/components/TreeAccount/AccountSearchAny.vue";
import waves from "@/directive/waves"; // waves directive
import { parseTime } from "@/utils";

export default {
  name: "AccountStatement",
  components: {
    StatusTag,
    SearchByDate,
    DrawerPrint,
    AccountSearchAny,
  },
  directives: { waves, permission },
  data() {
    return {
      list: [],
      Totals: { Rows: 0, Totals: 0, Debit: 0, Credit: 0 },
      listLoading: false,
      listQuery: {
        DateFrom: "",
        DateTo: "",
        AccountId: undefined,
      },
      Account: {},
      downloadLoading: false,
    };
  },

  methods: {
    getList() {
      this.listLoading = true;
      //    console.log("sdsad", this.listQuery);
      GetAccountStatement(this.listQuery).then((response) => {
        this.list = response.items.map((curr, i, array) => {
          curr.TotalRow = array[i != 0 ? i - 1 : i].TotalRow - (curr.Debit - curr.Credit);
          return curr;
        });
        this.Totals = response.Totals;
        this.listLoading = false;
      });
    },
    handleFilter() {
      this.getList();
    },
    handleDownload() {
      this.downloadLoading = true;
      import("@/Report/Excel/Export2Excel").then((excel) => {
        const tHeader = Object.keys(this.list[0]);
        const filterVal = Object.keys(this.list[0]);
        const data = this.formatJson(filterVal);
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: "table-list",
        });
        this.downloadLoading = false;
      });
    },
    formatJson(filterVal) {
      return this.list.map((v) =>
        filterVal.map((j) => {
          if (j === "timestamp") {
            return parseTime(v[j]);
          } else {
            return v[j];
          }
        })
      );
    },
  },
};
</script>
