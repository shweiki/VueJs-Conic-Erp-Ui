<template>
  <div>
   <el-button
              type="primary"
              icon="el-icon-plus"
              @click="Visibles = true"
            >تعديل الراتب</el-button>
    <el-dialog style="margin-top: -13vh" title="تعديل الراتب" :visible.sync="Visibles">
      <el-form
        :model="Temp"
        ref="SalaryForm"
        label-position="top"
        class="demo-form-inline"
      >
        <el-row :gutter="20">
            <el-col :span="8">
            <el-form-item prop="EmployeeId" label="الرقم الوظيفي ">
              <el-input disabled v-model="EmployeeId"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="15">
            <el-form-item prop="EmployeeName" label="اسم الموظف">
              <el-input disabled v-model="EmployeeName"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
           <el-col :span="24">
            <el-form-item label="الراتب الكلي" prop="GrossSalary">
              <el-input-number
                v-model="Temp.GrossSalary"
                :precision="2"
                :step="1.0"
                :min="0.0"
                :max="5000"
                @focus="$event.target.select()"
              ></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="Visibles = false">{{ $t("AddVendors.Cancel") }}</el-button>
        <el-button type="primary" @click="update()">{{
          $t("AddVendors.Save")
        }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { Update } from "@/api/Salary";
import EmployeeSearchAny from "@/components/HumanResource/EmployeeSearchAny";
import permission from "@/directive/permission/index.js";
import FakeDate from "@/components/Date/FakeDate.vue";
export default {
  components: { EmployeeSearchAny, FakeDate },
  directives: { permission },
  props:{
       SalaryPayment: {
      type: Array,
      default: () => {
        return null;
      }
    },
    EmployeeId:{
      type: Number,
      default: undefined
    },
    EmployeeName:{
      type: String
    },
    LastSalary:{
      type: Number
    }
    },
  data() {
    return {
      Temp: {
        Id: undefined,
        EmployeeId :0,
        GrossSalary: 0.0,
      },
      Visibles: false,
      
    };
  },
  methods: {
    update() {
      this.$refs["SalaryForm"].validate((valid) => {
        if (valid) {
          this.Temp.Id = this.LastSalary;
          Update(this.Temp)
            .then((response) => {
              this.Visibles = false;
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
        }
      });
    },
  },
};
</script>
