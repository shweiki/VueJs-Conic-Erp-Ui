<template>
  <div>
    <el-col :span="24"> <member-search /> </el-col>
    <el-card style="margin-bottom: 20px">
      <el-row type="flex">
        <el-col :span="8">
          <el-button icon="el-icon-sort" @click="reverse = !reverse" />
        </el-col>
        <el-col :span="6">
          <Add-Device-Log table-name="Member" />
        </el-col>
        <el-col :span="2">
          <el-button :loading="loading" type="primary" icon="el-icon-refresh" :size="$store.getters.size"
            @click="getdata()" />
        </el-col>
        <el-col :span="4">
          <el-tooltip class="item" effect="dark" :content="deviceState" placement="bottom">
            <el-tag :type="deviceIsConnect ? 'success' : 'danger'"><i class="el-icon-connection" />{{ deviceState
              }}</el-tag>
          </el-tooltip>
        </el-col>
      </el-row>
      <el-row type="flex">
        <el-col :span="24">
          <el-timeline :v-infinite-scroll="load" :infinite-scroll-disabled="disabled" :reverse="reverse" style="
              margin-top: 15px;
              height: 550px;
              overflow: auto;
              text-align: center;
            ">
            <el-timeline-item v-for="(Log, index) in MembersLogs" :key="index" :icon="Log.User.Style.IconClass"
              :color="Log.User.Style.Color" :size="$store.getters.size" :timestamp="Log.DateTime" :hide-timestamp="true"
              class="infinite-list-item">
              <el-row type="flex">
                <el-col :span="6">
                  <el-time-picker v-model="Log.DateTime" :size="$store.getters.size" format="hh:mm A"
                    disabled /></el-col>
                <el-col :span="5">
                  <el-tag :color="Log.User.Style.Color" @click="$router.push({ path: '/Gym/Edit/' + Log.Fk })"><strong
                      style="font-size: 10px; cursor: pointer">{{
      Log.User.Name
    }}</strong></el-tag>
                </el-col>
                <el-col :span="4">
                  <Status-Tag :status="Log.User.Status" table-name="Member" />
                </el-col>
                <el-col v-if="Log.User.ActiveMemberShip != null" :span="3">
                  <el-tag style="color: orangered">({{ Log.User.ActiveMemberShip.NumberClass }}\{{
      Log.User.ActiveMemberShip.NumberClass -
      Log.User.ActiveMemberShip.VisitsUsed
    }})
                  </el-tag>
                </el-col>
                <el-col v-if="Log.User.ActiveMemberShip != null" :span="3">
                  <el-tag :type="Log.User.ActiveMemberShip.Type == 'Morning'
      ? 'warning'
      : 'success'
      ">{{ Log.User.ActiveMemberShip.Type }}</el-tag>
                </el-col>
                <el-col :span="3">
                  <el-tag v-if="Log.User.TotalCredit - Log.User.TotalDebit > 0" type="info">مدين</el-tag>
                </el-col>
              </el-row>
            </el-timeline-item>
            <p v-if="loading">Loading...</p>
            <p v-if="noMore">No more</p>
            <p v-if="!noMore" @click="load">more</p>
          </el-timeline>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import { GetByStatus } from '@/api/DeviceLog'
import StatusTag from '@/components/Oprationsys/StatusTag.vue'
import AddDeviceLog from '@/components/Device/AddDeviceLog.vue'
import MemberSearch from '@/components/Member/MemberSearch.vue'

export default {
  name: 'MemberLog',
  components: { StatusTag, AddDeviceLog, MemberSearch },
  data() {
    return {
      loading: false,
      MembersLogs: [],
      deviceState: 'socket is not work',
      deviceIsConnect: false,
      reverse: false,
      listQuery: {
        Page: 1,
        Any: '',
        limit: this.$store.getters.settings.LimitQurey,
        Sort: '-id',
        Status: 0,
        TableName: 'Member'
      }
    }
  },
  computed: {
    noMore() {
      return this.listQuery.Page >= 12
    },
    disabled() {
      return this.loading || this.noMore
    }
  },
  created() {
    this.getdata()
    this.$socket.start({
      log: true // Logging is optional but very helpful during development
    })
  },
  sockets: {
    SendEventLog(log) {
      this.MembersLogs.unshift(JSON.parse(log))
    },
    DeviceState({ deviceIsConnect, msg }) {
      this.deviceIsConnect = deviceIsConnect
      this.deviceState = msg
    }
  },
  methods: {
    getdata() {
      this.loading = true
      GetByStatus(this.listQuery)
        .then((response) => {
          // this.MembersLogs = response
          Array.prototype.push.apply(this.MembersLogs, response)
          // .sort((a, b) => new Date(b.DateTime) - new Date(a.DateTime) );
          this.listQuery.Page++
          if (response.length < this.listQuery.limit) {
            this.listQuery.Page = 13
          }
          //  localStorage.setItem('MemberLog_ListQuery', JSON.stringify(this.listQuery))
        })
        .catch()
        .finally(() => {
          this.loading = false
        })
    },
    load() {
      this.getdata()
    }
  }
}
</script>
