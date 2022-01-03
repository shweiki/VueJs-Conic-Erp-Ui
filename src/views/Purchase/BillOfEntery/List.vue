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
        <el-col :span="3">
          <Drawer-Print
            Type="BillOfEnteryList"
            :Data="{
              Items: list,
              Dates: [listQuery.DateFrom, listQuery.DateTo],
              Totals: Totals,
            }"
          />
        </el-col>
        <el-button
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
    <el-row type="flex">
      <el-col :span="18">
        <el-divider direction="vertical"></el-divider>
        <span>عدد </span>
        <el-divider direction="vertical"></el-divider>
        <span>{{ Totals.Rows }}</span>
        <el-divider direction="vertical"></el-divider>
      </el-col>
      <el-col :span="6">
        <Radio-Oprations
          TableName="BillOfEntery"
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
      default-expand-all
    >
      <el-table-column label="Id" prop="Id" sortable="custom" align="center" width="80">
        <template slot-scope="{ row }">
          <span>{{ row.Id }}</span>
        </template>
      </el-table-column>
      <el-table-column v-bind:label="$t('Sales.Date')" width="150px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.FakeDate | parseTime("{y}-{m}-{d} {h}:{i}") }}</span>
        </template>
      </el-table-column>

      <el-table-column v-bind:label="$t('AddVendors.BonId')" prop="BonId" align="center">
      </el-table-column>
      <el-table-column
        label="رقم فاتورة شراء"
        prop="PurchaseInvoiceId"
        align="center"
        width="80"
      >
        <template slot-scope="{ row }">
          <router-link :to="'/Purchase/Edit/' + row.PurchaseInvoiceId">
            <strong style="font-size: 10px; cursor: pointer">{{
              row.PurchaseInvoiceId
            }}</strong>
          </router-link>
        </template>
      </el-table-column>
      <el-table-column
        v-bind:label="$t('AddVendors.Description')"
        prop="Description"
        align="center"
      >
      </el-table-column>
      <el-table-column v-bind:label="$t('Sales.Status')" width="120" align="center">
        <template slot-scope="scope">
          <Status-Tag :Status="scope.row.Status" TableName="BillOfEntery" />
        </template>
      </el-table-column>
      <el-table-column width="180" align="center">
        <template slot-scope="scope">
          <Next-Oprations
            :ObjId="scope.row.Id"
            :Status="scope.row.Status"
            TableName="BillOfEntery"
            @Done="handleFilter"
          />
          <Drawer-Print Type="BillOfEntery" :Data="scope.row" />
        </template>
      </el-table-column>
      <el-table-column type="expand" align="center">
        <template slot-scope="props">
          <el-table :data="props.row.InventoryMovements">
            <el-table-column prop="ItemsId" label="رقم \ باركود الصنف" align="center">
              <template slot-scope="scope">
                {{ scope.row.ItemsId + " - " + scope.row.Barcode }}
              </template>
            </el-table-column>
            <el-table-column
              v-bind:label="$t('CashPool.Items')"
              width="130"
              align="center"
            >
              <template slot-scope="scope">{{
                scope.row.Name
              }}</template></el-table-column
            >
            <el-table-column
              prop="Qty"
              v-bind:label="$t('CashPool.quantity')"
              align="center"
            >
              <template slot-scope="scope"
                >{{ scope.row.Qty.toFixed($store.getters.settings.ToFixed) }}
              </template></el-table-column
            >
            <el-table-column label="الكمية المباعة" align="center">
              <template slot-scope="scope">{{
                scope.row.Total.toFixed($store.getters.settings.ToFixed)
              }}</template>
            </el-table-column>
            <el-table-column label="الباقي" align="center">
              <template slot-scope="scope"
                >{{
                  (scope.row.Qty - scope.row.Total).toFixed(
                    $store.getters.settings.ToFixed
                  )
                }}
              </template>
            </el-table-column>
            <el-table-column label="الحالة" align="center">
              <template slot-scope="scope">{{ scope.row.Status }} </template>
            </el-table-column>
            <el-table-column type="expand" align="center">
              <template slot-scope="props">
                <el-table
                  v-loading="listLoading"
                  v-bind:data="
                    props.row.SalesItemMovements == null
                      ? props.row.BillOfEnteryItemMovements
                      : props.row.BillOfEnteryItemMovements.concat(
                          props.row.SalesItemMovements
                        )
                  "
                  ref="BillOfEnteryItemMovementsTable"
                  border
                  fit
                  highlight-current-row
                  style="width: 100%"
                  @row-dblclick="
                    (row) => {
                      let r = $router.resolve({
                        path: '/Sales/Edit/' + row.SalesInvoiceId,
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
                    v-bind:label="$t('Vendors.ID')"
                    align="center"
                    width="80"
                  >
                    <template slot-scope="{ row }">
                      <span>{{ row.SalesInvoiceId }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column
                    v-bind:label="$t('Sales.Date')"
                    width="150px"
                    align="center"
                  >
                    <template slot-scope="{ row }">
                      <span>{{
                        row.SalesInvoiceFakeDate | parseTime("{y}-{m}-{d} {h}:{i}")
                      }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column
                    v-bind:label="$t('AddVendors.Name')"
                    prop="VendorName"
                    align="center"
                  >
                  </el-table-column>
                  <el-table-column v-bind:label="$t('CashPool.Price')" align="center">
                    <template slot-scope="scope">{{
                      scope.row.SellingPrice.toFixed($store.getters.settings.ToFixed)
                    }}</template>
                  </el-table-column>
                  <el-table-column label="الكمية " align="center">
                    <template slot-scope="scope">{{
                      scope.row.Qty.toFixed($store.getters.settings.ToFixed)
                    }}</template>
                  </el-table-column>
                  <el-table-column label="الباقي" align="center">
                    <template slot-scope="props">{{ props.row.Total }} </template>
                  </el-table-column>
                  <el-table-column label="#" align="center">
                    <template slot-scope="scope">
                      <Pin-Movement
                        :InventoryMovementsId="scope.row.Id"
                        :BillOfEnteryId="scope.row.BillOfEnteryId"
                        :RootBillOfEnteryId="scope.row.RootBillOfEnteryId"
                        @Done="handleFilter"
                      />
                    </template>
                  </el-table-column>
                </el-table>
              </template>
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
import { GetByListQ } from "@/api/BillOfEntery";
import NextOprations from "@/components/Oprationsys/NextOprations";
import SearchByDate from "@/components/Date/SearchByDate";
import StatusTag from "@/components/Oprationsys/StatusTag";
import DrawerPrint from "@/components/PrintRepot/DrawerPrint.vue";
import UserSelect from "@/components/User/UserSelect";
import RadioOprations from "@/components/Oprationsys/RadioOprations";
import PinMovement from "./components/PinMovement.vue";

import waves from "@/directive/waves"; // waves directive
import { parseTime } from "@/utils";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
import SortOptions from "@/components/SortOptions";
import Export from "@/components/Export";

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
    SortOptions,
    Export,
    PinMovement,
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
  },
};
</script>
