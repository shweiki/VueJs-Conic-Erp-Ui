<template>
  <div class="app-container">
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
      <el-col :span="6">
        <Drawer-Print style="float: left" Type="CashPoolList" :Data="Data" />

        <el-button
          v-waves
          v-permission="['admin']"
          :loading="downloadLoading"
          class="filter-item"
          type="warning"
          icon="el-icon-download"
          @click="handleDownload"
        >
        </el-button
        ><el-button
          v-waves
          class="filter-item"
          type="primary"
          icon="el-icon-search"
          @click="handleFilter"
        >
        </el-button>
      </el-col>
    </el-row>
    <el-row type="flex">
      <el-col :span="24">
        <Radio-Oprations
          TableName="CashPool"
          @Set="
            (v) => {
              listQuery.Status = v;
            }
          "
      /></el-col>
    </el-row>
    <el-row type="flex">
      <el-col v-permission="['admin']" :span="24">
        <el-divider direction="vertical"></el-divider>
        <span>عدد الاغلاقات</span>
        <el-divider direction="vertical"></el-divider>
        <span>{{ Totals.Rows }}</span>
        <el-divider direction="vertical"></el-divider>

        <span>{{ $t("CashPool.Cash") }}</span>
        <el-divider direction="vertical"></el-divider>
        <span>{{ Totals.Cash.toFixed($store.getters.settings.ToFixed) }} JOD</span>
        <el-divider direction="vertical"></el-divider>

        <span> اجمالي عد المعدن</span>
        <el-divider direction="vertical"></el-divider>
        <span>{{ Totals.Coins.toFixed($store.getters.settings.ToFixed) }} JOD</span>
        <el-divider direction="vertical"></el-divider>

        <span>{{ $t("CashPool.Visa") }}</span>
        <el-divider direction="vertical"></el-divider>
        <span>{{ Totals.Visa.toFixed($store.getters.settings.ToFixed) }} JOD</span>
        <el-divider direction="vertical"></el-divider>

        <span>الملغي</span>
        <el-divider direction="vertical"></el-divider>
        <span>{{ Totals.Reject.toFixed($store.getters.settings.ToFixed) }} JOD</span>
        <el-divider direction="vertical"></el-divider>
        <span>السحوبات</span>
        <el-divider direction="vertical"></el-divider>
        <span>{{ Totals.Outlay.toFixed($store.getters.settings.ToFixed) }} JOD</span>
        <el-divider direction="vertical"></el-divider>
        <span>التعويضات</span>
        <el-divider direction="vertical"></el-divider>
        <span>{{ Totals.Restitution.toFixed($store.getters.settings.ToFixed) }} JOD</span>
        <el-divider direction="vertical"></el-divider>
        <span>{{ $t("CashPool.Amount") }}</span>
        <el-divider direction="vertical"></el-divider>
        <span
          >{{
            list.reduce((prev, cur) => {
              return prev + cur.Totals.Totals;
            }, 0)
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
      <el-table-column
        v-bind:label="$t('Vendors.ID')"
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
      <el-table-column v-bind:label="$t('Sales.Date')" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.DateTime | parseTime("{y}-{m}-{d} {h}:{i}") }}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-bind:label="$t('AddVendors.EditorName')"
        prop="EditorName"
        align="center"
      >
      </el-table-column>
      <el-table-column
        v-bind:label="$t('AddVendors.Description')"
        prop="Description"
        align="center"
      >
      </el-table-column>

      <el-table-column
        v-bind:label="$t('table.type')"
        width="100"
        align="center"
        prop="Type"
      >
        <template slot-scope="{ row }">
          <router-link
            v-if="row.Type == 'SaleInvoice'"
            :to="'/CashPool/Edit/SaleInvoice/' + row.Id"
          >
            <strong style="font-size: 10px; cursor: pointer">{{
              $t("CashPool." + row.Type)
            }}</strong>
          </router-link>
          <router-link
            v-if="row.Type == 'Payment'"
            :to="'/CashPool/Edit/Payment/' + row.Id"
          >
            <strong style="font-size: 10px; cursor: pointer">{{
              $t("CashPool." + row.Type)
            }}</strong>
          </router-link>
          <router-link v-if="row.Type == 'Visit'" :to="'/CashPool/Edit/Visit/' + row.Id">
            <strong style="font-size: 10px; cursor: pointer">{{
              $t("CashPool." + row.Type)
            }}</strong>
          </router-link>
        </template>
      </el-table-column>
      <el-table-column label="المطلوب" align="center">
        <template slot-scope="{ row }">
          {{ row.Totals.Totals }}
          JOD
        </template>
      </el-table-column>
      <el-table-column v-bind:label="$t('CashPool.TotalCash')" align="center">
        <template slot-scope="{ row }">
          {{ row.TotalCash.toFixed($store.getters.settings.ToFixed) }}
          JOD
        </template>
      </el-table-column>
      <el-table-column label="العد المعدن" align="center">
        <template slot-scope="{ row }">
          {{ row.TotalCoins.toFixed($store.getters.settings.ToFixed) }}
          JOD
        </template>
      </el-table-column>
      <el-table-column v-bind:label="$t('CashPool.TotalVisa')" align="center">
        <template slot-scope="{ row }">
          {{ row.TotalVisa.toFixed($store.getters.settings.ToFixed) }}
          JOD
        </template>
      </el-table-column>
      <el-table-column v-bind:label="$t('CashPool.TotalReject')" align="center">
        <template slot-scope="{ row }">
          {{ row.TotalReject.toFixed($store.getters.settings.ToFixed) }}
          JOD
        </template>
      </el-table-column>
      <el-table-column v-bind:label="$t('CashPool.TotalOutlay')" align="center">
        <template slot-scope="{ row }">
          {{ row.TotalOutlay.toFixed($store.getters.settings.ToFixed) }}
          JOD
        </template>
      </el-table-column>

      <el-table-column v-bind:label="$t('CashPool.TotalRestitution')" align="center">
        <template slot-scope="{ row }">
          {{ row.TotalRestitution.toFixed($store.getters.settings.ToFixed) }}
          JOD
        </template>
      </el-table-column>
      <el-table-column v-bind:label="$t('Sales.Status')" align="center">
        <template slot-scope="scope">
          <Status-Tag :Status="scope.row.Status" TableName="CashPool" />
        </template>
      </el-table-column>
      <el-table-column align="center">
        <template slot-scope="scope">
          <Next-Oprations
            :ObjId="scope.row.Id"
            :Status="scope.row.Status"
            TableName="CashPool"
            @Done="handleFilter"
          />
          <Drawer-Print Type="CashPool" :Data="scope.row" />
          <Dialog-Action-Log TableName="CashPool" :ObjId="scope.row.Id" />
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
import { GetByListQ } from "@/api/CashPool";
import { GetSaleInvoiceByListId } from "@/api/SaleInvoice";
import { GetPaymentByListId } from "@/api/Payment";
import { GetByListId as GetVisitByListId } from "@/api/Visit";

import NextOprations from "@/components/Oprationsys/NextOprations";
import SearchByDate from "@/components/Date/SearchByDate";
import StatusTag from "@/components/Oprationsys/StatusTag";
import DrawerPrint from "@/components/PrintRepot/DrawerPrint";
import UserSelect from "@/components/User/UserSelect";
import RadioOprations from "@/components/Oprationsys/RadioOprations";

import permission from "@/directive/permission/index.js";

import waves from "@/directive/waves"; // waves directive
import { parseTime } from "@/utils";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
import DialogActionLog from "@/components/ActionLog/DialogActionLog.vue";
import SortOptions from "@/components/SortOptions";

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
    DialogActionLog,
    SortOptions,
  },
  directives: { waves, permission },
  data() {
    return {
      Data: undefined,
      list: [],
      Totals: {
        Rows: 0,
        Totals: 0,
        Cash: 0,
        Coins: 0,
        Reject: 0,
        Visa: 0,
        Outlay: 0,
        Restitution: 0,
      },
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
      },
      downloadLoading: false,
    };
  },
  created() {
    // this.getList();
  },
  methods: {
    async getList() {
      this.listLoading = true;
      //    console.log("sdsad", this.listQuery);
      await GetByListQ(this.listQuery).then(async (response) => {
        this.Totals = response.Totals;
        await response.items.forEach(async (element) => {
          element.Totals = await this.GetListId(element);
        });

        this.list = await response.items;

        //console.log("sdsad", this.list);
        this.listLoading = false;
      });
    },
    GetListId(item) {
      return new Promise(async (resolve, reject) => {
        let total = 0;
        if (item.Type == "SaleInvoice") {
          await GetSaleInvoiceByListId({ listid: item.Fktable }).then((res) => {
            item.Totals = res.Totals;
            item.SaleInvoice = res.items;
            total = res.Totals;
            total.Totals = total.Totals.toFixed(this.$store.getters.settings.ToFixed);
            // console.log((item.Totals, res.Totals));
          });
        }
        if (item.Type == "Payment") {
          await GetPaymentByListId({ listid: item.Fktable }).then((res) => {
            item.Totals = res.Totals;
            item.Payment = res.items;
            total = res.Totals;
            total.Totals = total.Totals.toFixed(this.$store.getters.settings.ToFixed);
          });
        }
        if (item.Type == "Visit") {
          await GetVisitByListId({ listid: item.Fktable }).then((res) => {
            item.Totals = res.Totals;
            item.Visit = res.items;
            total = res.Totals;
            total.Totals = total.Totals.toFixed(this.$store.getters.settings.ToFixed);
          });
        }
        resolve(total);
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
      import("@/Report/Excel/Export2Excel").then((excel) => {
        const tHeader = Object.keys(this.list[0]);
        const filterVal = Object.keys(this.list[0]);
        const data = this.formatJson(filterVal);
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename:
            window.location.pathname.split("/") + "-" + JSON.stringify(this.listQuery),
        });
        this.downloadLoading = false;
      });
    },
    formatJson(filterVal) {
      return this.list.map((v) =>
        filterVal.map((j) => {
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
    getSortClass: function (key) {
      const sort = this.listQuery.sort;
      return sort === `+${key}` ? "ascending" : "descending";
    },
  },
};
</script>
