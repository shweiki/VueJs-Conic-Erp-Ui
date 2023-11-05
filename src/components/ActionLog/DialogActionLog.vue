<template>
  <div>
    <el-button type="success" icon="el-icon-data-line" @click="getdata()" />

    <el-dialog style="margin-top: -13vh" :visible.sync="Visible">
      <el-timeline>
        <el-timeline-item
          v-for="(log, index) in actionlogs"
          :key="index"
          :timestamp="
            formatDate(new Date(log.PostingDateTime), 'no') +
              ' - ' +
              tConvert(new Date(log.PostingDateTime))
          "
          placement="top"
          :color="
            $store.getters.Oprations.find((obj) => {
              return obj.Id == log.OprationId;
            }).Color
          "
          :icon="
            $store.getters.Oprations.find((obj) => {
              return obj.Id == log.OprationId;
            }).IconClass
          "
          :type="
            $store.getters.Oprations.find((obj) => {
              return obj.Id == log.OprationId;
            }).ClassName
          "
        >
          {{
            $store.getters.Oprations.find((obj) => {
              return obj.Id == log.OprationId;
            }).OprationDescription
          }}
          {{ log.Description }}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
import { GetLogByObjTable } from '@/api/ActionLog'

export default {
  props: {
    tableName: {
      type: String,
      required: true
    },
    objId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      Visible: false,
      actionlogs: []
    }
  },
  methods: {
    getdata() {
      GetLogByObjTable({ TableName: this.tableName, Id: this.objId }).then((response) => {
        // handle success
        this.actionlogs = response

        this.Visible = true
      })
    },
    tConvert(date) {
      let hours = date.getHours()
      let minutes = date.getMinutes()
      const ampm = hours >= 12 ? 'PM' : 'AM'
      hours = hours % 12
      hours = hours || 12 // the hour '0' should be '12'
      minutes = minutes < 10 ? '0' + minutes : minutes
      const strTime = ' ' + hours + ':' + minutes + '  ' + ampm
      return strTime
    },
    formatDate(date) {
      const d = new Date(date)
      let day = '' + d.getDate()
      let month = '' + (d.getMonth() + 1)
      const year = d.getFullYear()
      if (month.length < 2) month = '0' + month
      if (day.length < 2) day = '0' + day

      return [day, month, year].join('/')
    }
  }
}
</script>
