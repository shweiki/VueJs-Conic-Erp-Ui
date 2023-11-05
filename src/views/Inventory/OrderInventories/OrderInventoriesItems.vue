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
        <Item-Search-Any
          @Set="
            (v) => {
              ItemName = v.Name;
              listQuery.ItemId = v.Id;
              handleFilter();
            }
          "
        />
        <el-tag>{{ ItemName }}</el-tag>
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
        <Export :list="list" />
        <el-button
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
      <el-col :span="6">
        <Radio-Oprations
          :value="listQuery.Status"
          tableName="OrderInventory"
          @Set="
            (v) => {
              listQuery.Status = v;
              handleFilter();
            }
          "
      /></el-col>
      <el-col v-permission="['admin']" :span="18">
        <el-divider direction="vertical"></el-divider>
        <span>عدد الطلبات</span>
        <el-divider direction="vertical"></el-divider>
        <span>{{ Totals.Rows }}</span>
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
        prop="OrderInventoryId"
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
                    path: '/OrderInventories/Edit/' + row.OrderInventoryId,
                  });
                  window.open(r.href, r.route.name, $store.getters.settings.windowStyle);
                }
              "
              >{{ row.OrderInventoryId }}</strong
            ></el-tag
          >
        </template>
      </el-table-column>
      <el-table-column v-bind:label="$t('Sales.Date')" width="150px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.FakeDate | parseTime("{y}-{m}-{d} {h}:{i}") }}</span>
        </template>
      </el-table-column>

      <el-table-column
        prop="OrderType"
        v-bind:label="$t('OrderInventories.OrderType')"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="Description"
        label="ملاحظات"
        align="center"
      ></el-table-column>

      <el-table-column v-bind:label="$t('Sales.Status')" width="120" align="center">
        <template slot-scope="scope">
          <Status-Tag :status="scope.row.Status" tableName="OrderInventory" />
        </template>
      </el-table-column>
      <el-table-column width="180" align="center">
        <template slot-scope="scope">
          <Next-Oprations
            :ObjId="scope.row.Id"
            :status="scope.row.Status"
            tableName="OrderInventory"
            @Done="handleFilter"
          />
          <Dialog-Action-Log tableName="OrderInventory" :ObjId="scope.row.Id" />
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
import Cookies from "js-cookie";
import { GetByItem } from "@/api/OrderInventory";
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
import ItemSearchAny from "@/components/Item/ItemSearchAny";
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
    DialogActionLog,
    ItemSearchAny,
    SortOptions,
    Export,
  },

  directives: { waves, permission },
  data() {
    return {
      list: [],
      ItemName: "",
      Totals: {
        Rows: 0,
        Totals: 0,
        Cash: 0,
        Receivables: 0,
        Visa: 0,
        Profit: 0,
        TotalCost: 0,
        Discount: 0,
      },
      listLoading: false,
      listQuery: JSON.parse(
        localStorage.getItem("OrderInventoriesItems_ListQuery") || null
      ) || {
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
      GetByItem(this.listQuery).then((response) => {
        this.list = response.items;
        this.Totals = response.Totals;
        localStorage.setItem(
          "OrderInventoriesItems_ListQuery",
          JSON.stringify(this.listQuery)
        );
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
    print(data) {
      data = data.map((Item) => ({
        Name: Item.Name,
        Qty: Item.Qty,
        SellingPrice: Item.SellingPrice,
        Total: (Item.SellingPrice * Item.Qty).toFixed(
          this.$store.getters.settings.ToFixed
        ),
      }));
      printJS({
        printable: data,
        properties: ["Name", "Qty", "SellingPrice", "Total"],
        type: "json",
      });
    },
  },
};
</script>
