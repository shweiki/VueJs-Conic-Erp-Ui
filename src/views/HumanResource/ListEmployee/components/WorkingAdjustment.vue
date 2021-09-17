<template>
  <div class="app-container" style="direction: rtl">
    <el-row :gutter="20">
      <el-col :span="4">
      <add-adjustment/>
    </el-col>
    <el-col :span="4">
      <add-static-adjustment/>
    </el-col>
    <el-col :span="16">
    <Adjustment-Bind :EmployeeId="EmployeeId" :EmployeeName="EmployeeName" />
      </el-col>
    </el-row>
      
    <el-table
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
          <el-table-column label="التاريخ" align="center" width="140">
        <template slot-scope="scope">
          <el-date-picker
            format="dd/MM/yyyy"
            disabled
            v-model="scope.row.SalaryPeriod"
          ></el-date-picker>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import AddAdjustment from "../../Adjustment/Components/AddAdjustment.vue";
import AddStaticAdjustment from "../../Adjustment/Components/AddStaticAdjustment.vue";
import SelectAdjustment from '../../Adjustment/Components/SelectAdjustment.vue';
import AdjustmentBind from '../../WorkingAdjustment/Components/AdjustmentBind.vue';
export default {
  components: { SelectAdjustment, AddAdjustment, AddStaticAdjustment, AdjustmentBind},
  props: 
    ["SalaryPayment", "EmployeeId", "EmployeeName"],
  
};
</script>
