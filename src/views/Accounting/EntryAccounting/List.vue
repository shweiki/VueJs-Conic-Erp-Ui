<template>
  <div class="app-container">
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
      <div slot="header" class="clearfix">
        <Search-By-Date
          :Value="[]"
          @Set="
            v => {
              date = v;
            }
          "
          @focus="getdata()"
        />
      </div>
      <el-card class="box-card">
        <span class="demonstration">{{ $t("Accounting.Account") }}</span>
        <el-select
          v-model="AccountId"
          filterable
          v-bind:placeholder="$t('Accounting.Account')"
          @change="getdata"
          autocomplete="off"
        >
          <el-option
            v-for="(item, index) in Account"
            :key="index"
            :label="item.label"
            :value="item.value"
          >
            <span style="float: right">{{ item.label }}</span>
            <span style="float: left color: #8492a6 font-size: 13px">{{
              item.value
            }}</span>
          </el-option>
        </el-select>
        <el-divider direction="vertical"></el-divider>
        <span>{{ Total.toFixed($store.getters.settings.ToFixed) }} JOD</span>
        <el-divider direction="vertical"></el-divider>
        <el-button
          style="float: left"
          icon="el-icon-printer"
          type="success"
          @click="print(tableData)"
        ></el-button>
      </el-card>

      <el-table
        v-loading="loading"
        :data="tableData"
        fit
        border
        max-height="850"
        highlight-current-row
        style="width: 100%"
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
          <template slot="header" slot-scope="{}">
            <el-button
              type="success"
              icon="el-icon-refresh"
              @click="getdata"
            ></el-button>
          </template>
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
      </el-table>
    </el-card>
  </div>
</template>
<script>
import SearchByDate from "@/components/Date/SearchByDate";

import { GetEntryAccounting } from "@/api/EntryAccounting";
import { GetActiveAccounts } from "@/api/Account";
import printJS from "print-js";

export default {
  name: "EntryAccounting",
  components: { SearchByDate },
  data() {
    return {
      tableData: [],
      Account: [],
      Total: 0,
      date: [],
      loading: true,
      AccountId: 2
    };
  },
  created() {
    console.log(this.date);
    this.getdata();
  },
  methods: {
    getdata() {
      this.loading = true;
      GetEntryAccounting({
        AccountId: this.AccountId,
        DateFrom: this.date[0],
        DateTo: this.date[1]
      }).then(response => {
        console.log(response);
        this.tableData = response;
        this.Total =
          this.tableData.reduce((a, b) => a + b.Credit, 0) -
          this.tableData.reduce((a, b) => a + b.Debit, 0);

        GetActiveAccounts().then(response => {
          // handle success
          console.log(response);
          this.Account = response;
          this.loading = false;
        });
      });
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
          this.Total.toFixed($store.getters.settings.ToFixed) +
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
