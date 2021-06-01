<template>
  <div class="app-container">
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
      <el-col :span="8">
        <search-by-date
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
          v-permission="['Admin']"
          v-waves
          class="filter-item"
          icon="el-icon-printer"
          type="primary"
          @click="SaleInvoicesList({ Totals: Totals, Items: list })"
        ></el-button>
        <el-button
          v-waves
          v-permission="['Admin']"
          :loading="downloadLoading"
          class="filter-item"
          type="primary"
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
        <el-divider direction="vertical"></el-divider>
        <span>عدد الفواتير</span>
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

        <span>الاجل</span>
        <el-divider direction="vertical"></el-divider>
        <span
          >{{
            Totals.Receivables.toFixed($store.getters.settings.ToFixed)
          }}
          JOD</span
        >
        <el-divider direction="vertical"></el-divider>

        <span>{{ $t("CashPool.Amount") }}</span>
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
    <el-row type="flex">
      <el-col :span="9">
        <radio-oprations
          TableName="SalesInvoice"
          @Set="
            v => {
              listQuery.Status = v;
              handleFilter();
            }
          "
      /></el-col>
      <el-col :span="6"> </el-col>
      <el-col :span="9">
        <button-oprations
          :ArrObjIds="this.Selection.map(x => x.Id)"
          TableName="SalesInvoice"
        />
      </el-col>
    </el-row>
    <el-table
      v-loading="listLoading"
      :data="list"
      border
      ref="multipleTable"
      @selection-change="handleSelectionChange"
      style="width: 100%"
      @sort-change="sortChange"
      @row-dblclick="
        row => {
          $router.push({ path: `/Sales/Edit/${row.Id}` });
        }
      "
    >
      <el-table-column
        type="selection"
        width="50"
        align="center"
      ></el-table-column>
      <el-table-column
        label="ID"
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
      <el-table-column label="Name" prop="Name" align="center">
      </el-table-column>
      <el-table-column
        v-bind:label="$t('Sales.Date')"
        width="120px"
        align="center"
      >
        <template slot-scope="{ row }">
          <span>{{ row.FakeDate | parseTime("{y}-{m}-{d} {h}:{i}") }}</span>
        </template>
      </el-table-column>

      <el-table-column
        prop="PaymentMethod"
        sortable
        v-bind:label="$t('CashPool.Pay')"
        width="90"
        align="center"
      ></el-table-column>
      <el-table-column
        v-bind:label="$t('Type')"
        width="80"
        align="center"
        prop="Type"
      >
      </el-table-column>
      <el-table-column
        v-bind:label="$t('CashPool.Amountv')"
        width="100"
        align="center"
      >
        <template slot-scope="{ row }">
          {{ row.Total.toFixed($store.getters.settings.ToFixed) }}
          JOD
        </template>
      </el-table-column>

      <el-table-column
        v-bind:label="$t('Sales.Status')"
        width="110"
        align="center"
      >
        <template slot-scope="scope">
          <status-tag :Status="scope.row.Status" TableName="SalesInvoice" />
        </template>
      </el-table-column>
      <el-table-column label="اسم سائق" width="120" align="center">
        <template>
          <select-driver
            @SetDriver="
              v => {
                DriverDescription = v.toString();
              }
            "
          />
        </template>
      </el-table-column>
      <el-table-column width="120" align="center">
        <template slot-scope="scope">
          <next-oprations
            :ObjID="scope.row.Id"
            :Status="scope.row.Status"
            TableName="SalesInvoice"
            :Description="DriverDescription"
            @Done="handleFilter"
          />
        </template>
      </el-table-column>
      <el-table-column width="55" align="center">
        <template slot-scope="scope">
          <print-button Type="SaleInvoice" :Data="scope.row" />
          <dialog-action-log TableName="SalesInvoice" :ObjID="scope.row.Id" />
        </template>
      </el-table-column>
      <el-table-column type="expand" align="center">
        <template slot-scope="props">
          <el-table :data="props.row.InventoryMovements">
            <el-table-column
              prop="Name"
              v-bind:label="$t('CashPool.Items')"
              width="130"
              align="center"
            >
              <template slot-scope="scope">
                <h5>{{ scope.row.Name }}</h5>
                <h6>{{ scope.row.Description }}</h6>
              </template></el-table-column
            >
            <el-table-column
              prop="Qty"
              v-bind:label="$t('CashPool.quantity')"
              align="center"
            ></el-table-column>
            <el-table-column v-bind:label="$t('CashPool.Price')" align="center">
              <template slot-scope="scope">{{
                scope.row.SellingPrice.toFixed($store.getters.settings.ToFixed)
              }}</template>
            </el-table-column>
            <el-table-column v-bind:label="$t('CashPool.Total')" align="center">
              <template slot-scope="scope"
                >{{
                  (scope.row.SellingPrice * scope.row.Qty).toFixed(
                    $store.getters.settings.ToFixed
                  )
                }}
                JOD</template
              >
            </el-table-column>
          </el-table>
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
import { GetByListQ } from "@/api/SaleInvoice";
import NextOprations from "@/components/Oprationsys/NextOprations";
import SearchByDate from "@/components/Date/SearchByDate";
import StatusTag from "@/components/Oprationsys/StatusTag";
import PrintButton from "@/components/PrintRepot/PrintButton";
import UserSelect from "@/components/User/UserSelect";
import RadioOprations from "@/components/Oprationsys/RadioOprations";
import { SaleInvoicesList } from "@/Report/SaleInvoice";
import permission from "@/directive/permission/index.js";
import waves from "@/directive/waves"; // waves directive
import { parseTime } from "@/utils";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
import SelectDriver from "@/components/Drivers/SelectDriver.vue";
import ButtonOprations from "@/components/Oprationsys/ButtonOprations.vue";
import DialogActionLog from "@/components/ActionLog/DialogActionLog.vue";

export default {
  name: "ComplexTable",
  components: {
    StatusTag,
    NextOprations,
    SearchByDate,
    PrintButton,
    Pagination,
    UserSelect,
    RadioOprations,
    SelectDriver,
    ButtonOprations,
    DialogActionLog
  },
  directives: {
    waves,
    permission
  },
  data() {
    return {
      list: [],
      Selection: [],
      DriverDescription: "احمد",
      Totals: {
        Rows: 0,
        Totals: 0,
        Cash: 0,
        Receivables: 0,
        Visa: 0,
        Profit: 0,
        TotalCost: 0,
        Discount: 0
      },
      listLoading: false,
      listQuery: {
        Page: 1,
        Type: "Delivery",
        Any: "",
        limit: this.$store.getters.settings.LimitQurey,
        Sort: "+id",
        User: undefined,
        DateFrom: "",
        DateTo: "",
        Status: undefined
      },
      sortOptions: [
        { label: "ID Ascending", key: "+id" },
        { label: "ID Descending", key: "-id" }
      ],
      downloadLoading: false
    };
  },
  created() {
    // this.getList();
  },
  methods: {
    SaleInvoicesList,
    getList() {
      this.listLoading = true;
      //    console.log("sdsad", this.listQuery);
      GetByListQ(this.listQuery).then(response => {
        this.list = response.items;
        // this.Totals = response.Totals;
        this.listLoading = false;
      });
    },
    handleSelectionChange(val) {
      this.Selection = val;
      this.Totals.Rows = this.Selection.length;
      this.Totals.Receivables = this.Selection.reduce(
        (a, b) =>
          a +
          (b["PaymentMethod"] == "Receivables"
            ? b.InventoryMovements.reduce((prev, cur) => {
                return prev + cur.Qty * cur.SellingPrice;
              }, 0) - b.Discount
            : 0),
        0
      );
      this.Totals.Cash = this.Selection.reduce(
        (a, b) =>
          a +
          (b["PaymentMethod"] == "Cash"
            ? b.InventoryMovements.reduce((prev, cur) => {
                return prev + cur.Qty * cur.SellingPrice;
              }, 0) - b.Discount
            : 0),
        0
      );
      this.Totals.Visa = this.Selection.reduce(
        (a, b) =>
          a +
          (b["PaymentMethod"] == "Visa"
            ? b.InventoryMovements.reduce((prev, cur) => {
                return prev + cur.Qty * cur.SellingPrice;
              }, 0) - b.Discount
            : 0),
        0
      );
      this.Totals.TotalCost = this.Selection.reduce(
        (a, b) =>
          a +
          b.InventoryMovements.reduce((prev, cur) => {
            return prev + cur.CostPrice * cur.Qty;
          }, 0),
        0
      );

      this.Totals.Discount = this.Selection.reduce((a, b) => a + b.Discount, 0);
      this.Totals.Totals =
        this.Totals.Cash + this.Totals.Receivables + this.Totals.Visa;
    },
    handleFilter() {
      this.listQuery.Page = 1;
      this.getList();
    },
    sortChange(data) {
      const { prop, order } = data;
      if (prop === "id") {
        this.sortByID(order);
      }
    },
    sortByID(order) {
      if (order === "ascending") {
        this.listQuery.sort = "+id";
      } else {
        this.listQuery.sort = "-id";
      }
      this.handleFilter();
    },
    ChangeStatus(Status) {
      if (this.Selection.length > 0)
        ChangeArrObjStatus({
          ObjsId: this.Selection.map(x => x.Id),
          TableName: "MembershipMovementOrder",
          Status: Status,
          Description: "طلب تجميد او زيادة موافق عليه"
        }).then(response => {
          console.log(response);
          this.$notify({
            title: "تم ",
            message: "تم الإضافة بنجاح",
            type: "success",
            duration: 2000
          });
          this.$nextTick(() => {
            this.$router.replace({
              path: "/redirect" + this.$route.fullPath
            });
          });
        });
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
