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
    </el-row>
    <el-row type="flex">
      <el-col :span="24" :xs="24" v-loading="loading">
        <el-card class="box-card">
          <el-descriptions class="margin-top" title="احتساب الراتب" :column="3" border>
            <el-descriptions-item
              :label-style="{ 'text-align': 'right' }"
              :content-style="{ 'text-align': 'right' }"
            >
              <template slot="label"> الراتب الكلي </template>
              <el-tag size="small">{{ tempForm.GrossSalary }}</el-tag>
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
              <el-tag size="small">{{ tempForm.EmpId }}</el-tag>
            </el-descriptions-item>
            <el-descriptions-item
              :label-style="{ 'text-align': 'right' }"
              :content-style="{ 'text-align': 'right' }"
            >
              <template slot="label"> مجموع ساعات الدوام </template>
              <el-tag size="small">{{ Totals.Totals }}</el-tag>
            </el-descriptions-item>
            <el-descriptions-item
              :label-style="{ 'text-align': 'right' }"
              :content-style="{ 'text-align': 'right' }"
            >
              <template slot="label"> عدد أيام الدوام </template>
              <el-tag size="small">{{ Totals.Rows }}</el-tag>
            </el-descriptions-item>
          </el-descriptions>
        </el-card>
      </el-col>
    </el-row>
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
        v-bind:label="$t('Vendors.Id')"
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
      <el-table-column label="تسجيل الدخول" width="150px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.StartDateTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="تسجيل الخروج" width="150px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.EndDateTime }}</span>
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
          (scope.row.WorkTime - 8).toFixed($store.getters.settings.ToFixed)
        }}</template>
      </el-table-column>
      <el-table-column label="الاجرائات " width="120" align="center">
        <el-button> اتخاذ اجراء</el-button>
      </el-table-column>
      <!-- <el-table-column
        v-bind:label="$t('table.type')"
        width="80"
        align="center"
        prop="Type"
      >
      </el-table-column> -->
      <!-- <el-table-column v-bind:label="$t('CashPool.Amountv')" width="120" align="center">
        <template slot-scope="{ row }">
          {{ row.Total.toFixed($store.getters.settings.ToFixed) }}
          JOD
        </template>
      </el-table-column> -->
      <!-- <el-table-column v-bind:label="$t('Sales.Status')" width="120" align="center">
        <template slot-scope="scope">
          <Status-Tag :Status="scope.row.Status" TableName="SalesInvoice" />
        </template>
      </el-table-column> -->
      <!-- <el-table-column width="180" align="center">
        <template slot-scope="scope">
          <Next-Oprations
            :ObjId="scope.row.Id"
            :Status="scope.row.Status"
            TableName="SalesInvoice"
            @Done="handleFilter"
          />
           <Drawer-Print Type="SaleInvoice" :Data="scope.row" /> 
          <Dialog-Action-Log TableName="SalesInvoice" :ObjId="scope.row.Id" />
        </template>
      </el-table-column> -->
    </el-table>
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="13">
          <el-table
            height="500"
            :data="list2"
            v-loading="listLoading2"
            border
            highlight-current-row
            @sort-change="sortChange"
          >
            <el-table-column
              prop="Id"
              label="Id"
              width="80"
              align="center"
            ></el-table-column>
            <el-table-column
              prop="AdjustmentName"
              label="AdjustmentName"
              width="140"
              align="center"
            ></el-table-column>
            <el-table-column
              prop="Description"
              label="Description"
              width="160"
              align="center"
            ></el-table-column>
            <el-table-column
              prop="AdjustmentAmmount"
              label="AdjustmentAmmount"
              width="160"
              align="center"
            ></el-table-column>
          </el-table>
        </el-col>

        <el-col :span="11">
          <el-table height="500" :data="StaticAdjustment" border highlight-current-row>
            <el-table-column
              prop="Id"
              label="Id"
              width="100"
              align="center"
            ></el-table-column>
            <el-table-column
              prop="AdjustmentName"
              label="AdjustmentName"
              width="160"
              align="center"
            ></el-table-column>
            <el-table-column
              prop="AdjustmentAmount"
              label="AdjustmentAmount"
              width="160"
              align="center"
            ></el-table-column>
          </el-table>
        </el-col>
      </el-row>
    </el-card>
    <pagination
      v-show="Totals.Rows > 0"
      :total="Totals.Rows"
      :page.sync="listQuery.Page"
      :limit.sync="listQuery.limit"
      @pagination="getdata"
    />
  </div>
</template>

<script>
import { GetSalary } from "@/api/Salary";
import { GetEmployeeMounthLog } from "@/api/WorkingHoursLog";
import { GetWorkingAdjustmentBySalaryId, GetByListQ } from "@/api/WorkingAdjustment";
import { GetStaticAdjustmentsById } from "@/api/StaticAdjustment";
import NextOprations from "@/components/Oprationsys/NextOprations";
import SearchByDate from "@/components/Date/SearchByDate";
import StatusTag from "@/components/Oprationsys/StatusTag";
import DrawerPrint from "@/components/PrintRepot/DrawerPrint.vue";
import RadioOprations from "@/components/Oprationsys/RadioOprations";
import DialogActionLog from "@/components/ActionLog/DialogActionLog.vue";
import { parseTime } from "@/utils";
import Pagination from "@/components/Pagination";
import SortOptions from "@/components/SortOptions";
export default {
  name: "Profile",
  components: {
    Pagination,
    parseTime,
    DialogActionLog,
    SortOptions,
    RadioOprations,
    SearchByDate,
  },

  data() {
    return {
      activeTab: "Details",
      loading: true,
      tableData: [],
      WorkingAdjustment: [],
      StaticAdjustment: [],
      tempForm: {
        Id: undefined,
        EmpId: undefined,
        GrossSalary: 0,
        NetSalary: 0,
        SalaryPeriod: "",
        status: 0,
        Name: "",
      },
      WorkingForm: {
        Id: undefined,
        StartDateTime: "",
        EndDateTime: "",
        DeviceName: "",
        Description: "",
      },
      list: [],
      list2: [],
      Totals: {
        Rows: 0,
        Totals: 0,
        OverTime: 0,
      },
      Totals2: {
        Rows: 0,
        Totals: 0,
        Cash: 0,
        Percentage: 0,
        Hours: 0,
      },
      listLoading: false,
      listLoading2: false,
      listQuery: {
        Page: 1,
        limit: this.$store.getters.settings.LimitQurey,
        Sort: "-id",
        DateFrom: "",
        DateTo: "",
        Status: 0,
        EmpId: undefined,
      },
    };
  },
  created() {
    // this.getdata(val);
  },
  methods: {
    getdata() {
      GetSalary({ Id: this.$route.params && this.$route.params.id }).then((response) => {
        this.tempForm = response;
        this.GetWork();
      });
      this.listQuery.EmpId = this.tempForm.EmpId;
      GetEmployeeMounthLog(this.listQuery).then((response) => {
        // this.tableData = response;
        this.list = response.totals;
        this.Totals2 = response.Totals;
        this.listLoading2 = false;
      });
      GetByListQ(this.listQuery)
        .then((response) => {
          this.list2 = response.totals;
          this.Totals = response.Totals;
          this.listLoading = false;
        })
        .catch((err) => {
          console.log(err);
        });
      this.loading = false;
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
    GetWork() {
      GetWorkingAdjustmentBySalaryId({
        SalId: this.$route.params && this.$route.params.id,
      }).then((response) => {
        this.WorkingAdjustment = response;
      });
      GetStaticAdjustmentsById({
        Id: this.$route.params && this.$route.params.id,
      }).then((response) => {
        this.StaticAdjustment = response;
      });
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
