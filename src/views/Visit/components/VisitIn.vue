<template>
  <div class="app-container">
    <el-row type="flex">
      <el-col :span="12">
        <el-divider direction="vertical"></el-divider>
        <span>عدد الزيارات</span>
        <el-divider direction="vertical"></el-divider>
        <span>{{ Totals.Rows }}</span>
        <el-divider direction="vertical"></el-divider>
        <el-divider direction="vertical"></el-divider>
        <span>عدد اشخاص</span>
        <el-divider direction="vertical"></el-divider>
        <span>{{ Totals.TotalPerson }}</span>
        <el-divider direction="vertical"></el-divider>
      </el-col>
      <el-col :span="12">
        <Button-Oprations
          TableName="Visit"
          :ArrObjIds="Selection.map((x) => x.Id)"
          :Status="1"
          @Done="
            (v) => {
              getList();
            }
          "
      /></el-col>
    </el-row>
    <el-table
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      height="250"
      style="width: 100%"
      @selection-change="handleSelectionChange"
      :row-class-name="tableRowClassName"
    >
      <el-table-column type="selection" width="55"> </el-table-column>
      <el-table-column label="Id" prop="Id" align="center" width="80">
        <template slot="header" slot-scope="{}">
          <el-button
            circle
            type="success"
            icon="el-icon-refresh"
            @click="getList()"
            :size="$store.getters.size"
          ></el-button>
        </template>
      </el-table-column>

      <el-table-column v-bind:label="$t('AddVendors.Name')" prop="Name" align="center">
      </el-table-column>

      <el-table-column
        v-bind:label="$t('Visit.PersonCount')"
        prop="PersonCount"
        align="center"
        width="100px"
      >
      </el-table-column>
      <el-table-column v-bind:label="$t('Visit.In')" width="100px" align="center">
        <template slot-scope="{ row }">
          <span>{{ TimeConvert(row.FakeDate) }}</span>
        </template>
      </el-table-column>
      <el-table-column v-bind:label="$t('Visit.Out')" width="100px" align="center">
        <template slot-scope="{ row }">
          <span>{{ TimeConvert(row.TimeOut) }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { GetByStatus } from "@/api/Visit";
import ButtonOprations from "@/components/Oprationsys/ButtonOprations.vue";

import waves from "@/directive/waves"; // waves directive
import { parseTime, TimeConvert } from "@/utils";

export default {
  name: "ComplexTable",
  components: {
    ButtonOprations,
  },
  directives: { waves },
  data() {
    return {
      Selection: [],
      list: [],
      Totals: { Rows: 0, TotalPerson: 0 },
      listLoading: false,
      listQuery: {
        DateFrom: "",
        DateTo: "",
        Status: 0,
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    TimeConvert,
    getList() {
      this.listLoading = true;
      //    console.log("sdsad", this.listQuery);
      GetByStatus(this.listQuery).then((response) => {
        this.list = response.items;
        this.Totals = response.Totals;
        this.listLoading = false;
      });
    },
    handleSelectionChange(val) {
      this.Selection = val;
    },
    tableRowClassName({ row, rowIndex }) {
      var now = new Date();
      let TimeOut = new Date(row.TimeOut);
      console.log(now.getTime(), TimeOut.getTime());

      if (now.getTime() > TimeOut.getTime()) {
        return "warning-row";
      } else {
        return "success-row";
      }
    },
  },
};
</script>
<style>
.el-table .warning-row {
  background: #f44336;
  color: #000000;
  font-weight: 700;
}

.el-table .success-row {
  background: #4caf50;
  color: #000000;
  font-weight: 700;
}
</style>
