<template>
  <div class="app-container">
    <el-row type="flex">
      <el-col :span="8">
        <Search-By-Date
          :Value="[listQuery.DateFrom, listQuery.DateTo]"
          @Set="
            (v) => {
              listQuery.DateFrom = v[0];
              listQuery.DateTo = v[1];
              handleFilter();
            }
          "
        />
      </el-col>
      <el-col :span="3">
        <Sort-Options
          :Value="listQuery.Sort"
          @Set="
            (v) => {
              listQuery.Sort = v;
              handleFilter();
            }
          "
        />
      </el-col>
      <el-col :span="3">
        <el-button
          v-waves
          class="filter-item"
          type="primary"
          icon="el-icon-search"
          @click="handleFilter"
        >
        </el-button>
      </el-col>
      <el-col :span="3">
        <Drawer-Print style="float: left" Type="SalaryPayment" :Data="tempForm" />
      </el-col>
    </el-row>
    <el-row type="flex"
      ><el-col :span="12">
        <el-row type="flex">
          <el-col :span="24" :xs="24" v-loading="loading">
            <el-card class="box-card">
              <Status-Tag :Status="tempForm.Status" TableName="SalaryPayment" />
              <el-descriptions
                class="margin-top"
                title="احتساب الراتب"
                :column="3"
                border
              >
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
                  <template slot="label"> مجموع ساعات الدوام </template>
                  <el-tag size="small">{{}}</el-tag>
                </el-descriptions-item>
                <el-descriptions-item
                  :label-style="{ 'text-align': 'right' }"
                  :content-style="{ 'text-align': 'right' }"
                >
                  <template slot="label"> عدد أيام الدوام </template>
                  <el-tag size="small">{{
                    30 -
                    list.reduce((prev, cur) => {
                      return prev + parseFloat(cur.absent ? 1 : 0);
                    }, 0)
                  }}</el-tag>
                </el-descriptions-item>
                <el-descriptions-item
                  :label-style="{ 'text-align': 'right' }"
                  :content-style="{ 'text-align': 'right' }"
                >
                  <template slot="label"> صافي الراتب </template>
                  <el-tag size="small">{{
                    parseFloat(tempForm.GrossSalary) +
                    tempForm.SalaryAdjustmentLogs.reduce((prev, cur) => {
                      return prev + parseFloat(cur.AdjustmentAmmount);
                    }, 0)
                  }}</el-tag>
                </el-descriptions-item>
              </el-descriptions>
              <el-button
                :disabled="DisabledSave"
                @click="confirmData"
                type="success"
                icon="el-icon-check"
              ></el-button>
            </el-card>
          </el-col> </el-row></el-col
      ><el-col :span="12">
        <el-card class="box-card">
          <adjustment-bind
            :EmployeeId="tempForm.EmployeeId"
            :EmployeeName="tempForm.Name"
            :SalaryPaymentId="tempForm.Id"
            :GrossSalary="tempForm.GrossSalary"
          />
          <el-row>
            <el-col :span="24">
              <el-table
                height="200"
                :data="tempForm.SalaryAdjustmentLogs"
                v-loading="listLoading2"
                border
                highlight-current-row
                @sort-change="sortChange"
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
                  width="160"
                  align="center"
                ></el-table-column>
                <el-table-column
                  prop="AdjustmentAmmount"
                  label="القيمة"
                  align="center"
                ></el-table-column>
              </el-table>
            </el-col>
          </el-row>
        </el-card> </el-col
    ></el-row>

    <el-table
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%"
      @sort-change="sortChange"
    >
      <el-table-column
        v-bind:label="$t('Vendors.ID')"
        prop="Id"
        sortable="custom"
        align="center"
        width="80"
        :class-name="getSortClass('id')"
      >
        <template slot-scope="{ row }">
          <span>{{ row.Id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="اليوم" align="center">
        <template slot-scope="{ row }">
          <span>{{ days[row.Day] }}</span>
        </template>
      </el-table-column>
      <el-table-column label="التاريخ" width="150px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.Date | parseTime("{y}-{m}-{d}") }}</span>
        </template>
      </el-table-column>
      <el-table-column label="الدخول" width="80px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.StartDateTime | parseTime("{h}:{i}") }}</span>
        </template>
      </el-table-column>
      <el-table-column label="الخروج" width="80px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.EndDateTime | parseTime("{h}:{i}") }}</span>
        </template>
      </el-table-column>
      <el-table-column label="غياب" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.absent ? "غياب" : "حضور" }}</span>
        </template>
      </el-table-column>
      <el-table-column label="الوصف" prop="Description" align="center"> </el-table-column>
      <el-table-column sortable label="عدد ساعات الدوام" width="150" align="center">
        <template slot-scope="scope">{{
          scope.row.WorkTime.toFixed($store.getters.settings.ToFixed)
        }}</template>
      </el-table-column>
      <el-table-column label="الزيادة والنقص" width="120" align="center">
        <template slot-scope="scope">{{
          (scope.row.WorkTime - tempForm.WorkingHours).toFixed(
            $store.getters.settings.ToFixed
          )
        }}</template>
      </el-table-column>
      <el-table-column label="الاجرائات " width="120" align="center">
        <template slot-scope="scope">
          <dialog-log-device :Log="scope.row.logs" />
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { GetById, Update } from "@/api/Salary";
import NextOprations from "@/components/Oprationsys/NextOprations";
import SearchByDate from "@/components/Date/SearchByDate";
import StatusTag from "@/components/Oprationsys/StatusTag";
import DrawerPrint from "@/components/PrintRepot/DrawerPrint.vue";
import RadioOprations from "@/components/Oprationsys/RadioOprations";
import DialogActionLog from "@/components/ActionLog/DialogActionLog.vue";
import { parseTime } from "@/utils";
import SortOptions from "@/components/SortOptions";
import AdjustmentBind from "../../WorkingAdjustment/Components/AdjustmentBind.vue";
import waves from "@/directive/waves"; // waves directive
import { GetLogByUserId } from "@/api/DeviceLog";
import DialogLogDevice from "@/components/Device/DialogLogDevice.vue";

export default {
  name: "Profile",
  components: {
    DialogActionLog,
    SortOptions,
    RadioOprations,
    SearchByDate,
    AdjustmentBind,
    DrawerPrint,
    StatusTag,
    DialogLogDevice,
  },
  directives: { waves },
  data() {
    return {
      activeTab: "Details",
      DisabledSave: false,
      loading: true,
      tableData: [],
      tempForm: {
        Id: undefined,
        EmployeeId: undefined,
        GrossSalary: 0,
        NetSalary: 0,
        SalaryFrom: new Date(),
        SalaryTo: new Date(),
        status: 0,
        WorkingHours: 0,
        Name: "",
        SalaryAdjustmentLogs: [],
      },
      list: [],
      listLoading: false,
      listLoading2: false,
      listQuery: {
        Page: 1,
        limit: this.$store.getters.settings.LimitQurey,
        Sort: "-id",
        DateFrom: "",
        DateTo: "",
        Status: 0,
        TableName: "Employee",
        UserId: undefined,
      },
      days: ["الاحد", "الاثنين", "الثلاثاء", "الاربعاء", "الخميس", "الجمعة", "السبت"],
    };
  },
  created() {
    // this.getdata(val);
  },
  methods: {
    getdata() {
      GetById({ Id: this.$route.params && this.$route.params.id }).then((response) => {
        this.tempForm = response;
        this.listQuery.UserId = this.tempForm.EmployeeId;
        GetLogByUserId(this.listQuery).then((response) => {
          this.list = this.GenerateWorkHoursLog(
            this.listQuery.DateFrom,
            this.listQuery.DateTo,
            response
          );
          console.log(" this.list", this.list);
          this.listLoading2 = false;
        });
      });

      this.loading = false;
    },
    confirmData() {
      this.DisabledSave = true;
      Update(this.tempForm)
        .then((response) => {
          this.tempForm = response;
        })
        .then((res) => {
          if (res) {
            this.DisabledSave = false;
          }
        });
    },
    GenerateWorkHoursLog(startDate, endDate, log) {
      const WorkHoursLogs = [];
      startDate = new Date(startDate);
      endDate = new Date(endDate);

      // Strip hours minutes seconds etc.
      let currentDate = new Date(
        startDate.getFullYear(),
        startDate.getMonth(),
        startDate.getDate()
      );

      while (currentDate <= endDate) {
        let logs = log.filter((x) => {
          return new Date(x.DateTime).getDate() === currentDate.getDate();
        });
        let MinMaxD = [
          new Date(
            Math.min.apply(
              null,
              logs.map((x) => new Date(x.DateTime))
            )
          ),
          new Date(
            Math.max.apply(
              null,
              logs.map((x) => new Date(x.DateTime))
            )
          ),
        ];
        WorkHoursLogs.push({
          Id: WorkHoursLogs.length + 1,
          Day: currentDate.getDay(),
          Date: currentDate,
          StartDateTime: MinMaxD[0], // minDate
          EndDateTime: MinMaxD[1], // maxDate,
          WorkTime:
            parseInt((Math.abs(MinMaxD[1] - MinMaxD[0]) / (1000 * 60 * 60)) % 24) +
            parseInt(
              (Math.abs(MinMaxD[1].getTime() - MinMaxD[0].getTime()) / (1000 * 60)) % 60
            ) /
              100,
          absent: logs.length <= 0 ? true : false,
          logs: logs,
        });
        currentDate = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          currentDate.getDate() + 1 // Will increase month if over range
        );
      }
      return WorkHoursLogs;
    },
    handleFilter() {
      this.listQuery.Page = 1;
      this.getdata();
    },
    sortChange(data) {
      const { prop, order } = data;
      if (prop === "id") {
        this.sortById(order);
      }
    },
    sortById(order) {
      if (order === "ascending") {
        this.listQuery.sort = "+id";
      } else {
        this.listQuery.sort = "-id";
      }
      this.handleFilter();
    },
    getSortClass: function (key) {
      const sort = this.listQuery.sort;
      return sort === `+${key}` ? "ascending" : "descending";
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
