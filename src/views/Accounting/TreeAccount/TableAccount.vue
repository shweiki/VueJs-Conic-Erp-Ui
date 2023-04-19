<template>
  <div class="app-container">
    <el-row type="flex">
      <el-col :span="12">
        <el-input v-model="listQuery.Any" placeholder="Search By Any Acount Name Or Id" class="filter-item"
          @keyup.enter.native="handleFilter" />
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
        <Export :list="list" />
        <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
          {{ $t("table.search") }}
        </el-button>
      </el-col>
    </el-row>
    <el-row type="flex"><el-col :span="6">
        <AddAccountDialog />
      </el-col>
      <el-col :span="18">
        <Radio-Oprations TableName="Account" @Set="
          (v) => {
            listQuery.Status = v;
            handleFilter();
          }
        " /></el-col>
    </el-row>
    <el-row type="flex">
      <el-col v-permission="['admin']" :span="24">
        <el-divider direction="vertical"></el-divider>
        <span>عدد الحسابات</span>
        <el-divider direction="vertical"></el-divider>
        <span>{{ Totals.Rows }}</span>
        <el-divider direction="vertical"></el-divider>

        <span>مجموع المدين (لك)</span>
        <el-divider direction="vertical"></el-divider>
        <span>{{
          Totals.TotalCredit.toFixed($store.getters.settings.ToFixed)
        }}
          JOD</span>
        <el-divider direction="vertical"></el-divider>

        <span> (عليك) مجموع الدائن </span>
        <el-divider direction="vertical"></el-divider>
        <span>{{
          Totals.TotalDebit.toFixed($store.getters.settings.ToFixed)
        }}
          JOD</span>
        <el-divider direction="vertical"></el-divider>

        <span>الرصيد</span>
        <el-divider direction="vertical"></el-divider>
        <span>{{
          Totals.Totals.toFixed($store.getters.settings.ToFixed)
        }}
          JOD</span>
        <el-divider direction="vertical"></el-divider>
      </el-col>
    </el-row>

    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%"
      @sort-change="sortChange" @row-dblclick="
        (row) => {
          if (DblClickRow == 'AddAsRow') {
            $emit('dblclick', row);
          }
        }
      ">
      <el-table-column label="#" prop="Id" width="50"></el-table-column>
      <el-table-column prop="Code" width="60"> </el-table-column>
      <el-table-column prop="Name" align="center" v-bind:label="$t('Account.AccountName')">
      </el-table-column>
      <el-table-column v-bind:label="$t('Account.MainAccount')" prop="Type" width="150"></el-table-column>

      <el-table-column v-bind:label="$t('Account.Credit')" prop="totalCredit" width="100" align="center">
        <template slot-scope="scope">{{
          scope.row.TotalCredit.toFixed($store.getters.settings.ToFixed)
        }}</template>
      </el-table-column>
      <el-table-column v-bind:label="$t('Account.Debit')" prop="totalDebit" width="100" align="center">
        <template slot-scope="scope">{{
          scope.row.TotalDebit.toFixed($store.getters.settings.ToFixed)
        }}</template>
      </el-table-column>
      <el-table-column v-bind:label="$t('Account.funds')" width="100" align="center">
        <template slot-scope="scope">{{
          (scope.row.TotalCredit - scope.row.TotalDebit).toFixed(
            $store.getters.settings.ToFixed
          )
        }}</template>
      </el-table-column>
      <el-table-column v-bind:label="$t('Account.Status')" align="center" width="70">
        <template slot-scope="scope">
          <EditAccount :AccountId="scope.row.Id" />
          <StatusTag :Status="scope.row.Status" TableName="Account" />
        </template>
      </el-table-column>

      <el-table-column width="180" align="center">
        <template slot-scope="scope">
          <Next-Oprations :ObjId="scope.row.Id" :Status="scope.row.Status" TableName="Account" @Done="handleFilter" />
          <Drawer-Print Type="Account" :Data="scope.row" />
          <Dialog-Action-Log TableName="Account" :ObjId="scope.row.Id" />
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="Totals.Rows > 0" :total="Totals.Rows" :page.sync="listQuery.Page" :limit.sync="listQuery.limit"
      @pagination="getList" />
  </div>
</template>
<script>
import Cookies from 'js-cookie'
import { GetByListQ } from "@/api/Account";
import StatusTag from "@/components/Oprationsys/StatusTag";
import RadioOprations from "@/components/Oprationsys/RadioOprations";
import NextOprations from "@/components/Oprationsys/NextOprations";
import waves from "@/directive/waves"; // waves directive
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
import permission from "@/directive/permission/index.js";
import AddAccountDialog from "@/components/TreeAccount/AddAccountDialog.vue";
import DrawerPrint from "@/components/PrintRepot/DrawerPrint.vue";
import EditAccount from "@/components/TreeAccount/EditAccount.vue";
import DialogActionLog from "@/components/ActionLog/DialogActionLog.vue";
import SortOptions from "@/components/SortOptions";
import Export from "@/components/Export";

export default {
  name: "TableAccount",
  props: ["DblClickRow"],

  components: {
    StatusTag,
    RadioOprations,
    NextOprations,
    Pagination,
    AddAccountDialog,
    DrawerPrint,
    EditAccount,
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
        TotalCredit: 0,
        TotalDebit: 0,
      },
      listLoading: false,
      listQuery: JSON.parse(localStorage.getItem('TableAccount_ListQuery') || null) || {
        Page: 1,
        Any: "",
        limit: this.$store.getters.settings.LimitQurey,
        Sort: "+id",
        User: undefined,

        Status: undefined,
      },
    };
  },
  created() {
    //   this.getdata();
  },
  methods: {
    getList() {
      this.listLoading = true;

      GetByListQ(this.listQuery).then((response) => {
        this.list = response.items;
        this.Totals = response.Totals;
        localStorage.setItem('TableAccount_ListQuery', JSON.stringify(this.listQuery))
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
