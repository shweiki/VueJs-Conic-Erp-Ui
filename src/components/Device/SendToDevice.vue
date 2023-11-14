<template>
  <el-popover placement="left-start" width="500" trigger="hover">
    <el-button-group v-for="item in options" :key="item.Id">
      <el-button
        :loading="loading"
        type="info"
        icon="el-icon-arrow-left"
        @click="EnrollUserOnDevice(item.Ip)"
      >تحديث البيانات الى{{ item.Name }}</el-button>
      <el-button
        :loading="loading"
        :size="$store.getters.size"
        type="warning"
        @click="ConnectDevice(item.Ip)"
      >اتصال</el-button>
      <el-button
        :loading="loading"
        :size="$store.getters.size"
        type="success"
        @click="RestartDevice(item.Ip)"
      >اعادة تشغيل الجهاز</el-button>
    </el-button-group>

    <el-button slot="reference" type="info"> جهاز البصمة</el-button>
  </el-popover>
</template>
<script>
import { GetDevice } from '@/api/Device'

export default {
  props: {
    objectId: {
      type: String,
      required: true
    },
    name: {
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
      loading: false,
      options: []
    }
  },
  created() {
    GetDevice().then((response) => {
      this.options = response
      this.$socket.start()
    })
  },
  sockets: {
    SendEventLog(log) {

    },
    DeviceState({ deviceIsConnect, msg }) {
      this.deviceIsConnect = deviceIsConnect
      this.deviceState = msg
    }
  },
  methods: {
    async EnrollUserOnDevice(Ip) {
      this.loading = true
      try {
        await this.$socket.invoke('EnrollUser', Ip, this.objectId, this.name)
      } catch (err) {
        console.error(err)
      } finally {
        this.loading = false
      }
    },
    async ConnectDevice(Ip) {
      this.loading = true
      try {
        await this.$socket.invoke('ConnectDevice', Ip)
      } catch (err) {
        console.error(err)
      } finally {
        this.loading = false
      }
    },
    async RestartDevice(Ip) {
      this.loading = true
      try {
        await this.$socket.invoke('RestartDevice', Ip)
      } catch (err) {
        console.error(err)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
