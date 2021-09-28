<template>
  <div class="app-container" style="direction: rtl">
    <el-row :gutter="20">
      <el-col :span="10">
        <add-salary
          :LastSalary="LastSalary"
          :SalaryPayment="SalaryPayment"
          :EmployeeId="EmployeeId"
          :EmployeeName="EmployeeName"
        />
      </el-col>
      <el-col :span="12">
        <!-- <SalaryCalculation :SalaryPaymentId="SalaryPaymentId" :SalaryPayment="SalaryPayment" :EmployeeId="EmployeeId" :EmployeeName="EmployeeName"/> -->
      </el-col>
    </el-row>
    <el-table :data="SalaryPayment" fit border highlight-current-row height="500">
      <el-table-column prop="Id" label="Id" width="80" align="center"></el-table-column>
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
      <el-table-column label="GrossSalary" width="100" align="center">
        <template slot-scope="scope">{{
          scope.row.GrossSalary.toFixed($store.getters.settings.ToFixed)
        }}</template>
      </el-table-column>
      <el-table-column label="NetSalary" prop="NetSalary" width="100" align="center">
        <template slot-scope="scope">{{
          scope.row.NetSalary.toFixed($store.getters.settings.ToFixed)
        }}</template>
      </el-table-column>
      <el-table-column
        prop="WorkingHours"
        label="WorkingHours"
        align="center"
      ></el-table-column>
      <el-table-column v-bind:label="$t('Sales.Status')" width="120" align="center">
        <template slot-scope="scope">
          <Status-Tag :Status="scope.row.Status" TableName="SalaryPayment" />
        </template>
      </el-table-column>
      <el-table-column label="">
        <template slot-scope="{ row }">
          <el-button
            type="success"
            v-if="row.Status == 0"
            @click="$router.push({ path: `/HumanResource/SalaryCal/${row.Id}` })"
          >
            احتساب الراتب
          </el-button>
          <Drawer-Print Type="SalaryPayment" :Data="row" />
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import AddSalary from "../../Salary/Components/AddSalary";
import SalaryCal from "../../Salary/Components/SalaryCal";
import StatusTag from "@/components/Oprationsys/StatusTag";
import DrawerPrint from "@/components/PrintRepot/DrawerPrint.vue";

export default {
  components: { AddSalary, SalaryCal, StatusTag, DrawerPrint },
  props: {
    SalaryPayment: {
      type: Array,
      default: () => {
        return null;
      },
    },
    LastSalary: {
      type: Number,
    },
    EmployeeId: {
      type: Number,
      default: undefined,
    },
    EmployeeName: {
      type: String,
    },
    SalaryPaymentId: {
      type: Number,
    },
  },
};
</script>
