<template>
  <div class="app-container">
    <el-card class="box-card">
      <div class="filter-container">
        <el-row type="flex">
          <el-col :span="4">
            <el-input
              v-model="listQuery.Any"
              placeholder="Search By Any Acount Name Or Id"
              style="width: 200px"
              class="filter-item"
              @keyup.enter.native="handleFilter"
            />
          </el-col>
          <Account-Search-Any
            @Set="
              v => {
                listQuery.AccountId = v.Id;
                Accountx = v;
              }
            "
          />
          <ElTag type="success">{{ Accountx.Name }}</ElTag>
          <el-col :span="8">
            <Search-By-Date
              :Value="[listQuery.DateFrom, listQuery.DateTo]"
              @Set="
                v => {
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
                v => {
                  listQuery.User = v;
                  handleFilter();
                }
              "
            />
          </el-col>
          <el-col :span="3">
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
          <el-col :span="6">
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
        </el-row>
      </div>
      <Radio-Oprations
        TableName="EntryAccounting"
        @Set="
          v => {
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
      <span
        >{{ Totals.Credit.toFixed($store.getters.settings.ToFixed) }} JOD</span
      >
      <el-divider direction="vertical"></el-divider>

      <span>مجموع الدائن</span>
      <el-divider direction="vertical"></el-divider>
      <span
        >{{ Totals.Debit.toFixed($store.getters.settings.ToFixed) }} JOD</span
      >
      <el-divider direction="vertical"></el-divider>

      <span>الرصيد</span>
      <el-divider direction="vertical"></el-divider>
      <span
        >{{ Totals.Totals.toFixed($store.getters.settings.ToFixed) }} JOD</span
      >
      <el-divider direction="vertical"></el-divider>

      <el-button
        style="float: left"
        icon="el-icon-printer"
        type="success"
        @click="print(list)"
      ></el-button>
    </el-card>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <router-link
          class="pan-btn tiffany-btn"
          style="float: left; padding: 10px 15px; border-radius: 6px"
          icon="el-icon-plus"
          to="/EntryAccounting/Create"
          >{{ $t("Accounting.NewAccountingEntry") }}</router-link
        >
        <span>{{ $t("Accounting.AccountingEntryinquiries") }}</span>
      </div>

      <el-card class="box-card">
        <el-button
          style="float: left"
          icon="el-icon-printer"
          type="success"
          @click="print(list)"
        ></el-button>
      </el-card>

      <el-table
        v-loading="listLoading"
        :data="list"
        fit
        border
        highlight-current-row
        style="width: 100%"
        @sort-change="sortChange"
        @row-dblclick="
          row => {
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
        <el-table-column
          align="center"
          v-bind:label="$t('Stocks.Date')"
          prop="FakeDate"
          width="120"
        ></el-table-column>
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
        <el-table-column
          v-bind:label="$t('Sales.Status')"
          width="120"
          align="center"
        >
          <template slot-scope="scope">
            <Status-Tag
              :Status="scope.row.Status"
              TableName="EntryAccounting"
            />
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
    AccountSearchAny
  },
  directives: { waves, permission },
  data() {
    return {
      Accountx: { Name: "" },
      list: [],
      Totals: { Rows: 0, Totals: 0, Debit: 0, Credit: 0 },
      listLoading: false,
      listQuery: {
        Page: 1,
        Any: "",
        limit: this.$store.getters.settings.LimitQurey,
        Sort: "-id",
        User: undefined,
        DateFrom: "",
        DateTo: "",
        Status: undefined,
        AccountId: 2
      },
      sortOptions: [
        { label: "Id Ascending", key: "+id" },
        { label: "Id Descending", key: "-id" }
      ],
      downloadLoading: false
    };
  },

  methods: {
    getList() {
      this.listLoading = true;
      //    console.log("sdsad", this.listQuery);
      GetByListQ(this.listQuery).then(response => {
        this.list = response.items;
        this.Totals = response.Totals;
        this.listLoading = false;
      });
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
      import("@/Report/Excel/Export2Excel").then(excel => {
        const tHeader = Object.keys(this.list[0]);
        const filterVal = Object.keys(this.list[0]);
        const data = this.formatJson(filterVal);
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: "table-list"
        });
        this.downloadLoading = false;
      });
    },
    formatJson(filterVal) {
      return this.list.map(v =>
        filterVal.map(j => {
          if (j === "timestamp") {
            return parseTime(v[j]);
          } else {
            return v[j];
          }
        })
      );
    },
    getSortClass: function(key) {
      const sort = this.listQuery.sort;
      return sort === `+${key}` ? "ascending" : "descending";
    },
    print(data) {
      printJS({
        printable: data,
        properties: ["Id", "FakeDate", "Description", "Credit", "Debit"],
        type: "json",
        header:
          "<center> <h2>" +
          this.Account.find(obj => {
            return obj.value == this.AccountId;
          }).label +
          "</h2></center><h3 style='float:left'>الاجمالي " +
          this.Total.toFixed(this.$store.getters.settings.ToFixed) +
          "</h3><h3 style='float:right'>  الفترة  : " +
          this.formatDate(this.date[0]) +
          " - " +
          this.formatDate(this.date[1]) +
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
