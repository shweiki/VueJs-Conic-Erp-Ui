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
      @change="SetVal"
      :default-time="['00:00:00', '23:59:59']"
    ></el-date-picker>
  </div>
</template>
<script>
export default {
  props: {
    Value: Array,
  },
  data() {
    return {
      date: [this.$moment().startOf("day"), this.$moment().endOf("day")],
    };
  },
  created() {
    this.$emit("Set", [this.$moment(this.date[0])._d, this.$moment(this.date[1])._d]);
  },
  watch: {
    Value(val) {
      if (val != []) this.date = [this.$moment(val[0])._d, this.$moment(val[1])._d];
      else this.SetVal();
    },
  },
  methods: {
    SetVal() {
      this.$emit("Set", [this.$moment(this.date[0])._d, this.$moment(this.date[1])._d]);
      this.$emit("focus");
    },
  },
};
</script>
