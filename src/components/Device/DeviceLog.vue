<template>
  <div>
    <el-row type="flex">
      <el-col :span="8">
        <Search-By-Date
         v-bind:Value="[listQuery.DateFrom, listQuery.DateTo]"
          @Set="
            (v) => {
              listQuery.DateFrom = v[0];
              listQuery.DateTo = v[1];
              handleFilter()
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
      <el-table-column width="130px" align="center">
        <template slot="header" slot-scope="{}">
          دخول
          <span
            >({{
              listQuery.DateFrom != "Invalid Date"
                ? TimeConvert(listQuery.DateFrom)
                : " ****"
            }})</span
          >
        </template>
        <template slot-scope="{ row }">
          <span
            v-bind:style="
              row.logs.length > 1 &&
              row.logs[1].Id == undefined &&
              row.logs[1].Type == 'In'
                ? 'color : red'
                : ''
            "
            >{{
              row.StartDateTime != "Invalid Date"
                ? TimeConvert(row.StartDateTime)
                : " ****"
            }}</span
          >
        </template>
      </el-table-column>
      <el-table-column width="130px" align="center">
        <template slot="header" slot-scope="{}">
          خروج
          <span
            >({{
              listQuery.DateTo != "Invalid Date"
                ? TimeConvert(listQuery.DateTo)
                : " ****"
            }})</span
          >
        </template>
        <template slot-scope="{ row }">
          <span
            v-bind:style="
              row.logs.length > 1 &&
              row.logs[1].Id == undefined &&
              row.logs[1].Type == 'Out'
                ? 'color : red'
                : ''
            "
            >{{
              row.EndDateTime != "Invalid Date"
                ? TimeConvert(row.EndDateTime)
                : "****"
            }}</span
          >
        </template>
      </el-table-column>
      <el-table-column label="غياب" align="center">
        <template slot-scope="{ row }">
          <span v-bind:style="row.absent ? 'color : red' : 'color : green'">{{
            row.absent ? "غياب" : "حضور"
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="عدد ساعات الدوام" width="150" align="center">
        <template slot-scope="scope">{{
          scope.row.WorkTime.toFixed($store.getters.settings.ToFixed)
        }}</template>
      </el-table-column>
      <el-table-column label="ساعات تأخير" width="120" align="center">
        <template slot-scope="scope">{{
          MinutesConvert(scope.row.DelayMinute)
        }}</template>
      </el-table-column>
      <el-table-column label="ساعات إضافي" width="120" align="center">
        <template slot-scope="scope">{{
          MinutesConvert(scope.row.ExtraMinute)
        }}</template>
      </el-table-column>
      <el-table-column label="#" width="80" align="center">
        <template slot-scope="scope">
          <dialog-log-device
            :Log="scope.row.logs"
            :Fk="listQuery.UserId"
            @Done="Done"
          />
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
import { parseTime, TimeConvert, MinutesConvert } from "@/utils";
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
        ExtraMinute: 0,
        DelayMinute: 0,
        WorkingHours: 0,
      },
      listLoading: false,
      days: [
        "الاحد",
        "الاثنين",
        "الثلاثاء",
        "الاربعاء",
        "الخميس",
        "الجمعة",
        "السبت",
      ],
    };
  },
  directives: { waves },
  watch: {
    UserId(v) {
      console.log("v", v);
      if (v) this.getdata(this.UserId);
    },
    FromDate(v) {
      console.log("FromDate", v);
      if (v != "") this.listQuery.DateFrom = v;
    },
    ToDate(v) {
      console.log("ToDate", v);
      if (v != "") this.listQuery.DateTo = v;
    },
  },

  methods: {
    MinutesConvert,
    TimeConvert,
    getdata(v) {
      this.listLoading = true;

      this.listQuery.UserId = v || this.UserId;
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

        ExtraMinute: list
          .reduce((prev, cur) => {
            return prev + cur.ExtraMinute;
          }, 0)
          .toFixed(this.$store.getters.settings.ToFixed),
        DelayMinute: list
          .reduce((prev, cur) => {
            return prev + cur.DelayMinute;
          }, 0)
          .toFixed(this.$store.getters.settings.ToFixed),
        WorkingHours: list
          .reduce((prev, cur) => {
            return prev + cur.WorkTime;
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
          startDate.getDate(),
          endDate.getHours() + 9,
          endDate.getMinutes()
        );
        while (currentDate <= endDate) {
          let logs = log.filter((x) => {
            x.DateTime = new Date(x.DateTime);
            let startShiftDate = new Date(
              currentDate.getFullYear(),
              currentDate.getMonth(),
              currentDate.getDate(),
              startDate.getHours() - 5, // في حل اجى بدري ب 5 ساعات
              startDate.getMinutes()
            );
            let endShiftDate = new Date(
              currentDate.getFullYear(),
              currentDate.getMonth(),
              currentDate.getDate() +
                (startDate.getHours() > endDate.getHours() ? 1 : 0),
              endDate.getHours() + 9, // في حل اشتغل اضافي بدري ب 5 ساعات
              endDate.getMinutes()
            );

            if (x.DateTime > startShiftDate && x.DateTime < endShiftDate)
              return x.DateTime;
          });
          if (logs.length == 1) {
            if (logs[0].DateTime.getHours() < startDate.getHours() - 5)
              logs.push({
                DateTime: new Date(
                  currentDate.getFullYear(),
                  currentDate.getMonth(),
                  currentDate.getDate(),
                  startDate.getHours(),
                  startDate.getMinutes()
                ),
                Description: "",
                DeviceId: logs[0].DeviceId,
                Fk: logs[0].Fk,
                Id: undefined,
                Name: "",
                Status: undefined,
                TableName: "Employee",
                Type: "In",
              });
            else
              logs.push({
                DateTime: new Date(
                  currentDate.getFullYear(),
                  currentDate.getMonth(),
                  currentDate.getDate() +
                    (startDate.getHours() > endDate.getHours() ? 1 : 0),
                  endDate.getHours(),
                  endDate.getMinutes()
                ),
                Description: "",
                DeviceId: logs[0].DeviceId,
                Fk: logs[0].Fk,
                Id: undefined,
                Name: "",
                Status: undefined,
                TableName: "Employee",
                Type: "Out",
              });
          }
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
            parseInt(
              (Math.abs(MinMaxD[1] - MinMaxD[0]) / (1000 * 60 * 60)) % 24
            ) +
              Math.ceil(
                (Math.abs(MinMaxD[1] - MinMaxD[0]) / (1000 * 60)) % 60
              ) /
                100 || 0;
          //  Extra Hours && Delay Hours
          let ExtraHours = 0,
            ExtraMinute = 0,
            DelayHours = 0,
            DelayMinute = 0;
          if (WorkTime > this.WorkingHours) {
            ExtraHours = WorkTime - this.WorkingHours;
            ExtraMinute =
              Math.floor(ExtraHours) * 60 +
              (ExtraHours - Math.floor(ExtraHours)) * 100;
          } else if (WorkTime == 0 || WorkTime == this.WorkingHours)
            DelayHours = 0;
          else if (WorkTime < this.WorkingHours) {
            console.log(WorkTime, this.WorkingHours);
            DelayHours = this.WorkingHours - (WorkTime + 0.4);
            DelayMinute =
              Math.floor(DelayHours) * 60 +
              (DelayHours - Math.floor(DelayHours)) * 100;
          }
          /*  console.log(
            "WorkTime",
            Math.round((Math.abs(MinMaxD[1].getTime() - MinMaxD[0]) / (1000 * 60)) % 60) /
              100,
            WorkTime
          );
*/
          //  var MinutesCount = parseInt(
          //  Math.floor(ExtraHours) * 60 + (ExtraHours - Math.floor(ExtraHours)) * 100
          //  );
          // console.log("Hours", MinutesCount, MinutesConvert(MinutesCount));
          WorkHoursLogs.push({
            Id: WorkHoursLogs.length + 1,
            Day: currentDate.getDay(),
            Date: currentDate,
            StartDateTime: MinMaxD[0], // minDate
            EndDateTime: MinMaxD[1], // maxDate,
            WorkTime: WorkTime,
            ExtraHours: ExtraHours,
            DelayHours: DelayHours,
            ExtraMinute: ExtraMinute,
            DelayMinute: DelayMinute,
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
            parseInt(
              (Math.abs(Time.getTime() - ShouldTime) / (1000 * 60)) % 60
            ) /
              100 || 0)
        );
      else
        return (
          parseInt((Math.abs(Time - ShouldTime) / (1000 * 60 * 60)) % 24) +
            parseInt(
              (Math.abs(Time.getTime() - ShouldTime) / (1000 * 60)) % 60
            ) /
              100 || 0
        );
    },
    handleFilter() {
      this.listQuery.Page = 1;
      this.getdata();
    },
  },
};
</script>
