<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <div style="float: left">
          <el-radio-group v-model="Status" @change="getdata()">
            <el-radio-button
              v-for="op in Oprations"
              :key="op.Id"
              v-bind:label="op.Status"
              >{{ op.OprationDescription }}</el-radio-button
            >
          </el-radio-group>
        </div>
        <span>{{ $t("Members.Member") }}</span>
        <el-popover placement="left" width="400" v-model="visible">
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
      </div>
      <el-table
        v-loading="loading"
        :data="
          tableData.filter(
            (data) => !search || data.Name.toLowerCase().includes(search.toLowerCase())
          )
        "
        fit
        :default-sort="{ prop: 'totalCredit', order: 'descending' }"
        border
        highlight-current-row
        ref="multipleTable"
        @selection-change="handleSelectionChange"
        max-height="900"
        style="width: 100%"
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
        <el-table-column prop="Name" align="center">
          <template slot="header" slot-scope="{}">
            {{ tableData.length }}
            <el-input v-model="search" v-bind:placeholder="$t('Members.Search')" />
          </template>
          <template slot-scope="scope">
            <router-link :to="'/Gym/Edit/' + scope.row.Id">
              <strong style="font-size: 10px; cursor: pointer">{{
                scope.row.Name
              }}</strong>
            </router-link>
          </template>
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
        <el-table-column v-bind:label="$t('Account.funds')" width="120" align="center">
          <template slot-scope="scope">{{
            (scope.row.TotalCredit - scope.row.TotalDebit).toFixed(
              $store.getters.settings.ToFixed
            )
          }}</template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import { GetMemberByStatus } from "@/api/Member";

import { GetOprationByTable } from "@/api/Oprationsys";
import axios from "axios";

export default {
  name: "Member",
  data() {
    return {
      tableData: [],
      Selection: [],
      loading: true,
      search: "",
      Oprations: [],
      Status: 0,
      SmsBody: "",
      visible: false,
    };
  },
  mounted() {
    this.getdata();
    GetOprationByTable({ Name: "Member" }).then((response) => {
      console.log(response);

      this.Oprations = response;
    });
  },
  methods: {
    getdata() {
      this.loading = true;
      GetMemberByStatus({ Status: this.Status }).then((response) => {
        //console.log(response)
        this.tableData = response;

        this.loading = false;
      });
    },
    handleSelectionChange(val) {
      this.Selection = val;
    },
    SendSms() {
      if (this.Selection.length > 0) {
        let numbers = this.Selection.map((element) => {
          if (element.PhoneNumber1.length == 10) element.PhoneNumber1.slice(1);
          return "962" + element.PhoneNumber1;
        });
        console.log("numbers", numbers);
        let numbers100 = [];
        for (var i = 0; i < numbers.length; i++) {
          if (numbers.length > 0) {
            numbers100.push(numbers.splice(0, 98));
          } else {
            break;
          }
        }

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
