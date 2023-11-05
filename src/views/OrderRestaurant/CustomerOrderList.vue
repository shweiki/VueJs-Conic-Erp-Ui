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
        prop="Region"
        v-bind:label="$t('AddVendors.Region')"
        align="center"
      ></el-table-column>
      <el-table-column v-bind:label="$t('Sales.Date')" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.FakeDate | parseTime("{y}-{m}-{d} {h}:{i}") }}</span>
        </template>
      </el-table-column>

      <el-table-column v-bind:label="$t('Sales.Status')" width="160" align="center">
        <template slot-scope="scope">
          <Status-Tag :status="scope.row.Status" tableName="CustomerOrder" />
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
import { GetByListQByVendor } from "@/api/OrderRestaurant";
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
import { mapGetters } from "vuex";
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
    Export,
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
  computed: {
    ...mapGetters(["Id", "name"]),
  },
  created() {
    // this.getList();
  },
  methods: {
    getList() {
      this.user = {
        Id: this.Id,
        name: this.name,
      };
      this.listLoading = true;

      GetByListQByVendor({
        id: this.user.Id,
        name: this.user.name,
        Page: this.listQuery.Page,
        Any: this.listQuery.Any,
        limit: this.listQuery.limit,
        Sort: this.listQuery.Sort,
        Status: this.listQuery.Status,
      }).then((response) => {
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
