<template>
  <div class="app-container">
    <el-row type="flex">
      <el-col :span="3">
        <el-button v-waves class="filter-item" type="primary" icon="el-icon-search">
        </el-button>
      </el-col>
      <el-col :span="3">
        <Drawer-Print Type="SalaryPayment" :Data="tempForm" />
      </el-col>
      <el-col :span="3">
        <Dialog-Salary-From
          :isEdit="true"
          :Id="parseInt($route.params && $route.params.id)"
        />
      </el-col>
      <el-col :span="3">
        <el-button
          :disabled="DisabledSave"
          @click="confirmData"
          type="success"
          icon="el-icon-check"
        ></el-button>
      </el-col>
    </el-row>
    <el-row type="flex"
      ><el-col :span="12">
        <el-row type="flex">
          <el-col :span="24" :xs="24" v-loading="loading">
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                احتساب الراتب :
                <span>
                  <Status-Tag :Status="tempForm.Status" TableName="SalaryPayment" />
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
        </el-row></el-col
      ><el-col :span="12">
        <el-card class="box-card">
          <Add-Salary-Adjustment-Log
            :EmployeeId="tempForm.EmployeeId"
            :EmployeeName="tempForm.Name"
            :SalaryPaymentId="tempForm.Id"
            :GrossSalary="tempForm.GrossSalary"
            :Absent="AbsentCount"
            v-bind:ExtraHours="
              (parseFloat(MinutesConvert(TotalExtraMinute, '.')) + 0.4) *
              (tempForm.GrossSalary / tempForm.DaysCount / tempForm.WorkingHours)
            "
            v-bind:DelayHours="
              (parseFloat(MinutesConvert(TotalDelayMinute, '.')) + 0.4) *
              (tempForm.GrossSalary / tempForm.DaysCount / tempForm.WorkingHours)
            "
          />
          <el-row type="flex">
            <el-col :span="24">
              <el-table
                height="220"
                :data="tempForm.SalaryAdjustmentLogs"
                v-loading="listLoading"
                border
                highlight-current-row
              >
                <el-table-column
                  prop="Id"
                  label="رقم"
                  width="80"
                  align="center"
                ></el-table-column>
                <el-table-column
                  prop="Name"
                  label="التسوية"
                  align="center"
                ></el-table-column>
                <el-table-column
                  prop="Description"
                  label="ملاحظات"
                  width="120"
                  align="center"
                ></el-table-column>
                <el-table-column
                  prop="AdjustmentAmmount"
                  label="القيمة"
                  align="center"
                ></el-table-column>
                <el-table-column label="تعديل" align="center">
                  <template slot-scope="{ row }">
                    <edit-salary-adjustment-log :Id="row.Id" @Done="getdata" />
                    <Delete-Salary-Adjustment-Log :Id="row.Id" @Done="getdata"
                  /></template>
                </el-table-column>
              </el-table>
            </el-col>
          </el-row>
        </el-card> </el-col
    ></el-row>
    <Device-Log
      TableName="Employee"
      :UserId="tempForm.EmployeeId"
      :Name="tempForm.Name"
      :FromDate="tempForm.SalaryFrom"
      :ToDate="tempForm.SalaryTo"
      :WorkingHours="tempForm.WorkingHours"
      @Done="SetValue"
    />
  </div>
</template>
<script>
import { GetById, Edit } from "@/api/Salary";
import StatusTag from "@/components/Oprationsys/StatusTag";
import DrawerPrint from "@/components/PrintRepot/DrawerPrint.vue";
import RadioOprations from "@/components/Oprationsys/RadioOprations";
import DialogActionLog from "@/components/ActionLog/DialogActionLog.vue";
import AddSalaryAdjustmentLog from "../../WorkingAdjustment/Components/AddSalaryAdjustmentLog.vue";
import waves from "@/directive/waves"; // waves directive
import EditSalaryAdjustmentLog from "../../WorkingAdjustment/Components/EditSalaryAdjustmentLog.vue";
import DeleteSalaryAdjustmentLog from "../../WorkingAdjustment/Components/DeleteSalaryAdjustmentLog.vue";
import DeviceLog from "@/views/HumanResource/ListEmployee/components/DeviceLog.vue";
import DialogSalaryFrom from "../../Salary/Components/DialogSalaryFrom.vue";
import { parseTime, TimeConvert, MinutesConvert } from "@/utils";

export default {
  components: {
    DialogActionLog,
    RadioOprations,
    AddSalaryAdjustmentLog,
    DrawerPrint,
    StatusTag,
    DeviceLog,
    EditSalaryAdjustmentLog,
    DeleteSalaryAdjustmentLog,
    DialogSalaryFrom,
  },
  directives: { waves },
  data() {
    return {
      DisabledSave: false,
      loading: true,
      tableData: [],
      TotalExtraMinute: 0,
      TotalDelayMinute: 0,
      WorkingDays: 0,

      tempForm: {
        Id: undefined,
        EmployeeId: undefined,
        GrossSalary: 0,
        NetSalary: 0,
        SalaryFrom: "",
        SalaryTo: "",
        DaysCount: 0,
        status: 0,
        WorkingHours: 0,
        Name: "",
        SalaryAdjustmentLogs: [],
      },
      listLoading: false,
    };
  },

  created() {
    this.getdata();
  },
  methods: {
    MinutesConvert,
    SetValue(e) {
      console.log("e", e);
      this.WorkingDays = parseFloat(e.WorkingDays);
      this.TotalExtraMinute = parseFloat(e.ExtraMinute);
      this.TotalDelayMinute = parseFloat(e.DelayMinute);
      this.getdata();
    },
    getdata() {
      this.listLoading = true;
      this.loading = true;

      GetById({ Id: this.$route.params && this.$route.params.id }).then((response) => {
        this.tempForm = response;
this.setTagsViewTitle();
          // set page title
          this.setPageTitle();
        this.tempForm.NetSalary = (
          parseFloat(this.tempForm.GrossSalary) +
          this.tempForm.SalaryAdjustmentLogs.reduce((prev, cur) => {
            return prev + parseFloat(cur.AdjustmentAmmount);
          }, 0)
        ).toFixed(this.$store.getters.settings.ToFixed);
        this.listLoading = false;
      });
      this.loading = false;
    },
    confirmData() {
      this.DisabledSave = true;
      this.tempForm.Status = 0;
      Edit(this.tempForm)
        .then((response) => {
          this.$notify({
            title: "تم ",
            message: "تم احتساب بنجاح" + response,
            type: "success",
            duration: 2000,
          });
        })
        .then((res) => {
          if (res) {
            this.DisabledSave = false;
          }
        });
    },  setTagsViewTitle() {
      const title = "احتساب راتب "+this.tempForm.Name+" لشهر "+this.tempForm.SalaryFrom ;
      const route = Object.assign({}, this.tempRoute, {
        title: `${this.tempForm.Id} - ${title}`,
      });
      this.$store.dispatch("tagsView/updateVisitedView", route);
    },
    setPageTitle() {
      const title = "موظف";
      document.title = `${title} - ${this.tempForm.Id}`;
    },
  },
};
</script>
<style>
.el-date-editor.el-input,
.el-input__inner {
  width: 100%;
}
.el-col-8 {
  margin-left: 15px;
}

/*
.el-input.is-disabled .el-input__inner {
  color: #3399a5;
  font-weight: 650;
}*/

.BlackList {
  background: #ff1100;
}

.el-tabs__content {
  max-height: 700px;
}
</style>
