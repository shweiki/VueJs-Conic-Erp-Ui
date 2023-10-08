<template>
  <div class="app-container">
    <el-card class="box-card">
      <div class="filter-container">
        <el-row type="flex">
          <el-col :span="18">
            <SearchBy
              type="AccountSearchAny"
              :account-id="listQuery.AccountId"
              @Set="
                (v) => {
                  Account = v;
                  listQuery.AccountId = v.Id;
                }
              "
            />
          </el-col>
          <el-col :span="2">
            <el-popover placement="right" width="400" trigger="click">
              <SearchBy
                type="AccountSearchAny"
                :account-id="listQuery.MergeAccountId"
                @Set="
                  (v) => {
                    //  Account = v;
                    listQuery.MergeAccountId = v.Id;
                  }
                "
              />
              <el-button slot="reference" type="primary" icon="fa fa-object-group">
                دمج
              </el-button>
            </el-popover>
          </el-col>
        </el-row>
        <el-row type="flex">
          <el-col :span="10">
            <Search-By-Date
              :value="[listQuery.DateFrom, listQuery.DateTo]"
              @Set="
                (v) => {
                  listQuery.DateFrom = v[0];
                  listQuery.DateTo = v[1];
                }
              "
            />
          </el-col>

          <el-col :span="9">
            <Export :list="list" />
            <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
              {{ $t("table.search") }}
            </el-button>
          </el-col>
          <el-col :span="1">
            <Drawer-Print
              type="AccountStatement"
              :data="{
                Name: Account.Name,
                Id: Account.Id,
                Code: Account.Code,
                DateFrom: listQuery.DateFrom,
                DateTo: listQuery.DateTo,
                EntryMovement: list,
                TotalCredit: Totals.Credit,
                TotalDebit: Totals.Debit,
                TotalDebitCredit: Totals.Totals,
                TotalRows: Totals.Rows,
              }"
            /></el-col>
          <el-col :span="2">
            <DrawerAddEntry />
          </el-col>
        </el-row>
      </div>

      <el-divider direction="vertical" />
      <span>عدد القيود</span>
      <el-divider direction="vertical" />
      <span>{{ Totals.Rows }}</span>
      <el-divider direction="vertical" />

      <span>مجموع المدين</span>
      <el-divider direction="vertical" />
      <span>{{ Totals.Credit.toFixed($store.getters.settings.ToFixed) }} JOD</span>
      <el-divider direction="vertical" />

      <span>مجموع الدائن</span>
      <el-divider direction="vertical" />
      <span>{{ Totals.Debit.toFixed($store.getters.settings.ToFixed) }} JOD</span>
      <el-divider direction="vertical" />

      <span>الرصيد</span>
      <el-divider direction="vertical" />
      <span>{{ Totals.Totals.toFixed($store.getters.settings.ToFixed) }} JOD</span>
      <el-divider direction="vertical" />

      <el-table v-loading="listLoading" :data="list" fit border highlight-current-row style="width: 100%">
        <el-table-column :label="$t('Accounting.EntryId')" prop="EntryId" width="80" align="center" />
        <el-table-column label="التاريخ" align="center" width="140">
          <template slot-scope="{ row }">
            <span>{{ row.FakeDate | parseTime("{y}-{m}-{d} {h}:{i}") }}</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('Accounting.FktableDescription')"
          prop="FkDescription"
          align="center"
        />
        <el-table-column :label="$t('Accounting.Notes')" prop="Description" align="center" />
        <el-table-column label="رقم الحركة" prop="Fktable" align="center" width="80" />
        <el-table-column label="نوع الحركة" prop="TableName" align="center">
          <template slot-scope="{ row }">
            <router-link v-if="row.Type == 'Manual'" :to="'/EntryAccounting/Edit/' + row.EntryId">
              <strong style="font-size: 10px; cursor: pointer">{{
                $t("AccountStatement." + row.Type)
              }}</strong>
            </router-link>
            <router-link v-if="row.TableName == 'Receive'" :to="'/Receive/Edit/' + row.Fktable">
              <strong style="font-size: 10px; cursor: pointer">{{
                $t("AccountStatement." + row.TableName)
              }}</strong>
            </router-link>
            <router-link v-if="row.TableName == 'Payment'" :to="'/Payment/Edit/' + row.Fktable">
              <strong style="font-size: 10px; cursor: pointer">{{
                $t("AccountStatement." + row.TableName)
              }}</strong>
            </router-link>
            <router-link v-if="row.TableName == 'SaleInvoice'" :to="'/Sales/Edit/' + row.Fktable">
              <strong style="font-size: 10px; cursor: pointer">{{
                $t("AccountStatement." + row.TableName)
              }}</strong>
            </router-link>
            <router-link v-if="row.TableName == 'SaleInvoiceCashPool'" :to="'/CashPool/Edit/SaleInvoice/' + row.Fktable">
              <strong style="font-size: 10px; cursor: pointer">{{
                $t("AccountStatement." + row.TableName)
              }}</strong>
            </router-link>
            <router-link v-if="row.TableName == 'PaymentCashPool'" :to="'/CashPool/Edit/Payment/' + row.Fktable">
              <strong style="font-size: 10px; cursor: pointer">{{
                $t("AccountStatement." + row.TableName)
              }}</strong>
            </router-link>
          </template></el-table-column>
        <el-table-column label="مدين" prop="Credit" width="80" align="center">
          <template slot-scope="scope">{{
            scope.row.Credit.toFixed($store.getters.settings.ToFixed)
          }}</template>
        </el-table-column>
        <el-table-column label="دائن" prop="Debit" width="80" align="center">
          <template slot-scope="scope">{{
            scope.row.Debit.toFixed($store.getters.settings.ToFixed)
          }}</template>
        </el-table-column>
        <el-table-column label="الرصيد" prop="TotalRow" width="80" align="center">
          <template slot-scope="scope">{{
            scope.row.TotalRow.toFixed($store.getters.settings.ToFixed)
          }}</template>
        </el-table-column>
        <el-table-column :label="$t('Sales.Status')" width="100" align="center">
          <template slot-scope="scope">
            <Status-Tag :status="scope.row.Status" table-name="EntryAccounting" />
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
<script>
import { GetAccountStatement } from '@/api/EntryAccounting'
import SearchByDate from '@/components/Date/SearchByDate'
import StatusTag from '@/components/Oprationsys/StatusTag'
import DrawerPrint from '@/components/PrintRepot/DrawerPrint.vue'
import permission from '@/directive/permission/index.js'
import waves from '@/directive/waves' // waves directive
import SearchBy from '@/components/DynamicComponents/SearchBy.vue'
import Export from '@/components/Export'
import DrawerAddEntry from '@/views/Accounting/EntryAccounting/components/DrawerAddEntry.vue'

export default {
  components: {
    StatusTag,
    SearchByDate,
    DrawerPrint,
    SearchBy,
    Export,
    DrawerAddEntry
  },
  directives: { waves, permission },
  data() {
    return {
      list: [],
      Totals: { Rows: 0, Totals: 0, Debit: 0, Credit: 0 },
      listLoading: false,
      listQuery: JSON.parse(localStorage.getItem('AccountStatement_ListQuery') || null) || {
        DateFrom: '',
        DateTo: '',
        AccountId: undefined,
        MergeAccountId: undefined
      },
      Account: {}
    }
  },
  methods: {
    getList() {
      this.listLoading = true

      GetAccountStatement(this.listQuery).then((response) => {
        this.list = response.items.map((curr, i, array) => {
          const lastTotal = i !== 0 ? array[i - 1].TotalRow : 0
          //  console.log("lastTotal", lastTotal);

          curr.TotalRow += lastTotal

          //  console.log(curr.TotalRow);

          return curr
        })
        this.Totals = response.Totals
        localStorage.setItem('AccountStatement_ListQuery', JSON.stringify(this.listQuery))

        this.listLoading = false
      })
    },
    handleFilter() {
      this.getList()
    }
  }
}
</script>
