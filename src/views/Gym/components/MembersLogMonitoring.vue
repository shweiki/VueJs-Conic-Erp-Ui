<template>
  <div>
    <el-col :span="24"> <member-search /> </el-col>
    <el-card style="margin-bottom: 20px">

<!-- Logout -->
    <el-col :span="12">
        <!-- Logout header -->
      <el-row type="flex">
        <el-col :span="20" style="display: flex; justify-content: center; align-items:start;">
        <h3>تسجيل خروج</h3>
        </el-col>
        <el-col :span="4" style="display: flex; justify-content: end; padding-left: 32px; align-items:center;">
          <el-tooltip
            class="item"
            effect="dark"
            :content="deviceState"
            placement="bottom"
          >
            <el-tag
              :type="deviceIsConnect ? 'success' : 'danger'"
            ><i
              class="el-icon-connection"
            />{{ deviceState }}</el-tag>
          </el-tooltip>
        </el-col>
      </el-row>
        <el-row type="flex">
        <el-col :span="4" style="display: flex; justify-content: start;">
          <el-button icon="el-icon-sort" @click="reverse = !reverse" />
        </el-col>
        <el-col :span="6" style="display: flex; justify-content: start;">
        <Add-Device-Log table-name="Member" />
        </el-col>
        <el-col :span="14" style="display: flex; padding-left: 32px; justify-content: end;">
          <el-button
            :loading="loading"
            type="primary"
            icon="el-icon-refresh"
            :size="$store.getters.size"
            @click="getdata()"
          />
        </el-col>

        </el-row>

        <!-- Logout records -->
      <el-row>
          <el-timeline
            v-infinite-scroll="load"
            infinite-scroll-disabled="disabled"
            :reverse="reverse"
            style="
              margin-top: 15px;
              height: 550px;
              overflow: auto;
              text-align: center;
            "
          >
            <el-timeline-item
              v-for="(Log, index) in MembersLogout"
              :key="index"
              :color="Log.User.Style.Color"
              :size="$store.getters.size"
              :timestamp="Log.DateTime"
              :hide-timestamp="true"
              class="infinite-list-item"
            >
              <el-row type="flex">

                <!-- Debit | Credit -->
                <el-col :span="2" style="display: flex; justify-content: end; margin-left: 4px;">
                  <el-tag
                  v-if="Log.User.TotalCredit - Log.User.TotalDebit > 0"
                    type="info"
                  >مدين</el-tag>
                </el-col>

                <!-- Classes Number  -->
                <el-col :span="3" style="display: flex; justify-content: end; margin-left: 4px;">
                  <el-tag v-if="Log.User.ActiveMemberShip != null"
                    style="color: orangered"
                  >({{ Log.User.ActiveMemberShip.NumberClass }}\{{
                    Log.User.ActiveMemberShip.NumberClass -
                      Log.User.ActiveMemberShip.VisitsUsed
                  }})
                  </el-tag>
                </el-col>

                <!-- Subscription Shift -->
                <el-col :span="3" style="display: flex; justify-content: end; margin-left: 4px;">
                  <el-tag
                  v-if="Log.User.ActiveMemberShip != null"
                    :type="
                      Log.User.ActiveMemberShip.Type == 'Morning'
                        ? 'warning'
                        : 'success'
                    "
                  >{{ Log.User.ActiveMemberShip.Type }}</el-tag>
                </el-col>

                <!-- Name -->
                <el-col :span="12" :title="Log.User.Status == '1'? 'نشط' : Log.User.Status == '-1'? 'غير نشط' : Log.User.Status == '-2'? 'قائمة سوداء' : ''"
                style="display: flex; justify-content: end; margin-left: 4px;">
                  <el-tag
                    :style="Log.User.Status == '1'? 'color: orange' : 'color: red' "
                    @click="$router.push({ path: '/Gym/Edit/' + Log.Fk })"
                  ><strong style="font-size: 10px; cursor: pointer">{{
                    Log.User.Name
                  }}</strong></el-tag>
                </el-col>

                <!-- DateTime -->
                <el-col :span="4" style="display: flex; justify-content: end; margin-left: 4px;">
                      <el-tag
                    type="info"
                    style="width: 80px;"
                  >
                  <i class="el-icon-time"></i>
                {{setDateTime(Log.DateTime)}}</el-tag>
                  </el-col>

              </el-row>
            </el-timeline-item>
            <p v-if="loading">Loading...</p>
            <p v-if="noMore">No more</p>
            <p v-if="!noMore" @click="load">more</p>
          </el-timeline>
      </el-row>

    </el-col>
<!-- Logout -->

      <!-- <el-row > -->
<!-- Login -->
      <el-col :span="12">
        <!-- Login header -->
      <el-row type="flex">
        <el-col :span="20" style="display: flex; justify-content: center; align-items:start;">
        <h3>تسجيل دخول</h3>
        </el-col>
        <el-col :span="4" style="display: flex; justify-content: end; padding-left: 32px; align-items:center;">
          <el-tooltip
            class="item"
            effect="dark"
            :content="deviceState"
            placement="bottom"
          >
            <el-tag
              :type="deviceIsConnect ? 'success' : 'danger'"
            ><i
              class="el-icon-connection"
            />{{ deviceState }}</el-tag>
          </el-tooltip>
        </el-col>
      </el-row>
        <el-row type="flex">
        <el-col :span="4" style="display: flex; justify-content: start;">
          <el-button icon="el-icon-sort" @click="reverse = !reverse" />
        </el-col>
        <el-col :span="6" style="display: flex; justify-content: start;">
        <Add-Device-Log table-name="Member" />
        </el-col>
        <el-col :span="14" style="display: flex; padding-left: 32px; justify-content: end;">
          <el-button
            :loading="loading"
            type="primary"
            icon="el-icon-refresh"
            :size="$store.getters.size"
            @click="getdata()"
          />
        </el-col>

        </el-row>

        <!-- Login records -->
        <el-row>
          <el-timeline
            v-infinite-scroll="load"
            infinite-scroll-disabled="disabled"
            :reverse="reverse"
            style="
              margin-top: 15px;
              height: 550px;
              overflow: auto;
              text-align: center;
            "
          >
            <el-timeline-item
              v-for="(Log, index) in MembersLogin"
              :key="index"
              :color="Log.User.Style.Color"
              :size="$store.getters.size"
              :timestamp="Log.DateTime"
              :hide-timestamp="true"
              class="infinite-list-item"
            >
              <el-row type="flex">

                <!-- Debit | Credit -->
                <el-col :span="2"  style="display: flex; justify-content: end; margin-left: 4px;">
                  <div>
                  <el-tag
                  v-if="Log.User.TotalCredit - Log.User.TotalDebit > 0"
                    type="info"
                  >مدين</el-tag></div>
                </el-col>

                <!-- Classes Number  -->
                <el-col :span="3" style="display: flex; justify-content: end; margin-left: 4px;">
                  <el-tag v-if="Log.User.ActiveMemberShip != null"
                    style="color: orangered"
                  >({{ Log.User.ActiveMemberShip.NumberClass }}\{{
                    Log.User.ActiveMemberShip.NumberClass -
                      Log.User.ActiveMemberShip.VisitsUsed
                  }})
                  </el-tag>
                </el-col>

                <!-- Subscription Shift -->
                <el-col :span="3" style="display: flex; justify-content: end; margin-left: 4px;">
                  <el-tag
                  v-if="Log.User.ActiveMemberShip != null"
                    :type="
                      Log.User.ActiveMemberShip.Type == 'Morning'
                        ? 'warning'
                        : 'success'
                    "
                  >{{ Log.User.ActiveMemberShip.Type }}</el-tag>
                </el-col>

                <!-- Name -->
                <el-col :span="12" :title="Log.User.Status == '1'? 'نشط' : Log.User.Status == '-1'? 'غير نشط' : Log.User.Status == '-2'? 'قائمة سوداء' : ''"
                style="display: flex; justify-content: end; margin-left: 4px;">
                  <el-tag
                    :style="Log.User.Status == '1'? 'color: orange' : 'color: red' "
                    @click="$router.push({ path: '/Gym/Edit/' + Log.Fk })"
                  ><strong style="font-size: 10px; cursor: pointer">{{
                    Log.User.Name
                  }}</strong></el-tag>
                </el-col>

                <!-- DateTime -->
                <el-col :span="4" style="display: flex; justify-content: end; margin-left: 4px;">
                      <el-tag
                    type="info"
                    style="width: 80px;"
                  >
                  <i class="el-icon-time"></i>
                {{setDateTime(Log.DateTime)}}</el-tag>
                  <!-- <el-time-picker
                    v-model="Log.DateTime"
                    :size="$store.getters.size"
                    format="hh:mm A"
                    disabled
                    style="width: 100px;"
                  /> -->
                  </el-col>

              </el-row>
            </el-timeline-item>
            <p v-if="loading">Loading...</p>
            <p v-if="noMore">No more</p>
            <p v-if="!noMore" @click="load">more</p>
          </el-timeline>
        </el-row>

      </el-col>
<!-- Login -->

  <!-- </el-row> -->

    </el-card>
  </div>
</template>

<script>
import { GetByStatus, GetLogin, GetLogout } from '@/api/DeviceLog'
import StatusTag from '@/components/Oprationsys/StatusTag.vue'
import AddDeviceLog from '@/components/Device/AddDeviceLog.vue'
import MemberSearch from '@/components/Member/MemberSearch.vue'
import { DateTimeFormatter,  LocalDateTime, Instant } from '@js-joda/core'
export default {
  name: 'MemberLog',
  components: { StatusTag, AddDeviceLog, MemberSearch },
  data() {
    return {
      loading: false,
      MembersLogs: [],
      MembersLogin: [],
      MembersLogout: [],
      deviceState: 'socket is not work',
      deviceIsConnect: false,
      reverse: false,
      listQuery: {
        Page: 0,
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
    this.$socket.start({
      log: true // Logging is optional but very helpful during development
    })
  },
  // sockets: {
  //   SendEventLog(log) {
  //     this.MembersLogs.unshift(JSON.parse(log))
  //   },
  //   DeviceState({ deviceIsConnect, msg }) {
  //     this.deviceIsConnect = deviceIsConnect
  //     this.deviceState = msg
  //   }
  // },
  methods: {
    getdata() {
      this.loading = true

      this.listQuery.Page = 1

      GetLogin(this.listQuery)
              .then((response) => {
          this.MembersLogin = [...this.MembersLogin, ...response]
          if (response.length === 0) this.listQuery.Page = 13
        })
        .catch()
        .finally(() => {
          this.loading = false
        })
      GetLogout(this.listQuery)
              .then((response) => {
          this.MembersLogout = [...this.MembersLogout, ...response]
          if (response.length === 0) this.listQuery.Page = 13
        })
        .catch()
        .finally(() => {
          this.loading = false
        })
      GetByStatus(this.listQuery)
        .then((response) => {
          // this.MembersLogin = [...this.MembersLogin, ...loginArray]
          // this.MembersLogout = [...this.MembersLogout, ...logoutArray]
          this.MembersLogs = [...this.MembersLogs, ...response]
          // Array.prototype.push.apply(this.MembersLogs, response)
          // .sort((a, b) => new Date(b.DateTime) - new Date(a.DateTime) );
          if (response.length === 0) this.listQuery.Page = 13
          //  localStorage.setItem('MemberLog_ListQuery', JSON.stringify(this.listQuery))
        })
        .catch()
        .finally(() => {
          this.loading = false
        })
    },
    load() {
      this.listQuery.Page += 1
      this.getdata()
    },

    setDateTime(val) {
      const date = new Date(val);
      const formattedTime = date.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
      });
      return formattedTime.toString()
    }
  }
}
</script>
