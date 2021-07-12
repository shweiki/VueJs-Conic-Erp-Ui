<template>
  <el-date-picker
    style="width: 80%"
    clear-icon="false"
    :size="$store.getters.size"
    @change="SetVal"
    v-model="date"
    type="datetime"
    v-bind:placeholder="$t('CashPool.Date')"
    :format="$store.getters.settings.DateTimeFormat"
  ></el-date-picker>
</template>
<script>
import {
  LocalDateTime,
  LocalDate,
  LocalTime,
  DateTimeFormatter,
  Instant,
} from "@js-joda/core";
export default {
  props: {
    Value: String,
  },
  data() {
    return {
      date: "",
    };
  },
  created() {
    this.SetVal(new Date());
    //   this.date = new Date();
  },
  watch: {
    Value(val) {
      //     console.log(val);
      if (val != "") this.SetVal(new Date(val));
      else this.SetVal(new Date());
    },
  },
  methods: {
    SetVal(val) {
      val = LocalDateTime.ofInstant(Instant.ofEpochMilli(val)).format(
        DateTimeFormatter.ofPattern(this.$store.getters.settings.DateTimeFormat)
      );
      this.date = val;
      this.$emit("Set", val);
    },
  },
};
</script>
