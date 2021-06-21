<template>
  <el-date-picker
    style="width: 80%"
    clear-icon="false"
    :size="$store.getters.size"
    @change="SetVal"
    v-model="date"
    type="date"
    v-bind:placeholder="$t('CashPool.Date')"
    :format="$store.getters.settings.DateFormat"
  ></el-date-picker>
</template>
<script>
import {
  LocalDateTime,
  LocalDate,
  LocalTime,
  DateTimeFormatter,
  Instant
} from "@js-joda/core";
export default {
  props: {
    Value: String
  },
  data() {
    return {
      date: ""
    };
  },
  created() {
    this.SetVal(new Date(this.Value));
  },
  watch: {
    Value(val) {
      console.log(val);
      if (val != "") this.SetVal(new Date(val));
      else this.SetVal(new Date());
    }
  },
  methods: {
    SetVal(val) {
      this.date = LocalDateTime.ofInstant(Instant.ofEpochMilli(val)).format(
        DateTimeFormatter.ofPattern(this.$store.getters.settings.DateFormat)
      );
      this.$emit("Set", this.date);
    }
  }
};
</script>
