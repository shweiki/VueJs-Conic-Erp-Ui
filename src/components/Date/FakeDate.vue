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
export default {
  props: {
    Value: String,
  },
  data() {
    return {
      FakeDate: this.$moment(),
    };
  },
  created() {
    this.$emit("Set", this.$moment(this.FakeDate)._d);
  },
  watch: {
    Value(val) {
      if (val != "") this.FakeDate = this.$moment(val)._d;
      else this.$emit("Set", this.$moment(this.FakeDate)._d);
    },
  },
  methods: {
    SetVal() {
      this.$emit("Set", this.$moment(this.FakeDate)._d);
      this.$emit("focus");
    },
  },
};
</script>
