<template>
  <div class="app-container">
    <div class="filter-container">
      <el-row type="flex">
        <el-col :span="2">
          <el-popover placement="right" width="400" trigger="click">
            <Item-Search-Any
              :item-id="listQuery.MergeItemId"
              @Set="
                (v) => {
                  //  Account = v;
                  listQuery.MergeItemId = v.Id;
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
        <el-col :span="16">
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
        <el-col :span="3">
          <Export :list="list" />
        </el-col>
        <el-col :span="3">
          <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
            {{ $t("table.search") }}
          </el-button>
        </el-col>
        <el-col :span="1">
          <Drawer-Print
            type="ItemMoveStatement"
            :data="{
              Name: Item.Name,
              Id: Item.Id,
              Code: Item.BarCode,
              DateFrom: listQuery.DateFrom,
              DateTo: listQuery.DateTo,
              ItemMovement: list,
              TotalIn: Totals.In,
              TotalOut: Totals.Out,
              Total: Totals.Totals,
              TotalRows: Totals.Rows,
            }"
          /></el-col>
      </el-row>
    </div>

    <el-divider direction="vertical" />
    <span>عدد الحركات</span>
    <el-divider direction="vertical" />
    <span>{{ Totals.Rows }}</span>
    <el-divider direction="vertical" />

    <span>مجموع الداخل</span>
    <el-divider direction="vertical" />
    <span>{{ Totals.In.toFixed($store.getters.settings.ToFixed) }} JOD</span>
    <el-divider direction="vertical" />

    <span>مجموع الخارج</span>
    <el-divider direction="vertical" />
    <span>{{ Totals.Out.toFixed($store.getters.settings.ToFixed) }} JOD</span>
    <el-divider direction="vertical" />

    <span>الرصيد</span>
    <el-divider direction="vertical" />
    <span>{{ Totals.Totals.toFixed($store.getters.settings.ToFixed) }} JOD</span>
    <el-divider direction="vertical" />

    <el-table v-loading="listLoading" :data="list" fit border highlight-current-row style="width: 100%">
      <el-table-column label="رقم الحركة" prop="Id" width="80" align="center" />
      <el-table-column label="التاريخ" align="center" width="140">
        <template slot-scope="{ row }">
          <span>{{ row.FkObject.FakeDate | parseTime("{y}-{m}-{d} {h}:{i}") }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('Accounting.FktableDescription')" align="center">
        <template slot-scope="{ row }">
          {{ row.FkObject.Description }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('Accounting.Notes')" prop="Description" align="center" />
      <el-table-column label="نوع الحركة" prop="Move" align="center">
        <template slot-scope="{ row }">
          <router-link v-if="row.FkObject.Type == 'SalesInvoice'" :to="'/Sales/Edit/' + row.FkObject.Id">
            <strong style="font-size: 10px; cursor: pointer">{{
              $t("ItemMovement." + row.FkObject.Type)
            }}</strong>
          </router-link>
          <router-link v-if="row.FkObject.Type == 'PurchaseInvoice'" :to="'/Purchases/Edit/' + row.FkObject.Id">
            <strong style="font-size: 10px; cursor: pointer">{{
              $t("ItemMovement." + row.FkObject.Type)
            }}</strong>
          </router-link>
          <router-link v-if="row.FkObject.Type == 'OrderInventory'" :to="'/OrderInventory/Edit/' + row.FkObject.Id">
            <strong style="font-size: 10px; cursor: pointer">{{
              $t("ItemMovement." + row.FkObject.Type)
            }}</strong>
          </router-link>
          <router-link v-if="row.FkObject.Type == 'WorkShop'" :to="'/WorkShop/Edit/' + row.FkObject.Id">
            <strong style="font-size: 10px; cursor: pointer">{{
              $t("ItemMovement." + row.FkObject.Type)
            }}</strong>
          </router-link>
        </template></el-table-column>
      <el-table-column label="الداخل" prop="In" width="80" align="center">
        <template slot-scope="scope">{{
          scope.row.In.toFixed($store.getters.settings.ToFixed)
        }}</template>
      </el-table-column>
      <el-table-column label="الخارج" prop="Out" width="80" align="center">
        <template slot-scope="scope">{{
          scope.row.Out.toFixed($store.getters.settings.ToFixed)
        }}</template>
      </el-table-column>
      <el-table-column label="الرصيد" prop="TotalRow" width="80" align="center">
        <template slot-scope="scope">{{
          scope.row.TotalRow.toFixed($store.getters.settings.ToFixed)
        }}</template>
      </el-table-column>
      <!--  <el-table-column v-bind:label="$t('Sales.Status')" width="100" align="center">
        <template slot-scope="scope">
          <Status-Tag :status="scope.row.Status" tableName="InventoryMovements" />
        </template>
      </el-table-column>-->
    </el-table>
  </div>
</template>
<script>
import Cookies from 'js-cookie'
import { GetItemMove } from '@/api/Item'
import SearchByDate from '@/components/Date/SearchByDate'
import StatusTag from '@/components/Oprationsys/StatusTag'
import DrawerPrint from '@/components/PrintRepot/DrawerPrint.vue'
import permission from '@/directive/permission/index.js'
import ItemSearchAny from '@/components/Item/ItemSearchAny.vue'
import waves from '@/directive/waves' // waves directive
import SearchBy from '@/components/DynamicComponents/SearchBy'
import { parseTime } from '@/utils'
import Export from '@/components/Export'

export default {
  components: {
    StatusTag,
    SearchByDate,
    DrawerPrint,
    ItemSearchAny,
    SearchBy,
    Export
  },
  directives: { waves, permission },
  props: ['Item'],
  data() {
    return {
      list: [],
      Totals: { Rows: 0, Totals: 0, In: 0, Out: 0 },
      listLoading: false,
      listQuery: JSON.parse(localStorage.getItem('ItemMoveStatement_ListQuery') || null) || {
        DateFrom: '',
        DateTo: '',
        ItemId: this.Item.Id,
        MergeItemId: undefined
      }
      //   Item: this.Item,
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      this.listQuery.ItemId = this.Item.Id
      GetItemMove(this.listQuery).then((response) => {
        this.list = response.items.map((curr, i, array) => {
          const Total = curr.In - curr.Out
          const lastTotal = i != 0 ? array[i - 1].TotalRow : 0

          curr.TotalRow += lastTotal

          return curr
        })
        this.Totals = response.Totals
        localStorage.setItem('ItemMoveStatement_ListQuery', JSON.stringify(this.listQuery))

        this.listLoading = false
      })
    },
    handleFilter() {
      this.getList()
    }
  }
}
</script>
