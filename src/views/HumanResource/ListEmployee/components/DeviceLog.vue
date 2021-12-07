<template>
  <div>
    <el-row type="flex">
      <el-col :span="8">
        <Search-By-Date
          :Value="[FromDate, ToDate]"
          @Set="
            (v) => {
              listQuery.DateFrom = v[0];
              listQuery.DateTo = v[1];
            }
          "
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
      <el-col :span="3">
        <el-button
          v-waves
          class="filter-item"
          type="primary"
          icon="el-icon-search"
          @click="handleFilter"
        >
        </el-button>
      </el-col>
      <el-col :span="3">
        <Drawer-Print
          Type="WorkHoursLog"
          :Data="{
            Items: list,
            Dates: [listQuery.DateFrom, listQuery.DateTo],
            Name: Name,
            Id: UserId,
            Totals: Totals,
          }"
        />
      </el-col>
    </el-row>
    <el-table
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column
        v-bind:label="$t('Vendors.ID')"
        prop="Id"
        sortable="custom"
        align="center"
        width="80"
      >
        <template slot-scope="{ row }">
          <span>{{ row.Id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="اليوم" align="center">
        <template slot-scope="{ row }">
          <span>{{ days[row.Day] }}</span>
        </template>
      </el-table-column>
      <el-table-column label="التاريخ" width="150px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.Date | parseTime("{y}-{m}-{d}") }}</span>
        </template>
      </el-table-column>
      <el-table-column label="الدخول" width="80px" align="center">
        <template slot-scope="{ row }">
          <span>{{
            row.StartDateTime != "Invalid Date" ? TimeConvert(row.StartDateTime) : " ****"
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="الخروج" width="80px" align="center">
        <template slot-scope="{ row }">
          <span>{{
            row.EndDateTime != "Invalid Date" ? TimeConvert(row.EndDateTime) : "****"
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="غياب" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.absent ? "غياب" : "حضور" }}</span>
        </template>
      </el-table-column>
      <el-table-column label="عدد ساعات الدوام" width="150" align="center">
        <template slot-scope="scope">{{
          scope.row.WorkTime.toFixed($store.getters.settings.ToFixed)
        }}</template>
      </el-table-column>
      <el-table-column label="ساعات تأخير" width="120" align="center">
        <template slot-scope="scope">{{
          scope.row.DelayHours.toFixed($store.getters.settings.ToFixed)
        }}</template>
      </el-table-column>
      <el-table-column label="ساعات إضافي" width="120" align="center">
        <template slot-scope="scope">{{
          scope.row.ExtraHours.toFixed($store.getters.settings.ToFixed)
        }}</template>
      </el-table-column>
      <el-table-column label="#" width="80" align="center">
        <template slot-scope="scope">
          <dialog-log-device :Log="scope.row.logs" :Fk="listQuery.UserId" @Done="Done" />
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import DialogLogDevice from "@/components/Device/DialogLogDevice.vue";
import waves from "@/directive/waves"; // waves directive
import { GetLogByUserId } from "@/api/DeviceLog";
import SortOptions from "@/components/SortOptions";
import { parseTime, TimeConvert } from "@/utils";
import DrawerPrint from "@/components/PrintRepot/DrawerPrint.vue";
import SearchByDate from "@/components/Date/SearchByDate.vue";

export default {
  props: ["UserId", "Name", "TableName", "FromDate", "ToDate", "WorkingHours"],
  components: {
    DialogLogDevice,
    SortOptions,
    DrawerPrint,
    SearchByDate,
  },
  data() {
    return {
      list: [],
      listQuery: {
        Page: 1,
        limit: this.$store.getters.settings.LimitQurey,
        Sort: "-id",
        DateFrom: "",
        DateTo: "",
        Status: undefined,
        TableName: this.TableName,
        UserId: undefined,
      },
      Totals: {
        WorkingDays: 0,
        ExtraHours: 0,
        DelayHours: 0,
      },
      listLoading: false,
      days: ["الاحد", "الاثنين", "الثلاثاء", "الاربعاء", "الخميس", "الجمعة", "السبت"],
    };
  },
  directives: { waves },
  watch: {
    UserId(v) {
      console.log("v", v);
      if (v) this.getdata(this.UserId);
    },
  },

  methods: {
    TimeConvert,
    getdata(v) {
      this.listLoading = true;

      this.listQuery.UserId = v || this.UserId;
      this.listQuery.DateFrom = v || this.FromDate;
      this.listQuery.DateTo = v || this.ToDate;
      console.log(" this.listQuery", this.listQuery);

      GetLogByUserId(this.listQuery).then(async (response) => {
        this.list = await this.GenerateWorkHoursLog(
          this.listQuery.DateFrom,
          this.listQuery.DateTo,
          response
        );
        this.Done(this.list);

        //  console.log("this.list", this.list);
        this.listLoading = false;
      });
    },
    Done(vlist) {
      let list = vlist;
      this.Totals = {
        WorkingDays:
          30 -
          list
            .reduce((prev, cur) => {
              return prev + parseFloat(cur.absent ? 1 : 0);
            }, 0)
            .toFixed(this.$store.getters.settings.ToFixed),

        ExtraHours: list
          .reduce((prev, cur) => {
            return prev + cur.ExtraHours;
          }, 0)
          .toFixed(this.$store.getters.settings.ToFixed),
        DelayHours: list
          .reduce((prev, cur) => {
            return prev + cur.DelayHours;
          }, 0)
          .toFixed(this.$store.getters.settings.ToFixed),
      };
      this.$emit("Done", this.Totals);
    },
    GenerateWorkHoursLog(startDate, endDate, log) {
      return new Promise((resolve) => {
        const WorkHoursLogs = [];
        startDate = new Date(startDate);
        endDate = new Date(endDate);
        // Strip hours minutes seconds etc.
        let currentDate = new Date(
          startDate.getFullYear(),
          startDate.getMonth(),
          startDate.getDate()
        );
        while (currentDate <= endDate) {
          let logs = log.filter((x) => {
            x.DateTime = new Date(x.DateTime);
            let startShiftDate = new Date(
              currentDate.getFullYear(),
              currentDate.getMonth(),
              currentDate.getDate(),
              startDate.getHours() - 5,
              startDate.getMinutes()
            );
            let endShiftDate = new Date(
              currentDate.getFullYear(),
              currentDate.getMonth(),
              currentDate.getDate() + (startDate.getHours() > endDate.getHours() ? 1 : 0),
              endDate.getHours() + 5,
              endDate.getMinutes()
            );

            if (x.DateTime > startShiftDate && x.DateTime < endShiftDate)
              return x.DateTime;
          });
          let MinMaxD = [
            new Date(
              Math.min.apply(
                null,
                logs.map((x) => x.DateTime)
              )
            ),
            new Date(
              Math.max.apply(
                null,
                logs.map((x) => x.DateTime)
              )
            ),
          ];

          // Work Time
          let WorkTime =
            parseInt((Math.abs(MinMaxD[1] - MinMaxD[0]) / (1000 * 60 * 60)) % 24) +
              parseInt(
                (Math.abs(MinMaxD[1].getTime() - MinMaxD[0].getTime()) / (1000 * 60)) % 60
              ) /
                100 || 0;
          //  Extra Hours && Delay Hours
          let ExtraHours = 0,
            DelayHours = 0,
            CalHours;
          CalHours = this.CalDelayExtraHours(
            MinMaxD[1],
            new Date(
              MinMaxD[1].getFullYear(),
              MinMaxD[1].getMonth(),
              MinMaxD[1].getDate(),
              endDate.getHours(),
              endDate.getMinutes()
            )
          );
          if (CalHours > 0) ExtraHours += Math.abs(CalHours);
          else DelayHours += Math.abs(CalHours);
          CalHours = this.CalDelayExtraHours(
            MinMaxD[0],
            new Date(
              MinMaxD[0].getFullYear(),
              MinMaxD[0].getMonth(),
              MinMaxD[0].getDate(),
              startDate.getHours(),
              startDate.getMinutes()
            )
          );
          if (CalHours < 0) ExtraHours += Math.abs(CalHours);
          else DelayHours += Math.abs(CalHours);

          //    console.log("Hours", ExtraHours, DelayHours);
          WorkHoursLogs.push({
            Id: WorkHoursLogs.length + 1,
            Day: currentDate.getDay(),
            Date: currentDate,
            StartDateTime: MinMaxD[0], // minDate
            EndDateTime: MinMaxD[1], // maxDate,
            WorkTime: WorkTime,
            ExtraHours: ExtraHours,
            DelayHours: DelayHours,
            absent: logs.length <= 0 ? true : false,
            logs: logs,
          });
          currentDate = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            currentDate.getDate() + 1 // Will increase month if over range
          );
        }
        resolve(WorkHoursLogs);
      });
    },
    CalDelayExtraHours(Time, ShouldTime) {
      if (Time - ShouldTime < 0)
        return (
          -1 *
          (parseInt((Math.abs(Time - ShouldTime) / (1000 * 60 * 60)) % 24) +
            parseInt((Math.abs(Time.getTime() - ShouldTime) / (1000 * 60)) % 60) / 100 ||
            0)
        );
      else
        return (
          parseInt((Math.abs(Time - ShouldTime) / (1000 * 60 * 60)) % 24) +
            parseInt((Math.abs(Time.getTime() - ShouldTime) / (1000 * 60)) % 60) / 100 ||
          0
        );
    },
    handleFilter() {
      this.listQuery.Page = 1;
      this.getdata();
    },
  },
};
</script>
