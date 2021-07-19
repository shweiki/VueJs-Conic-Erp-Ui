<template>
  <div class="app-container">

    <el-card class="box-card">
      <div class="filter-container">
        <el-button @click="FixPhoneNumber">FixPhoneNumber</el-button>
        <el-popover placement="left" width="400" >
          <p>ارسال عبر</p>
          <div style="text-align: right; margin: 0">
            <el-input
              type="textarea"
              v-model="SmsBody"
              :rules="[
                {
                  required: true,
                  message: 'لايمكن ترك الخصم فارغ',
                  trigger: 'blur'
                }
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
          <el-button icon="el-icon-circle-plus" slot="reference"
            >ارسال رسالة</el-button
          >
        </el-popover>
        <el-row type="flex">
          <el-col :span="12">
            <el-input
              v-model="listQuery.Any"
              placeholder="Search By Any Acount Name Or Id"
              style="width: 200px"
              class="filter-item"
              @keyup.enter.native="handleFilter"
            />
          </el-col>

          <el-col :span="3">
            <el-select
              v-model="listQuery.Sort"
              style="width: 140px"
              class="filter-item"
              @change="handleFilter"
            >
              <el-option
                v-for="item in sortOptions"
                :key="item.key"
                :label="item.label"
                :value="item.key"
              />
            </el-select>
          </el-col>
          <el-col :span="6">
            <el-button
              v-waves
              :loading="downloadLoading"
              class="filter-item"
              type="primary"
              icon="el-icon-download"
              @click="handleDownload"
            >
              Export </el-button
            ><el-button
              v-waves
              class="filter-item"
              type="primary"
              icon="el-icon-search"
              @click="handleFilter"
            >
              Search
            </el-button>
          </el-col>
        </el-row>
      </div>
      <radio-oprations
        TableName="Member"
        @Set="
          v => {
            listQuery.Status = v;
            handleFilter();
          }
        "
      />
      <el-divider direction="vertical"></el-divider>
      <span>عدد المشتركين</span>
      <el-divider direction="vertical"></el-divider>
      <span>{{ Totals.Rows }}</span>
      <el-divider direction="vertical"></el-divider>

      <span>مجموع المدين (لك)</span>
      <el-divider direction="vertical"></el-divider>
      <span
        >{{
          Totals.TotalCredit.toFixed($store.getters.settings.ToFixed)
        }}
        JOD</span
      >
      <el-divider direction="vertical"></el-divider>

      <span> (عليك) مجموع الدائن </span>
      <el-divider direction="vertical"></el-divider>
      <span
        >{{
          Totals.TotalDebit.toFixed($store.getters.settings.ToFixed)
        }}
        JOD</span
      >
      <el-divider direction="vertical"></el-divider>

      <span>الرصيد</span>
      <el-divider direction="vertical"></el-divider>
      <span
        >{{ Totals.Totals.toFixed($store.getters.settings.ToFixed) }} JOD</span
      >
      <el-divider direction="vertical"></el-divider>
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
        row => {
          let r = $router.resolve({
            path: '/Gym/Edit/' + row.Id
          });
          window.open(
            r.href,
            r.route.name,
            $store.getters.settings.windowStyle
          );
        }
      "
    >
      <el-table-column
        type="selection"
        width="55"
        align="center"
      ></el-table-column>
      <el-table-column
        label="Id"
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

      <el-table-column label="Name" prop="Name" align="center">
      </el-table-column>
      <el-table-column
        v-bind:label="$t('Members.Phone1')"
        prop="PhoneNumber1"
        width="120"
      ></el-table-column>

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
      <el-table-column
        v-bind:label="$t('Account.funds')"
        width="120"
        align="center"
      >
        <template slot-scope="scope">{{
          (scope.row.TotalCredit - scope.row.TotalDebit).toFixed(
            $store.getters.settings.ToFixed
          )
        }}</template>
      </el-table-column>
      <el-table-column
        v-bind:label="$t('Sales.Status')"
        width="120"
        align="center"
      >
        <template slot-scope="scope">
          <Status-Tag :Status="scope.row.Status" TableName="Member" />
        </template>
      </el-table-column>
      <el-table-column width="180" align="center">
        <template slot-scope="scope">
          <Next-Oprations
            :ObjId="scope.row.Id"
            :Status="scope.row.Status"
            TableName="Member"
            @Done="handleFilter"
          />
          <Print-Button Type="Member" :Data="scope.row" />
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
import { GetByListQ, FixPhoneNumber } from "@/api/Member";
import NextOprations from "@/components/Oprationsys/NextOprations";
import StatusTag from "@/components/Oprationsys/StatusTag";
import PrintButton from "@/components/PrintRepot/PrintButton";
import RadioOprations from "@/components/Oprationsys/RadioOprations";
import permission from "@/directive/permission/index.js";

import waves from "@/directive/waves"; // waves directive
import { parseTime } from "@/utils";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination

export default {
  name: "ComplexTable",
  components: {
    StatusTag,
    NextOprations,
    PrintButton,
    Pagination,
    RadioOprations
  },
  directives: { waves, permission },
  data() {
    return {
      list: [],
      Totals: { Rows: 0, Totals: 0, TotalDebit: 0, TotalCredit: 0 },
      listLoading: false,
      Selection: [],
      SmsBody: "",
      listQuery: {
        Page: 1,
        Any: "",
        limit: this.$store.getters.settings.LimitQurey,
        Sort: "-id",
        Status: undefined
      },
      sortOptions: [
        { label: "Id Ascending", key: "+id" },
        { label: "Id Descending", key: "-id" }
      ],
      downloadLoading: false
    };
  },
  created() {
    // this.getList();
  },
  methods: {
    FixPhoneNumber,
    getList() {
      this.listLoading = true;
      //    console.log("sdsad", this.listQuery);
      GetByListQ(this.listQuery).then(response => {
        this.list = response.items;
        this.Totals = response.Totals;
        this.listLoading = false;
      });
    },
    handleFilter() {
      this.listQuery.Page = 1;
      this.getList();
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
    handleDownload() {
      this.downloadLoading = true;
      import("@/Report/Excel/Export2Excel").then(excel => {
        const tHeader = Object.keys(this.list[0]);
        const filterVal = Object.keys(this.list[0]);
        const data = this.formatJson(filterVal);
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: "table-list"
        });
        this.downloadLoading = false;
      });
    },
    formatJson(filterVal) {
      return this.list.map(v =>
        filterVal.map(j => {
          if (j === "timestamp") {
            return parseTime(v[j]);
          } else {
            return v[j];
          }
        })
      );
    },
    getSortClass: function(key) {
      const sort = this.listQuery.sort;
      return sort === `+${key}` ? "ascending" : "descending";
    },
    handleSelectionChange(val) {
      this.Selection = val;
    },
    SendSms() {
      if (this.Selection.length > 0) {
        let numbers = this.Selection.map(element => {
          return "962" + element.PhoneNumber1;
        });
        console.log("numbers", numbers);
        let numbers100 = [];
        for (var i = 0; i < numbers.length; i++) {
          if (numbers.length > 0) {
            numbers100.push(numbers.splice(0, 100));
          } else {
            break;
          }
        }
        //  console.log(this.Selection);
          numbers100.forEach((element) => {
          axios({
            method: "get",
            url: "http://josmsservice.com/smsonline/msgservicejo.cfm",
            params: {
              numbers: element,
              senderid: "High Fit",
              AccName: "highfit",
              AccPass: "D7!cT5!SgU0",
              msg: this.SmsBody,
              requesttimeout: 5000000,
            },
          }).then((response) => {
            console.log(response);
          });
        });
        this.$notify({
          title: "تم ",
          message: "تم ارسال بنجاح",
          type: "success",
          duration: 2000
        });
      } else {
        this.$notify({
          title: "تم ",
          message: "الرجاء تحديد المشتركين",
          type: "error",
          duration: 2000
        });
      }
    }
  }
};
</script>
