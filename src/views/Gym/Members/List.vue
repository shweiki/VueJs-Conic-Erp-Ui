<template>
  <div class="app-container">
    <el-card class="box-card">
      <div class="filter-container">
        <el-button @click="FixPhoneNumber">
          {{ $t("Members.FixPhoneNumber") }}
        </el-button>
        <el-button @click="CheckBlackListActionLogMembers">{{
          $t("Members.CheckBlackList")
        }}</el-button>
        <el-popover placement="left" width="400">
          <p>{{ $t("Members.SendBy") }}</p>
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
              >{{ $t("Vendors.Email") }}</el-button
            >
          </div>
          <el-button icon="el-icon-circle-plus" slot="reference">{{
            $t("Members.SendSMS")
          }}</el-button>
        </el-popover>
        <el-col :span="1">
          <add-member />
        </el-col>
        <el-row type="flex">
          <el-col :span="12">
            <el-input
              v-model="listQuery.Any"
              v-bind:placeholder="$t('Members.SearchAll')"
              class="filter-item"
              @keyup.enter.native="handleFilter"
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
          <el-col :span="6">
            <Export :list="list" />
            <el-col :span="1">
              <drawer-print
                Type="MemberList"
                :Data="{
                  Totals: Totals,
                  Items: list,
                }"
              />
            </el-col>
            <el-button
              v-waves
              class="filter-item"
              type="primary"
              icon="el-icon-search"
              @click="handleFilter"
            >
              {{ $t("Members.Search") }}
            </el-button>
          </el-col>
        </el-row>
        <el-col :span="24">
          <Radio-Oprations
            TableName="Member"
            @Set="
              (v) => {
                listQuery.Status = v;
                handleFilter();
              }
            "
          />
        </el-col>
      </div>

      <el-row type="flex">
        <el-col v-permission="['admin']" :span="24">
          <el-divider direction="vertical"></el-divider>
          <span>{{ $t("Vendors.PersonsCount") }}</span>
          <el-divider direction="vertical"></el-divider>
          <span>{{ Totals.Rows }}</span>
          <el-divider direction="vertical"></el-divider>

          <span>{{ $t("Vendors.TotalCredit") }}</span>
          <el-divider direction="vertical"></el-divider>
          <span
            >{{
              Totals.TotalCredit.toFixed($store.getters.settings.ToFixed)
            }}
            JOD</span
          >
          <el-divider direction="vertical"></el-divider>

          <span>{{ $t("Vendors.TotalDebit") }}</span>
          <el-divider direction="vertical"></el-divider>
          <span
            >{{
              Totals.TotalDebit.toFixed($store.getters.settings.ToFixed)
            }}
            JOD</span
          >
          <el-divider direction="vertical"></el-divider>

          <span>{{ $t("MinOrd.Balance") }}</span>
          <el-divider direction="vertical"></el-divider>
          <span
            >{{
              Totals.Totals.toFixed($store.getters.settings.ToFixed)
            }}
            JOD</span
          >
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
          } else {
            let r = $router.resolve({
              path: '/Gym/Edit/' + row.Id,
            });
            window.open(
              r.href,
              r.route.name,
              $store.getters.settings.windowStyle
            );
          }
        }
      "
    >
      <el-table-column
        type="selection"
        width="55"
        align="center"
      ></el-table-column>
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

      <el-table-column
        v-bind:label="$t('AddVendors.Name')"
        prop="Name"
        align="center"
      >
      </el-table-column>
      <el-table-column
        v-bind:label="$t('Members.Phone1')"
        prop="PhoneNumber1"
        width="120"
      ></el-table-column>
      <el-table-column
        width="150"
        v-bind:label="$t('Visit.LastVisit')"
        align="center"
      >
        <template slot-scope="scope">
          <LastLog :UserId="scope.row.Id" TableName="Member" />
        </template>
      </el-table-column>
      <el-table-column
        prop="MembershipsCount"
        v-bind:label="$t('MemberList.MembershipCount')"
        width="120"
        align="center"
      >
        <template slot-scope="scope">{{ scope.row.MembershipsCount }}</template>
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
          <Dialog-Action-Log TableName="Member" :ObjId="scope.row.Id" />
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
import {
  GetByListQ,
  FixPhoneNumber,
  CheckBlackListActionLogMembers,
} from "@/api/Member";
import NextOprations from "@/components/Oprationsys/NextOprations.vue";
import StatusTag from "@/components/Oprationsys/StatusTag";
import RadioOprations from "@/components/Oprationsys/RadioOprations.vue";
import permission from "@/directive/permission/index.js";
import LastLog from "@/components/Gym/LastLog.vue";

import waves from "@/directive/waves"; // waves directive
import { parseTime } from "@/utils";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
import { SendMultiSMS } from "@/api/SMS";
import AddMember from "@/components/Member/AddMember.vue";
import DialogActionLog from "@/components/ActionLog/DialogActionLog.vue";
import SortOptions from "@/components/SortOptions";
import Export from "@/components/Export";
import DrawerPrint from "@/components/PrintRepot/DrawerPrint.vue";

export default {
  name: "ComplexTable",
  props: ["DblClickRow"],

  components: {
    StatusTag,
    NextOprations,
    Pagination,
    RadioOprations,
    AddMember,
    DialogActionLog,
    SortOptions,
    Export,
    DrawerPrint,
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
      listQuery: {
        Page: 1,
        Any: "",
        limit: this.$store.getters.settings.LimitQurey,
        Sort: "-id",
        Status: undefined,
      },
    };
  },
  created() {
    // this.getList();
  },
  methods: {
    FixPhoneNumber,
    CheckBlackListActionLogMembers,
    getList() {
      this.listLoading = true;
      //    console.log("sdsad", this.listQuery);
      GetByListQ(this.listQuery).then((response) => {
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
    getSortClass: function (key) {
      const sort = this.listQuery.sort;
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
          message: "الرجاء تحديد المشتركين",
          type: "error",
          duration: 2000,
        });
      }
    },
  },
};
</script>
