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
          style="margin-left: -25px; margin-top: 15px; margin-right: -45px; height: 550px; overflow: scroll"
        >
          <el-timeline-item
            v-for="(activity, index) in MembersLogs"
            :key="index"
            :icon="activity.IconClass"
            :color="activity.Color"
            size="large"
            :timestamp="activity.DateTime"
            :hide-timestamp="true"
          >
            <router-link
              v-bind:class="{
                BlackList: activity.Status == -2 ? true : false
              }"
              :to="'/Gym/Edit/' + activity.MemberId"
            >
              <el-tag :color="activity.Color"
                ><strong style="font-size: 10px; cursor: pointer;">{{
                  activity.Name
                }}</strong></el-tag
              >
              <status-tag :Status="activity.Status" TableName="Member">
              </status-tag>
            </router-link>
            <el-tag
              v-if="activity.ActiveMemberShip != null"
              v-bind:type="
                activity.ActiveMemberShip.Type == 'Morning'
                  ? 'warning'
                  : 'success'
              "
              >{{ activity.ActiveMemberShip.Type }}</el-tag
            >
            <el-tag
              v-if="activity.TotalCredit - activity.TotalDebit > 0"
              type="info"
              >مدين</el-tag
            >
            <el-time-picker
              size="mini"
              v-model="activity.DateTime"
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
import moment from "moment";

export default {
  name: "MemberLog",
  components: { StatusTag },
  props: {},
  data() {
    return {
      MembersLogs: [],
      reverse: false
    };
  },
  created() {
    this.getdata();
  },
  methods: {
    getdata() {
      GetMemberLogByStatus({ Status: 0 })
        .then(response => {
          //    console.log(response)
          if (response.length > this.MembersLogs.length) {
            this.MembersLogs = response.sort(
              (a, b) => moment(b.DateTime) - moment(a.DateTime)
            );
          }
        })
        .catch(error => {
          console.log("test");

          reject(error);
        });
    }
  }
};
</script>

