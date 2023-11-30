<template>
  <div class="app-container">
    <el-row type="flex">
      <el-col :span="3">
        <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" />
      </el-col>
      <el-col :span="3">
        <Drawer-Print type="SalaryPayment" :data="tempForm" />
      </el-col>
      <el-col :span="3">
        <Dialog-Salary-From
          :id="parseInt($route.params && $route.params.id)"
          :is-edit="true"
        />
      </el-col>
      <el-col :span="3">
        <el-button
          :disabled="DisabledSave"
          type="success"
          icon="el-icon-check"
          @click="confirmData"
        />
      </el-col>
    </el-row>
    <el-row
      type="flex"
    ><el-col :span="12">
      <el-row type="flex">
        <el-col v-loading="loading" :span="24" :xs="24">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              احتساب الراتب :
              <span>
                <Status-Tag :status="tempForm.Status" table-name="SalaryPayment" />
              </span>
            </div>
            <el-descriptions class="margin-top" :column="3" border>
              <el-descriptions-item
                :label-style="{ 'text-align': 'right' }"
                :content-style="{ 'text-align': 'right' }"
              >
                <template slot="label"> الراتب الاساسي </template>
                <el-tag size="small">{{ tempForm.GrossSalary }}</el-tag>
              </el-descriptions-item>
              <el-descriptions-item
                :label-style="{ 'text-align': 'right' }"
                :content-style="{ 'text-align': 'right' }"
              >
                <template slot="label"> ساعات الدوام </template>
                <el-tag size="small">{{ tempForm.WorkingHours }}</el-tag>
              </el-descriptions-item>
              <el-descriptions-item
                :label-style="{ 'text-align': 'right' }"
                :content-style="{ 'text-align': 'right' }"
              >
                <template slot="label"> اسم الموظف </template>
                <el-tag size="small">{{ tempForm.Name }}</el-tag>
              </el-descriptions-item>
              <el-descriptions-item
                :label-style="{ 'text-align': 'right' }"
                :content-style="{ 'text-align': 'right' }"
              >
                <template slot="label"> الرقم الوظيفي </template>
                <el-tag size="small">{{ tempForm.EmployeeId }}</el-tag>
              </el-descriptions-item>

              <el-descriptions-item
                :label-style="{ 'text-align': 'right' }"
                :content-style="{ 'text-align': 'right' }"
              >
                <template slot="label"> مجموع ساعات التأخير </template>
                <el-tag size="small">{{ MinutesConvert(TotalDelayMinute) }}</el-tag>
              </el-descriptions-item>
              <el-descriptions-item
                :label-style="{ 'text-align': 'right' }"
                :content-style="{ 'text-align': 'right' }"
              >
                <template slot="label"> مجموع ساعات إضافي </template>
                <el-tag size="small">{{ MinutesConvert(TotalExtraMinute) }}</el-tag>
              </el-descriptions-item>
              <el-descriptions-item
                :label-style="{ 'text-align': 'right' }"
                :content-style="{ 'text-align': 'right' }"
              >
                <template slot="label"> عدد أيام الدوام </template>
                <el-tag size="small">{{ WorkingDays }}</el-tag>
              </el-descriptions-item>
              <el-descriptions-item
                :label-style="{ 'text-align': 'right' }"
                :content-style="{ 'text-align': 'right' }"
              >
                <template slot="label"> صافي الراتب </template>
                <el-tag size="small">{{ tempForm.NetSalary }}</el-tag>
              </el-descriptions-item>
            </el-descriptions>
          </el-card>
        </el-col>
      </el-row></el-col><el-col :span="12">
      <el-card class="box-card">
        <Add-Salary-Adjustment-Log
          :employee-id="tempForm.EmployeeId"
          :employee-name="tempForm.Name"
          :salary-payment-id="tempForm.Id"
          :gross-salary="tempForm.GrossSalary"
          :extra-hours="
            (parseFloat(MinutesConvert(TotalExtraMinute, '.')) + 0.4) *
              (tempForm.GrossSalary / tempForm.DaysCount / tempForm.WorkingHours)
          "
          :delay-hours="
            (parseFloat(MinutesConvert(TotalDelayMinute, '.')) + 0.4) *
              (tempForm.GrossSalary / tempForm.DaysCount / tempForm.WorkingHours)
          "
        />
        <el-row type="flex">
          <el-col :span="24">
            <el-table
              v-loading="listLoading"
              height="220"
              :data="tempForm.SalaryAdjustmentLogs"
              border
              highlight-current-row
            >
              <el-table-column
                prop="Id"
                label="رقم"
                width="80"
                align="center"
              />
              <el-table-column
                prop="Name"
                label="التسوية"
                align="center"
              />
              <el-table-column
                prop="Description"
                label="ملاحظات"
                width="120"
                align="center"
              />
              <el-table-column
                prop="AdjustmentAmmount"
                label="القيمة"
                align="center"
              />
              <el-table-column label="تعديل" align="center">
                <template slot-scope="{ row }">
                  <edit-salary-adjustment-log :id="row.Id" @Done="getdata" />
                  <Delete-Salary-Adjustment-Log
                    :id="row.Id"
                    @Done="getdata"
                  /></template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
      </el-card> </el-col></el-row>
    <Device-Log
      table-name="Employee"
      :user-id="tempForm.EmployeeId"
      :name="tempForm.Name"
      :from-date="tempForm.SalaryFrom"
      :to-date="tempForm.SalaryTo"
      :working-hours="tempForm.WorkingHours"
      @Done="SetValue"
    />
  </div>
</template>
<script>
import { GetById, Edit } from '@/api/Salary'
import StatusTag from '@/components/Oprationsys/StatusTag'
import DrawerPrint from '@/components/PrintRepot/DrawerPrint.vue'
import AddSalaryAdjustmentLog from '../../WorkingAdjustment/Components/AddSalaryAdjustmentLog.vue'
import waves from '@/directive/waves' // waves directive
import EditSalaryAdjustmentLog from '../../WorkingAdjustment/Components/EditSalaryAdjustmentLog.vue'
import DeleteSalaryAdjustmentLog from '../../WorkingAdjustment/Components/DeleteSalaryAdjustmentLog.vue'
import DeviceLog from '@/components/Device/DeviceLog.vue'
import DialogSalaryFrom from './DialogSalaryFrom.vue'
import { parseTime, MinutesConvert } from '@/utils'

export default {
  components: {
    AddSalaryAdjustmentLog,
    DrawerPrint,
    StatusTag,
    DeviceLog,
    EditSalaryAdjustmentLog,
    DeleteSalaryAdjustmentLog,
    DialogSalaryFrom
  },
  directives: { waves },
  props: {
    isEdit: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      DisabledSave: false,
      loading: true,
      tempRoute: {},
      tableData: [],
      TotalExtraMinute: 0,
      TotalDelayMinute: 0,
      WorkingDays: 0,
      tempForm: {
        Id: undefined,
        EmployeeId: undefined,
        GrossSalary: 0,
        NetSalary: 0,
        SalaryFrom: '',
        SalaryTo: '',
        DaysCount: 0,
        status: 0,
        WorkingHours: 0,
        Name: '',
        SalaryAdjustmentLogs: []
      },
      listLoading: false
    }
  },
  created() {
    if (this.isEdit) {
      this.getdata()
      // console.log(this.$route.params )
    }
    this.tempRoute = Object.assign({}, this.$route)
  },
  methods: {
    MinutesConvert,
    SetValue(e) {
      console.log('e', e)
      this.WorkingDays = parseFloat(e.WorkingDays)
      this.TotalExtraMinute = parseFloat(e.ExtraMinute)
      this.TotalDelayMinute = parseFloat(e.DelayMinute)
      this.getdata()
    },
    getdata() {
      this.listLoading = true
      this.loading = true

      GetById({ Id: this.$route.params && this.$route.params.id }).then((response) => {
        this.tempForm = response

        this.tempForm.NetSalary = (
          parseFloat(this.tempForm.GrossSalary) +
          this.tempForm.SalaryAdjustmentLogs.reduce((prev, cur) => {
            return prev + parseFloat(cur.AdjustmentAmmount)
          }, 0)
        ).toFixed(this.$store.getters.settings.ToFixed)
        // set page title
        this.setTagsViewTitle()
        this.setPageTitle()
        this.listLoading = false
      })
      this.loading = false
    },
    confirmData() {
      this.DisabledSave = true
      this.tempForm.Status = 0
      Edit(this.tempForm)
        .then((response) => {
          this.$notify({
            title: 'تم ',
            message: 'تم احتساب بنجاح' + response,
            type: 'success',
            duration: 2000
          })
        })
        .then((res) => {
          if (res) {
            this.DisabledSave = false
          }
        })
    },
    setTagsViewTitle() {
      const title = this.$t('route.EditOrderInventory')
      const route = Object.assign({}, this.tempRoute, {
        title: `${title} - ${this.tempForm.Name} - ${parseTime(
          this.tempForm.SalaryFrom,
          '{m}\\{y}'
        )}`
      })

      this.$store.dispatch('tagsView/updateVisitedView', route)
    },
    setPageTitle() {
      const title = this.$t('route.EditOrderInventory')
      document.title = `${title} - ${this.tempForm.Name} - ${parseTime(
        this.tempForm.SalaryFrom,
        '{m}\\{y}'
      )}`
    }
  }
}
</script>
<style>
.el-date-editor.el-input,
.el-input__inner {
  width: 100%;
}
.el-col-8 {
  margin-left: 15px;
}
.BlackList {
  background: #ff1100;
}

.el-tabs__content {
  max-height: 700px;
}
</style>
