<template>
  <div class="app-container">
    <el-row type="flex">
      <el-col :span="4">
        <el-input v-model="listQuery.Any" placeholder="Search By Any Acount Name Or Id" class="filter-item"
          @keyup.enter.native="handleFilter" />
      </el-col>
      <el-col :span="8">
        <Search-By-Date v-permission="['admin']" :Value="[listQuery.DateFrom, listQuery.DateTo]" @Set="
  (v) => {
    listQuery.DateFrom = v[0];
    listQuery.DateTo = v[1];
    handleFilter();
  }
" />
      </el-col>
      <el-col :span="3">
        <user-select v-permission="['admin']" @Set="
  (v) => {
    listQuery.User = v;
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
        <Drawer-Print v-permission="['admin']" style="float: left" Type="ItemsSales" :Data="{
  Totals: Totals,
  Items() {
    var res = [];
    for (var i = 0; i < list.length; i++) {
      list[i].InventoryMovements.map((m) => {
        var find = res.findIndex((value) => value.Name == m.Name);
        if (find != -1) res[find].TotalCount += m.Qty;
        else {
          res.push({
            Name: m.Name,
            TotalCount: m.Qty,
            AvgPrice: m.SellingPrice.toFixed($store.getters.settings.ToFixed),
            CostPrice: m.CostPrice,
            Ingredients: JSON.parse(m.Ingredients) || [],
          });
        }
      });
    }
    return res;
  },
  Dates: [listQuery.DateFrom, listQuery.DateTo],
}" />

        <Drawer-Print v-permission="['admin']" style="float: left" Type="ItemsIngredients" :Data="{
  Items() {
    var res = [];
    var res2 = [];
    for (var i = 0; i < list.length; i++) {
      list[i].InventoryMovements.map((m) => {
        var find = res.findIndex((value) => value.Name == m.Name);
        if (find != -1) res[find].TotalCount += m.Qty;
        else {
          res.push({
            Name: m.Name,
            TotalCount: m.Qty,
            AvgPrice: m.SellingPrice.toFixed($store.getters.settings.ToFixed),
            CostPrice: m.CostPrice,
            Ingredients: JSON.parse(m.Ingredients) || [],
          });
        }
      });
    }
    for (var i = 0; i < res.length; i++) {
      res[i].Ingredients.map((m) => {
        var find = res2.findIndex((value) => value.Name == m.Name);
        if (find != -1) res2[find].TotalCount += res[i].TotalCount * m.Qty;
        else {
          res2.push({
            Name: m.Name,
            TotalCount: res[i].TotalCount * m.Qty,
          });
        }
      });
    }
    return res2;
  },
  Dates: [listQuery.DateFrom, listQuery.DateTo],
}" />
        <Drawer-Print v-permission="['admin']" style="float: left" Type="SaleInvoicesList" :Data="{
  Totals: Totals,
  Items: list,
  Dates: [listQuery.DateFrom, listQuery.DateTo],
}" />
        <Export :list="list" Type="SaleInvoicesList" />
        <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        </el-button>
      </el-col>
    </el-row>

    <el-col :span="24">
      <Radio-Oprations TableName="SalesInvoice" @Set="
  (v) => {
    listQuery.Status = v;
    handleFilter();
  }
" /></el-col> <el-row type="flex">

      <el-col v-permission="['admin']" :span="24">
        <el-divider direction="vertical"></el-divider>
        <span>عدد الفواتير</span>
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
        <span>الخصم</span>
        <el-divider direction="vertical"></el-divider>
        <span>{{ Totals.Discount.toFixed($store.getters.settings.ToFixed) }} JOD</span>
        <el-divider direction="vertical"></el-divider>
        <span>{{ $t("CashPool.Amount") }}</span>
        <el-divider direction="vertical"></el-divider>
        <span>{{ Totals.Totals.toFixed($store.getters.settings.ToFixed) }} JOD</span>
        <el-divider direction="vertical"></el-divider>
      </el-col>
    </el-row>

    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%"
      @sort-change="sortChange" @row-dblclick="
  (row) => {
    let r = $router.resolve({
      path: '/Sales/Edit/' + row.Id,
    });
    window.open(r.href, r.route.name, $store.getters.settings.windowStyle);
  }
">
      <el-table-column v-bind:label="$t('Vendors.ID')" prop="Id" sortable="custom" align="center" width="80"
        :class-name="getSortClass('id')">
        <template slot-scope="{ row }">
          <span>{{ row.Id }}</span>
        </template>
      </el-table-column>
      <el-table-column v-bind:label="$t('Sales.Date')" width="150px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.FakeDate | parseTime("{y}-{m}-{d} {h}:{i}") }}</span>
        </template>
      </el-table-column>
      <el-table-column v-bind:label="$t('AddVendors.Name')" prop="Name" align="center">
      </el-table-column>
      <el-table-column prop="PaymentMethod" sortable v-bind:label="$t('CashPool.Pay')" width="150"
        align="center"></el-table-column>
      <el-table-column v-bind:label="$t('CashPool.Discount')" width="120" align="center">
        <template slot-scope="scope">{{
    scope.row.Discount.toFixed($store.getters.settings.ToFixed)
}}</template>
      </el-table-column>
      <el-table-column v-bind:label="$t('NewPurchaseInvoice.Tax')" width="120" align="center">
        <template slot-scope="scope">{{
    scope.row.Tax.toFixed($store.getters.settings.ToFixed)
}}</template>
      </el-table-column>
      <el-table-column v-bind:label="$t('CashPool.Amountv')" width="120" align="center">
        <template slot-scope="{ row }">
          {{ row.Total.toFixed($store.getters.settings.ToFixed) }}
          JOD
        </template>
      </el-table-column>
      <el-table-column v-bind:label="$t('Sales.Status')" width="120" align="center">
        <template slot-scope="scope">
          <Status-Tag :Status="scope.row.Status" TableName="SalesInvoice" />
        </template>
      </el-table-column>
      <el-table-column width="180" align="center">
        <template slot-scope="scope">
          <Next-Oprations :ObjId="scope.row.Id" :Status="scope.row.Status" TableName="SalesInvoice"
            @Done="handleFilter" />
          <Drawer-Print Type="SaleInvoice" :Data="scope.row" />
          <Dialog-Action-Log TableName="SalesInvoice" :ObjId="scope.row.Id" />
        </template>
      </el-table-column>
      <el-table-column type="expand" align="center">
        <template slot-scope="props">
          <el-table :data="props.row.InventoryMovements">
            <el-table-column prop="Name" v-bind:label="$t('CashPool.Items')" width="130"
              align="center"></el-table-column>
            <el-table-column prop="Qty" v-bind:label="$t('CashPool.quantity')" align="center"></el-table-column>
            <el-table-column v-bind:label="$t('CashPool.Price')" align="center">
              <template slot-scope="scope">{{
    scope.row.SellingPrice.toFixed($store.getters.settings.ToFixed)
}}</template>
            </el-table-column>
            <el-table-column v-bind:label="$t('CashPool.Total')" align="center">
              <template slot-scope="scope">{{
    (scope.row.SellingPrice * scope.row.Qty).toFixed(
      $store.getters.settings.ToFixed
    )
}}
                JOD</template>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="Totals.Rows > 0" :total="Totals.Rows" :page.sync="listQuery.Page" :limit.sync="listQuery.limit"
      @pagination="getList" />
  </div>
</template>

<script>
import Cookies from 'js-cookie'
import { GetByListQ } from "@/api/SaleInvoice";
import NextOprations from "@/components/Oprationsys/NextOprations";
import SearchByDate from "@/components/Date/SearchByDate";
import StatusTag from "@/components/Oprationsys/StatusTag";
import DrawerPrint from "@/components/PrintRepot/DrawerPrint.vue";
import UserSelect from "@/components/User/UserSelect";
import RadioOprations from "@/components/Oprationsys/RadioOprations";
import permission from "@/directive/permission/index.js";

import waves from "@/directive/waves"; // waves directive
import { parseTime } from "@/utils";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
import DialogActionLog from "@/components/ActionLog/DialogActionLog.vue";
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
    SortOptions,
    Export,
  },
  directives: { waves, permission },
  data() {
    return {
      list: [],
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
      listQuery: JSON.parse(Cookies.get('SaleInvoice_ListQuery') || null) || {
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
        Cookies.set('SaleInvoice_ListQuery', JSON.stringify(this.listQuery))
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
