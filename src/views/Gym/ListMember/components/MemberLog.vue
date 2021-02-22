<template>
  <div>
    <el-card style="margin-bottom: 20px">
      <el-button
        style="float: left"
        type="primary"
        icon="el-icon-refresh"
        size="mini"
        @click="getdata()"
      ></el-button>
      <el-button @click="reverse = !reverse" icon="el-icon-sort"></el-button>

      <div style="margin-top: 10px">
        <el-timeline
          :reverse="reverse"
          style="
            margin-left: -25px;
            margin-top: 15px;
            margin-right: -45px;
            height: 550px;
            overflow: scroll;
          "
        >
          <el-timeline-item
            v-for="(Log, index) in MembersLogs"
            :key="index"
            :icon="Log.IconClass"
            :color="Log.Color"
            size="large"
            :timestamp="Log.DateTime"
            :hide-timestamp="true"
          >
            <router-link
              v-bind:class="{
                BlackList: Log.Status == -2 ? true : false,
              }"
              :to="'/Gym/Edit/' + Log.MemberId"
            >
              <el-tag :color="Log.Color"
                ><strong style="font-size: 10px; cursor: pointer">{{
                  Log.Name
                }}</strong></el-tag
              >
              <status-tag :Status="Log.Status" TableName="Member"> </status-tag>
            </router-link>
            <el-tag
              v-if="Log.ActiveMemberShip != null"
              v-bind:type="Log.ActiveMemberShip.Type == 'Morning' ? 'warning' : 'success'"
              >{{ Log.ActiveMemberShip.Type }}</el-tag
            >
            <el-tag v-if="Log.TotalCredit - Log.TotalDebit > 0" type="info">مدين</el-tag>
            <el-time-picker
              size="mini"
              v-model="Log.DateTime"
              format="hh:mm A"
              disabled
            />
          </el-timeline-item>
        </el-timeline>
      </div>
    </el-card>
  </div>
</template>

<script>
import { GetMemberLogByStatus } from "@/api/MemberLog";
import StatusTag from "@/components/Oprationsys/StatusTag";
import { LocalTime } from "@js-joda/core";
export default {
  name: "MemberLog",
  components: { StatusTag },
  props: {},
  data() {
    return {
      MembersLogs: [],
      reverse: false,
    };
  },
  created() {
    this.getdata();
  },
  methods: {
    getdata() {
      GetMemberLogByStatus({ Status: 0 })
        .then((response) => {
          if (response.length > this.MembersLogs.length) {
            this.MembersLogs = response.sort(
              (a, b) => new Date(b.DateTime) - new Date(a.DateTime)
            );
          }
        })
        .catch((error) => {
          reject(error);
        });
    },
  },
};
</script>
