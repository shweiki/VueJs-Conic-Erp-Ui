<template>
  <div class="app-container" style="direction: rtl">
    <el-row :gutter="20">
      <el-col :span="10">
    <add-salary :LastSalary="LastSalary" :SalaryPayment="SalaryPayment" :EmployeeId="EmployeeId" :EmployeeName="EmployeeName" />
      </el-col>
      <el-col :span="12">
        <!-- <SalaryCalculation :SalaryPaymentId="SalaryPaymentId" :SalaryPayment="SalaryPayment" :EmployeeId="EmployeeId" :EmployeeName="EmployeeName"/> -->
        <el-button @click="cal()">
          احتساب الراتب
        </el-button>
         </el-col>
    </el-row>
    <el-table
      @row-dblclick="
        row => {
          $router.push({ path: `/Salary/Details/${row.EntryId}` });
        }
      "
      :data="SalaryPayment"
      fit
      border
      highlight-current-row
      height="500"
    >
      <el-table-column
        prop="Id"
        label="Id"
        width="80"
        align="center"
      ></el-table-column>
      <el-table-column
        label="GrossSalary"
        width="100"
        align="center"
      >
        <template slot-scope="scope">{{
          scope.row.GrossSalary.toFixed($store.getters.settings.ToFixed)
        }}</template>
      </el-table-column>
      <el-table-column
        label="NetSalary"
        prop="totalDebit"
        width="100"
        align="center"
      >
        <template slot-scope="scope">{{
          scope.row.NetSalary.toFixed($store.getters.settings.ToFixed)
        }}</template>
      </el-table-column>
       <el-table-column
        prop="WorkingHours"
        label="WorkingHours"
        width="80"
        align="center"
      ></el-table-column>
          <el-table-column label="من تاريخ" align="center" width="140">
        <template slot-scope="scope">
          <el-date-picker
            format="dd/MM/yyyy"
            disabled
            v-model="scope.row.SalaryFrom"
          ></el-date-picker>
        </template>
      </el-table-column>
        <el-table-column label="الى تاريخ" align="center" width="140">
        <template slot-scope="scope">
          <el-date-picker
            format="dd/MM/yyyy"
            disabled
            v-model="scope.row.SalaryTo"
          ></el-date-picker>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import AddSalary from "../../Salary/Components/AddSalary";
import SalaryCal from "../../Salary/Components/SalaryCal";
export default {
  components: {AddSalary, SalaryCal},
  props: {
      SalaryPayment: {
      type: Array,
      default: () => {
        return null;}
      },
      LastSalary: {
      type: Number
    },
    EmployeeId:{
      type: Number,
      default: undefined
    },
     EmployeeName:{
      type: String,
    },
    SalaryPaymentId:{
      type: Number
    },
  },
  methods:{
    cal(){
       
        let r = this.$router.resolve({
          path: '/HumanResource/SalaryCal/' + this.LastSalary,
        });
        window.open(r.href, r.route.name, this.$store.getters.settings.windowStyle);
        
    }
  },
 
};
</script>
