<template>
  <div class="app-container">
    <el-card class="box-card">
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
        TableName="Payment"
        @Set="
          v => {
            listQuery.Status = v;
            handleFilter();
          }
        "
      />
      <el-divider direction="vertical"></el-divider>
      <span>عدد مقبوضات</span>
      <el-divider direction="vertical"></el-divider>
      <span>{{ Totals.Rows }}</span>
      <el-divider direction="vertical"></el-divider>

      <span>{{ $t("CashPool.Cash") }}</span>
      <el-divider direction="vertical"></el-divider>
      <span
        >{{ Totals.Cash.toFixed($store.getters.settings.ToFixed) }} JOD</span
      >
      <el-divider direction="vertical"></el-divider>

      <span>{{ $t("CashPool.Visa") }}</span>
      <el-divider direction="vertical"></el-divider>
      <span
        >{{ Totals.Visa.toFixed($store.getters.settings.ToFixed) }} JOD</span
      >
      <el-divider direction="vertical"></el-divider>

      <span>شيكات</span>
      <el-divider direction="vertical"></el-divider>
      <span
        >{{ Totals.Cheque.toFixed($store.getters.settings.ToFixed) }} JOD</span
      >
      <el-divider direction="vertical"></el-divider>

      <span>{{ $t("CashPool.Amount") }}</span>
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

    <el-table
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%"
      @sort-change="sortChange"
      @row-dblclick="
        row => {
          $router.push({ path: `/Sales/Edit/${row.Id}` });
        }
      "
    >
      <el-table-column
        label="Id"
        prop="Id"
        sortable="custom"
        align="center"
        width="80"
        :class-name="getSortClass('id')"
      >
        <template slot-scope="{ row }">
          <span>{{ row.Id }}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-bind:label="$t('Sales.Date')"
        width="150px"
        align="center"
      >
        <template slot-scope="{ row }">
          <span>{{ row.FakeDate | parseTime("{y}-{m}-{d} {h}:{i}") }}</span>
        </template>
      </el-table-column>

      <el-table-column
        prop="MemberId"
        label="رقم المشترك"
        align="center"
      ></el-table-column>

      <el-table-column prop="Name" label="المشترك" align="center">
        <template slot-scope="scope">
          <router-link :to="'/Gym/Edit/' + scope.row.accountId">
            <strong style="font-size: 10px; cursor: pointer">{{
              scope.row.Name
            }}</strong>
          </router-link>
        </template>
      </el-table-column>
      <el-table-column
        prop="PaymentMethod"
        sortable
        v-bind:label="$t('CashPool.Pay')"
        width="150"
        align="center"
      ></el-table-column>
      <el-table-column label="المحرر" prop="EditorName" align="center">
      </el-table-column>

      <el-table-column
        v-bind:label="$t('CashPool.Amountv')"
        width="120"
        align="center"
      >
        <template slot-scope="{ row }">
          {{ row.TotalAmmount.toFixed($store.getters.settings.ToFixed) }}
          JOD
        </template>
      </el-table-column>

      <el-table-column
        v-bind:label="$t('Sales.Status')"
        width="120"
        align="center"
      >
        <template slot-scope="scope">
          <Status-Tag :Status="scope.row.Status" TableName="Payment" />
        </template>
      </el-table-column>
      <el-table-column width="180" align="center">
        <template slot-scope="scope">
          <Next-Oprations
            :ObjId="scope.row.Id"
            :Status="scope.row.Status"
            TableName="Payment"
            @Done="handleFilter"
          />
          <Dialog-Action-Log TableName="Payment" :ObjId="scope.row.Id" />
          <Drawer-Print Type="Payment" :Data="scope.row" />
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
import { GetByListQ } from "@/api/Payment";
import NextOprations from "@/components/Oprationsys/NextOprations";
import SearchByDate from "@/components/Date/SearchByDate";
import StatusTag from "@/components/Oprationsys/StatusTag";
import DrawerPrint from "@/components/PrintRepot/DrawerPrint";
import UserSelect from "@/components/User/UserSelect.vue";
import RadioOprations from "@/components/Oprationsys/RadioOprations";
import DialogActionLog from "@/components/ActionLog/DialogActionLog.vue";

import waves from "@/directive/waves"; // waves directive
import { parseTime } from "@/utils";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination

export default {
  name: "ComplexTable",
  components: {
    StatusTag,
    NextOprations,
    SearchByDate,
    DrawerPrint,
    Pagination,
    UserSelect,
    RadioOprations,
    DialogActionLog
  },
  directives: { waves },
  data() {
    return {
      list: [],
      Totals: { Rows: 0, Totals: 0, Cash: 0, Cheque: 0, Visa: 0 },
      listLoading: false,
      listQuery: {
        Page: 1,
        Any: "",
        limit: this.$store.getters.settings.LimitQurey,
        Sort: "-id",
        User: undefined,
        DateFrom: "",
        DateTo: "",
        Status: undefined
      },
      sortOptions: [
        { label: "Id Ascending", key: "+id" },
        { label: "Id Descending", key: "-id" }
      ],
      downloadLoading: false
    };
  },
  created() {
    // this.getList();
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
        properties: [
          "Id",
          "AccountId",
          "Name",
          "FakeDate",
          "PaymentMethod",
          "TotalAmmount"
        ],
        type: "json",
        header:
          "<center> <h2> مقبوضات</h2></center><h3 style='float:right'> الاجمالي النقدي " +
          this.Totals.Cash.toFixed(this.$store.getters.settings.ToFixed) +
          " - الاجمالي الفيزا : " +
          this.Totals.Visa.toFixed(this.$store.getters.settings.ToFixed) +
          " - الاجمالي الشيكات : " +
          this.Totals.Cheque.toFixed(this.$store.getters.settings.ToFixed) +
          " - الاجمالي :  " +
          this.Totals.Totals.toFixed(this.$store.getters.settings.ToFixed) +
          "</h3><h3 style='float:right'>  الفترة  : " +
          this.formatDate(this.listQuery.DateFrom) +
          " - " +
          this.formatDate(this.listQuery.DateTo) +
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
