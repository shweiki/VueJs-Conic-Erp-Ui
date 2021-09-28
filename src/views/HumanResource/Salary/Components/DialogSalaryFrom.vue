<template>
  <div>
    <el-button
      type="primary"
      v-bind:icon="isEdit ? 'el-icon-edit' : 'el-icon-plus'"
      @click="Visibles = true"
      >{{ isEdit ? "تعديل" : "إضافة" }} الراتب</el-button
    >
    <el-dialog style="margin-top: -13vh" title="تعديل الراتب" :visible.sync="Visibles">
      <el-form
        :model="tempForm"
        ref="SalaryForm"
        label-position="top"
        class="demo-form-inline"
      >
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item prop="EmployeeId" label="الرقم الوظيفي ">
              <el-input disabled v-model="tempForm.EmployeeId"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="15">
            <el-form-item prop="Name" label="اسم الموظف">
              <el-input disabled v-model="tempForm.Name"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="الفترة" prop="SalaryFrom">
              <Search-By-Date
                :Value="[tempForm.SalaryFrom, tempForm.SalaryTo]"
                @Set="
                  (v) => {
                    tempForm.SalaryFrom = v[0];
                    tempForm.SalaryTo = v[1];
                  }
                "
            /></el-form-item> </el-col
        ></el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="الراتب الكلي" prop="GrossSalary">
              <el-input-number
                v-model="tempForm.GrossSalary"
                :precision="2"
                :step="1.0"
                :min="0.0"
                :max="5000"
                @focus="$event.target.select()"
              ></el-input-number>
            </el-form-item> </el-col
          ><el-col :span="12">
            <el-form-item label="ساعات الدوام " prop="WorkingHours">
              <el-input-number
                v-model="tempForm.WorkingHours"
                :step="1.0"
                :min="0.0"
                :max="15"
                @focus="$event.target.select()"
              ></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="Visibles = false">{{ $t("AddVendors.Cancel") }}</el-button>
        <el-button type="primary" @click="confirmData">{{
          $t("AddVendors.Save")
        }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { Create, Edit, GetById } from "@/api/Salary";
import permission from "@/directive/permission/index.js";
import SearchByDate from "@/components/Date/SearchByDate.vue";
import { GetLastSalaryById } from "@/api/Salary";

export default {
  components: { SearchByDate },
  directives: { permission },
  props: {
    isEdit: {
      type: Boolean,
      default: () => {
        return false;
      },
    },
    Id: {
      type: Number,
      default: undefined,
    },
    EmployeeId: {
      type: Number,
      default: undefined,
    },
    EmployeeName: {
      type: String,
    },
  },
  data() {
    return {
      tempForm: {
        Id: undefined,
        EmployeeId: 0,
        Name: "",
        GrossSalary: 0.0,
        NetSalary: 0.0,
        WorkingHours: 0,
        SalaryFrom: "",
        SalaryTo: "",
        Status: 0,
      },
      Visibles: false,
    };
  },
  created() {
    if (this.isEdit) {
      GetById({ Id: this.Id }).then((res) => {
        this.tempForm = res;
      });
    } else {
      if (this.EmployeeId != undefined && this.EmployeeId > 0) {
        this.tempForm.EmployeeId = this.EmployeeId;

        GetLastSalaryById({ Id: this.EmployeeId }).then((res) => {
          if (res) {
            this.tempForm.GrossSalary = res.GrossSalary;
            this.tempForm.WorkingHours = res.WorkingHours;
            this.tempForm.SalaryFrom = res.SalaryFrom;
            this.tempForm.SalaryTo = res.SalaryTo;
          }
        });
      }
      if (this.EmployeeName != undefined && this.EmployeeName != "")
        this.tempForm.Name = this.EmployeeName;
    }
  },
  methods: {
    confirmData() {
      this.$refs["SalaryForm"].validate(async (valid) => {
        if (valid) {
          let Done;
          if (this.isEdit != true) {
            Done = await Create(this.tempForm)
              .then((res) => {
                if (res) return res;
                else return false;
              })
              .catch((error) => {
                return false;
              });
          } else {
            Done = await Edit(this.tempForm)
              .then((res) => {
                if (res) return res;
                else return false;
              })
              .catch((error) => {
                return false;
              });
          }
          if (Done) {
            this.Visibles = false;
            this.$notify({
              title: "تم " + this.isEdit ? "تعديل" : "إضافة" + "  بنجاح",
              message: "تم " + this.isEdit ? "تعديل" : "إضافة" + " ",
              type: "success",
              position: "top-left",
              duration: 1000,
              showClose: false,
            });
          } else {
            this.Visibles = false;
            this.$notify({
              title: "مشكلة",
              message: "حصلت مشكلة في عملية الحفظ",
              type: "error",
              position: "top-left",
              duration: 1000,
              showClose: false,
            });
          }
        }
      });
    },
  },
};
</script>
