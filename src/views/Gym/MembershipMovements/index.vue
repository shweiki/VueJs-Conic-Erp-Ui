<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header">
        <el-row type="flex">
          <el-col :span="3">
            <span>{{ $t("Members.Member") }}</span>
          </el-col>
          <el-col :span="9">
            <el-date-picker
              v-model="DateIn"
              @change="FilterByDateIn"
              type="date"
              placeholder="بحث حسب تاريخ ما بين البدء و الانتهاء"
            >
            </el-date-picker
          ></el-col>
          <el-col :span="12">
            <Radio-Oprations TableName="MembershipMovement" @Change="getdata" />
          </el-col>
        </el-row>
        <el-button
          icon="el-icon-setting"
          type="primary"
          :size="$store.getters.size"
          @click="$store.dispatch('Members/CheckMembers')"
          >CheckMemberShips</el-button
        >
      </div>
      <el-button
        style="width: 100px"
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
        max-height="500"
        style="width: 100%"
        ref="multipleTable"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center"></el-table-column>
        <el-table-column label="#" prop="Id" width="120" align="center">
          <template slot="header" slot-scope="{}">
            Ids
            {{ tableData.length }}
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
        <el-table-column prop="Type" label="الفترة" align="center"></el-table-column>

        <el-table-column prop="StartDate" label="تاريخ البدء" align="center" sortable>
        </el-table-column>
        <el-table-column prop="EndDate" label="تاريخ الانتهاء" align="center" sortable>
        </el-table-column>
      </el-table>
    </el-card>
    <div>
      <el-dialog style="margin-top: -13vh" title="تسجيل تجميد" :visible.sync="Visibles">
        <el-form label-position="top" class="demo-form-inline">
          <el-row type="flex">
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
                  style="width: 80%"
                ></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex">
            <el-col :span="24">
              <el-form-item v-bind:label="$t('AddVendors.Description')">
                <el-input v-model="Description"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex">
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
          <el-button @click="Visibles = false">{{ $t("AddVendors.Cancel") }}</el-button>
          <el-button type="primary" @click="createFreeze()">{{
            $t("AddVendors.Save")
          }}</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import {
  GetMembershipMovementByStatus,
  GetMembershipMovementByDateIn,
} from "@/api/MembershipMovement";
import { CreateMulti } from "@/api/MembershipMovementOrder";
import RadioOprations from "@/components/Oprationsys/RadioOprations";
import {
  LocalDateTime,
  LocalDate,
  LocalTime,
  DateTimeFormatter,
  Instant,
} from "@js-joda/core";
export default {
  name: "Member",
  components: { RadioOprations },
  data() {
    return {
      tableData: [],
      Selection: [],
      FreezeBetween: "",
      Description: "",
      Visibles: false,
      Days: 0,
      loading: false,
      search: "",
      DateIn: "",
    };
  },

  methods: {
    getdata(val) {
      console.log(val);
      this.loading = true;
      GetMembershipMovementByStatus({ Status: val }).then((response) => {
        //console.log(response)
        this.tableData = response;
        this.loading = false;
      });
    },
    FilterByDateIn(val) {
      this.loading = true;
      let date = LocalDate.ofInstant(Instant.ofEpochMilli(val))
        .atStartOfDay()
        .format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm"));
      GetMembershipMovementByDateIn({
        DateIn: date,
      }).then((response) => {
        //console.log(response)
        this.tableData = response;
        this.loading = false;
      });
    },
    handleSelectionChange(val) {
      this.Selection = val;
    },
    createFreeze() {
      let createFreeze100 = [];
      for (var i = 0; i < this.Selection.length; i++) {
        if (this.Selection.length > 0) {
          createFreeze100.push(this.Selection.splice(0, 98));
        } else {
          break;
        }
      }

      createFreeze100.forEach((element) => {
        let date = [
          LocalDate.ofInstant(Instant.ofEpochMilli(this.FreezeBetween[0]))
            .atStartOfDay()
            .format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm")),
          LocalDate.ofInstant(Instant.ofEpochMilli(this.FreezeBetween[1]))
            .atTime(LocalTime.MAX)
            .format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm")),
        ];
        CreateMulti({
          collection: element.map((x) => {
            return {
              Id: undefined,
              Type: "Freeze",
              StartDate: date[0],
              EndDate: date[1],
              Status: 2,
              Description: this.Description,
              MemberShipMovementId: x.Id,
            };
          }),
        }).then((response) => {
          if (response) {
            this.Visibles = false;
            this.$notify({
              title: "تم ",
              message: "تم الإضافة بنجاح",
              type: "success",
              duration: 2000,
            });
          }
        });
      });
    },
  },
};
</script>
