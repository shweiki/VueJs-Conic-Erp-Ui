<!--
تاريخ البدء والانتهاء
+ القيمة المتفق عليها
القيمة الاجمالية = قيمة التكلفة
-->
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
          :value="[listQuery.DateFrom, listQuery.DateTo]"
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
          :value="listQuery.Sort"
          @Set="
            (v) => {
              listQuery.Sort = v;
              handleFilter();
            }
          "
        />
      </el-col>
      <el-col :span="6">
        <Export :list="list" />
        <el-button
          v-waves
          class="filter-item"
          type="primary"
          icon="el-icon-search"
          @click="handleFilter"
        >
          {{ $t("table.search") }}
        </el-button>
      </el-col>
    </el-row>
    <el-row type="flex">
      <el-col :span="18">
        <el-divider direction="vertical"></el-divider>
        <span>{{ $t("WorkShop.WSNumbers") }}</span>
        <el-divider direction="vertical"></el-divider>
        <span>{{ Totals.Rows }}</span>
        <el-divider direction="vertical"></el-divider>

        <span>{{ $t("CashPool.Cash") }}</span>
        <el-divider direction="vertical"></el-divider>
        <span>{{ Totals.Cash.toFixed($store.getters.settings.ToFixed) }} JOD</span>
        <el-divider direction="vertical"></el-divider>

        <span>{{ $t("CashPool.Visa") }}</span>
        <el-divider direction="vertical"></el-divider>
        <span>{{ Totals.Visa.toFixed($store.getters.settings.ToFixed) }} JOD</span>
        <el-divider direction="vertical"></el-divider>

        <span>الاجل</span>
        <el-divider direction="vertical"></el-divider>
        <span>{{ Totals.Receivables.toFixed($store.getters.settings.ToFixed) }} JOD</span>
        <el-divider direction="vertical"></el-divider>

        <span>{{ $t("CashPool.Amount") }}</span>
        <el-divider direction="vertical"></el-divider>
        <span>{{ Totals.Totals.toFixed($store.getters.settings.ToFixed) }} JOD</span>
        <el-divider direction="vertical"></el-divider
      ></el-col>
      <el-col :span="6">
        <Radio-Oprations
          :value="listQuery.Status"
          tableName="WorkShop"
          @Set="
            (v) => {
              listQuery.Status = v;
              handleFilter();
            }
          "
      /></el-col>
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
          <el-tag type="primary" disable-transitions>
            <strong
              style="font-size: 10px; cursor: pointer"
              @click="
                () => {
                  let r = $router.resolve({
                    path: '/WorkShop/Edit/' + row.Id,
                  });
                  window.open(r.href, r.route.name, $store.getters.settings.windowStyle);
                }
              "
              >{{ row.Id }}</strong
            ></el-tag
          >
        </template>
      </el-table-column>
      <el-table-column
        v-bind:label="$t('WorkShop.StartDate')"
        width="150px"
        align="center"
      >
        <template slot-scope="{ row }">
          <span>{{ row.FakeDate | parseTime("{y}-{m}-{d} {h}:{i}") }}</span>
        </template>
      </el-table-column>

      <el-table-column v-bind:label="$t('AddVendors.Name')" prop="Name" align="center">
      </el-table-column>

      <el-table-column v-bind:label="$t('WorkShop.EndDate')" width="150px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.DeliveryDate | parseTime("{y}-{m}-{d} {h}:{i}") }}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-bind:label="$t('CashPool.Pay')"
        width="120"
        align="center"
        prop="PaymentMethod"
      >
      </el-table-column>
      <el-table-column v-bind:label="$t('CashPool.Discount')" width="120" align="center">
        <template slot-scope="scope">{{
          scope.row.Discount.toFixed($store.getters.settings.ToFixed)
        }}</template>
      </el-table-column>
      <el-table-column v-bind:label="$t('WorkShop.Amount')" width="120" align="center">
        <template slot-scope="{ row }">
          {{ row.Total.toFixed($store.getters.settings.ToFixed) }}
          JOD
        </template>
      </el-table-column>
      <el-table-column v-bind:label="$t('WorkShop.TAmount')" width="120" align="center">
        <template slot-scope="{ row }">
          {{ row.TotalAmmount.toFixed($store.getters.settings.ToFixed) }}
          JOD
        </template>
      </el-table-column>

      <el-table-column v-bind:label="$t('Sales.Status')" width="120" align="center">
        <template slot-scope="scope">
          <Status-Tag :status="scope.row.Status" tableName="WorkShop" />
        </template>
      </el-table-column>
      <el-table-column width="100" align="center">
        <template slot-scope="scope">
          <Next-Oprations
            :ObjId="scope.row.Id"
            :status="scope.row.Status"
            tableName="WorkShop"
            @Done="handleFilter"
          />
          <Drawer-Print Type="WorkShop" :Data="scope.row" />
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
import { GetByListQ } from "@/api/WorkShop";
import NextOprations from "@/components/Oprationsys/NextOprations";
import SearchByDate from "@/components/Date/SearchByDate";
import StatusTag from "@/components/Oprationsys/StatusTag";
import DrawerPrint from "@/components/PrintRepot/DrawerPrint";
import UserSelect from "@/components/User/UserSelect";
import RadioOprations from "@/components/Oprationsys/RadioOprations";

import waves from "@/directive/waves"; // waves directive
import { parseTime } from "@/utils";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
import SortOptions from "@/components/SortOptions";
import Export from "@/components/Export";

export default {
  components: {
    StatusTag,
    NextOprations,
    SearchByDate,
    DrawerPrint,
    Pagination,
    UserSelect,
    RadioOprations,
    SortOptions,
    Export,
  },
  directives: { waves },
  data() {
    return {
      list: [],
      Totals: { Rows: 0, Totals: 0, Cash: 0, Receivables: 0, Visa: 0 },
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
    };
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
        this.listLoading = false;
      });
    },
    handleFilter() {
      this.listQuery.Page = 1;
      this.getList();
    },
    sortChange(data) {
      const { prop, order } = data;
      if (prop === "Id") {
        this.sortById(order);
      }
    },
    sortById(order) {
      if (order === "ascending") {
        this.listQuery.Sort = "+id";
      } else {
        this.listQuery.Sort = "-id";
      }
      this.handleFilter();
    },
    getSortClass: function (key) {
      const sort = this.listQuery.Sort;
      return sort === `+${key}` ? "ascending" : "descending";
    },
  },
};
</script>
