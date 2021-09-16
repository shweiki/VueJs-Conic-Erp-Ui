<template>
  <div class="app-container" style="direction: rtl">
    <el-row :gutter="20">
      <el-col :span="12">
    <select-adjustment
        :Value="adTemp"
        @SetAdjustment="
          (v) => {
            vRegion = v;
            SetVal();
          }
        "
      />
      </el-col>
    </el-row>
      
    <el-table
      @row-dblclick="
        row => {
          $router.push({ path: `/EntryAccounting/Edit/${row.EntryId}` });
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

import SelectAdjustment from '../../Adjustment/Components/SelectAdjustment.vue';
export default {
  components: { SelectAdjustment},
  props: 
    ["adTemp", "SalaryPayment", "EmployeeId", "EmployeeName"],
   
  
    data() {
    return {
      vAdjustment: "",
    };
  },
    watch: {
    adTemp(val) {
      if (val != null && val != undefined) {
        this.vAdjustment = val;
      }
    },
  },
    methods: {
    SetVal() {
      this.$emit("SetAdjustment", this.vAdjustment);
     
    },
  },
 
};
</script>
