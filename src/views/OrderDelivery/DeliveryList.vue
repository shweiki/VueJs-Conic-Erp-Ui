<template>
  <div class="app-container">
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
        <el-col :span="6">
          <!-- <drawer-print
            style="float: left"
            Type="OrderDeliveryList"
            :Data="{
              Totals: Totals,
              Items: list,
              Dates: [listQuery.DateFrom, listQuery.DateTo],
            }"
          /> -->
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
      TableName="OrderDelivery"
      @Set="
        (v) => {
          listQuery.Status = v;
          handleFilter();
        }
      "
    />

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
        sortable
        prop="Name"
        v-bind:label="$t('AddVendors.Name')"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="PhoneNumber"
        v-bind:label="$t('MemberList.Phone')"
        width="120"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="Region"
        v-bind:label="$t('AddVendors.Region')"
        width="150"
        align="center"
      ></el-table-column>
      <el-table-column v-bind:label="$t('Sales.Date')" width="150px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.FakeDate | parseTime("{y}-{m}-{d} {h}:{i}") }}</span>
        </template>
      </el-table-column>
      <el-table-column v-bind:label="$t('CashPool.Amountv')" width="120" align="center">
        <template slot-scope="{ row }">
          {{ row.TotalPrice.toFixed($store.getters.settings.ToFixed) }}
          JOD
        </template>
      </el-table-column>
      <el-table-column v-bind:label="$t('Area.TotalPill')" width="120" align="center">
        <template slot-scope="{ row }">
          {{ row.TotalPill.toFixed($store.getters.settings.ToFixed) }}
          JOD
        </template>
      </el-table-column>
      <el-table-column v-bind:label="$t('Area.DelievryPrice')" width="120" align="center">
        <template slot-scope="{ row }">
          {{ row.DeliveryPrice.toFixed($store.getters.settings.ToFixed) }}
          JOD
        </template>
      </el-table-column>
      <el-table-column
        v-bind:label="$t('Vendors.Description')"
        prop="Description"
        align="center"
      >
      </el-table-column>
      <el-table-column
        v-bind:label="$t('Delivery.DriverName')"
        prop="Driver.Name"
        align="center"
      >
      </el-table-column>
      <el-table-column v-bind:label="$t('Sales.Status')" width="120" align="center">
        <template slot-scope="scope">
          <Status-Tag :Status="scope.row.Status" TableName="OrderDelivery" />
        </template>
      </el-table-column>
      <el-table-column width="180" align="center">
        <template slot-scope="scope">
          <Dialog-Action-Log TableName="OrderDelivery" :ObjId="scope.row.Id" />
          <Drawer-Print Type="OrderDelivery" :Data="scope.row" />
           <Next-Oprations
                :ObjId="scope.row.Id"
                :Status="scope.row.Status"
                TableName="OrderDelivery"
                @Done="getList"
            />
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
import { GetByListQ } from "@/api/OrderDelivery";
import NextOprations from "@/components/Oprationsys/NextOprations";
import SearchByDate from "@/components/Date/SearchByDate.vue";
import StatusTag from "@/components/Oprationsys/StatusTag";
import DrawerPrint from "@/components/PrintRepot/DrawerPrint";
import DialogActionLog from "@/components/ActionLog/DialogActionLog.vue";
import RadioOprations from "@/components/Oprationsys/RadioOprations";
import waves from "@/directive/waves"; // waves directive
import { parseTime } from "@/utils";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
import SortOptions from "@/components/SortOptions"; // secondary package based on el-pagination
export default {
  name: "ComplexTable",
  components: {
    StatusTag,
    NextOprations,
    SearchByDate,
    DrawerPrint,
    Pagination,
    SortOptions,
    DialogActionLog,
    RadioOprations,
  },
  directives: { waves },
  data() {
    return {
      list: [],
      Totals: { Rows: 0 },
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
    getSortClass: function (key) {
      const sort = this.listQuery.sort;
      return sort === `+${key}` ? "ascending" : "descending";
    },
  },
};
</script>
