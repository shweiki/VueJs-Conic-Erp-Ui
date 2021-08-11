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
        <Item-Search-Any
          @Set="
            v => {
              ItemName = v.Name;
              listQuery.ItemId = v.Id;
              handleFilter();
            }
          "
        />
        <el-tag>{{ ItemName }}</el-tag>
      </el-col>
      <el-col :span="8">
        <Search-By-Date
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
          @click="
            SaleInvoicesList({
              Totals: Totals,
              Items: list,
              Dates: [listQuery.DateFrom, listQuery.DateTo]
            })
          "
        ></el-button>
        <el-button
          v-permission="['Admin']"
          v-waves
          class="filter-item"
          icon="el-icon-printer"
          type="info"
          @click="
            SaleInvoicesItemsMovements({
              Totals: Totals,
              Items: list,
              Dates: [listQuery.DateFrom, listQuery.DateTo]
            })
          "
        ></el-button>
        <el-button
          v-permission="['Admin']"
          v-waves
          class="filter-item"
          icon="el-icon-printer"
          type="success"
          @click="
            SaleInvoicesItemsIngredients({
              Totals: Totals,
              Items: list,
              Dates: [listQuery.DateFrom, listQuery.DateTo]
            })
          "
        ></el-button>
        <el-button
          v-waves
          v-permission="['Admin']"
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
      <el-col :span="6">
        <Radio-Oprations
          TableName="SalesInvoice"
          @Set="
            v => {
              listQuery.Status = v;
              handleFilter();
            }
          "
      /></el-col>
      <el-col v-permission="['Admin']" :span="18">
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

    <el-table
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%"
      @sort-change="sortChange"
      @row-dblclick="
        row => {
          let r = $router.resolve({
            path: '/Sales/Edit/' + row.SalesInvoiceId
          });
          window.open(
            r.href,
            r.route.name,
            $store.getters.settings.windowStyle
          );
        }
      "
    >
      <el-table-column
        v-bind:label="$t('Vendors.Id')"
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
        v-bind:label="$t('Sales.Date')"
        width="150px"
        align="center"
      >
        <template slot-scope="{ row }">
          <span>{{ row.FakeDate | parseTime("{y}-{m}-{d} {h}:{i}") }}</span>
        </template>
      </el-table-column>

      <el-table-column
        v-bind:label="$t('AddVendors.Name')"
        prop="Name"
        align="center"
      >
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
      <el-table-column
        v-bind:label="$t('CashPool.Amountv')"
        width="120"
        align="center"
      >
        <template slot-scope="{ row }">
          {{ row.Total.toFixed($store.getters.settings.ToFixed) }}
          JOD
        </template>
      </el-table-column>

      <el-table-column
        v-bind:label="$t('Sales.Status')"
        width="120"
        align="center"
      >
        <template slot-scope="scope">
          <Status-Tag :Status="scope.row.Status" TableName="SalesInvoice" />
        </template>
      </el-table-column>
      <el-table-column width="180" align="center">
        <template slot-scope="scope">
          <Next-Oprations
            :ObjId="scope.row.Id"
            :Status="scope.row.Status"
            TableName="SalesInvoice"
            @Done="handleFilter"
          />
          <Drawer-Print Type="SaleInvoice" :Data="scope.row" />
          <Dialog-Action-Log TableName="SalesInvoice" :ObjId="scope.row.Id" />
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
import { GetByItem } from "@/api/SaleInvoice";
import NextOprations from "@/components/Oprationsys/NextOprations";
import SearchByDate from "@/components/Date/SearchByDate";
import StatusTag from "@/components/Oprationsys/StatusTag";
import DrawerPrint from "@/components/PrintRepot/DrawerPrint";
import UserSelect from "@/components/User/UserSelect";
import RadioOprations from "@/components/Oprationsys/RadioOprations";
import {
  SaleInvoicesList,
  SaleInvoicesItemsMovements,
  SaleInvoicesItemsIngredients
} from "@/Report/SaleInvoice";
import permission from "@/directive/permission/index.js";

import waves from "@/directive/waves"; // waves directive
import { parseTime } from "@/utils";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
import DialogActionLog from "@/components/ActionLog/DialogActionLog.vue";
import ItemSearchAny from "@/components/Item/ItemSearchAny";

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
    ItemSearchAny
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
        Discount: 0
      },
      listLoading: false,
      listQuery: {
        ItemId: undefined,
        Page: 1,
        Any: "",
        limit: this.$store.getters.settings.LimitQurey,
        Sort: "-id",
        User: undefined,
        DateFrom: "",
        DateTo: "",
        Status: undefined
      },
      sortOptions: [
        { label: "Id Ascending", key: "+id" },
        { label: "Id Descending", key: "-id" }
      ],
      downloadLoading: false
    };
  },
  created() {
    // this.getList();
  },
  methods: {
    SaleInvoicesList,
    SaleInvoicesItemsMovements,
    SaleInvoicesItemsIngredients,
    getList() {
      this.listLoading = true;
      //    console.log("sdsad", this.listQuery);
      GetByItem(this.listQuery).then(response => {
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
    },
    print(data) {
      data = data.map(Item => ({
        Name: Item.Name,
        Qty: Item.Qty,
        SellingPrice: Item.SellingPrice,
        Total: (Item.SellingPrice * Item.Qty).toFixed(
          this.$store.getters.settings.ToFixed
        )
      }));
      printJS({
        printable: data,
        properties: ["Name", "Qty", "SellingPrice", "Total"],
        type: "json"
      });
    }
  }
};
</script>
