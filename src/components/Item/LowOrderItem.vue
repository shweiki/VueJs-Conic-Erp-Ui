<template>
  <div class="app-container">
    <div class="filter-container">
      <el-row type="flex">
        <el-col :span="12">
          <el-input
            v-model="listQuery.Any"
            v-bind:placeholder="$t('MinOrd.SBy')"
            class="filter-item"
            @keyup.enter.native="handleFilter"
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
          <Export :list="list" /><el-button
            v-waves
            class="filter-item"
            type="primary"
            icon="el-icon-search"
            @click="handleFilter"
          >
            {{ $t("table.search") }}
        </el-button>
        </el-col>
        <el-col :span="3">
          <el-button @click="CalculateCostPrice">CalculateCostPrice</el-button>
          <add-item
        /></el-col>
      </el-row>
    </div>
    <Radio-Oprations
      :value="listQuery.Status"
      tableName="Item"
      @Set="
        (v) => {
          listQuery.Status = v;
          handleFilter();
        }
      "
    />
    <el-divider direction="vertical"></el-divider>
    <span>{{ $t("MinOrd.Qty") }} </span>
    <el-divider direction="vertical"></el-divider>
    <span>{{ Totals.Rows }}</span>
    <el-divider direction="vertical"></el-divider>

    <span>{{ $t("MinOrd.TotalIn") }}</span>
    <el-divider direction="vertical"></el-divider>
    <span>{{ Totals.TotalIn.toFixed($store.getters.settings.ToFixed) }} </span>
    <el-divider direction="vertical"></el-divider>

    <span>{{ $t("MinOrd.TotalOut") }}</span>
    <el-divider direction="vertical"></el-divider>
    <span>{{ Totals.TotalOut.toFixed($store.getters.settings.ToFixed) }} </span>
    <el-divider direction="vertical"></el-divider>

    <span>{{ $t("MinOrd.Balance") }}</span>
    <el-divider direction="vertical"></el-divider>
    <span>{{ Totals.Totals.toFixed($store.getters.settings.ToFixed) }} </span>
    <el-divider direction="vertical"></el-divider>

    <el-table
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%"
      @sort-change="sortChange"
      ref="multipleTable"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center"></el-table-column>
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
                    path: '/Item/Edit/' + row.Id,
                  });
                  window.open(r.href, r.route.name, $store.getters.settings.windowStyle);
                }
              "
              >{{ row.Id }}</strong
            ></el-tag
          >
        </template>
      </el-table-column>

      <el-table-column label="Name" prop="Name" align="center"> </el-table-column>
      <el-table-column
        v-bind:label="$t('Items.Barcode')"
        prop="Barcode"
        width="120"
        align="center"
      ></el-table-column>
      <el-table-column
        v-bind:label="$t('Items.QuantityInventory')"
        align="center"
        width="120"
      >
        <template slot-scope="scope">
          <item-qty :ItemId="scope.row.Id" />
        </template>
      </el-table-column>
      <el-table-column v-bind:label="$t('Items.MenuItem')" align="center" width="120">
        <template slot-scope="scope">
          <el-tag
            v-for="item of Array.from((scope.row.MenuItem || '').split(','))"
            :key="item"
          >
            {{ item }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column v-bind:label="$t('Sales.Status')" width="120" align="center">
        <template slot-scope="scope">
          <Status-Tag :status="scope.row.Status" tableName="Item" />
        </template>
      </el-table-column>
      <el-table-column width="180" align="center">
        <template slot-scope="scope">
          <el-col :span="8">
            <Next-Oprations
              :ObjId="scope.row.Id"
              :status="scope.row.Status"
              tableName="Item"
              @Done="handleFilter"
          /></el-col>
          <el-col :span="8"> <edit-item :ItemId="scope.row.Id" /> </el-col>
          <el-col :span="8">
            <Drawer-Print Type="Item" :Data="scope.row" />
          </el-col>
        </template>
      </el-table-column>
      <el-table-column type="expand" width="30">
        <template slot-scope="props">
          <el-table :data="[props.row]">
            <el-table-column v-bind:label="$t('Items.Cost')" align="center">
              <template slot-scope="scope">
                <i class="el-icon-money"></i>
                {{ scope.row.CostPrice.toFixed($store.getters.settings.ToFixed) }}
              </template>
            </el-table-column>
            <el-table-column v-bind:label="$t('Items.Packeges')" align="center">
              <template slot-scope="scope">
                <i class="el-icon-money"></i>
                {{ scope.row.OtherPrice.toFixed($store.getters.settings.ToFixed) }}
              </template>
            </el-table-column>
            <el-table-column v-bind:label="$t('Items.Retail')" align="center">
              <template slot-scope="scope">
                <i class="el-icon-money"></i>
                {{ scope.row.SellingPrice.toFixed($store.getters.settings.ToFixed) }}
              </template>
            </el-table-column>
            <el-table-column
              v-bind:label="$t('Items.LowerOrder')"
              prop="LowOrder"
              width="110"
              align="center"
            ></el-table-column>
            <el-table-column
              v-bind:label="$t('Items.Tax')"
              prop="Tax"
              width="100"
              align="center"
            ></el-table-column>
            <el-table-column
              v-bind:label="$t('Items.Rate')"
              prop="Rate"
              width="100"
              align="center"
            ></el-table-column>
            <el-table-column
              v-bind:label="$t('Items.Notes')"
              prop="Description"
              width="150"
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
import { GetLowOrder, CalculateCostPrice } from "@/api/Item";
import NextOprations from "@/components/Oprationsys/NextOprations";
import StatusTag from "@/components/Oprationsys/StatusTag";
import DrawerPrint from "@/components/PrintRepot/DrawerPrint.vue";
import RadioOprations from "@/components/Oprationsys/RadioOprations";
import ItemQty from "@/components/Item/ItemQty.vue";
import EditItem from "@/components/Item/EditItem.vue";
import AddItem from "@/components/Item/AddItem.vue";

import waves from "@/directive/waves"; // waves directive
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
import SortOptions from "@/components/SortOptions";
import Export from "@/components/Export";

export default {
  components: {
    StatusTag,
    NextOprations,
    DrawerPrint,
    Pagination,
    RadioOprations,
    ItemQty,
    EditItem,
    AddItem,
    SortOptions,
    Export,
  },
  directives: { waves },
  data() {
    return {
      list: [],
      Totals: { Rows: 0, Totals: 0, TotalIn: 0, TotalOut: 0 },
      listLoading: false,
      Selection: [],
      listQuery: JSON.parse(localStorage.getItem("LowOrderItem_ListQuery") || null) || {
        Page: 1,
        Any: "",
        limit: this.$store.getters.settings.LimitQurey,
        Sort: "-id",
        Status: undefined,
      },
    };
  },
  created() {
    // this.getList();
  },
  methods: {
    CalculateCostPrice,

    getList() {
      this.listLoading = true;

      GetLowOrder(this.listQuery).then((response) => {
        this.list = response.items;
        this.Totals = response.Totals;
        localStorage.setItem("LowOrderItem_ListQuery", JSON.stringify(this.listQuery));

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
    handleSelectionChange(val) {
      this.Selection = val;
    },
  },
};
</script>
