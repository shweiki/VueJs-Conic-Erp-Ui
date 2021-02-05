<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>استعلامات المقبوضات</span>
        <div style="float: left">
          <el-radio-group v-model="Status" @change="getdata(date[0], date[1], Status)">
            <el-radio-button
              v-for="op in Oprations"
              :key="op.Id"
              v-bind:label="op.Status"
              >{{ op.OprationDescription }}</el-radio-button
            >
          </el-radio-group>
        </div>
      </div>

      <div slot="header" class="clearfix">
        <search-by-date
          :Value="date"
          @Set="
            (v) => {
              date = v;
            }
          "
          @focus="getdata()"
        />
      </div>
      <el-card class="box-card">
        <el-divider direction="vertical"></el-divider>
        <span>عدد مقبوضات</span>
        <el-divider direction="vertical"></el-divider>
        <span>{{ tableData.length }}</span>
        <el-divider direction="vertical"></el-divider>

        <span>{{ $t("CashPool.Cash") }}</span>
        <el-divider direction="vertical"></el-divider>
        <span>{{ TotalCash.toFixed(3) }} JOD</span>
        <el-divider direction="vertical"></el-divider>

        <span>{{ $t("CashPool.Visa") }}</span>
        <el-divider direction="vertical"></el-divider>
        <span>{{ TotalVisa.toFixed(3) }} JOD</span>
        <el-divider direction="vertical"></el-divider>

        <span>شيكات</span>
        <el-divider direction="vertical"></el-divider>
        <span>{{ TotalCheque.toFixed(3) }} JOD</span>
        <el-divider direction="vertical"></el-divider>

        <span>{{ $t("CashPool.Amount") }}</span>
        <el-divider direction="vertical"></el-divider>
        <span>{{ Total.toFixed(3) }} JOD</span>
        <el-divider direction="vertical"></el-divider>
        <el-button
          style="float: left"
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
          prop="MemberId"
          label="رقم المشترك"
          align="center"
        ></el-table-column>

        <el-table-column prop="Name" label="المشترك" align="center">
          <template slot-scope="scope">
            <router-link :to="'/Gym/Edit/' + scope.row.accountID">
              <strong style="font-size: 10px; cursor: pointer">{{
                scope.row.Name
              }}</strong>
            </router-link>
          </template>
        </el-table-column>

        <el-table-column label="التاريخ" align="center" width="120">
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
        <el-table-column label="المحرر" prop="EditorName" align="center">
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
      </el-table>
    </el-card>
  </div>
</template>
<script>
import SearchByDate from "@/components/Date/SearchByDate";

import { GetPayment } from "@/api/Payment";
import { ChangeObjStatus } from "@/api/Oprationsys";
import { PaymentMember } from "@/Report/PayPapar";
import { GetOprationByTable } from "@/api/Oprationsys";

import printJS from "print-js";

export default {
  name: "Payment",
  components: { SearchByDate },

  data() {
    return {
      tableData: [],
      Total: 0,
      date: "",
      loading: true,
      dialogFormVisible: false,
      dialogOprationVisible: false,
      dialogFormStatus: "",
      TotalCash: 0,
      TotalCheque: 0,
      TotalVisa: 0,
      Oprations: [],
      Status: 1,
      Total: 0,
    };
  },
  created() {
    GetOprationByTable({ Name: "Payment" }).then((response) => {
      this.Oprations = response;
      this.getdata();
    });
  },
  methods: {
    getdata() {
      this.loading = true;

      GetPayment({
        DateFrom: this.date[0],
        DateTo: this.date[1],
        Status: this.Status,
      }).then((response) => {
        console.log(response);
        this.tableData = response;
        this.TotalCheque = this.tableData.reduce(
          (a, b) => a + (b["PaymentMethod"] == "Cheque" ? b.TotalAmmount : 0),
          0
        );
        this.TotalCash = this.tableData.reduce(
          (a, b) => a + (b["PaymentMethod"] == "Cash" ? b.TotalAmmount : 0),
          0
        );
        this.TotalVisa = this.tableData.reduce(
          (a, b) => a + (b["PaymentMethod"] == "Visa" ? b.TotalAmmount : 0),
          0
        );

        this.Total = this.TotalCash + this.TotalVisa + this.TotalCheque;

        this.loading = false;
      });
    },

    print(data) {
      printJS({
        printable: data,
        properties: [
          "ID",
          "AccountId",
          "Name",
          "FakeDate",
          "PaymentMethod",
          "TotalAmmount",
        ],
        type: "json",
        header:
          "<center> <h2> مقبوضات</h2></center><h3 style='float:right'> الاجمالي النقدي " +
          this.TotalCash.toFixed(3) +
          " - الاجمالي الفيزا : " +
          this.TotalVisa.toFixed(3) +
          " - الاجمالي الشيكات : " +
          this.TotalCheque.toFixed(3) +
          " - الاجمالي :  " +
          this.Total.toFixed(3) +
          "</h3><h3 style='float:right'>  الفترة  : " +
          this.formatDate(this.date[0]) +
          " - " +
          this.formatDate(this.date[1]) +
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
