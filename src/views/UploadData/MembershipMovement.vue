<template>
  <div class="app-container">
    <upload-excel-component :on-success="handleSuccess" :before-upload="beforeUpload" />
    <el-button @click="AddMemberShip" plain :disabled="isDisabled" type='success'>Push</el-button>
    <el-table
      height="250"
      v-loading="loading"
      :data="tableData"
      border
      highlight-current-row
      style="width: 100%;margin-top:20px;"
    >
      <el-table-column v-for="item of tableHeader" :key="item" :prop="item" :label="item" />
    </el-table>
  </div>
</template>

<script>
import UploadExcelComponent from "@/components/UploadExcel/index.vue";
import { Create } from "@/api/MembershipMovement";

export default {
  name: "MembershipMovement",
  components: { UploadExcelComponent },
  data() {
    return {
      isDisabled: true,
      loading: false,
      tableData: [],
      data: [],
      tableHeader: []
    };
  },

  methods: {
    AddMemberShip() {
      this.loading = true;
      this.isDisabled = true;
      Create(this.data[0])
        .then(response => {
          console.log("tag", "" + response);
          this.data.splice(0, 1);
          if (this.data.length != 0) {
            this.AddMemberShip();
          } else {
            this.loading = false
            this.tableData = [];
            this.$notify({
              title: "تم ",
              message: "تم الإضافة بنجاح",
              type: 'success',
              duration: 2000
            })
          }
        })
        .catch(error => {
          console.log(error);
          //this.AddMemberShip(100), 1000);
        })
    },

    beforeUpload(file) {
      const isLt1M = file.size / 1024 / 1024 < 8;

      if (isLt1M) {
        return true;
      }

      this.$message({
        message: "Please do not upload files larger than 8m in size.",
        type: "warning"
      })
      return false;
    },
    handleSuccess({ results, header }) {
      this.loading = true;
      this.tableData = results;
      console.log(this.tableData);
      this.data = this.tableData.map(element => {
        let MemberId, MembershipId, Type;
        if (element.Offers_Id == 10028) {
          // 1 Day
          MembershipId = 4;
          Type = "OneDay";
        }
        if (element.Offers_Id == 10029) {
          // 1 month Morning
          MembershipId = 2;
          Type = "Morning";
        }
        if (element.Offers_Id == 10030) {
          // 3 month Morning
          MembershipId = 3;
          Type = "Morning";
        }
        if (element.Offers_Id == 10031) {
          // 6 month Morning
          MembershipId = 5;
          Type = "Morning";
        }
        if (element.Offers_Id == 10032) {
          // 12 month Morning
          MembershipId = 7;
          Type = "Morning";
        }
        if (element.Offers_Id == 10033) {
          // 1 month FullDay
          MembershipId = 2;
          Type = "FullDay";
        }
        if (element.Offers_Id == 10046) {
          // 3 month FullDay
          MembershipId = 3;
          Type = "FullDay";
        }
        if (element.Offers_Id == 10047) {
          // 6 month FullDay
          MembershipId = 5;
          Type = "FullDay";
        }
        if (element.Offers_Id == 10048) {
          // 12 month FullDay
          MembershipId = 7;
          Type = "FullDay";
        }
        if (element.Offers_Id == 10068) {
          // 12 month FullDay
          MembershipId = 7;
          Type = "FullDay";
        }
        if (element.Offers_Id == 10069) {
          // 9 month FullDay
          MembershipId = 6;
          Type = "FullDay";
        }
        MemberId = this.FindIdMemberByTag(
          element.Member_Id,
          this.$store.getters.Members
        );
        console.log(MembershipId, Type, MemberId);
        return {
          Id: undefined,
          TotalAmmount: element.VALUE,
          Tax: 0.0,
          StartDate: this.ExcelDateToJSDate(element.On_Date),
          EndDate: this.ExcelDateToJSDate(element.Off_Date),
          Type: Type,
          VisitsUsed: 0,
          Discount: 0,
          DiscountDescription: '',
          Description: element.Note,
          Status: 1,
          MemberId: MemberId,
          MembershipId: MembershipId
        };
      })
      this.tableHeader = header;
      this.loading = false
      this.isDisabled = false;
    },
    FindIdMemberByTag(Tag, arr) {
      for (var i = 0; i < arr.length; i++) {
        if (arr[i].Tag == Tag) {
          return arr[i].Id;
        }
      }
    },
    ExcelDateToJSDate(serial) {
      var utc_days = Math.floor(serial - 25569);
      var utc_value = utc_days * 86400;
      var date_info = new Date(utc_value * 1000);

      var fractional_day = serial - Math.floor(serial) + 0.0000001;

      var total_seconds = Math.floor(86400 * fractional_day);

      var seconds = total_seconds % 60;

      total_seconds -= seconds;

      var hours = Math.floor(total_seconds / (60 * 60));
      var minutes = Math.floor(total_seconds / 60) % 60;

      return new Date(
        date_info.getFullYear(),
        date_info.getMonth(),
        date_info.getDate(),
        hours,
        minutes,
        seconds
      );
    }
  }
};
</script>