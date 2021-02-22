<template>
  <el-date-picker
    style="width: 80%"
    clear-icon="false"
    :size="$store.getters.size"
    @change="SetVal"
    v-model="FakeDate"
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
  Instant,
} from "@js-joda/core";
export default {
  props: {
    Value: String,
  },
  data() {
    return {
      FakeDate: "",
    };
  },
  created() {
    this.SetVal(new Date());
  },
  watch: {
    Value(val) {
      if (val != "") this.SetVal(new Date(val));
      else this.SetVal(new Date());
    },
  },
  methods: {
    SetVal(val) {
      this.FakeDate = LocalDateTime.ofInstant(Instant.ofEpochMilli(val)).format(
        DateTimeFormatter.ofPattern(this.$store.getters.settings.DateTimeFormat)
      );
      this.$emit("Set", this.FakeDate);
    },
  },
};
</script>
