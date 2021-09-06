<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header">
        <router-link
          class="pan-btn tiffany-btn"
          style="float: left; padding: 10px 15px; border-radius: 6px"
          icon="el-icon-plus"
          to="/EntryAccounting/Create"
          >{{ $t("Accounting.NewAccountingEntry") }}</router-link
        >
        <span>{{ $t("Accounting.AccountingEntryinquiries") }}</span>
      </div>
      <div class="filter-container">
        <el-row type="flex"
          ><el-col :span="18">
            <Account-Search-Any
              @Set="
                (v) => {
                  listQuery.AccountId = v.Id;
                  Account = v;
                }
              "
          /></el-col>
        </el-row>
        <el-row type="flex">
          <el-col :span="4">
            <el-input
              v-model="listQuery.Any"
              placeholder="Search By Any Acount Name Or Id"
              class="filter-item"
              @keyup.enter.native="handleFilter"
            />
          </el-col>
          <el-col :span="8">
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
          <el-col :span="3">
            <user-select
              @Set="
                (v) => {
                  listQuery.User = v;
                  handleFilter();
                }
              "
            />
          </el-col>

          <el-col :span="5">
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
                DateFrom: listQuery.DateFrom,
                DateTo: listQuery.DateTo,
                InventoryMovements: list,
                TotalCredit: Totals.Credit,
                TotalDebit: Totals.Debit,
                TotalDebitCredit: Totals.Totals,
                TotalRows: Totals.Rows,
              }"
          /></el-col>
        </el-row>
      </div>
      <Radio-Oprations
        TableName="EntryAccounting"
        @Set="
          (v) => {
            listQuery.Status = v;
            handleFilter();
          }
        "
      />
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
        @row-dblclick="
          (row) => {
            $router.push({ path: `/EntryAccounting/Edit/${row.EntryId}` });
          }
        "
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
        <el-table-column width="180" align="center">
          <template slot-scope="scope">
            <Next-Oprations
              :ObjId="scope.row.Id"
              :Status="scope.row.Status"
              TableName="EntryAccounting"
              @Done="handleFilter"
            />
            <Drawer-Print Type="EntryAccounting" :Data="scope.row" />
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
<script>
import { GetByListQ } from "@/api/EntryAccounting";
import NextOprations from "@/components/Oprationsys/NextOprations";
import SearchByDate from "@/components/Date/SearchByDate";
import StatusTag from "@/components/Oprationsys/StatusTag";
import DrawerPrint from "@/components/PrintRepot/DrawerPrint.vue";
import UserSelect from "@/components/User/UserSelect";
import RadioOprations from "@/components/Oprationsys/RadioOprations";
import printJS from "print-js";
import permission from "@/directive/permission/index.js";
import AccountSearchAny from "@/components/TreeAccount/AccountSearchAny.vue";

import waves from "@/directive/waves"; // waves directive
import { parseTime } from "@/utils";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
import DialogActionLog from "@/components/ActionLog/DialogActionLog.vue";

export default {
  name: "EntryAccounting",
  components: {
    StatusTag,
    NextOprations,
    SearchByDate,
    DrawerPrint,
    Pagination,
    UserSelect,
    RadioOprations,
    DialogActionLog,
    AccountSearchAny,
  },
  directives: { waves, permission },
  data() {
    return {
      Account: {},
      list: [],
      Totals: { Rows: 0, Totals: 0, Debit: 0, Credit: 0 },
      listLoading: false,
      listQuery: {
        Page: 1,
        Any: "",
        limit: this.$store.getters.settings.LimitQurey,
        User: undefined,
        DateFrom: "",
        DateTo: "",
        Status: undefined,
        AccountId: 2,
      },
      downloadLoading: false,
    };
  },

  methods: {
    getList() {
      this.listLoading = true;
      //    console.log("sdsad", this.listQuery);
      GetByListQ(this.listQuery).then((response) => {
        this.list = response.items.map((curr, i, array) => {
          curr.TotalRow = array[i != 0 ? i - 1 : i].TotalRow - (curr.Debit - curr.Credit);
          return curr;
        });
        this.Totals = response.Totals;
        this.listLoading = false;
      });
    },
    handleFilter() {
      this.listQuery.Page = 1;
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
    getSortClass: function (key) {
      const sort = this.listQuery.sort;
      return sort === `+${key}` ? "ascending" : "descending";
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
