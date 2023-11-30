<template>
  <div>
    <!-- <span class="demonstration">{{ $t("Sales.ByDate") }}</span>
     -->
    <el-date-picker
      v-model="date"
      :size="$store.getters.size"
      :format="$store.getters.settings.DateTimeFormat"
      :type="
        $store.getters.settings.DateTimeFormat.length > 10 ? 'datetimerange' : 'daterange'
      "
      align="right"
      :range-separator="$t('Sales.until')"
      :start-placeholder="$t('Sales.From')"
      :end-placeholder="$t('Sales.To')"
      :picker-options="
        WithOptions === false ? {} : pickerOptions
      "
      :default-time="['00:00:00', '23:59:59']"
      @change="SetVal"
    />
  </div>
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
      type: Array,
      default() {
        return []
      }
    },
    withOptions: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      date: [],
      pickerOptions: { shortcuts: this.$store.getters.settings.pickerOptions.shortcuts.map(element => {
        return {
          text: element.text,
          onClick: function(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * element.days)
            picker.$emit('pick', [start.setHours(0, 0, 0, 0), end.setHours(23, 59, 59, 999)])
          }
        }
      }) || [] },
      WithOptions: this.withOptions || true
    }
  },
  watch: {
    value(val) {
      if (
        val[0] !== '' &&
        val[0] !== this.date[0] &&
        val[1] !== '' &&
        val[1] !== this.date[1]
      ) {
        const start = new Date(val[0])
        const end = new Date(val[1])
        this.SetVal([start, end])
      }
    }
  },
  created() {
    let start = new Date()
    let end = new Date()

    if (this.value[0] !== '' && this.value[1] !== '') {
      start = new Date(this.value[0])
      end = new Date(this.value[1])
    } else {
      start = new Date(
        start.setTime(
          start.getTime() -
          3600 * 1000 * 24 * this.$store.getters.settings.pickerOptions.shortcuts.find((obj) => obj.default === true).days
        )
      )
      end = end.setHours(23, 59, 59, 999)
    }
    this.SetVal([start, end])
  },
  methods: {
    SetVal(val) {
      val = [
        LocalDateTime.ofInstant(Instant.ofEpochMilli(val[0])).format(
          DateTimeFormatter.ofPattern('yyyy-MM-dd HH:mm')
        ),
        LocalDateTime.ofInstant(Instant.ofEpochMilli(val[1])).format(
          DateTimeFormatter.ofPattern('yyyy-MM-dd HH:mm')
        )
      ]
      this.date = val
      this.$emit('Set', val)
    }
  }
}
</script>
