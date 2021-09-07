<template>
  <div>
    <!-- <span class="demonstration">{{ $t("Sales.ByDate") }}</span>
     --><el-date-picker
      v-model="date"
      :size="$store.getters.size"
      :format="$store.getters.settings.DateTimeFormat"
      v-bind:type="
        $store.getters.settings.DateTimeFormat.length > 10 ? 'datetimerange' : 'daterange'
      "
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
    const { shortcuts } = this.$store.getters.settings.pickerOptions;
    let start = new Date();
    start = new Date(
      start.setTime(
        start.getTime() -
          3600 * 1000 * 24 * shortcuts.find((obj) => obj.default == true).days
      )
    );
    let end = new Date();
    this.SetVal([start.setHours(0, 0, 0, 0), end.setHours(23, 59, 59, 999)]);
    //  this.date = [new Date(), new Date()];
  },
  methods: {
    SetVal(val) {
      val = [
        LocalDateTime.ofInstant(Instant.ofEpochMilli(val[0])).format(
          DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm")
        ),
        LocalDateTime.ofInstant(Instant.ofEpochMilli(val[1])).format(
          DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm")
        ),
      ];
      this.date = val;
      this.$emit("Set", val);
    },
  },
};
</script>
