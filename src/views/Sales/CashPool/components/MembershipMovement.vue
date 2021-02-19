<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-button
          :disabled="EnableSave"
          style="float: left"
          type="success"
          icon="fa fa-save"
          @click="createData('tempForm')"
          >{{ $t("CashPool.Save") }}</el-button
        >
        <span class="demonstration">{{ $t("NewPurchaseInvoice.Box") }}</span>
        <el-select
          disabled
          v-model="CashAccount"
          default-first-option
          filterable
          placeholder="صندوق"
          autocomplete="off"
        >
          <el-option
            v-for="item in CashAccounts"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
            <span style="float: right">{{ item.label }}</span>
            <span style="float: left color: #8492a6 font-size: 12px">{{
              item.value
            }}</span>
          </el-option>
        </el-select>
        <span class="demonstration">إيراد</span>
        <el-select
          disabled
          v-model="InComeAccount"
          filterable
          placeholder="إيراد"
          autocomplete="off"
        >
          <el-option
            v-for="item in InComeAccounts"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
            <span style="float: right">{{ item.label }}</span>
            <span style="float: left color: #8492a6 font-size: 12px">{{
              item.value
            }}</span>
          </el-option>
        </el-select>
      </div>

      <el-divider direction="vertical"></el-divider>
      <span>عدد الاشتراكات</span>
      <el-divider direction="vertical"></el-divider>
      <span>{{ Selection.length }}</span>
      <el-divider direction="vertical"></el-divider>

      <span>{{ $t("CashPool.Amount") }}</span>
      <el-divider direction="vertical"></el-divider>
      <span>{{ Total.toFixed(3) }} JOD</span>
      <el-divider direction="vertical"></el-divider>
      <el-button
        :disabled="EnableSave"
        style="float: left"
        icon="el-icon-printer"
        type="success"
        @click="print(tableData)"
      ></el-button>
    </el-card>

    <el-card class="box-card">
      <span>{{ $t("CashPool.Note") }}</span>

      <el-table
        height="250"
        v-loading="loading"
        :data="tableData"
        fit
        border
        highlight-current-row
        ref="multipleTable"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center"></el-table-column>
        <el-table-column label="#" prop="Id" width="120" align="center">
          <template slot="header" slot-scope="{}">
            <el-button
              type="primary"
              icon="el-icon-refresh"
              @click="getdata()"
            ></el-button>
          </template>
        </el-table-column>

        <el-table-column
          prop="MembershipName"
          label="الاشتراك"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="MemberId"
          label="رقم المشترك"
          align="center"
        ></el-table-column>

        <el-table-column prop="MemberName" label="المشترك" align="center">
          <template slot-scope="scope">
            <router-link :to="'/Gym/Edit/' + scope.row.MemberId">
              <strong style="font-size: 10px; cursor: pointer">{{
                scope.row.MemberName
              }}</strong>
            </router-link>
          </template>
        </el-table-column>
        <el-table-column prop="Type" label="الفترة" align="center"></el-table-column>

        <el-table-column label="تاريخ البدء" align="center">
          <template slot-scope="scope">
            <el-date-picker
              format="dd/MM/yyyy"
              disabled
              v-model="scope.row.StartDate"
            ></el-date-picker>
          </template>
        </el-table-column>
        <el-table-column label="تاريخ الانتهاء" align="center">
          <template slot-scope="scope">
            <el-date-picker
              format="dd/MM/yyyy"
              disabled
              v-model="scope.row.EndDate"
            ></el-date-picker>
          </template>
        </el-table-column>
        <el-table-column v-bind:label="$t('CashPool.Total')" align="center">
          <template slot-scope="scope"
            >{{ scope.row.TotalAmmount.toFixed(3) }} JOD</template
          >
        </el-table-column>
        <el-table-column width="180" align="center" v-if="checkPermission(['Admin'])">
          <template slot-scope="scope">
            <next-oprations
              :ObjID="scope.row.Id"
              :Status="scope.row.Status"
              TableName="MembershipMovement"
              @Done="getdata"
            />
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
<script>
import checkPermission from "@/utils/permission";

import { GetMembershipMovementByStatus } from "@/api/MembershipMovement";
import { GetInComeAccounts } from "@/api/Account";
import { GetActiveCash } from "@/api/Cash";
import { CreateEntry } from "@/api/EntryAccounting";
import { ChangeArrObjStatus } from "@/api/Oprationsys";
import printJS from "print-js";
import NextOprations from "@/components/Oprationsys/NextOprations.vue";

export default {
  name: "MembershipMovement",
  components: { NextOprations },
  data() {
    return {
      loading: true,
      EnableSave: true,
      tableData: [],
      Selection: [],
      CashAccounts: [],
      InComeAccounts: [],
      tempForm: {},
      CashAccount: undefined,
      InComeAccount: undefined,
      Total: 0,
    };
  },
  created() {
    this.getdata();
  },
  methods: {
    checkPermission,
    handleSelectionChange(val) {
      this.Selection = val;
      this.tempForm = {
        ID: undefined,
        FakeDate: new Date(),
        Description: "قيد اغلاق اشتراكات",
        Type: "CloseMemberShipMovement",
        EntryMovements: [
          {
            ID: undefined,
            AccountId: this.InComeAccount,
            Debit: this.Total,
            Credit: 0.0,
            Description:
              "قيد اغلاق  (" +
              this.CashAccounts.find((obj) => {
                return obj.value == this.CashAccount;
              }).label,
            EntryId: undefined,
          },
        ],
      };
      this.Selection.forEach((i) => {
        this.tempForm.EntryMovements.push({
          ID: undefined,
          AccountId: i.AccountId,
          Debit: 0.0,
          Credit: i.TotalAmmount,
          Description: "اشتراك " + i.MembershipName + "-" + i.Type + " رقم " + i.Id + " ",
          EntryId: undefined,
        });
      });
      this.Total = this.Selection.reduce((a, b) => a + b.TotalAmmount, 0);
      this.EnableSave = false;
    },
    getdata() {
      this.loading = true;
      GetActiveCash().then((response) => {
        // handle success
        //   console.log(response)
        this.CashAccounts = response;
        this.CashAccount = this.CashAccounts[0].value;
        GetInComeAccounts().then((response) => {
          this.InComeAccounts = response;
          this.InComeAccount = this.InComeAccounts[1].value;
        });
      });

      GetMembershipMovementByStatus({ Status: 0 })
        .then((response) => {
          // handle success
          console.log(response);
          this.tableData = response;
          this.loading = false;
        })
        .catch((error) => {
          // handle error
          console.log(error);
        });
    },
    createData() {
      this.EnableSave = true;
      console.log(this.tempForm);
      CreateEntry(this.tempForm)
        .then((response) => {
          console.log(response);
          ChangeArrObjStatus({
            ObjsID: this.Selection.map((x) => x.Id),
            TableName: "MembershipMovement",
            Status: 1,
            Description: "اشتراك مؤكد",
          }).then((response) => {
            console.log(response);

            Object.assign(this.$data, this.$options.data());
            this.getdata();
            this.$notify({
              title: "تم الإضافة بنجاح",
              message: "تم الإضافة بنجاح",
              type: "success",
              position: "top-left",
              duration: 1000,
            });
            this.EnableSave = false;
          });
        })
        .catch((error) => {
          console.log(error);
        });
    },
    print(data) {
      printJS({
        printable: data,
        properties: [
          "ID",
          "MemberId",
          "MemberName",
          "MembershipName",
          "Type",
          "StartDate",
          "EndDate",
          "TotalAmmount",
        ],
        type: "json",
        header:
          "<center> <h2>" +
          this.InComeAccounts.find((obj) => {
            return obj.value == this.InComeAccount;
          }).label +
          "</h2></center><h3 style='float:right'> - الاجمالي :  " +
          this.Total.toFixed(3) +
          "</h3><h3 style='float:right'>  التاريخ  : " +
          this.formatDate(new Date()) +
          "</h3>",
        gridHeaderStyle: "color: red;  border: 2px solid #3971A5;",
        gridStyle: "border: 2px solid #3971A5; text-align: center;",
      });
    },
    formatDate(date) {
      let d = new Date(date),
        day = "" + d.getDate(),
        month = "" + (d.getMonth() + 1),
        year = d.getFullYear();
      if (month.length < 2) month = "0" + month;
      if (day.length < 2) day = "0" + day;

      return [day, month, year].join("/");
    },
  },
};
</script>
