<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <div style="float : left">
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
      </div>
      <el-button
        style="width: 100px;"
        type="primary"
        icon="el-icon-plus"
        @click="Visibles = true"
        >تجميد</el-button
      >
      <el-table
        v-loading="loading"
        :data="tableData"
        fit
        border
        highlight-current-row
        max-height="900"
        style="width: 100%"
        ref="multipleTable"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="selection"
          width="55"
          align="center"
        ></el-table-column>
        <el-table-column label="#" prop="Id" width="120" align="center">
          <template slot="header" slot-scope="{}">
            <el-button
              type="primary"
              icon="el-icon-refresh"
              @click="getdata()"
            ></el-button>
            {{tableData.length}}
          </template>
        </el-table-column>
        <el-table-column
          prop="MembershipName"
          label="الاشتراك"
          align="center"
        ></el-table-column>

        <el-table-column
          prop="MemberName"
          label="المشترك"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="Type"
          label="الفترة"
          align="center"
        ></el-table-column>

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
      </el-table>
    </el-card>
    <div>
      <el-dialog
        style="margin-top: -13vh"
        title="تسجيل تجميد"
        :visible.sync="Visibles"
      >
        <el-form label-position="top" class="demo-form-inline">
          <el-row >
            <el-col :span="24">
              <el-form-item prop="FreezeBetween" label="الفترة">
                <el-date-picker
                  v-model="FreezeBetween"
                  format="dd/MM/yyyy"
                  type="daterange"
                  align="left"
                  unlink-panels
                  v-bind:range-separator="$t('Sales.until')"
                  v-bind:start-placeholder="$t('Sales.From')"
                  v-bind:end-placeholder="$t('Sales.To')"
                  :default-time="['00:00:00', '23:59:59']"
                  style="width:80%"
                ></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row >
            <el-col :span="24">
              <el-form-item v-bind:label="$t('AddVendors.Description')">
                <el-input v-model="Description"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row >
            <el-col :span="24">
              مجموع الايام حسب الفترة المطلوبة
              {{
                Math.round(
                  Math.abs(
                    (new Date(FreezeBetween[0]) - new Date(FreezeBetween[1])) /
                      (24 * 60 * 60 * 1000)
                  )
                )
              }}
              ايام
            </el-col>
          </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="Visibles = false">{{
            $t("AddVendors.Cancel")
          }}</el-button>
          <el-button type="primary" @click="createFreeze()">{{
            $t("AddVendors.Save")
          }}</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { GetMembershipMovementByStatus } from "@/api/MembershipMovement";
import { Create } from "@/api/MembershipMovementOrder";

import { GetOprationByTable } from "@/api/Oprationsys";

export default {
  name: "Member",
  data() {
    return {
      tableData: [],
      Selection: [],
      FreezeBetween: "",
      Description: "",
      Visibles: false,
      Days: 0,
      loading: true,
      search: "",
      Oprations: [],
      Status: 1
    };
  },
  mounted() {
    this.getdata();
  },
  methods: {
    getdata() {
      this.loading = true;
      GetMembershipMovementByStatus({ Status: this.Status }).then(response => {
        //console.log(response)
        this.tableData = response;

        GetOprationByTable({ Name: "MembershipMovement" }).then(response => {
          console.log(response);

          this.Oprations = response;
        });

        this.loading = false;
      });
    },
    handleSelectionChange(val) {
      this.Selection = val;
    },
    createFreeze() {
      let MembershipMovementOrder = {
        ID: undefined,
        Type: "Freeze",
        StartDate: this.FreezeBetween[0],
        EndDate: this.FreezeBetween[1],
        Status: 0,
        Description: this.Description,
        MemberShipMovementID: undefined
      };
      this.Selection.forEach(i => {
        MembershipMovementOrder.MemberShipMovementID = i.Id;
        Create(MembershipMovementOrder).then(response => {
          if (response) {
            this.Visibles = false;
            this.$notify({
              title: "تم ",
              message: "تم الإضافة بنجاح",
              type: 'success',
              duration: 2000
            });
          }
        });
      });
    }
  }
};
</script>