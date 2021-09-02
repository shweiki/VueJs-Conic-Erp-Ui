﻿<template>
  <div class="app-container">
    <el-card class="box-card">
      <div class="filter-container">
        <el-row type="flex">
          <el-col :span="6">
            <el-radio-group v-model="Type" text-color="#f78123">
              <el-radio label="Payables" border>{{ $t("Accounting.Payables") }}</el-radio>
              <el-radio label="Receivables" border>{{
                $t("Accounting.Receivables")
              }}</el-radio>
            </el-radio-group>
          </el-col>
          <el-col :span="4">
            <el-switch
              active-text="With Zero"
              inactive-text="Without Zero"
              v-model="listQuery.WithZero"
            >
            </el-switch>
          </el-col>
          <el-col :span="4">
            <el-select
              v-model="listQuery.Sort"
              style="width: 140px"
              class="filter-item"
              @change="handleFilter"
            >
              <el-option
                v-for="item in sortOptions"
                :key="item.key"
                :label="item.label"
                :value="item.key"
              />
            </el-select>
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
              Type="AccountReceivablesPayables"
              :Data="{
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
      <span>عدد </span>
      <el-divider direction="vertical"></el-divider>
      <span>{{ Totals.Rows }}</span>
      <el-divider direction="vertical"></el-divider>

      <span>مجموع المدين</span>
      <el-divider direction="vertical"></el-divider>
      <span>{{ Totals.TotalCredit.toFixed($store.getters.settings.ToFixed) }} JOD</span>
      <el-divider direction="vertical"></el-divider>

      <span>مجموع الدائن</span>
      <el-divider direction="vertical"></el-divider>
      <span>{{ Totals.TotalDebit.toFixed($store.getters.settings.ToFixed) }} JOD</span>
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
        @sort-change="sortChange"
      >
        <el-table-column
          v-bind:label="$t('Accounting.Id')"
          prop="Id"
          width="120"
          align="center"
        >
        </el-table-column>

        <el-table-column
          v-bind:label="$t('Accounting.Name')"
          prop="Name"
          align="center"
        ></el-table-column>
        <el-table-column label="مدين" prop="Credit" width="100" align="center">
          <template slot-scope="scope">{{
            scope.row.TotalCredit.toFixed($store.getters.settings.ToFixed)
          }}</template>
        </el-table-column>
        <el-table-column label="دائن" prop="Debit" width="100" align="center">
          <template slot-scope="scope">{{
            scope.row.TotalDebit.toFixed($store.getters.settings.ToFixed)
          }}</template>
        </el-table-column>
        <el-table-column label="الرصيد" prop="Total" width="100" align="center">
          <template slot-scope="scope">{{
            (scope.row.TotalCredit - scope.row.TotalDebit).toFixed(
              $store.getters.settings.ToFixed
            )
          }}</template>
        </el-table-column>
        <el-table-column v-bind:label="$t('Sales.Status')" width="120" align="center">
          <template slot-scope="scope">
            <Status-Tag :Status="scope.row.Status" TableName="Account" />
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="Totals.Rows > 0"
        :total="Totals.Rows"
        :page.sync="listQuery.Page"
        :limit.sync="listQuery.limit"
        @pagination="getList"
      />
    </el-card>
  </div>
</template>
<script>
import { GetPayables, GetReceivables } from "@/api/Account";
import StatusTag from "@/components/Oprationsys/StatusTag";
import DrawerPrint from "@/components/PrintRepot/DrawerPrint.vue";
import permission from "@/directive/permission/index.js";
import waves from "@/directive/waves"; // waves directive
import { parseTime } from "@/utils";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination

export default {
  name: "AccountReceivablesPayables",
  components: {
    StatusTag,
    DrawerPrint,
    Pagination,
  },
  directives: { waves, permission },
  data() {
    return {
      Type: "Payables",
      list: [],
      Totals: { Rows: 0, Totals: 0, TotalDebit: 0, TotalCredit: 0 },
      listLoading: false,
      listQuery: {
        WithZero: false,
        Page: 1,
        Any: "",
        Sort: "-id",
        limit: this.$store.getters.settings.LimitQurey,
      },
      sortOptions: [
        { label: "Id Ascending", key: "+id" },
        { label: "Id Descending", key: "-id" },
      ],
      downloadLoading: false,
    };
  },

  methods: {
    getList() {
      this.listLoading = true;
      if (this.Type == "Payables") {
        GetPayables(this.listQuery).then((response) => {
          this.list = response.items.map((curr, i, array) => {
            curr.TotalRow =
              array[i != 0 ? i - 1 : i].TotalRow - (curr.Debit - curr.Credit);
            return curr;
          });
          this.Totals = response.Totals;
          this.listLoading = false;
        });
      } else {
        GetReceivables(this.listQuery).then((response) => {
          this.list = response.items.map((curr, i, array) => {
            curr.TotalRow =
              array[i != 0 ? i - 1 : i].TotalRow - (curr.Debit - curr.Credit);
            return curr;
          });
          this.Totals = response.Totals;
          this.listLoading = false;
        });
      }
    },
    handleFilter() {
      this.listQuery.Page = 1;
      this.getList();
    },
    sortChange(data) {
      const { prop, order } = data;
      if (prop === "id") {
        this.sortById(order);
      }
    },
    sortById(order) {
      if (order === "ascending") {
        this.listQuery.sort = "+id";
      } else {
        this.listQuery.sort = "-id";
      }
      this.handleFilter();
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