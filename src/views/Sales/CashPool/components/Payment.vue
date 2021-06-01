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
      <span>عدد مقبوضات</span>
      <el-divider direction="vertical"></el-divider>
      <span>{{ Selection.length }}</span>
      <el-divider direction="vertical"></el-divider>

      <span>{{ $t("CashPool.Cash") }}</span>
      <el-divider direction="vertical"></el-divider>
      <span>{{ TotalCash.toFixed($store.getters.settings.ToFixed) }} JOD</span>
      <el-divider direction="vertical"></el-divider>

      <span>{{ $t("CashPool.Visa") }}</span>
      <el-divider direction="vertical"></el-divider>
      <span>{{ TotalVisa.toFixed($store.getters.settings.ToFixed) }} JOD</span>
      <el-divider direction="vertical"></el-divider>

      <span>شيكات</span>
      <el-divider direction="vertical"></el-divider>
      <span>{{ TotalCheque.toFixed($store.getters.settings.ToFixed) }} JOD</span>
      <el-divider direction="vertical"></el-divider>

      <span>{{ $t("CashPool.Amount") }}</span>
      <el-divider direction="vertical"></el-divider>
      <span>{{ Total.toFixed($store.getters.settings.ToFixed) }} JOD</span>
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
          prop="ObjectID"
          label="رقم المشترك"
          align="center"
        ></el-table-column>

        <el-table-column prop="Name" label="المشترك" align="center">
          <template slot-scope="scope">
            <router-link :to="'/Gym/Edit/' + scope.row.ObjectID">
              <strong style="font-size: 10px; cursor: pointer">{{
                scope.row.Name
              }}</strong>
            </router-link>
          </template>
        </el-table-column>

        <el-table-column label="التاريخ" align="center">
          <template slot-scope="scope">
            <el-date-picker
              format="dd/MM/yyyy"
              disabled
              v-model="scope.row.FakeDate"
            ></el-date-picker>
          </template>
        </el-table-column>
        <el-table-column
          prop="PaymentMethod"
          v-bind:label="$t('CashPool.Pay')"
          width="150"
          align="center"
        ></el-table-column>
        <el-table-column v-bind:label="$t('CashPool.Total')" align="center">
          <template slot-scope="scope">{{ scope.row.TotalAmmount }} JOD</template>
        </el-table-column>
        <el-table-column label="#" align="center">
          <template slot-scope="scope">
            <el-button
              icon="el-icon-printer"
              type="primary"
              @click="printPayment(scope.row)"
            ></el-button>
          </template>
        </el-table-column>

        <el-table-column width="180" align="center" v-if="checkPermission(['Admin'])">
          <template slot-scope="scope">
            <next-oprations
              :ObjID="scope.row.Id"
              :Status="scope.row.Status"
              TableName="Payment"
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

import { GetPaymentByStatus } from "@/api/Payment";
import { GetInComeAccounts } from "@/api/Account";
import { GetActiveCash } from "@/api/Cash";
import { CreateEntry } from "@/api/EntryAccounting";
import { PaymentMember } from "@/Report/PayPapar";
import NextOprations from "@/components/Oprationsys/NextOprations.vue";

import { ChangeArrObjStatus } from "@/api/Oprationsys";
import printJS from "print-js";

export default {
  name: "Payment",
  components: { NextOprations },
  data() {
    return {
      loading: true,
      EnableSave: true,
      tableData: [],
      Selection: [],
      tempForm: {},
      CashAccounts: [],
      InComeAccounts: [],
      CashAccount: undefined,
      InComeAccount: undefined,
      TotalCash: 0,
      TotalCheque: 0,
      TotalVisa: 0,
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
        Id: undefined,
        FakeDate: new Date(),
        Description: "قيد اغلاق مقبوضات",
        Type: "ClosePayment",
        EntryMovements: [
          {
            Id: undefined,
            AccountId: this.InComeAccount,
            Debit: 0.0,
            Credit: this.Total,
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
          Id: undefined,
          AccountId: i.AccountId,
          Debit: i.TotalAmmount,
          Credit: 0.0,
          Description: "سند قبض رقم " + i.Id + " ",
          EntryId: undefined,
        });
      });

      this.TotalCheque = this.Selection.reduce(
        (a, b) => a + (b["PaymentMethod"] == "Cheque" ? b.TotalAmmount : 0),
        0
      );
      this.TotalCash = this.Selection.reduce(
        (a, b) => a + (b["PaymentMethod"] == "Cash" ? b.TotalAmmount : 0),
        0
      );
      this.TotalVisa = this.Selection.reduce(
        (a, b) => a + (b["PaymentMethod"] == "Visa" ? b.TotalAmmount : 0),
        0
      );

      this.Total = this.TotalCash + this.TotalVisa + this.TotalCheque;
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
          this.InComeAccount = this.InComeAccounts[2].value;
        });
      });
      GetPaymentByStatus({ Status: 0 })
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
            ObjsId: this.Selection.map((x) => x.Id),
            TableName: "Payment",
            Status: 1,
            Description: "دفعة مؤكدة",
          }).then((response) => {
            this.EnableSave = false;
            console.log(response);
            this.$notify({
              title: "تم الإضافة بنجاح",
              message: "تم الإضافة بنجاح",
              type: "success",
              position: "top-left",
              duration: 1000,
            });
            this.getdata();
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
          "ObjectID",
          "Name",
          "FakeDate",
          "PaymentMethod",
          "TotalAmmount",
        ],
        type: "json",
        header:
          "<center> <h2>" +
          this.InComeAccounts.find((obj) => {
            return obj.value == this.InComeAccount;
          }).label +
          "</h2></center><h3 style='float:right'> الاجمالي النقدي " +
          this.TotalCash.toFixed(this.$store.getters.settings.ToFixed) +
          " - الاجمالي الفيزا : " +
          this.TotalVisa.toFixed(this.$store.getters.settings.ToFixed) +
          " - الاجمالي الشيكات : " +
          this.TotalCheque.toFixed(this.$store.getters.settings.ToFixed) +
          " - الاجمالي :  " +
          this.Total.toFixed(this.$store.getters.settings.ToFixed) +
          "</h3><h3 style='float:right'>  التاريخ  : " +
          this.formatDate(new Date()) +
          "</h3>",
        gridHeaderStyle: "color: red;  border: 2px solid #3971A5;",
        gridStyle: "border: 2px solid #3971A5; text-align: center;",
      });
    },
    printPayment(data) {
      printJS({
        printable: PaymentMember(data),
        type: "pdf",
        base64: true,
        showModal: true,
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
