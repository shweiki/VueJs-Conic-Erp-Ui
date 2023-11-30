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
          <Drawer-Print
            style="float: left"
            Type="ReceiveList"
            :Data="{
              Totals: Totals,
              Items: list,
              Dates: [listQuery.DateFrom, listQuery.DateTo],
            }"
          />
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
    </div>
    <Radio-Oprations
      :value="listQuery.Status"
      tableName="Receive"
      @Set="
        (v) => {
          listQuery.Status = v;
          handleFilter();
        }
      "
    />
    <el-card class="box-card">
      <el-divider direction="vertical"></el-divider>
      <span>عدد المصروفات</span>
      <el-divider direction="vertical"></el-divider>
      <span>{{ Totals.Rows }}</span>
      <el-divider direction="vertical"></el-divider>

      <span>{{ $t("CashPool.Cash") }}</span>
      <el-divider direction="vertical"></el-divider>
      <span>{{ Totals.Cash.toFixed($store.getters.settings.ToFixed) }} JOD</span>
      <el-divider direction="vertical"></el-divider>

      <span>شيكات</span>
      <el-divider direction="vertical"></el-divider>
      <span>{{ Totals.Cheque.toFixed($store.getters.settings.ToFixed) }} JOD</span>
      <el-divider direction="vertical"></el-divider>

      <span>{{ $t("CashPool.Amount") }}</span>
      <el-divider direction="vertical"></el-divider>
      <span>{{ Totals.Totals.toFixed($store.getters.settings.ToFixed) }} JOD</span>
      <el-divider direction="vertical"></el-divider>
    </el-card>

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
                    path: '/Receive/Edit/' + row.Id,
                  });
                  window.open(r.href, r.route.name, $store.getters.settings.windowStyle);
                }
              "
              >{{ row.Id }}</strong
            ></el-tag
          >
        </template>
      </el-table-column>
      <el-table-column v-bind:label="$t('Sales.Date')" width="150px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.FakeDate | parseTime("{y}-{m}-{d} {h}:{i}") }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="Name" label="الاسم" align="center">
        <template slot-scope="{ row }">
          <router-link v-if="row.MemberId != null" :to="'/Gym/Edit/' + row.ObjectId">
            <strong style="font-size: 10px; cursor: pointer">{{ row.Name }}</strong>
          </router-link>
          <router-link v-if="row.VendorId != null" :to="'/Vendor/Edit/' + row.ObjectId">
            <strong style="font-size: 10px; cursor: pointer">{{ row.Name }}</strong>
          </router-link>
        </template>
      </el-table-column>
      <el-table-column
        prop="ReceiveMethod"
        sortable
        label="طريقة الصرف"
        width="150"
        align="center"
      ></el-table-column>
      <el-table-column label="المحرر" prop="CreatedBy" align="center"> </el-table-column>

      <el-table-column v-bind:label="$t('CashPool.Amountv')" width="120" align="center">
        <template slot-scope="{ row }">
          {{ row.TotalAmmount.toFixed($store.getters.settings.ToFixed) }}
          JOD
        </template>
      </el-table-column>

      <el-table-column v-bind:label="$t('Sales.Status')" width="120" align="center">
        <template slot-scope="scope">
          <Status-Tag :status="scope.row.Status" tableName="Receive" />
        </template>
      </el-table-column>
      <el-table-column width="180" align="center">
        <template slot-scope="scope">
          <Next-Oprations
            :ObjId="scope.row.Id"
            :status="scope.row.Status"
            tableName="Receive"
            @Done="handleFilter"
          />
          <Dialog-Action-Log tableName="Receive" :ObjId="scope.row.Id" />
          <Drawer-Print Type="Receive" :Data="scope.row" />
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
import { GetByListQ } from "@/api/Receive";
import NextOprations from "@/components/Oprationsys/NextOprations";
import SearchByDate from "@/components/Date/SearchByDate";
import StatusTag from "@/components/Oprationsys/StatusTag";
import DrawerPrint from "@/components/PrintRepot/DrawerPrint";
import UserSelect from "@/components/User/UserSelect.vue";
import RadioOprations from "@/components/Oprationsys/RadioOprations";
import DialogActionLog from "@/components/ActionLog/DialogActionLog.vue";

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
    DialogActionLog,
    SortOptions,
    Export,
  },
  directives: { waves },
  data() {
    return {
      list: [],
      Totals: { Rows: 0, Totals: 0, Cash: 0, Cheque: 0 },
      listLoading: false,
      listQuery: JSON.parse(localStorage.getItem("Receive_ListQuery") || null) || {
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
        localStorage.setItem("Receive_ListQuery", JSON.stringify(this.listQuery));
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
