﻿<template>
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
        <!-- <el-col :span="6">
          <el-switch
            style="direction: ltr"
            v-model="IsAuto"
            active-text="تلقائي"
            inactive-text="يدوي"
          >
          </el-switch>
        </el-col> -->
      </el-row>
    </div>
    <el-row :gutter="20">

      <el-col :span="24">
        <Radio-Oprations
          :value="listQuery.Status"

          table-name="OrderRestaurant"
          @Set="
            (v) => {
              listQuery.Status = v;
              handleFilter();
            }
          "
        />
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
    >
      <el-table-column type="expand">
        <template slot-scope="props">
          <h3 style="float: right; padding-right: 20px">محتويات الطلب :</h3>
          <br>
          <h4 style="float: right; padding-top: 5px">{{ props.row.Content }}</h4>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('Vendors.ID')"
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
      <el-table-column :label="$t('Sales.Date')" width="120px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.FakeDate | parseTime("{y}-{m}-{d} {h}:{i}") }}</span>
        </template>
      </el-table-column>
      <el-table-column align="right" label="معلومات الزبون">
        <el-table-column
          sortable
          prop="Name"
          :label="$t('AddVendors.Name')"
          align="center"
        />
        <el-table-column
          prop="PhoneNumber"
          :label="$t('MemberList.Phone')"
          width="100"
          align="center"
        />
        <el-table-column
          prop="TableNo"
          label="Table No"
          width="130"
          align="center"
        />
      </el-table-column>
      <el-table-column :label="$t('Area.TotalPill')" width="100" align="center">
        <template slot-scope="{ row }">
          {{ row.TotalPill.toFixed($store.getters.settings.ToFixed) }}
          JOD
        </template>
      </el-table-column>
      <el-table-column :label="$t('CashPool.Amountv')" width="100" align="center">
        <template slot-scope="{ row }">
          {{ row.TotalPrice.toFixed($store.getters.settings.ToFixed) }}
          JOD
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('Vendors.Name')"
        prop="Vendor.Name"
        align="center"
      />
      <el-table-column
        :label="$t('Vendors.Description')"
        prop="Description"
        align="center"
      />
      <el-table-column :label="$t('Sales.Status')" width="120" align="center">
        <template slot-scope="scope">
          <Status-Tag :status="scope.row.Status" table-name="OrderRestaurant" />
        </template>
      </el-table-column>
      <el-table-column label="#" width="100" align="center">
        <template slot-scope="scope">
          <Dialog-Action-Log table-name="OrderRestaurant" :obj-id="scope.row.Id" />

          <Next-Oprations
            :obj-id="scope.row.Id"
            :status="scope.row.Status"
            table-name="OrderRestaurant"
            @Done="getList"
          />
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
import { GetByListQ } from '@/api/OrderRestaurant'
import NextOprations from '@/components/Oprationsys/NextOprations'
import SearchByDate from '@/components/Date/SearchByDate.vue'
import StatusTag from '@/components/Oprationsys/StatusTag'
import DrawerPrint from '@/components/PrintRepot/DrawerPrint'
import DialogActionLog from '@/components/ActionLog/DialogActionLog.vue'
import RadioOprations from '@/components/Oprationsys/RadioOprations'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import SortOptions from '@/components/SortOptions' // secondary package based on el-pagination
import AddOrder from './components/AddOrder.vue'
import Export from '@/components/Export'

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
    AddOrder,
    Export
  },
  directives: { waves },
  data() {
    return {
      list: [],
      Totals: { Rows: 0 },
      listLoading: false,
      listQuery: {
        Page: 1,
        Any: '',
        limit: this.$store.getters.settings.LimitQurey,
        Sort: '-id',
        User: undefined,
        DateFrom: '',
        DateTo: '',
        Status: undefined
      }
    }
  },
  computed: {
    IsAuto: {
      get() {
        return this.$store.state.settings.OrderIsAutomatic
      },
      set(val) {
        this.$store.dispatch('settings/changeSetting', {
          key: 'OrderIsAutomatic',
          value: val
        })
      }
    }
  },
  created() {
    // this.getList();
  },
  methods: {
    getList() {
      this.listLoading = true

      GetByListQ(this.listQuery).then((response) => {
        this.list = response.items
        this.Totals = response.Totals
        this.listLoading = false
      })
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
    },
    getSortClass: function(key) {
      const sort = this.listQuery.Sort
      return sort === `+${key}` ? 'ascending' : 'descending'
    }
  }
}
</script>
