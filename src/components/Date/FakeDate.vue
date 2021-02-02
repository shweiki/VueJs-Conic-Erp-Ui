<template>
  <el-date-picker
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
    Value: String
  },
  data() {
    return {
      FakeDate: this.$moment()
    };
  },
  watch: {
    Value(val) {
      if (val) this.FakeDate = this.$moment(val)._d
    }
  },
  methods: {
    SetVal() {
      this.$emit("Set", this.$moment(this.FakeDate)._d);
      this.$emit("focus");
    }
  }
};
</script>