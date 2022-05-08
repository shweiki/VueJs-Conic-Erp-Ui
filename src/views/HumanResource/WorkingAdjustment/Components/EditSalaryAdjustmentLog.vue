<template>
  <div>
    <el-button type="warning" icon="el-icon-edit" @click="getData" round />
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
            @click="Edit()"
          />
        </el-col>
        <el-col :span="20">
          <el-divider>تعديل إيرادات \ إقتطاعات </el-divider>
        </el-col>
      </div>
      <el-form
        :model="tempForm"
        ref="EmployeeLogForm"
        label-position="top"
        class="demo-form-inline"
      >
        <el-row type="flex">
          <el-col :span="12">
            <el-form-item prop="EmployeeName" label="اسم الموظف">
              <el-input disabled v-model="tempForm.Name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="EmployeeId" label="الرقم الوظيفي">
              <el-input disabled v-model="tempForm.EmployeeId"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex">
          <el-col :span="12">
            <el-form-item prop="AdjustmentId" label="التسوية">
              <Select-Adjustment
                :GrossSalary="tempForm.GrossSalary"
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
                :value-range="{ min: -10000, max: 10000 }"
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
import { GetById, Edit } from "@/api/SalaryAdjustmentLog";

export default {
  props: ["Id"],
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
  methods: {
    getData() {
      GetById({ Id: this.Id }).then((res) => {
        this.tempForm = res;
      });
      this.dialogFormVisible = true;
    },
    Edit() {
      this.$refs["dataForm"];
      Edit(this.tempForm)
        .then((response) => {
          this.dialogFormVisible = false;
          this.$notify({
            title: "تم ",
            message: "تم الإضافة بنجاح",
            type: "success",
            duration: 2000,
          });
          this.$emit("Done");
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
};
</script>
