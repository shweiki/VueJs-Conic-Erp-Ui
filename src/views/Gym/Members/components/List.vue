<template>
  <div class="app-container">
    <div class="filter-container">
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
        <Add-Member />
      </el-col>
      <el-col :span="1">
        <merge-two-members @Done="getList()" />
      </el-col>
      <el-row type="flex">
        <el-col :span="12">
          <el-input
            clearable
            v-model="listQuery.Any"
            v-bind:placeholder="$t('Members.SearchAll')"
            class="filter-item"
            @keyup.enter.native="handleFilter"
          />
        </el-col>
        <el-col :span="3">
          <Sort-Options
            :value="listQuery.Sort"
            @Set="
              (v) => {
                listQuery.Sort = v;
                handleFilter();
              }
            "
          />
        </el-col>
        <el-col :span="2"> <Export :list="list" /></el-col>
        <el-col :span="2">
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
        <el-col :span="3">
          <el-button
            :loading="loadingExport"
            v-waves
            class="filter-item"
            type="success"
            icon="el-icon-download"
            @click="exportDataOfMembersToExcel"
          >
            {{ $t("Members.ExportDataOfMembers") }}
          </el-button>
        </el-col>
        <el-col :span="1">
          <drawer-print
            Type="MemberList"
            :Data="{
              Totals: Totals,
              Items: list,
            }"
          />
        </el-col>
      </el-row>
      <el-col :span="24">
        <Radio-Oprations
          :value="listQuery.Status"
          tableName="Member"
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
        <span>{{ Totals.TotalCredit.toFixed($store.getters.settings.ToFixed) }} JOD</span>
        <el-divider direction="vertical"></el-divider>

        <span>{{ $t("Vendors.TotalDebit") }}</span>
        <el-divider direction="vertical"></el-divider>
        <span>{{ Totals.TotalDebit.toFixed($store.getters.settings.ToFixed) }} JOD</span>
        <el-divider direction="vertical"></el-divider>

        <span>{{ $t("MinOrd.Balance") }}</span>
        <el-divider direction="vertical"></el-divider>
        <span>{{ Totals.Totals.toFixed($store.getters.settings.ToFixed) }} JOD</span>
        <el-divider direction="vertical"></el-divider>
      </el-col>
    </el-row>

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
                    path: '/Gym/Edit/' + row.Id,
                  });
                  window.open(r.href, r.route.name, $store.getters.settings.windowStyle);
                }
              "
              >{{ row.Id }}</strong
            ></el-tag
          >
        </template>
      </el-table-column>

      <el-table-column v-bind:label="$t('AddVendors.Name')" prop="Name" align="center">
      </el-table-column>
      <el-table-column
        v-bind:label="$t('Members.Phone1')"
        prop="PhoneNumber1"
        width="120"
      ></el-table-column>
      <el-table-column width="150" v-bind:label="$t('Visit.LastVisit')" align="center">
        <template slot-scope="scope">
          <last-log :userId="scope.row.Id.toString()" tableName="Member" />
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
      <el-table-column v-bind:label="$t('Account.funds')" width="120" align="center">
        <template slot-scope="scope">{{
          (scope.row.TotalCredit - scope.row.TotalDebit).toFixed(
            $store.getters.settings.ToFixed
          )
        }}</template>
      </el-table-column>
      <el-table-column v-bind:label="$t('Sales.Status')" width="120" align="center">
        <template slot-scope="scope">
          <Status-Tag :status="scope.row.Status" tableName="Member" />
        </template>
      </el-table-column>
      <el-table-column width="180" align="center">
        <template slot-scope="scope">
          <el-row>
            <el-col :span="24">
              <Dialog-Action-Log tableName="Member" :objId="scope.row.Id.toString()"
            /></el-col>
          </el-row>
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
import { GetByListQ, ExportDataOfMembers } from "@/api/Member";
import NextOprations from "@/components/Oprationsys/NextOprations.vue";
import StatusTag from "@/components/Oprationsys/StatusTag";
import RadioOprations from "@/components/Oprationsys/RadioOprations.vue";
import permission from "@/directive/permission/index.js";
import lastLog from "@/views/Gym/components/LastLog";

import waves from "@/directive/waves"; // waves directive
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
import { SendMultiSMS } from "@/api/SMS";
import AddMember from "@/components/Member/AddMember.vue";
import MergeTwoMembers from "./MergeTwoMembers.vue";
import DialogActionLog from "@/components/ActionLog/DialogActionLog.vue";
import SortOptions from "@/components/SortOptions";
import Export from "@/components/Export";
import DrawerPrint from "@/components/PrintRepot/DrawerPrint.vue";
import { saveAs } from "file-saver";
import JSZip from "jszip";
import {
  LocalDateTime,
  LocalDate,
  LocalTime,
  DateTimeFormatter,
  Instant,
} from "@js-joda/core";
export default {
  props: ["DblClickRow"],
  components: {
    StatusTag,
    NextOprations,
    Pagination,
    RadioOprations,
    AddMember,
    MergeTwoMembers,
    DialogActionLog,
    SortOptions,
    Export,
    DrawerPrint,
    lastLog,
  },
  directives: { waves, permission },
  data() {
    return {
      list: [],
      Totals: { Rows: 0, Totals: 0, TotalDebit: 0, TotalCredit: 0 },
      listLoading: false,
      loadingExport: false,
      zip: new JSZip(),
      Selection: [],
      SmsBody: "",
      listQuery: JSON.parse(localStorage.getItem("Member_ListQuery") || null) || {
        Page: 1,
        Any: "",
        limit: this.$store.getters.settings.LimitQurey,
        Sort: "-id",
        Status: null,
      },
    };
  },
  created() {
    // this.getList();
  },
  methods: {
    getList() {
      this.listLoading = true;

      GetByListQ(this.listQuery)
        .then((response) => {
          this.list = response.items;
          this.Totals = response.Totals;
          localStorage.setItem("Member_ListQuery", JSON.stringify(this.listQuery));
        })
        .finally(() => {
          this.listLoading = false;
        });
    },
    exportDataOfMembersToExcel() {
      this.loadingExport = true;

      ExportDataOfMembers()
        .then(async (response) => {
          let today = LocalDateTime.ofInstant(Instant.ofEpochMilli(new Date())).format(
            DateTimeFormatter.ofPattern("yyyy-MM-dd")
          );

          Promise.all([
            this.ExporToExcel(response.Memebers, `Memebers ${today}`),
            this.ExporToExcel(
              response.MembershipMovements,
              `Membership Movements ${today}`
            ),
            this.ExporToExcel(
              response.MembershipMovementOrders,
              `Membership Movement Orders ${today}`
            ),
          ]).then((values) => {
            this.zip.generateAsync({ type: "blob" }).then((content) => {
              // see FileSaver.js
              saveAs(content, `Members Data ${today}.zip`);
            });
          });
        })
        .finally(() => {
          this.loadingExport = false;
        });
    },
    ExporToExcel(data, filename) {
      return new Promise((resolve, reject) => {
        import("@/report/Excel/Export2ExcelOrginal").then((excel) => {
          const tHeader = Object.keys(data[0]);
          const filterVal = Object.keys(data[0]);
          const list = data;
          let formatJson = this.formatJson(filterVal, list);
          resolve(
            this.zip.file(
              `${filename}.xlsx`,
              excel.export_json_to_blob({
                header: tHeader,
                data: formatJson,
                filename: filename,
                autoWidth: false,
                bookType: "xlsx",
              })
            )
          );
        });
      });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map((v) =>
        filterVal.map((j) => {
          if (j === "timestamp") {
            return parseTime(v[j], "{y}-{m}-{d} {h}:{i}");
          }
          if (j === "FakeDate") {
            return parseTime(v[j], "{y}-{m}-{d} {h}:{i}");
          } else {
            return v[j];
          }
        })
      );
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
    MergeMember() {
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
