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
    <Adjustment-Bind :WorkingHourId="WorkingHourId" :EmployeeId="EmployeeId" :EmployeeName="EmployeeName" :SalaryPaymentId="SalaryPaymentId" />
      </el-col>
    </el-row>
      
    <el-table
      :data="WorkingAdjustment"
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
        label="AdjustmentName"
        prop="Name"
        width="200"
        align="center"
      >
        <template slot-scope="scope">{{
          scope.row.AdjustmentName
        }}</template>
      </el-table-column>
      <el-table-column
        label="AdjustmentAmmount"
        width="100"
        align="center"
      >
        <template slot-scope="scope">{{
          scope.row.AdjustmentAmmount.toFixed($store.getters.settings.ToFixed)
        }}</template>
      </el-table-column>
      <el-table-column
        label="Tax"
        prop="Tax"
        width="100"
        align="center"
      >
        <template slot-scope="scope">{{
          scope.row.Tax.toFixed($store.getters.settings.ToFixed)
        }}</template>
      </el-table-column>
        <el-table-column
        label="Description"
        prop="Description"
        width="200"
        align="center"
      >
        <template slot-scope="scope">{{
          scope.row.Description
        }}</template>
      </el-table-column>
           <el-table-column label="التاريخ" align="center" width="140">
        <template slot-scope="scope">
          <div v-if="scope.row.StartDate">
          <el-date-picker
            format="dd/MM/yyyy"
            disabled
            v-model="scope.row.StartDate"
          ></el-date-picker>
          </div>
          <div v-else>
          <el-date-picker
            format="dd/MM/yyyy"
            disabled
            v-model="scope.row.EndDate"
          ></el-date-picker>
          </div>
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
    WorkingAdjustment:{
      type: Array,
    },
    WorkingHourId :{
      type: Number
    }

  }
  
};
</script>
