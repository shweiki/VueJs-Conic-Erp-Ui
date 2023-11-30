<template>
  <el-date-picker
    v-model="date"
    style="width: 80%"
    clear-icon="false"
    :size="$store.getters.size"
    type="date"
    :placeholder="$t('CashPool.Date')"
    :format="$store.getters.settings.DateTimeFormat"
    @change="SetVal"
  />
</template>
<script>
import {
  LocalDateTime,

  DateTimeFormatter,
  Instant
} from '@js-joda/core'
export default {
  value: {
    type: String,
    default: null
  },
  data() {
    return {
      date: ''
    }
  },
  watch: {
    value(val) {
      if (val !== '') this.SetVal(new Date(val))
      else this.SetVal(new Date())
    }
  },
  created() {
    this.SetVal(new Date(this.Value))
  },
  methods: {
    SetVal(val) {
      this.date = LocalDateTime.ofInstant(Instant.ofEpochMilli(val)).format(
        DateTimeFormatter.ofPattern('yyyy-MM-dd HH:mm')
      )
      this.$emit('Set', this.date)
    }
  }
}
</script>
