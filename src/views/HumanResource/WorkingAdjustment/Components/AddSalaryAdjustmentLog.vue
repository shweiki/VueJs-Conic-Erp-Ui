<template>
  <div>
    <el-button
      type="warning"
      icon="el-icon-circle-plus"
      @click="dialogFormVisible = true"
    >
      <span style="font-size: 14px">إيرادات \ إقتطاعات </span>
    </el-button>
    <el-dialog
      style="margin-top: -13vh"
      :show-close="false"
      :visible.sync="dialogFormVisible"
    >
      <div slot="title" class="dialog-footer">
        <el-col :span="4">
          <el-button
            icon="fa fa-save"
            style="float: left"
            type="primary"
            @click="createData()"
          />
        </el-col>
        <el-col :span="20">
          <el-divider> إيرادات \ إقتطاعات </el-divider>
        </el-col>
      </div>
      <el-form
        ref="EmployeeLogForm"
        :model="tempForm"
        label-position="top"
        class="demo-form-inline"
      >
        <el-row type="flex">
          <el-col :span="12">
            <el-form-item prop="EmployeeName" label="اسم الموظف">
              <el-input v-model="EmployeeName" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="EmployeeId" label="الرقم الوظيفي">
              <el-input v-model="EmployeeId" disabled />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex">
          <el-col :span="12">
            <el-form-item prop="AdjustmentId" label="التسوية">
              <Select-Adjustment
                :gross-salary="GrossSalary"
                :extra-hours="ExtraHours"
                :delay-hours="DelayHours"
                :value="tempForm.AdjustmentId"
                @SetAdjustment="
                  (v) => {
                    tempForm.AdjustmentId = v;
                  }
                "
                @SetAdjustmentAmount="
                  (v) => {
                    tempForm.AdjustmentAmmount = v;
                  }
                "
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="القيمة ">
              <currency-input
                v-model="tempForm.AdjustmentAmmount"
                :rules="[
                  {
                    required: true,
                    message: 'لايمكن ترك القيمة فارغ',
                    trigger: 'blur',
                  },
                ]"
                class="currency-input"
                :value-range="{ min: -10000, max: 10000 }"
                @focus="$event.target.select()"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item prop="Description" label="ملاحظات ">
          <el-input v-model="tempForm.Description" />
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import SelectAdjustment from '../../Adjustment/Components/SelectAdjustment.vue'
import { Create } from '@/api/SalaryAdjustmentLog'

export default {
  name: 'Adjustment',
  components: { SelectAdjustment },
  props: [
    'EmployeeId',
    'EmployeeName',
    'SalaryPaymentId',
    'GrossSalary',
    'ExtraHours',
    'DelayHours'
  ],
  data() {
    return {
      dialogFormVisible: false,
      tempForm: {
        Id: undefined,
        AdjustmentAmmount: 0.0,
        Description: '',
        Status: 0,
        AdjustmentId: undefined,
        SalaryPaymentId: undefined
      }
    }
  },

  created() {
    this.resetTempForm()
  },
  methods: {
    getData(val) {},
    resetTempForm() {
      this.tempForm = {
        Id: undefined,
        AdjustmentAmmount: 0.0,
        Description: '',
        Status: 0,
        AdjustmentId: undefined,
        SalaryPaymentId: undefined
      }
    },
    createData() {
      this.$refs['dataForm']
      this.tempForm.SalaryPaymentId = this.SalaryPaymentId
      Create(this.tempForm)
        .then((response) => {
          this.dialogFormVisible = false
          this.$notify({
            title: 'تم ',
            message: 'تم الإضافة بنجاح',
            type: 'success',
            duration: 2000
          })
        })
        .catch((error) => {
          console.log(error)
        })
    }
  }
}
</script>
