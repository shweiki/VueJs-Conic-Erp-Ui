<template>
  <div class="app-container">

    <!-- Filter Options Row -->
    <el-row type="flex">

      <!-- Search-By-Date -->
      <el-col :span="8">
        <Search-By-Date
          v-permission="['admin']"
          :value="[listQuery.DateFrom, listQuery.DateTo]"
          @Set="(v) => {
            listQuery.DateFrom = v[0];
            listQuery.DateTo = v[1];
            handleFilter();
          }
          "
        />
      </el-col>

      <!-- Select-All-Memberships -->
      <el-col :span="3">
        <Select-All-Memberships
          :clearable="true"
          :with-description="false"
          :membership-id="listQuery.MembershipId"
          @Set="
            (v) => {
              listQuery.MembershipId = v.Id;
              handleFilter();
            }
          "
        />
      </el-col>

      <!-- user-select -->
      <el-col :span="3">
        <user-select
          v-permission="['admin']"
          :value="listQuery.CreatedBy"
          @Set="(v) => {
            listQuery.CreatedBy = v;
            handleFilter();
          }
          "
        />
      </el-col>

      <!-- Sort-Options -->
      <el-col :span="3">
        <Sort-Options
          :value="listQuery.Sort"
          @Set="(v) => {
            listQuery.Sort = v;
            handleFilter();
          }
          "
        />
      </el-col>

      <!-- Drawer-Print -->
      <el-col :span="6">
        <Drawer-Print
          v-permission="['admin']"
          style="float: left"
          type="MembershipMovements"
          :data="{
            Totals: Totals,
            Items: list,
            Dates: [listQuery.DateFrom, listQuery.DateTo],
          }"
        />
        <Export :list="list" type="MembershipMovements" />
        <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
          {{ $t("table.search") }}
        </el-button>
      </el-col>
    </el-row>
    <!-- Totals-->
    <el-row type="flex">
      <el-col v-permission="['admin']" :span="24">
        <el-divider direction="vertical" />
        <span>عدد اشتركات</span>
        <el-divider direction="vertical" />
        <span>{{ Totals.Rows }}</span>
        <el-divider direction="vertical" />

        <span>عدد الكلي</span>
        <el-divider direction="vertical" />
        <span>{{ Totals.Totals.toFixed($store.getters.settings.ToFixed) }} JOD</span>
        <el-divider direction="vertical" />
      </el-col>
    </el-row>

    <!-- Table -->
    <el-table
      v-loading="listLoading"
      :data="list"
      fit
      border
      highlight-current-row
      style="width: 100%"
      @sort-change="sortChange"
    >
      <el-table-column prop="Id" label="رقم" width="120" align="center" :class-name="getSortClass('id')">
        <template slot-scope="{ row }">
          <el-tag type="primary" disable-transitions>
            <strong>{{ row.Id }}</strong>
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="Name" label="الاشتراك" align="center"> <template slot-scope="{ row }">
        <el-tag type="primary" disable-transitions>
          <strong>{{ row.Membership.Name }}</strong>
        </el-tag>
      </template>
      </el-table-column>

      <el-table-column label="تاريخ البدء" align="center" width="150">
        <template slot-scope="scope">
          <el-date-picker v-model="scope.row.StartDate" format="yyyy-MM-dd" disabled />
        </template>
      </el-table-column>
      <el-table-column label="تاريخ الانتهاء" align="center" width="150">
        <template slot-scope="scope">
          <el-date-picker v-model="scope.row.EndDate" format="yyyy-MM-dd" disabled />
        </template>
      </el-table-column>
      <el-table-column label="محرر" align="center" prop="CreatedBy" />

      <!--<el-table-column label="اخر تعديل" align="center" width="140">
        <template slot-scope="{ row }">
          <span>{{ row.LastModified | parseTime("{y}-{m}-{d} {h}:{i}") }}</span>
        </template>
      </el-table-column>

      <el-table-column
        label="اسم المعدل"
        prop="LastModifiedBy"
        align="center"
      />
-->
      <el-table-column label="المبلغ" prop="TotalAmmount" align="center">
        <template slot-scope="scope">{{
          scope.row.TotalAmmount.toFixed($store.getters.settings.ToFixed)
        }}</template>
      </el-table-column>
      <el-table-column :label="$t('Accounting.Notes')" prop="Description" align="center" />

      <el-table-column :label="$t('Sales.Status')" width="120" align="center">
        <template slot-scope="scope">
          <Status-Tag :status="scope.row.Status" table-name="MembershipMovement" />
        </template>
      </el-table-column>

      <el-table-column type="expand" align="center">
        <template slot-scope="props">
          <el-table :data="[props.row]">
            <el-table-column label="النوع" prop="Type" align="center" />

            <el-table-column label="الزيارات" prop="VisitsUsed" align="center" />

            <el-table-column label="الخصم" prop="Discount" align="center">
              <template slot-scope="scope">{{
                scope.row.Discount.toFixed($store.getters.settings.ToFixed)
              }}</template>

            </el-table-column>

            <el-table-column label="وصف الخصم" prop="DiscountDescription" align="center" />

          </el-table>
        </template>
      </el-table-column>
    </el-table>

    <!-- Pagination -->
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
import UserSelect from '@/components/User/UserSelect.vue'
import { GetByListQ } from '@/api/MembershipMovement'
import waves from '@/directive/waves' // waves directive
import permission from '@/directive/permission/index.js'
import SearchByDate from '@/components/Date/SearchByDate.vue'
import DrawerPrint from '@/components/PrintRepot/DrawerPrint.vue'

import SelectAllMemberships from '@/views/Gym/components/SelectAllMemberships.vue'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import StatusTag from '@/components/Oprationsys/StatusTag'
import SortOptions from '@/components/SortOptions'

import Export from '@/components/Export'

export default {
  components: {
    UserSelect,
    Pagination,
    StatusTag,
    SelectAllMemberships,
    SearchByDate,
    DrawerPrint,

    SortOptions,
    Export
  },
  directives: { waves, permission },

  data() {
    return {
      list: [],
      Totals: {
        Rows: 0,
        Totals: 0
      },
      listLoading: false,
      listQuery: JSON.parse(localStorage.getItem('MembershipMovementList_ListQuery') || null) || {
        Page: 1,
        limit: this.$store.getters.settings.LimitQurey,
        Sort: '-id',
        MembershipId: undefined,
        CreatedBy: '',
        DateFrom: '',
        DateTo: ''
      }
    }
  },
  methods: {
    getList() {
      this.listLoading = true
      GetByListQ(this.listQuery).then((response) => {
        this.list = response.Items
        this.Totals.Rows = response.Rows
        this.Totals.Totals = response.Totals
        localStorage.setItem('MembershipMovementList_ListQuery', JSON.stringify(this.listQuery))
      }).finally(() => { this.listLoading = false })
    },
    handleFilter() {
      this.listQuery.Page = 1
      if (!this.listLoading) this.getList()
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
    },
    getSortClass: function(key) {
      const sort = this.listQuery.Sort
      return sort === `+${key}` ? 'ascending' : 'descending'
    }

  }
}

</script>
