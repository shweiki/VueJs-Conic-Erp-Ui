<template>
  <el-date-picker
    v-model="date"
    style="width: 80%"
    clear-icon="false"
    :size="$store.getters.size"
    :type="type"
    :placeholder="$t('CashPool.Date')"
    :format="$store.getters.settings.DateTimeFormat"
    :disabled="disabled"
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
  props: {
    value: {
      type: String,
      default: null
    },
    disabled: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: 'datetime'
    }
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
    if (this.value !== '') this.SetVal(new Date(this.value))
    else this.SetVal(new Date())
  },
  methods: {
    SetVal(val) {
      val = LocalDateTime.ofInstant(Instant.ofEpochMilli(val)).format(
        DateTimeFormatter.ofPattern('yyyy-MM-dd HH:mm')
      )
      this.date = val
      this.$emit('Set', val)
    }
  }
}
</script>
