<template>
  <div class="app-container">
    <el-card class="box-card">
      <div class="filter-container">
        <el-row type="flex">
          <el-col :span="6">
            <el-radio-group v-model="Type" text-color="#f78123">
              <el-radio label="Payables" border>{{ $t("Accounting.Payables") }}</el-radio>
              <el-radio label="Receivables" border>{{
                $t("Accounting.Receivables")
              }}</el-radio>
            </el-radio-group>
          </el-col>
          <el-col :span="4">
            <el-switch
              v-model="listQuery.WithZero"
              active-text="With Zero"
              inactive-text="Without Zero"
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
          <el-col :span="9">
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
          <el-col :span="1">
            <Drawer-Print
              type="AccountReceivablesPayables"
              :data="{
                EntryMovement: list,
                TotalCredit: Totals.Credit,
                TotalDebit: Totals.Debit,
                TotalDebitCredit: Totals.Totals,
                TotalRows: Totals.Rows,
              }"
            /></el-col>
        </el-row>
      </div>

      <el-divider direction="vertical" />
      <span>عدد </span>
      <el-divider direction="vertical" />
      <span>{{ Totals.Rows }}</span>
      <el-divider direction="vertical" />

      <span>مجموع المدين</span>
      <el-divider direction="vertical" />
      <span>{{ Totals.TotalCredit.toFixed($store.getters.settings.ToFixed) }} JOD</span>
      <el-divider direction="vertical" />

      <span>مجموع الدائن</span>
      <el-divider direction="vertical" />
      <span>{{ Totals.TotalDebit.toFixed($store.getters.settings.ToFixed) }} JOD</span>
      <el-divider direction="vertical" />

      <span>الرصيد</span>
      <el-divider direction="vertical" />
      <span>{{ Totals.Totals.toFixed($store.getters.settings.ToFixed) }} JOD</span>
      <el-divider direction="vertical" />

      <el-table
        v-loading="listLoading"
        :data="list"
        fit
        border
        highlight-current-row
        style="width: 100%"
        @sort-change="sortChange"
      >
        <el-table-column
          :label="$t('Accounting.Id')"
          prop="Id"
          width="120"
          align="center"
        />

        <el-table-column
          :label="$t('Accounting.Name')"
          prop="Name"
          align="center"
        />
        <el-table-column label="مدين" prop="Credit" width="100" align="center">
          <template slot-scope="scope">{{
            scope.row.TotalCredit.toFixed($store.getters.settings.ToFixed)
          }}</template>
        </el-table-column>
        <el-table-column label="دائن" prop="Debit" width="100" align="center">
          <template slot-scope="scope">{{
            scope.row.TotalDebit.toFixed($store.getters.settings.ToFixed)
          }}</template>
        </el-table-column>
        <el-table-column label="الرصيد" prop="Total" width="100" align="center">
          <template slot-scope="scope">{{
            (scope.row.TotalCredit - scope.row.TotalDebit).toFixed(
              $store.getters.settings.ToFixed
            )
          }}</template>
        </el-table-column>
        <el-table-column :label="$t('Sales.Status')" width="120" align="center">
          <template slot-scope="scope">
            <Status-Tag :status="scope.row.Status" table-name="Account" />
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
    </el-card>
  </div>
</template>
<script>
import Cookies from 'js-cookie'
import { GetPayables, GetReceivables } from '@/api/Account'
import StatusTag from '@/components/Oprationsys/StatusTag'
import DrawerPrint from '@/components/PrintRepot/DrawerPrint.vue'
import permission from '@/directive/permission/index.js'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import SortOptions from '@/components/SortOptions'
import Export from '@/components/Export'

export default {
  name: 'AccountReceivablesPayables',
  components: {
    StatusTag,
    DrawerPrint,
    Pagination,
    SortOptions,
    Export
  },
  directives: { waves, permission },
  data() {
    return {
      Type: 'Payables',
      list: [],
      Totals: { Rows: 0, Totals: 0, TotalDebit: 0, TotalCredit: 0 },
      listLoading: false,
      listQuery: JSON.parse(
        localStorage.getItem('PayablesReceivables_ListQuery') || null
      ) || {
        WithZero: false,
        Page: 1,
        Any: '',
        Sort: '-id',
        limit: this.$store.getters.settings.LimitQurey
      }
    }
  },

  methods: {
    getList() {
      this.listLoading = true
      if (this.Type == 'Payables') {
        GetPayables(this.listQuery).then((response) => {
          this.list = response.items.map((curr, i, array) => {
            curr.TotalRow =
              array[i != 0 ? i - 1 : i].TotalRow - (curr.Debit - curr.Credit)
            return curr
          })
          this.Totals = response.Totals
          this.listLoading = false
        })
      } else {
        GetReceivables(this.listQuery).then((response) => {
          this.list = response.items.map((curr, i, array) => {
            curr.TotalRow =
              array[i != 0 ? i - 1 : i].TotalRow - (curr.Debit - curr.Credit)
            return curr
          })
          this.Totals = response.Totals
          this.listLoading = false
        })
      }
      localStorage.setItem(
        'PayablesReceivables_ListQuery',
        JSON.stringify(this.listQuery)
      )
    },
    handleFilter() {
      this.listQuery.Page = 1
      this.getList()
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'Id') {
        this.sortById(order)
      }
    },
    sortById(order) {
      if (order === 'ascending') {
        this.listQuery.Sort = '+id'
      } else {
        this.listQuery.Sort = '-id'
      }
      this.handleFilter()
    }
  }
}
</script>
