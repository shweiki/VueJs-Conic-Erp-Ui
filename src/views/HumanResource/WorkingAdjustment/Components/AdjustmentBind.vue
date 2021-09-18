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
         @SetAdjustmentAmount="
          (v) => {
             tempForm.AdjustmentAmmount = v;
          }
        "
         @CheckStatic="
          (v) => {
             IsStatic = v;
          }
        "
         @CheckWork="
          (v) => {
             IsWork = v;
          }
        "
        
      />
      </el-form-item>
      <el-form-item prop="Description" label="ملاحظات ">
             <el-input  v-model="tempForm.Description"></el-input>
            </el-form-item>
        </el-form>
    </el-dialog>
  </div>
</template>
<script>
import SelectAdjustment from '../../Adjustment/Components/SelectAdjustment.vue';
import { Create as CreateWork} from "@/api/WorkingAdjustment";
import { Create as CreateStatic} from "@/api/StaticAdjustment";

export default {
  name: "Adjustment",
  props: {
    EmployeeId:{
      type: Number,
    },
    EmployeeName:{
      type: String,
    },
    SalaryPaymentId:{
      type: Number,
    },
     WorkingHourId :{
      type: Number
    }
  },
   
  components: {SelectAdjustment},
  data() {
    return {
      radio: '1',
      type:'1',
      dialogFormVisible: false,
      IsStatic : false,
      IsWork : false,
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

        StaticTemp :{
          Id: undefined,
          AdjustmentAmount: 0.0,
          AdjustmentPercentage: 0.0,
          AdjustmentId: undefined,
          SalaryPaymentId: undefined,
        }
    
    };
  },
 
  mounted() {
    this.resetTempForm();
    //this.getData(this.SalaryPaymentId);
  },
  methods: {

      getData(val) {
      // GetSalaryById({ Id: val })
      //   .then((response) => {
      //     this.tempForm.SalaryPaymentId = response.Id;
      //   })
      //   .catch((err) => {
      //     console.log(err);
      //   });
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
     if (this.IsWork){
       this.tempForm.SalaryPaymentId = this.SalaryPaymentId;
      this.tempForm.WorkingHoursLogId = this.WorkingHourId;
          CreateWork(this.tempForm)
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
        }
        if (this.IsStatic){
          this.StaticTemp.SalaryPaymentId = this.SalaryPaymentId;
          this.StaticTemp.AdjustmentAmount =  this.tempForm.AdjustmentAmmount
          this.StaticTemp.AdjustmentPercentage =  this.tempForm.AdjustmentAmmount
          this.StaticTemp.AdjustmentId =  this.tempForm.AdjustmentId
          console.log("this.StaticTemp", this.StaticTemp)
          CreateStatic(this.StaticTemp)
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
        }

     
    },
 
  }
};
</script>
