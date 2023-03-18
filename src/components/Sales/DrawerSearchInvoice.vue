<template>
  <div>
    <el-button
      type="primary"
      icon="el-icon-search"
      :size="$store.getters.size"
      @click="Open = true"
    ></el-button>

    <el-drawer direction="ttb" size="80%" :visible.sync="Open">
      <template slot="title">
        <el-row type="flex">
          <el-col :span="24">
            <ElTag type="success">بحث عن فاتورة</ElTag>
          </el-col>
        </el-row>
      </template>
      <el-row type="flex">
        <el-col :span="4">
          <el-input
            v-model="listQuery.Any"
            placeholder="Search By Any Acount Name Or Id"
            class="filter-item"
            @keyup.enter.native="handleFilter"
          />
        </el-col>
        <el-col :span="4">
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
      <el-table
        v-loading="listLoading"
        :data="list"
        border
        fit
        highlight-current-row
        style="width: 100%"
        @row-dblclick="
          (row) => {
            let r = $router.resolve({
              path: '/Sales/Edit/' + row.Id,
            });
            window.open(r.href, r.route.name, $store.getters.settings.windowStyle);
          }
        "
      >
        <el-table-column
          v-bind:label="$t('Vendors.ID')"
          prop="Id"
          sortable="custom"
          align="center"
          width="80"
        >
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
        <el-table-column
          prop="PaymentMethod"
          sortable
          v-bind:label="$t('CashPool.Pay')"
          width="150"
          align="center"
        ></el-table-column>
        <el-table-column
          v-bind:label="$t('CashPool.Discount')"
          width="120"
          align="center"
        >
          <template slot-scope="scope">{{
            scope.row.Discount.toFixed($store.getters.settings.ToFixed)
          }}</template>
        </el-table-column>
        <el-table-column
          v-bind:label="$t('table.type')"
          width="80"
          align="center"
          prop="Type"
        >
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
            <Drawer-Print Type="SaleInvoice" :Data="scope.row" />
          </template>
        </el-table-column>
      </el-table>
    </el-drawer>
  </div>
</template>

<script>

import DrawerPrint from "@/components/PrintRepot/DrawerPrint";
import StatusTag from "@/components/Oprationsys/StatusTag";
import { GetByAny } from "@/api/SaleInvoice";
import waves from "@/directive/waves"; // waves directive
import { parseTime } from "@/utils";
import permission from "@/directive/permission/index.js";

export default {
  components: { DrawerPrint, StatusTag },
  directives: { waves, permission },
  data() {
    return {
      list: [],
      listLoading: false,
      Open: false,
      listQuery: {
        Any: "",
        limit: this.$store.getters.settings.LimitQurey,
        Status: 0,
      },
    };
  },
  methods: {
    getList() {
      this.listLoading = true;

      GetByAny(this.listQuery).then((response) => {
        this.list = response;
        this.listLoading = false;
      });
    },
    handleFilter() {
      this.getList();
    },
  },
};
</script>
