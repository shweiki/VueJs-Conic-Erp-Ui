<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <router-link
          class="pan-btn tiffany-btn"
          style="float: left; padding: 10px 15px; border-radius: 6px;"
          icon="el-icon-plus"
          to="/Accounting/NewAccountingEntry"
          >{{ $t("Accounting.NewAccountingEntry") }}</router-link
        >

        <span>{{ $t("Accounting.AccountingEntryinquiries") }}</span>
      </div>

      <div slot="header" class="clearfix">
        <search-by-date @change="getdata" />
      </div>
      <el-card class="box-card">
        <span class="demonstration">{{ $t("Accounting.Account") }}</span>
        <el-select
          v-model="AccountId"
          filterable
          v-bind:placeholder="$t('Accounting.Account')"
          @change="getdata"
          autocomplete="off"
        >
          <el-option
            v-for="(item, index) in Account"
            :key="index"
            :label="item.label"
            :value="item.value"
          >
            <span style="float: right">{{ item.label }}</span>
            <span style="float: left color: #8492a6 font-size: 13px">{{
              item.value
            }}</span>
          </el-option>
        </el-select>
        <el-divider direction="vertical"></el-divider>
        <span>{{ Total.toFixed(3) }} JOD</span>
        <el-divider direction="vertical"></el-divider>
        <el-button
          style="float: left;"
          icon="el-icon-printer"
          type="success"
          @click="print(tableData)"
        ></el-button>
      </el-card>

      <el-table
        v-loading="loading"
        :data="tableData"
        fit
        border
        max-height="850"
        highlight-current-row
        style="width: 100%"
      >
        <el-table-column
          v-bind:label="$t('Accounting.EntryId')"
          prop="EntryId"
          width="120"
          align="center"
        >
          <template slot="header" slot-scope="{}">
            <el-button
              type="success"
              icon="el-icon-refresh"
              @click="getdata"
            ></el-button>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          v-bind:label="$t('Stocks.Date')"
          prop="FakeDate"
          width="120"
        ></el-table-column>
        <el-table-column
          v-bind:label="$t('Accounting.Notes')"
          prop="Description"
          align="center"
        ></el-table-column>
        <el-table-column label="مدين" prop="Credit" width="100" align="center">
          <template slot-scope="scope">{{
            scope.row.Credit.toFixed(3)
          }}</template>
        </el-table-column>
        <el-table-column label="دائن" prop="Debit" width="100" align="center">
          <template slot-scope="scope">{{
            scope.row.Debit.toFixed(3)
          }}</template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog
      style="margin-top: -13vh"
      :show-close="false"
      :title="textOpration.OprationDescription"
      :visible.sync="dialogOprationVisible"
    >
      <el-form
        ref="dataOpration"
        :rules="rulesOpration"
        :model="tempOpration"
        label-position="top"
        label-width="70px"
        style="width: 400px margin-left:50px"
      >
        <el-form-item
          v-bind:label="$t('Inventory.OperationNote')"
          prop="Description"
        >
          <el-input
            type="textarea"
            v-model="tempOpration.Description"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button
          :type="textOpration.ClassName"
          @click="createOprationData()"
          >{{ textOpration.OprationDescription }}</el-button
        >
      </div>
    </el-dialog>
  </div>
</template> 
<script>
import SearchByDate from "@/components/Date/SearchByDate";

import { GetEntryAccounting } from "@/api/EntryAccounting";
import { GetActiveAccounts } from "@/api/Account";
import { ChangeObjStatus } from "@/api/Oprationsys";
import printJS from "print-js";

export default {
  name: "EntryAccounting",
  components: { SearchByDate },
  data() {
    return {
      tableData: [],
      Account: [],
      Total: 0,
      loading: true,
      dialogFormVisible: false,
      dialogOprationVisible: false,
      dialogFormStatus: "",
      AccountId: 2,
      textOpration: {
        OprationDescription: "",
        ArabicOprationDescription: "",
        IconClass: "",
        ClassName: ""
      },
      tempOpration: {
        ObjID: undefined,
        OprationID: undefined,
        Description: ""
      },
      rulesOpration: {
        Description: [
          {
            required: true,
            message: "يجب إدخال ملاحظة للعملية",
            trigger: "blur"
          },
          {
            minlength: 5,
            maxlength: 150,
            message: "الرجاء إدخال اسم لا يقل عن 5 حروف و لا يزيد عن 150 حرف",
            trigger: "blur"
          }
        ]
      }
    };
  },
  created() {
    this.getdata();
  },
  methods: {
    getdata() {
      this.loading = true;
      GetEntryAccounting({
        AccountId: this.AccountId,
        DateFrom: this.$store.state.settings.datepickerQuery[0],
        DateTo: this.$store.state.settings.datepickerQuery[1]
      }).then(response => {
        console.log(response);
        this.tableData = response;
        this.Total =
          this.tableData.reduce((a, b) => a + b.Credit, 0) -
          this.tableData.reduce((a, b) => a + b.Debit, 0);

        GetActiveAccounts().then(response => {
          // handle success
          console.log(response);
          this.Account = response;
          this.loading = false;
        });
      });
    },

    print(data) {
      printJS({
        printable: data,
        properties: ["ID", "FakeDate", "Description", "Credit", "Debit"],
        type: "json",
        header:
          "<center> <h2>" +
          this.Account.find(obj => {
            return obj.value == this.AccountId;
          }).label +
          "</h2></center><h3 style='float:left'>الاجمالي " +
          this.Total.toFixed(3) +
          "</h3><h3 style='float:right'>  الفترة  : " +
          this.formatDate(this.date[0]) +
          " - " +
          this.formatDate(this.date[1]) +
          "</h3>",
        gridHeaderStyle: "color: red;  border: 2px solid #3971A5;",
        gridStyle: "border: 2px solid #3971A5; text-align: center;"
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
    }
  }
};
</script>