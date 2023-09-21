<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header">
        <el-row type="flex">
          <el-col :span="3">
            <span>{{ $t("Members.Member") }}</span>
          </el-col>
          <el-col :span="7">
            <Select-All-Memberships
              @Set="
                (v) => {
                  MembershipId = v.Id;
                  getdata();
                }
              "
            />
          </el-col>
          <el-col :span="8">
            <el-date-picker
              v-model="DateIn"
              @change="getdata()"
              type="date"
              placeholder="بحث حسب تاريخ ما بين البدء و الانتهاء"
            >
            </el-date-picker
          ></el-col>
          <el-col :span="2">
            <drawer-print
              Type="MemberShipList"
              :Data="{
                Items: tableData,
              }"
            />
          </el-col>
        </el-row>
      </div>

      <el-table
        v-loading="loading"
        :data="tableData"
        fit
        border
        highlight-current-row
        max-height="500"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="selection"
          width="55"
          align="center"
        ></el-table-column>

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
        <el-table-column
          v-bind:label="$t('Members.Phone1')"
          prop="PhoneNumber1"
          width="120"
        ></el-table-column>
        <el-table-column
          prop="StartDate"
          label="تاريخ البدء"
          align="center"
          width="150"
        >
          <template slot-scope="scope">
            <el-date-picker
              :format="$store.getters.settings.DateTimeFormat"
              disabled
              v-model="scope.row.StartDate"
            ></el-date-picker>
          </template>
        </el-table-column>
        <el-table-column
          prop="EndDate"
          label="تاريخ الانتهاء"
          align="center"
          width="150"
        >
          <template slot-scope="scope">
            <el-date-picker
              :format="$store.getters.settings.DateTimeFormat"
              disabled
              v-model="scope.row.EndDate"
            ></el-date-picker>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import { GetMembershipMovementByMembershipId } from "@/api/MembershipMovement";
import SelectAllMemberships from "@/views/Gym/components/SelectAllMemberships.vue";
import DrawerPrint from "@/components/PrintRepot/DrawerPrint.vue";
import {
  LocalDateTime,
  LocalDate,
  LocalTime,
  DateTimeFormatter,
  Instant,
} from "@js-joda/core";
export default {
  components: { SelectAllMemberships, DrawerPrint },
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
      MembershipId: "",
      DateIn: "",
    };
  },

  methods: {
    getdata() {
      let date;
      this.loading = true;
      if (this.DateIn != "") {
        date = LocalDate.ofInstant(Instant.ofEpochMilli(this.DateIn))
          .atStartOfDay()
          .format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm"));
      }

      GetMembershipMovementByMembershipId({
        MembershipId: this.MembershipId,
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
  },
};
</script>
