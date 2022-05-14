<template>
  <div class="app-container" style="direction: rtl">
    <el-row type="flex">
      <el-col :span="24">
        <Dialog-Salary-From
          :isEdit="false"
          :EmployeeId="EmployeeId"
          :EmployeeName="EmployeeName"
        />
      </el-col>
    </el-row>
    <el-table :data="SalaryPayment" fit border highlight-current-row height="500">
      <el-table-column prop="Id" label="Id" width="60" align="center"></el-table-column>
      <el-table-column label="من تاريخ" align="center" width="140">
        <template slot-scope="scope">
          <el-date-picker
            :format="$store.getters.settings.DateTimeFormat"
            disabled
            v-model="scope.row.SalaryFrom"
          ></el-date-picker>
        </template>
      </el-table-column>
      <el-table-column label="الى تاريخ" align="center" width="140">
        <template slot-scope="scope">
          <el-date-picker
            :format="$store.getters.settings.DateTimeFormat"
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
      <el-table-column label="#" width="260">
        <template slot-scope="{ row }">
          <el-row type="flex">
            <el-col :span="8">
              <el-button
                type="success"
                :size="$store.getters.size"
                v-if="row.Status == 0"
                @click="$router.push({ path: `/HumanResource/EditSalary/${row.Id}` })"
              >
                احتساب الراتب
              </el-button></el-col
            >
            <el-col :span="8">
              <Dialog-Salary-From :isEdit="true" :Id="row.Id" />
            </el-col>
            <el-col :span="8"> <Drawer-Print Type="SalaryPayment" :Data="row" /> </el-col>
          </el-row>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import DialogSalaryFrom from "../../Salary/Components/DialogSalaryFrom.vue";
import StatusTag from "@/components/Oprationsys/StatusTag";
import DrawerPrint from "@/components/PrintRepot/DrawerPrint.vue";

export default {
  components: { DialogSalaryFrom, StatusTag, DrawerPrint },
  props: {
    SalaryPayment: {
      type: Array,
      default: () => {
        return null;
      },
    },
    EmployeeId: {
      type: Number,
      default: undefined,
    },
    EmployeeName: {
      type: String,
    },
  },
};
</script>
