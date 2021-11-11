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
            <Sort-Options
              :Value="listQuery.Sort"
              @Set="
                (v) => {
                  listQuery.Sort = v;
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
            <Export :list="list" />
            <el-button
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
              Type="EntryAccountingList"
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
            $router.push({ path: `/EntryAccounting/Edit/${row.Id}` });
          }
        "
      >
        <el-table-column
          v-bind:label="$t('Accounting.EntryId')"
          prop="Id"
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
        <el-table-column v-bind:label="$t('Sales.Status')" width="120" align="center">
          <template slot-scope="scope">
            <Status-Tag :Status="scope.row.Status" TableName="EntryAccounting" />
          </template>
        </el-table-column>
        <el-table-column width="180" align="center">
          <template slot-scope="scope">
            <Dialog-Action-Log TableName="EntryAccounting" :ObjId="scope.row.Id" />
            <Next-Oprations
              :ObjId="scope.row.Id"
              :Status="scope.row.Status"
              TableName="EntryAccounting"
              @Done="handleFilter"
            />
            <Drawer-Print Type="EntryAccounting" :Data="scope.row" />
          </template>
        </el-table-column>
        <el-table-column type="expand" align="center">
          <template slot-scope="props">
            <el-table :data="props.row.EntryMovements">
              <el-table-column
                v-bind:label="$t('Accounting.EntryId')"
                prop="Id"
                align="center"
              >
              </el-table-column>
              <el-table-column
                v-bind:label="$t('Accounting.AccountId')"
                prop="AccountId"
                align="center"
              >
              </el-table-column>
              <el-table-column
                v-bind:label="$t('Accounting.Name')"
                prop="Name"
                align="center"
              >
              </el-table-column>
              <el-table-column label="مدين" prop="Credit" align="center">
                <template slot-scope="scope">{{
                  scope.row.Credit.toFixed($store.getters.settings.ToFixed)
                }}</template>
              </el-table-column>
              <el-table-column label="دائن" prop="Debit" align="center">
                <template slot-scope="scope">{{
                  scope.row.Debit.toFixed($store.getters.settings.ToFixed)
                }}</template>
              </el-table-column>
              <el-table-column label="TableName" prop="TableName" align="center">
              </el-table-column>
              <el-table-column label="Fktable" prop="Fktable" align="center">
              </el-table-column>
            </el-table>
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
import permission from "@/directive/permission/index.js";

import waves from "@/directive/waves"; // waves directive
import { parseTime } from "@/utils";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
import DialogActionLog from "@/components/ActionLog/DialogActionLog.vue";
import SortOptions from "@/components/SortOptions";
import Export from "@/components/Export";

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
    SortOptions,
    DialogActionLog,
    Export,
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
      },
    };
  },

  methods: {
    getList() {
      this.listLoading = true;
      //    console.log("sdsad", this.listQuery);
      GetByListQ(this.listQuery).then((response) => {
        this.list = response.items;
        this.Totals = response.Totals;
        this.listLoading = false;
      });
    },
    handleFilter() {
      this.listQuery.Page = 1;
      this.getList();
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
