<template>
  <div>
    <span class="demonstration">{{ $t("Sales.ByDate") }}</span>
    <el-date-picker
      v-model="date"
      format="yyyy/MM/dd"
      type="daterange"
      unlink-panels
      v-bind:range-separator="$t('Sales.until')"
      v-bind:start-placeholder="$t('Sales.From')"
      v-bind:end-placeholder="$t('Sales.To')"
      :picker-options="$store.getters.settings.pickerOptions"
      :default-time="$store.getters.settings.timeQuery"
      @change="getdata"
    ></el-date-picker>
  </div>
</template>
<script>
import moment from "moment";

export default {
  computed: {
    date: {
      get() {
        return this.$store.state.settings.datepickerQuery;
      },
      set(val) {
        Date.prototype.toJSON = function() {
          return moment(this).format();
        };
        this.$store.dispatch("settings/changeSetting", {
          key: "datepickerQuery",
          value: val
        });
      }
    }
  },
  methods: {
    getdata() {
      this.$emit("change");
    }
  }
};
</script>