<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header">
        <el-row type="flex">
          <el-col :span="6">
            <Export :list="tableData" type="Members" />
          </el-col>
          <el-col :span="3">
            <el-button
              style="width: 100px"
              type="primary"
              icon="el-icon-plus"
              @click="Visibles = true"
            >تجميد</el-button>
          </el-col>
          <el-col :span="6">
            <el-button
              icon="el-icon-setting"
              type="primary"
              :size="$store.getters.size"
              @click="$store.dispatch('Members/CheckMembers')"
            >CheckMemberShips</el-button></el-col>
          <el-col :span="2">
            <el-button
              v-waves
              class="filter-item"
              type="primary"
              icon="el-icon-search"
              @click="handleFilter"
            >
              {{ $t("Members.Search") }}
            </el-button>
          </el-col>
        </el-row>
      </div>
      <el-table
        ref="multipleTable"
        v-loading="loading"
        :data="tableData"
        fit
        border
        highlight-current-row
        max-height="500"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="#" prop="Id" width="120" align="center">
          <template slot="header" slot-scope="{}">
            Ids
            {{ tableData.length }}
          </template>
        </el-table-column>
        <el-table-column
          prop="MembershipName"
          label="الاشتراك"
          align="center"
        />

        <el-table-column
          prop="MemberName"
          label="المشترك"
          align="center"
        />
        <el-table-column prop="Type" label="الفترة" align="center" />

        <el-table-column prop="StartDate" label="تاريخ البدء" align="center" sortable />
        <el-table-column prop="EndDate" label="تاريخ الانتهاء" align="center" sortable />
      </el-table>
    </el-card>
    <div>
      <el-dialog style="margin-top: -13vh" title="تسجيل تجميد" :visible.sync="Visibles">
        <el-form label-position="top" class="demo-form-inline">
          <el-row type="flex">
            <el-col :span="24">
              <el-form-item prop="FreezeBetween" label="الفترة">
                <el-date-picker
                  v-model="FreezeBetween"
                  :format="$store.getters.settings.DateTimeFormat"
                  type="daterange"
                  align="left"
                  unlink-panels
                  :range-separator="$t('Sales.until')"
                  :start-placeholder="$t('Sales.From')"
                  :end-placeholder="$t('Sales.To')"
                  :default-time="['00:00:00', '23:59:59']"
                  style="width: 80%"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex">
            <el-col :span="24">
              <el-form-item :label="$t('AddVendors.Description')">
                <el-input v-model="Description" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex">
            <el-col :span="24">
              مجموع الايام حسب الفترة المطلوبة
              {{
                Math.round(
                  Math.abs(
                    (new Date(FreezeBetween[0]) - new Date(FreezeBetween[1])) /
                      (24 * 60 * 60 * 1000)
                  )
                )
              }}
              ايام
            </el-col>
          </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="Visibles = false">{{ $t("AddVendors.Cancel") }}</el-button>
          <el-button type="primary" @click="createFreeze()">{{
            $t("AddVendors.Save")
          }}</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import Export from '@/components/Export'
import permission from '@/directive/permission/index.js'

import waves from '@/directive/waves' // waves directive
import { GetMembershipMovementList } from '@/api/MembershipMovement'
import { CreateMulti } from '@/api/MembershipMovementOrder'
import { LocalDate, LocalTime, DateTimeFormatter, Instant } from '@js-joda/core'

export default {
  components: { Export },
  directives: { waves, permission },
  data() {
    return {
      tableData: [],
      Selection: [],
      FreezeBetween: '',
      Description: '',
      Visibles: false,
      Days: 0,
      loading: false,
      search: '',
      DateIn: '',
      listQuery: JSON.parse(localStorage.getItem('MembershipMovement_ListQuery') || null) || {
        Page: 1,
        Any: '',
        limit: this.$store.getters.settings.LimitQurey,
        Sort: '-id',
        Status: null
      }
    }
  },

  methods: {
    getList() {
      this.loading = true
      GetMembershipMovementList(this.listQuery).then((response) => {
        // console.log(response)
        this.tableData = response
        this.loading = false
      })
    },
    handleSelectionChange(val) {
      this.Selection = val
    },
    handleFilter() {
      this.listQuery.Page = 1
      this.getList()
    },
    createFreeze() {
      const chunkSize = 3
      const chunks = []

      for (let i = 0; i < this.Selection.length; i += chunkSize) {
        chunks.push(this.Selection.slice(i, i + chunkSize))
      }
      chunks.forEach((element) => {
        const date = [
          LocalDate.ofInstant(Instant.ofEpochMilli(this.FreezeBetween[0]))
            .atStartOfDay()
            .format(DateTimeFormatter.ofPattern('yyyy-MM-dd HH:mm')),
          LocalDate.ofInstant(Instant.ofEpochMilli(this.FreezeBetween[1]))
            .atTime(LocalTime.MAX)
            .format(DateTimeFormatter.ofPattern('yyyy-MM-dd HH:mm'))
        ]
        CreateMulti({
          collection: element.map((x) => {
            return {
              Id: undefined,
              Type: 'Freeze',
              StartDate: date[0],
              EndDate: date[1],
              Status: 2,
              Description: this.Description,
              MemberShipMovementId: x.Id
            }
          })
        }).then((response) => {
          if (response) {
            this.Visibles = false
            this.$notify({
              title: 'تم ',
              message: 'تم الإضافة بنجاح',
              type: 'success',
              duration: 2000
            })
          }
        })
      })
    }
  }
}
</script>
