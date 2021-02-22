<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.Any"
        placeholder="Search By Any Acount Name Or Id"
        style="width: 200px"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <search-by-date
        :Value="[listQuery.DateFrom, listQuery.DateTo]"
        @Set="
          (v) => {
            listQuery.DateFrom = v[0];
            listQuery.DateTo = v[1];
          }
        "
      />
      <el-select
        v-model="listQuery.User"
        placeholder="Type"
        clearable
        class="filter-item"
        style="width: 130px"
      >
        <el-option
          v-for="item in calendarTypeOptions"
          :key="item.key"
          :label="item.display_name + '(' + item.key + ')'"
          :value="item.key"
        />
      </el-select>
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
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >
        Search
      </el-button>
      <el-button
        v-waves
        :loading="downloadLoading"
        class="filter-item"
        type="primary"
        icon="el-icon-download"
        @click="handleDownload"
      >
        Export
      </el-button>
    </div>

    <el-table
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%"
      @sort-change="sortChange"
      @row-dblclick="
        (row) => {
          $router.replace({
            path: '/Sales/Edit/' + row.Id,
          });
        }
      "
    >
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
      <el-table-column label="Date" width="150px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.FakeDate | parseTime("{y}-{m}-{d} {h}:{i}") }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="FakeDate"
        v-bind:label="$t('Sales.Date')"
        width="120"
        align="center"
      ></el-table-column>
      <el-table-column prop="Name" align="center"> </el-table-column>
      <el-table-column
        prop="PaymentMethod"
        sortable
        v-bind:label="$t('CashPool.Pay')"
        width="150"
        align="center"
      ></el-table-column>
      <el-table-column v-bind:label="$t('CashPool.Discount')" width="120" align="center">
        <template slot-scope="scope">{{ scope.row.Discount.toFixed(3) }}</template>
      </el-table-column>
      <el-table-column v-bind:label="$t('CashPool.Amountv')" width="120" align="center">
        <template slot-scope="scope">
          {{
            scope.row.InventoryMovements.reduce(function (prev, cur) {
              return prev + cur.Qty * cur.SellingPrice;
            }, 0)
          }}
          JOD
        </template>
      </el-table-column>

      <el-table-column v-bind:label="$t('Sales.Status')" width="120" align="center">
        <template slot-scope="scope">
          <status-tag :Status="scope.row.Status" TableName="SalesInvoice" />
        </template>
      </el-table-column>
      <el-table-column width="180" align="center">
        <template slot-scope="scope">
          <next-oprations
            :ObjID="scope.row.Id"
            :Status="scope.row.Status"
            TableName="SalesInvoice"
          />
          <print-button Type="SaleInvoice" :Data="scope.row" />
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
            ></el-table-column>
            <el-table-column
              prop="Qty"
              v-bind:label="$t('CashPool.quantity')"
              align="center"
            ></el-table-column>
            <el-table-column v-bind:label="$t('CashPool.Price')" align="center">
              <template slot-scope="scope">{{
                scope.row.SellingPrice.toFixed(3)
              }}</template>
            </el-table-column>
            <el-table-column v-bind:label="$t('CashPool.Total')" align="center">
              <template slot-scope="scope"
                >{{ (scope.row.SellingPrice * scope.row.Qty).toFixed(3) }} JOD</template
              >
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.Page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />

    <el-dialog :visible.sync="dialogPvVisible" title="Reading statistics">
      <el-table :data="pvData" border fit highlight-current-row style="width: 100%">
        <el-table-column prop="key" label="Channel" />
        <el-table-column prop="pv" label="Pv" />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false">Confirm</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { GetByListQ } from "@/api/SaleInvoice";
import NextOprations from "@/components/Oprationsys/NextOprations";
import SearchByDate from "@/components/Date/SearchByDate";
import StatusTag from "@/components/Oprationsys/StatusTag";
import PrintButton from "@/components/PrintRepot/PrintButton";

import waves from "@/directive/waves"; // waves directive
import { parseTime } from "@/utils";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination

const calendarTypeOptions = [
  { key: "CN", display_name: "China" },
  { key: "US", display_name: "USA" },
  { key: "JP", display_name: "Japan" },
  { key: "EU", display_name: "Eurozone" },
];

// arr to obj, such as { CN : "China", US : "USA" }
const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name;
  return acc;
}, {});

export default {
  name: "ComplexTable",
  components: {
    StatusTag,
    NextOprations,
    SearchByDate,
    PrintButton,
    Pagination,
  },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: "success",
        draft: "info",
        deleted: "danger",
      };
      return statusMap[status];
    },
    typeFilter(type) {
      return calendarTypeKeyValue[type];
    },
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: false,
      date: [],
      listQuery: {
        Page: 1,
        Any: "",
        limit: 10,
        Sort: "+id",
        User: "Developer",
        DateFrom: "",
        DateTo: "",
      },
      calendarTypeOptions,
      sortOptions: [
        { label: "ID Ascending", key: "+id" },
        { label: "ID Descending", key: "-id" },
      ],
      statusOptions: ["published", "draft", "deleted"],
      dialogPvVisible: false,
      pvData: [],

      downloadLoading: false,
    };
  },
  created() {
    // this.getList();
  },
  methods: {
    getList() {
      this.listLoading = true;
      console.log("sdsad", this.listQuery);
      GetByListQ(this.listQuery).then((response) => {
        this.list = response.items;
        this.total = response.total;
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
    handleFetchPv(pv) {
      console.log("PV", pv);
      /*  fetchPv(pv).then((response) => {
        this.pvData = response.data.pvData;
        this.dialogPvVisible = true;
      });*/
    },
    handleDownload() {
      this.downloadLoading = true;
      import("@/Report/Excel/Export2Excel").then((excel) => {
        const tHeader = ["timestamp", "title", "type", "importance", "status"];
        const filterVal = ["timestamp", "title", "type", "importance", "status"];
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
  },
};
</script>
