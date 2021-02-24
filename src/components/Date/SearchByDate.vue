<template>
  <div>
    <!-- <span class="demonstration">{{ $t("Sales.ByDate") }}</span>
     --><el-date-picker
      v-model="date"
      :format="$store.getters.settings.DateTimeFormat"
      type="daterange"
      align="right"
      v-bind:range-separator="$t('Sales.until')"
      v-bind:start-placeholder="$t('Sales.From')"
      v-bind:end-placeholder="$t('Sales.To')"
      :picker-options="$store.getters.settings.pickerOptions"
      @change="SetVal"
      :default-time="['00:00:00', '23:59:59']"
    ></el-date-picker>
  </div>
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
  data() {
    return {
      date: [],
    };
  },
  created() {
    this.SetVal([new Date(), new Date()]);
  },
  methods: {
    SetVal(val) {
      if (!val) this.date = [];
      else
        this.date = [
          LocalDate.ofInstant(Instant.ofEpochMilli(val[0]))
            .atStartOfDay()
            .format(
              DateTimeFormatter.ofPattern(this.$store.getters.settings.DateTimeFormat)
            ),
          LocalDate.ofInstant(Instant.ofEpochMilli(val[1]))
            .atTime(LocalTime.MAX)
            .format(
              DateTimeFormatter.ofPattern(this.$store.getters.settings.DateTimeFormat)
            ),
        ];
      this.$emit("Set", this.date);
    },
  },
};
</script>
