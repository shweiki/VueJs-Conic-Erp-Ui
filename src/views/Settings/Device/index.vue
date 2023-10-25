<template>
  <div class="app-container">
    <p>{{ response }}</p>
    <el-card class="box-card">
      <div slot="header">
        <add-device />

        <span>جميع الاجهزة</span>
      </div>
      <el-table
        v-loading="loading"
        :data="
          tableData.filter(
            (data) => !search || data.Name.toLowerCase().includes(search.toLowerCase())
          )
        "
        fit
        border
        max-height="900"
        highlight-current-row
        style="width: 100%"
      >
        <el-table-column prop="Id" width="80" align="center">
          <template slot="header" slot-scope="{}">
            <el-button
              type="primary"
              icon="el-icon-refresh"
              @click="getdata()"
            />
          </template>
        </el-table-column>
        <el-table-column prop="Name" align="center">
          <template slot="header" slot-scope="{}">
            <el-input v-model="search" :placeholder="$t('Classification.Name')" />
          </template>
        </el-table-column>
        <el-table-column
          prop="Ip"
          :label="$t('Classification.Ip')"
          align="center"
        />
        <el-table-column
          prop="Port"
          :label="$t('Classification.Port')"
          align="center"
        />
        <el-table-column
          :label="$t('Classification.Notes')"
          prop="Description"
          width="220"
          align="center"
        />
        <el-table-column :label="$t('Classification.Edit')" align="center">
          <template slot-scope="scope">
            <edit-device :device-id="scope.row.Id" />
          </template>
        </el-table-column>
        <el-table-column prop="Name" align="center">
          <template slot-scope="scope">
            <el-button
              :size="$store.getters.size"
              type="primary"
              @click="GetLogData(scope.row.Ip)"
            >
              سحب جميع سجلات
            </el-button>

            <el-button
              :size="$store.getters.size"
              type="warning"
              @click="EnrollAllUser(scope.row.Ip)"
            >
              ارسال جميع معلومات
            </el-button>

            <el-button
              :size="$store.getters.size"
              type="danger"
              @click="ClearLog(scope.row.Ip)"
            >مسح سجلات المشتركين</el-button>
            <el-button
              :size="$store.getters.size"
              type="success"
              @click="ClearAdministrators(scope.row.Ip)"
            >Clear Administrators</el-button>
            <el-button
              :size="$store.getters.size"
              type="danger"
              @click="TurnOffDevice(scope.row.Ip)"
            >إيقاف تشغيل الجهاز</el-button>
            <el-button
              :size="$store.getters.size"
              type="success"
              @click="RestartDevice(scope.row.Ip)"
            >اعادة تشغيل الجهاز</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import { GetDevice } from '@/api/Device'
import AddDevice from '@/components/Device/AddDevice.vue'
import EditDevice from '@/components/Device/EditDevice.vue'
import { getToken } from '@/utils/auth'

export default {
  name: 'Device',
  components: { AddDevice, EditDevice },
  data() {
    return {
      tableData: [],
      loading: true,
      search: '',
      response: ''
    }
  },
  created() {
    this.getdata()
  },
  methods: {
    getdata() {
      this.loading = true
      GetDevice()
        .then((response) => {
          // handle success
          console.log(response)
          this.tableData = response
          this.loading = false
        })
        .catch((error) => {
          // handle error
          this.response = error
          console.log(error)
        })
    },
    async EnrollAllUser(Ip) {
      this.loading = true
      try {
        await this.$socket.invoke(
          'EnrollServerUsers',
          Ip,
          getToken().replace('Bearer ', '')
        )
      } catch (err) {
        console.error(err)
      } finally {
        this.loading = false
      }
    },
    async GetLogData(Ip) {
      this.loading = true
      try {
        await this.$socket.invoke('GetLogData', Ip)
      } catch (err) {
        console.error(err)
      } finally {
        this.loading = false
      }
    },
    async ClearLog(Ip) {
      this.loading = true
      try {
        await this.$socket.invoke('ClearLog', Ip)
      } catch (err) {
        console.error(err)
      } finally {
        this.loading = false
      }
    },
    async ClearAdministrators(Ip) {
      this.loading = true
      try {
        await this.$socket.invoke('ClearAdministrators', Ip)
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
    },
    async TurnOffDevice(Ip) {
      this.loading = true
      try {
        await this.$socket.invoke('TurnOffDevice', Ip)
      } catch (err) {
        console.error(err)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
