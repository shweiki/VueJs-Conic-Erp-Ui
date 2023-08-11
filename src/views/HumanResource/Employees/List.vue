<template>
  <div class="app-container">
    <el-card class="box-card">
      <el-row type="flex">
        <el-col :span="12">
          <el-popover placement="left" width="400">
            <p>ارسال عبر</p>
            <div style="text-align: right; margin: 0">
              <el-input
                type="textarea"
                v-model="SmsBody"
                :rules="[
                  {
                    required: true,
                    message: 'لايمكن ترك الخصم فارغ',
                    trigger: 'blur',
                  },
                ]"
              ></el-input>
              <el-button
                icon="el-icon-circle-plus"
                type="primary"
                :size="$store.getters.size"
                @click="SendSms()"
                >SMS</el-button
              >
              <el-button
                icon="el-icon-circle-plus"
                type="primary"
                :size="$store.getters.size"
                @click="SendEmail()"
                >Email</el-button
              >
            </div>
            <el-button icon="el-icon-circle-plus" slot="reference">ارسال رسالة</el-button>
          </el-popover>
        </el-col>
        <el-col :span="12"> <add-employee /></el-col>
      </el-row>

      <el-row type="flex">
        <el-col :span="6">
          <el-input
            v-model="listQuery.Any"
            placeholder="Search By Any Acount Name Or Id"
            class="filter-item"
            @keyup.enter.native="handleFilter"
          />
        </el-col>
        <el-col :span="3">
          <SortOptions
            :Value="listQuery.Sort"
            @Set="
              (v) => {
                listQuery.Sort = v;
                handleFilter();
              }
            "
          />
        </el-col>
        <el-col :span="6">
          <Export :list="list" />
          <el-button
            v-waves
            class="filter-item"
            type="primary"
            icon="el-icon-search"
            @click="handleFilter"
          >
            {{ $t("table.search") }}
          </el-button>
        </el-col>
        <el-col :span="6">
          <RadioOprations
            TableName="Employee"
            :default="listQuery.Status"
            @Set="
              (v) => {
                listQuery.Status = v;
                handleFilter();
              }
            "
          />
        </el-col>
      </el-row>
      <el-row type="flex">
        <el-col v-permission="['admin']" :span="24">
          <el-divider direction="vertical"></el-divider>
          <span>عدد الموظفين</span>
          <el-divider direction="vertical"></el-divider>
          <span>{{ Totals.Rows }}</span>
          <el-divider direction="vertical"></el-divider>

          <span>مجموع المدين (لك)</span>
          <el-divider direction="vertical"></el-divider>
          <span
            >{{ Totals.TotalCredit.toFixed($store.getters.settings.ToFixed) }} JOD</span
          >
          <el-divider direction="vertical"></el-divider>

          <span> (عليك) مجموع الدائن </span>
          <el-divider direction="vertical"></el-divider>
          <span
            >{{ Totals.TotalDebit.toFixed($store.getters.settings.ToFixed) }} JOD</span
          >
          <el-divider direction="vertical"></el-divider>

          <span>الرصيد</span>
          <el-divider direction="vertical"></el-divider>
          <span>{{ Totals.Totals.toFixed($store.getters.settings.ToFixed) }} JOD</span>
          <el-divider direction="vertical"></el-divider>
        </el-col>
      </el-row>
    </el-card>

    <el-table
      v-loading="listLoading"
      :data="list"
      border
      fit
      height="400"
      highlight-current-row
      style="width: 100%"
      @sort-change="sortChange"
      ref="multipleTable"
      @selection-change="handleSelectionChange"
      @row-dblclick="
        (row) => {
          if (DblClickRow == 'AddAsRow') {
            $emit('dblclick', row);
          }
        }
      "
    >
      <el-table-column type="selection" width="55" align="center"></el-table-column>
      <el-table-column
        v-bind:label="$t('Vendors.ID')"
        prop="Id"
        sortable="custom"
        align="center"
        width="80"
        :class-name="getSortClass('id')"
      >
        <template slot-scope="{ row }">
          <el-tag type="primary" disable-transitions>
            <strong
              style="font-size: 10px; cursor: pointer"
              @click="
                () => {
                  let r = $router.resolve({
                    path: '/HumanResource/Edit/' + row.Id,
                  });
                  window.open(r.href, r.route.name, $store.getters.settings.windowStyle);
                }
              "
              >{{ row.Id }}</strong
            ></el-tag
          >
        </template>
      </el-table-column>

      <el-table-column label="Name" prop="Name" align="center"> </el-table-column>
      <el-table-column
        v-bind:label="$t('Members.Phone1')"
        prop="PhoneNumber1"
        width="110"
      ></el-table-column>
      <el-table-column width="150" v-bind:label="$t('Visit.LastVisit')" align="center">
        <template slot-scope="scope">
          <LastLog :UserId="scope.row.Id" TableName="Employee" />
        </template>
      </el-table-column>
      <el-table-column
        prop="totalCredit"
        sortable
        v-bind:label="$t('Account.Credit')"
        width="120"
        align="center"
      >
        <template slot-scope="scope">{{
          scope.row.TotalCredit.toFixed($store.getters.settings.ToFixed)
        }}</template>
      </el-table-column>
      <el-table-column
        v-bind:label="$t('Account.Debit')"
        prop="totalDebit"
        sortable
        width="120"
        align="center"
      >
        <template slot-scope="scope">{{
          scope.row.TotalDebit.toFixed($store.getters.settings.ToFixed)
        }}</template>
      </el-table-column>
      <el-table-column v-bind:label="$t('Account.funds')" width="120" align="center">
        <template slot-scope="scope">{{
          (scope.row.TotalCredit - scope.row.TotalDebit).toFixed(
            $store.getters.settings.ToFixed
          )
        }}</template>
      </el-table-column>
      <el-table-column v-bind:label="$t('Sales.Status')" width="120" align="center">
        <template slot-scope="scope">
          <Status-Tag :Status="scope.row.Status" TableName="Employee" />
        </template>
      </el-table-column>
      <el-table-column width="180" align="center">
        <template slot-scope="scope">
          <Next-Oprations
            :ObjId="scope.row.Id"
            :Status="scope.row.Status"
            TableName="Employee"
            @Done="handleFilter"
          />
          <Dialog-Action-Log TableName="Employee" :ObjId="scope.row.Id" />
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="Totals.Rows > 0"
      :total="Totals.Rows"
      :page.sync="listQuery.Page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />
  </div>
</template>

<script>
import { GetByListQ } from "@/api/Employee";
import NextOprations from "@/components/Oprationsys/NextOprations.vue";
import StatusTag from "@/components/Oprationsys/StatusTag";
import RadioOprations from "@/components/Oprationsys/RadioOprations";
import permission from "@/directive/permission/index.js";
import LastLog from "@/components/Gym/LastLog.vue";

import waves from "@/directive/waves"; // waves directive
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
import { SendMultiSMS } from "@/api/Sms";
import DialogActionLog from "@/components/ActionLog/DialogActionLog.vue";
import AddEmployee from "@/components/HumanResource/Employee/AddEmployee.vue";
import SortOptions from "@/components/SortOptions";
import Export from "@/components/Export";
export default {
  props: ["DblClickRow"],

  components: {
    StatusTag,
    NextOprations,
    Pagination,
    RadioOprations,
    DialogActionLog,
    AddEmployee,
    SortOptions,
    Export,
    LastLog,
  },
  directives: { waves, permission },
  data() {
    return {
      list: [],
      Totals: { Rows: 0, Totals: 0, TotalDebit: 0, TotalCredit: 0 },
      listLoading: false,
      Selection: [],
      SmsBody: "",
      listQuery: JSON.parse(localStorage.getItem("Employee_ListQuery") || null) || {
        Page: 1,
        Any: "",
        limit: this.$store.getters.settings.LimitQurey,
        Sort: "-id",
        Status: 0,
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      this.listLoading = true;
      GetByListQ(this.listQuery).then((response) => {
        this.list = response.items;
        this.Totals = response.Totals;
        localStorage.setItem("Employee_ListQuery", JSON.stringify(this.listQuery));
        this.listLoading = false;
      });
    },
    handleFilter() {
      this.listQuery.Page = 1;
      this.getList();
    },
    sortChange(data) {
      const { prop, order } = data;
      if (prop === "Id") {
        this.sortById(order);
      }
    },
    sortById(order) {
      if (order === "ascending") {
        this.listQuery.Sort = "+id";
      } else {
        this.listQuery.Sort = "-id";
      }
      this.handleFilter();
    },
    getSortClass: function (key) {
      const sort = this.listQuery.Sort;
      return sort === `+${key}` ? "ascending" : "descending";
    },
    handleSelectionChange(val) {
      this.Selection = val;
    },
    SendSms() {
      if (this.Selection.length > 0) {
        let numbers = this.Selection.map((element) => {
          return element.PhoneNumber1;
        });
        SendMultiSMS(numbers, this.SmsBody);
        this.$notify({
          title: "تم ",
          message: "تم ارسال بنجاح",
          type: "success",
          duration: 2000,
        });
      } else {
        this.$notify({
          title: "تم ",
          message: "الرجاء تحديد ",
          type: "error",
          duration: 2000,
        });
      }
    },
  },
};
</script>
