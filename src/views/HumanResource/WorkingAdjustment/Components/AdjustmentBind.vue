<template>
  <div>
    <el-button
      type="warning"
      icon="el-icon-circle-plus"
      @click="dialogFormVisible = true"
      round
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
        <el-row>
          <el-col :span="12">
            <el-form-item prop="AdjustmentId" label="التسوية">
              <Select-Adjustment
                :GrossSalary="GrossSalary"
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
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="القيمة ">
              <currency-input
                :rules="[
                  {
                    required: true,
                    message: 'لايمكن ترك القيمة فارغ',
                    trigger: 'blur',
                  },
                ]"
                class="currency-input"
                v-model="tempForm.AdjustmentAmmount"
                :value-range="{ min: -1000, max: 1000 }"
                @focus="$event.target.select()"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item prop="Description" label="ملاحظات ">
          <el-input v-model="tempForm.Description"></el-input>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import SelectAdjustment from "../../Adjustment/Components/SelectAdjustment.vue";
import { Create } from "@/api/SalaryAdjustmentLog";

export default {
  name: "Adjustment",
  props: {
    EmployeeId: {
      type: Number,
    },
    EmployeeName: {
      type: String,
    },
    SalaryPaymentId: {
      type: Number,
    },
    GrossSalary: {
      type: Number,
    },
  },

  components: { SelectAdjustment },
  data() {
    return {
      dialogFormVisible: false,
      tempForm: {
        Id: undefined,
        AdjustmentAmmount: 0.0,
        Description: "",
        Status: 0,
        AdjustmentId: undefined,
        SalaryPaymentId: undefined,
      },
    };
  },

  mounted() {
    this.resetTempForm();
    //this.getData(this.SalaryPaymentId);
  },
  methods: {
    getData(val) {},
    resetTempForm() {
      this.tempForm = {
        Id: undefined,
        AdjustmentAmmount: 0.0,
        Description: "",
        Status: 0,
        AdjustmentId: undefined,
        SalaryPaymentId: undefined,
      };
    },
    createData() {
      this.$refs["dataForm"];
      this.tempForm.SalaryPaymentId = this.SalaryPaymentId;
      Create(this.tempForm)
        .then((response) => {
          this.dialogFormVisible = false;
          this.$notify({
            title: "تم ",
            message: "تم الإضافة بنجاح",
            type: "success",
            duration: 2000,
          });
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
};
</script>
