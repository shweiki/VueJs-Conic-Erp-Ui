<template>
  <el-input v-model="lastLog" disabled />
</template>
<script>
import { GetlastLogByUserId } from '@/api/DeviceLog'
import { parseTime } from '@/utils'

export default {
  props: {
    userId: {
      type: String,
      required: true
    },
    tableName: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      lastLog: 'لا يوجد'
    }
  },
  watch: {
    UserId(val) {
      if (val) this.GetlastLog(val)
    }
  },
  methods: {
    GetlastLog(val) {
      GetlastLogByUserId({
        UserId: val, // || this.UserId,
        TableName: this.TableName
      }).then((res) => {
        if (res) this.lastLog = parseTime(res, '{y}-{m}-{d} {h}:{i}')
      })
    }
  }
}
</script>
