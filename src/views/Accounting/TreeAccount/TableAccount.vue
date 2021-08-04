<template>
  <div class="app-container">
    <el-row type="flex">
      <el-col :span="12">
        <el-input
          v-model="listQuery.Any"
          placeholder="Search By Any Acount Name Or Id"
          style="width: 200px"
          class="filter-item"
          @keyup.enter.native="handleFilter"
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

    <el-row type="flex">
      <el-col :span="6">
        <Radio-Oprations
          TableName="Account"
          @Set="
            v => {
              listQuery.Status = v;
              handleFilter();
            }
          "
      /></el-col>
      <el-col v-permission="['Admin']" :span="18">
        <el-divider direction="vertical"></el-divider>
        <span>عدد الحسابات</span>
        <el-divider direction="vertical"></el-divider>
        <span>{{ Totals.Rows }}</span>
        <el-divider direction="vertical"></el-divider>

        <span>مجموع المدين (لك)</span>
        <el-divider direction="vertical"></el-divider>
        <span
          >{{
            Totals.TotalCredit.toFixed($store.getters.settings.ToFixed)
          }}
          JOD</span
        >
        <el-divider direction="vertical"></el-divider>

        <span> (عليك) مجموع الدائن </span>
        <el-divider direction="vertical"></el-divider>
        <span
          >{{
            Totals.TotalDebit.toFixed($store.getters.settings.ToFixed)
          }}
          JOD</span
        >
        <el-divider direction="vertical"></el-divider>

        <span>الرصيد</span>
        <el-divider direction="vertical"></el-divider>
        <span
          >{{
            Totals.Totals.toFixed($store.getters.settings.ToFixed)
          }}
          JOD</span
        >
        <el-divider direction="vertical"></el-divider>
      </el-col>
    </el-row>

    <el-table
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%"
      @sort-change="sortChange"
    >
      <el-table-column label="#" prop="Id" width="50"></el-table-column>
      <el-table-column prop="Code" width="60"> </el-table-column>
      <el-table-column
        prop="Name"
        align="center"
        v-bind:label="$t('Account.AccountName')"
      >
      </el-table-column>
      <el-table-column
        v-bind:label="$t('Account.MainAccount')"
        prop="Type"
        width="150"
      ></el-table-column>

      <el-table-column
        v-bind:label="$t('Account.Credit')"
        prop="totalCredit"
        width="100"
        align="center"
      >
        <template slot-scope="scope">{{
          scope.row.TotalCredit.toFixed($store.getters.settings.ToFixed)
        }}</template>
      </el-table-column>
      <el-table-column
        v-bind:label="$t('Account.Debit')"
        prop="totalDebit"
        width="100"
        align="center"
      >
        <template slot-scope="scope">{{
          scope.row.TotalDebit.toFixed($store.getters.settings.ToFixed)
        }}</template>
      </el-table-column>
      <el-table-column
        v-bind:label="$t('Account.funds')"
        width="100"
        align="center"
      >
        <template slot-scope="scope">{{
          (scope.row.TotalCredit - scope.row.TotalDebit).toFixed(
            $store.getters.settings.ToFixed
          )
        }}</template>
      </el-table-column>
      <el-table-column
        v-bind:label="$t('Account.Status')"
        align="center"
        width="70"
      >
        <template slot-scope="scope">
          <Status-Tag :Status="scope.row.Status" TableName="Account" />
        </template>
      </el-table-column>

      <el-table-column width="180" align="center">
        <template slot-scope="scope">
          <Next-Oprations
            :ObjId="scope.row.Id"
            :Status="scope.row.Status"
            TableName="Account"
            @Done="handleFilter"
          />
          <Drawer-Print Type="Account" :Data="scope.row" />
          <Dialog-Action-Log TableName="Account" :ObjId="scope.row.Id" />
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
  </div>
</template>
<script>
import { GetByListQ } from "@/api/Account";
import StatusTag from "@/components/Oprationsys/StatusTag";
import RadioOprations from "@/components/Oprationsys/RadioOprations";
import NextOprations from "@/components/Oprationsys/NextOprations";
import waves from "@/directive/waves"; // waves directive
import { parseTime } from "@/utils";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
import permission from "@/directive/permission/index.js";

export default {
  name: "TableAccount",
  components: { StatusTag, RadioOprations, NextOprations, Pagination },
  directives: { waves, permission },
  data() {
    return {
      list: [],
      Totals: {
        Rows: 0,
        Totals: 0,
        TotalCredit: 0,
        TotalDebit: 0
      },
      listLoading: false,
      listQuery: {
        Page: 1,
        Any: "",
        limit: this.$store.getters.settings.LimitQurey,
        Sort: "+id",
        User: undefined,

        Status: undefined
      },
      sortOptions: [
        { label: "Id Ascending", key: "+id" },
        { label: "Id Descending", key: "-id" }
      ],
      downloadLoading: false,
      TypeAccounts: [
        {
          label: "حساب",
          value: "Vendor"
        },
        {
          label: "خزينة كاش",
          value: "Cash"
        }
      ]
    };
  },
  created() {
    //   this.getdata();
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
          filename:
            window.location.pathname.split("/") +
            "-" +
            JSON.stringify(this.listQuery)
        });
        this.downloadLoading = false;
      });
    },
    formatJson(filterVal) {
      return this.list.map(v =>
        filterVal.map(j => {
          if (j === "InventoryMovements") {
            return JSON.stringify(v[j]);
          }
          if (j === "ActionLogs") {
            return JSON.stringify(v[j]);
          }
          if (j === "FakeDate") {
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
    }
  }
};
</script>
