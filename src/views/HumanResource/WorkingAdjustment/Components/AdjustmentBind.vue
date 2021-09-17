<template>
  <div>
    <el-button
      type="success"
      icon="el-icon-circle-plus"
      @click="dialogFormVisible = true"
       round
    >
    <span style="font-size: 14px;">
    زيادة / خصم
    </span>
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
          <el-divider> زيادة / خصم </el-divider>
        </el-col>
      </div>
        <el-form
        :model="tempForm"
        ref="EmployeeLogForm"
        label-position="top"
        class="demo-form-inline"
      >
    <el-row>
          <el-col :span="12">
            <el-form-item prop="EmployeeName" label="اسم الموظف">
            <el-input disabled v-model="EmployeeName"></el-input>
            </el-form-item>
          </el-col>
           <el-col :span="12">
            <el-form-item prop="EmployeeId" label="الرقم الوظيفي">
             <el-input disabled v-model="EmployeeId"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item prop="AdjustmentId" label="التسوية">
             <Select-Adjustment
        :Value="tempForm.AdjustmentId"
        @SetAdjustment="
          (v) => {
             tempForm.AdjustmentId = v;
          }
        "
      />
      </el-form-item>
        </el-form>
    </el-dialog>
  </div>
</template>
<script>
import SelectAdjustment from '../../Adjustment/Components/SelectAdjustment.vue';
import { Create } from "@/api/WorkingAdjustment";
import { GetSalaryById } from "@/api/Salary";
export default {
  name: "Adjustment",
  props: 
    ["EmployeeId", "EmployeeName", "SalaryPayment"],
  components: {SelectAdjustment},
  data() {
    return {
      radio: '1',
      type:'1',
      dialogFormVisible: false,
       vAdjustment: "",
      tempForm: {
        Id: undefined,
        AdjustmentAmmount: 0.0,
        Tax: 0.0,
        Description: "",
        Status: 0,
        AdjustmentId: undefined,
        SalaryPaymentId: undefined,
        WorkingHoursLogId: undefined,
        },
    
    };
  },
 
  created() {
    this.getData(this.EmployeeId);
  },
  methods: {

      getData(val) {
      GetSalaryById({ Id: val })
        .then((response) => {
          this.tempForm.SalaryPaymentId = response.Id;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    resetTempForm() {
      this.tempForm = {
        Id: undefined,
        AdjustmentAmmount: 0.0,
        Tax: 0.0,
        Description: "",
        Status: 0,
        AdjustmentId: undefined,
        SalaryPaymentId: undefined,
        WorkingHoursLogId: undefined,
      };
    },
    createData() {
      this.$refs["dataForm"]
      this.tempForm.SalaryPaymentId = this.SalaryPayment.Id;
          Create(this.tempForm)
            .then(response => {
              this.dialogFormVisible = false;
              this.$notify({
                title: "تم ",
                message: "تم الإضافة بنجاح",
                type: "success",
                duration: 2000
              });
            })
            .catch(error => {
              console.log(error);
            });
        
     
    },
 
  }
};
</script>
