<template>
  <el-date-picker
    @change="SetVal"
    v-model="date"
    type="date"
    :size="$store.getters.size"
    placeholder="تاريخ الانتهاء"
    :picker-options="pickerOptions"
    :format="$store.getters.settings.DateFormat"
  >
  </el-date-picker>
</template>
<script>
import { GetInventoryItemEXP } from "@/api/Item";
import {
  LocalDateTime,
  LocalDate,
  LocalTime,
  DateTimeFormatter,
  Instant
} from "@js-joda/core";
export default {
  props: {
    Value: String,
    ItemId: { type: Number, default: undefined }
  },
  mounted() {
    this.getdata();
    if (!this.Value) this.date = new Date(this.Value);
  },
  data() {
    return {
      date: "",
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now();
        },
        shortcuts: []
      }
    };
  },
  methods: {
    SetVal(val) {
      console.log(val);
      val = new Date(val);
      val = LocalDateTime.ofInstant(Instant.ofEpochMilli(val)).format(
        DateTimeFormatter.ofPattern(this.$store.getters.settings.DateFormat)
      );
      this.$emit("SetVal", val);
      console.log(val);
    },
    getdata() {
      GetInventoryItemEXP({ Id: this.ItemId }).then(response => {
        // handle success
        //  console.log(response);
        response.forEach(x => {
          this.date = x.Exp;
          this.pickerOptions.shortcuts.push({
            text: this.formatDate(x.Exp),
            onClick(picker) {
              picker.$emit("pick", x.Exp);
            }
          });
        });
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
