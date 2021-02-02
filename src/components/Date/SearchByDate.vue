<template>
  <div>
    <span class="demonstration">{{ $t("Sales.ByDate") }}</span>
    <el-date-picker
      v-model="date"
      :format="$store.getters.settings.DateFormat"
      type="daterange"
      align="right"
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

export default {
  computed: {
    date: {
      get() {
        return [this.$moment().startOf("day"), this.$moment().endOf("day")]; //this.$store.state.settings.datepickerQuery;
      },
      set(val) {
        val[0] = this.$moment(val[0]).startOf("day");
        val[1] = this.$moment(val[1]).endOf("day");

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
