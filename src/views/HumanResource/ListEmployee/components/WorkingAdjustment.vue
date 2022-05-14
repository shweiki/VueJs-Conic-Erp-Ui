<template>
  <div class="app-container" style="direction: rtl">
    <el-row :gutter="20">
      <el-col :span="4">
        <add-adjustment />
      </el-col>
      <el-col :span="4">
        <add-static-adjustment />
      </el-col>
      <el-col :span="16">
        <Adjustment-Bind
          :WorkingHourId="WorkingHourId"
          :EmployeeId="EmployeeId"
          :EmployeeName="EmployeeName"
          :SalaryPaymentId="SalaryPaymentId"
        />
      </el-col>
    </el-row>

    <el-card class="box-card">
      <el-tabs
        v-model="activeTab"
        type="card"
        tab-position="top"
        @tab-click="tabClick"
      >
        <el-tab-pane label="التسويات العادية" name="RegularAdjustment">
          <span slot="label"
            ><i class="el-icon-refresh"></i> التسويات العادية</span
          >
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
              width="60"
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
                scope.row.AdjustmentAmmount.toFixed(
                  $store.getters.settings.ToFixed
                )
              }}</template>
            </el-table-column>
            <el-table-column label="Tax" prop="Tax" width="100" align="center">
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
                    :format="$store.getters.settings.DateTimeFormat"
                    disabled
                    v-model="scope.row.StartDate"
                  ></el-date-picker>
                </div>
                <div v-else>
                  <el-date-picker
                    :format="$store.getters.settings.DateTimeFormat"
                    disabled
                    v-model="scope.row.EndDate"
                  ></el-date-picker>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <el-tab-pane label="التسويات الدورية" name="PeriodicAdjustment">
          <span slot="label"
            ><i class="el-icon-refresh"></i> التسويات الدورية</span
          >
          <el-table
            :data="StaticAdjustment"
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
              label="AdjustmentAmount"
              width="100"
              align="center"
            >
              <template slot-scope="scope">{{
                scope.row.AdjustmentAmount.toFixed(
                  $store.getters.settings.ToFixed
                )
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
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>
<script>
import AddAdjustment from "../../Adjustment/Components/AddAdjustment.vue";
import AddStaticAdjustment from "../../Adjustment/Components/AddStaticAdjustment.vue";
import SelectAdjustment from "../../Adjustment/Components/SelectAdjustment.vue";
import AdjustmentBind from "../../WorkingAdjustment/Components/AddSalaryAdjustmentLog.vue";
import { GetWorkingAdjustmentBySalaryId } from "@/api/SalaryAdjustmentLog";
export default {
  components: {
    SelectAdjustment,
    AddAdjustment,
    AddStaticAdjustment,
    AdjustmentBind,
  },
  props: {
    EmployeeId: {
      type: Number,
    },
    EmployeeName: {
      type: String,
    },
    SalaryPaymentId: {
      type: Number,
    },
    WorkingAdjustment: {
      type: Array,
    },
    WorkingHourId: {
      type: Number,
    },
  },
  data() {
    return {
      activeTab: "RegularAdjustment",
      StaticAdjustment: [],
    };
  },
  methods: {
    tabClick(tab, event) {
      if (tab.label == "التسويات")
        GetWorkingAdjustmentBySalaryId({
          SalId: this.SalaryPaymentId,
        }).then((response) => {
          this.WorkingAdjustment = response.reverse();
        });

      if (tab.label == "التسويات الدورية")
        GetStaticAdjustmentsById({
          Id: this.SalaryPaymentId,
        }).then((response) => {
          this.StaticAdjustment = response.reverse();
        });
    },
  },
};
</script>
<style>
.el-tabs--card > .el-tabs__header .el-tabs__nav {
  position: sticky;
  float: right;
}
</style>
