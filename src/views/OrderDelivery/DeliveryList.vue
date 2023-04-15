<template>
  <div class="app-container">
    <div class="filter-container">
      <el-row type="flex">
        <el-col :span="4">
          <el-input v-model="listQuery.Any" placeholder="Search By Any Acount Name Or Id" class="filter-item"
            @keyup.enter.native="handleFilter" />
        </el-col>
        <el-col :span="8">
          <Search-By-Date :Value="[listQuery.DateFrom, listQuery.DateTo]" @Set="
            (v) => {
              listQuery.DateFrom = v[0];
              listQuery.DateTo = v[1];
              handleFilter();
            }
          " />
        </el-col>

        <el-col :span="3">
          <Sort-Options :Value="listQuery.Sort" @Set="
            (v) => {
              listQuery.Sort = v;
              handleFilter();
            }
          " />
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
          <Export :list="list" />
          <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
            Search
          </el-button>
        </el-col>
        <el-col :span="6">
          <el-switch style="direction: ltr" v-model="IsAuto" active-text="تلقائي" inactive-text="يدوي">
          </el-switch>
        </el-col>
      </el-row>
    </div>
    <el-row :gutter="20">
      <el-col :span="10" style="float: left">
        <div style="float: left">
          <Add-Order />
        </div>
      </el-col>
      <el-col :span="14">
        <Radio-Oprations              :value="listQuery.Status"
TableName="OrderDelivery" @Set="
          (v) => {
            listQuery.Status = v;
            handleFilter();
          }
        " />
      </el-col>
    </el-row>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%"
      @sort-change="sortChange">
      <el-table-column type="expand">
        <template slot-scope="props">
          <h3 style="float: right; padding-right: 20px">محتويات الطلب :</h3>
          <br />
          <h4 style="float: right; padding-top: 5px">{{ props.row.Content }}</h4>
        </template>
      </el-table-column>
      <el-table-column label="Id" prop="Id" sortable="custom" align="center" width="80" :class-name="getSortClass('id')">
        <template slot-scope="{ row }">
          <span>{{ row.Id }}</span>
        </template>
      </el-table-column>
      <el-table-column v-bind:label="$t('Sales.Date')" width="120px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.FakeDate | parseTime("{y}-{m}-{d} {h}:{i}") }}</span>
        </template>
      </el-table-column>
      <el-table-column align="right" label="معلومات الزبون">
        <el-table-column sortable prop="Name" v-bind:label="$t('AddVendors.Name')" align="center">
        </el-table-column>
        <el-table-column prop="PhoneNumber" v-bind:label="$t('MemberList.Phone')" width="100"
          align="center"></el-table-column>
        <el-table-column prop="Region" v-bind:label="$t('AddVendors.Region')" width="130"
          align="center"></el-table-column>
      </el-table-column>
      <el-table-column v-bind:label="$t('Area.TotalPill')" width="100" align="center">
        <template slot-scope="{ row }">
          {{ row.TotalPill.toFixed($store.getters.settings.ToFixed) }}
          JOD
        </template>
      </el-table-column>
      <el-table-column v-bind:label="$t('Area.DelievryPrice')" width="100" align="center">
        <template slot-scope="{ row }">
          {{ row.DeliveryPrice.toFixed($store.getters.settings.ToFixed) }}
          JOD
        </template>
      </el-table-column>
      <el-table-column v-bind:label="$t('CashPool.Amountv')" width="100" align="center">
        <template slot-scope="{ row }">
          {{ row.TotalPrice.toFixed($store.getters.settings.ToFixed) }}
          JOD
        </template>
      </el-table-column>
      <el-table-column v-bind:label="$t('Delivery.DriverName')" prop="Driver.Name" align="center">
      </el-table-column>
      <el-table-column v-bind:label="$t('Vendors.Description')" prop="Description" align="center">
      </el-table-column>
      <el-table-column v-bind:label="$t('Sales.Status')" width="120" align="center">
        <template slot-scope="scope">
          <Status-Tag :Status="scope.row.Status" TableName="OrderDelivery" />
        </template>
      </el-table-column>
      <el-table-column label="#" width="100" align="center">
        <template slot-scope="scope">
          <Dialog-Action-Log TableName="OrderDelivery" :ObjId="scope.row.Id" />
          <Drawer-Print Type="OrderDelivery" :Data="scope.row" />
          <Next-Oprations :ObjId="scope.row.Id" :Status="scope.row.Status" TableName="OrderDelivery" @Done="getList" />
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="Totals.Rows > 0" :total="Totals.Rows" :page.sync="listQuery.Page" :limit.sync="listQuery.limit"
      @pagination="getList" />
  </div>
</template>

<script>
import Cookies from 'js-cookie'
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
import AddOrder from "./components/AddOrder.vue";
import Export from "@/components/Export";

export default {
  components: {
    StatusTag,
    NextOprations,
    SearchByDate,
    DrawerPrint,
    Pagination,
    SortOptions,
    DialogActionLog,
    RadioOprations,
    AddOrder,
    Export,
  },
  directives: { waves },
  data() {
    return {
      list: [],
      Totals: { Rows: 0 },
      listLoading: false,
      listQuery: JSON.parse(localStorage.getItem('OrderDelivery_ListQuery') || null) || {
        Page: 1,
        Any: "",
        limit: this.$store.getters.settings.LimitQurey,
        Sort: "-id",
        User: undefined,
        DateFrom: "",
        DateTo: "",
        Status: undefined,
      },
    };
  },
  computed: {
    IsAuto: {
      get() {
        return this.$store.state.settings.OrderIsAutomatic;
      },
      set(val) {
        this.$store.dispatch("settings/changeSetting", {
          key: "OrderIsAutomatic",
          value: val,
        });
      },
    },
  },
  created() {
    // this.getList();
  },
  methods: {
    getList() {
      this.listLoading = true;
      GetByListQ(this.listQuery).then((response) => {
        this.list = response.items;
        this.Totals = response.Totals;
        localStorage.setItem('OrderDelivery_ListQuery', JSON.stringify(this.listQuery))

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
    getSortClass: function (key) {
      const sort = this.listQuery.sort;
      return sort === `+${key}` ? "ascending" : "descending";
    },
  },
};
</script>
