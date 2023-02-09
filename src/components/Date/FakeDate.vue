<template>
  <el-date-picker
    style="width: 80%"
    clear-icon="false"
    :size="$store.getters.size"
    @change="SetVal"
    v-model="date"
    :type="type"
    v-bind:placeholder="$t('CashPool.Date')"
    :format="$store.getters.settings.DateTimeFormat"
    :disabled ="disabled"
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
    disabled:{
      type: Boolean,
      default: false
    },
    type:{
      type: String,
      default: "datetime"
    }
  },
  data() {
    return {
      date: "",
    };
  },
  watch: {
    Value(val) {
      if (val != "") this.SetVal(new Date(val));
      else this.SetVal(new Date());
    },
  },
  created() {
    if (this.Value != "") this.SetVal(new Date(this.Value));
    else this.SetVal(new Date()); //   this.date = new Date();
  },
  methods: {
    SetVal(val) {
      val = LocalDateTime.ofInstant(Instant.ofEpochMilli(val)).format(
        DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm")
      );
      this.date = val;
      this.$emit("Set", val);
    },
  },
};
</script>
