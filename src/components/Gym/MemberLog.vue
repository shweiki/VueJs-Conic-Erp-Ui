<template>
  <div>
    <el-col :span="24"> <member-search /> </el-col>
    <el-card style="margin-bottom: 20px">
      <el-row type="flex">
        <el-col :span="8">
          <el-button
            @click="reverse = !reverse"
            icon="el-icon-sort"
          ></el-button>
        </el-col>
        <el-col :span="8">
          <Add-Device-Log TableName="Member" />
        </el-col>
        <el-col :span="4">
          <el-button
            :loading="loading"
            type="primary"
            icon="el-icon-refresh"
            :size="$store.getters.size"
            @click="
              () => {
                listQuery.Page = 1;
                MembersLogs = [];
                getdata();
              }
            "
          ></el-button>
        </el-col>
        <el-col :span="4">
          <el-button
            :loading="loading"
            style="float: left"
            type="danger"
            icon="el-icon-time"
            :size="$store.getters.size"
            @click="RemoveDuplicate"
          ></el-button>
        </el-col>
      </el-row>

      <div style="margin-top: 10px">
        <el-timeline
          v-infinite-scroll="load"
          infinite-scroll-disabled="disabled"
          :reverse="reverse"
          style="
            margin-top: 15px;
            height: 550px;
            overflow: scroll;
            text-align: center;
          "
        >
          <el-timeline-item
            v-for="(Log, index) in MembersLogs"
            :key="index"
            :icon="Log.User.Style.IconClass"
            :color="Log.User.Style.Color"
            size="large"
            :timestamp="Log.DateTime"
            :hide-timestamp="true"
          >
            <el-tag
              @click="$router.push({ path: '/Gym/Edit/' + Log.Fk })"
              :color="Log.User.Style.Color"
              ><strong style="font-size: 10px; cursor: pointer">{{
                Log.User.Name
              }}</strong></el-tag
            >
            <Status-Tag :Status="Log.User.Status" TableName="Member">
            </Status-Tag>
            <el-tag
              v-if="Log.User.ActiveMemberShip != null"
              v-bind:type="
                Log.User.ActiveMemberShip.Type == 'Morning'
                  ? 'warning'
                  : 'success'
              "
              >{{ Log.User.ActiveMemberShip.Type }}</el-tag
            >
            <el-tag
              v-if="Log.User.TotalCredit - Log.User.TotalDebit > 0"
              type="info"
              >مدين</el-tag
            >
            <el-time-picker
              :size="$store.getters.size"
              v-model="Log.DateTime"
              format="hh:mm A"
              disabled
            />
          </el-timeline-item>
          <p v-if="loading">Loading...</p>
          <p v-if="noMore">No more</p>
        </el-timeline>
      </div>
    </el-card>
  </div>
</template>

<script>
import { GetByStatus, RemoveDuplicate } from "@/api/DeviceLog";
import StatusTag from "@/components/Oprationsys/StatusTag";
import AddDeviceLog from "@/components/Device/AddDeviceLog.vue";
import MemberSearch from "@/components/Member/MemberSearch.vue";

export default {
  name: "MemberLog",
  components: { StatusTag, AddDeviceLog, MemberSearch },
  data() {
    return {
      loading: false,
      MembersLogs: [],
      reverse: false,
      listQuery: {
        Page: 0,
        Any: "",
        limit: this.$store.getters.settings.LimitQurey,
        Sort: "-id",
        Status: 0,
        TableName: "Member",
      },
    };
  },
  computed: {
    noMore() {
      return this.listQuery.Page >= 12;
    },
    disabled() {
      return this.loading || this.noMore;
    },
  },
  created() {
    // this.getdata();
  },
  methods: {
    getdata() {
      this.loading = true;
      GetByStatus(this.listQuery)
        .then((response) => {
          Array.prototype.push.apply(this.MembersLogs, response);
          //.sort((a, b) => new Date(b.DateTime) - new Date(a.DateTime) );
          if (response.length == 0) this.listQuery.Page = 13;
          this.loading = false;
        })
        .catch((error) => {
          reject(error);
          this.loading = false;
        });
    },
    RemoveDuplicate() {
      this.loading = true;
      RemoveDuplicate()
        .then((res) => {
          this.loading = false;
        })
        .catch((error) => {
          reject(error);
          this.loading = false;
        });
    },
    load() {
      this.listQuery.Page += 1;
      this.getdata();
    },
  },
};
</script>
