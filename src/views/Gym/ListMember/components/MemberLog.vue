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

      <div class="radio">
        <el-radio-group v-model="reverse">
          <el-radio :label="false">ألاقدم</el-radio>
          <el-radio :label="true">أحدث</el-radio>
        </el-radio-group>
      </div>
      <div style="margin-top: 10px">
        <el-timeline
          :reverse="reverse"
          style="margin-left: -30px; text-align: start; height: 550px; overflow: scroll"
        >
          <el-timeline-item
            v-for="(activity, index) in activities"
            :key="index"
            :icon="activity.icon"
            :color="activity.color"
            :size="activity.size"
            :timestamp="activity.DateTime"
          >
            <router-link :to="'/Gym/Edit/' + activity.MemberID">
              <status-tag
                :Status="activity.Status"
                TableName="Member"
                v-bind:class="{
                  BlackList: activity.Status == -2 ? true : false,
                }"
              />
            </router-link>
            <el-tag
              v-if="activity.ActiveMemberShip != null"
              v-bind:type="
                activity.ActiveMemberShip.Type == 'Morning' ? 'warning' : 'success'
              "
              >{{ activity.ActiveMemberShip.Type }}</el-tag
            >
            <el-tag v-if="activity.TotalCredit - activity.TotalDebit > 0" type="info"
              >مدين</el-tag
            >
          </el-timeline-item>
        </el-timeline>
      </div>
    </el-card>
  </div>
</template>

<script>
import { GetMemberLogByStatus } from "@/api/MemberLog";

export default {
  name: "MemberLog",
  props: {},
  data() {
    return {
      activities: [],
      reverse: true,
    };
  },
  created() {
    this.getdata();
  },
  methods: {
    getdata() {
      GetMemberLogByStatus({ Status: 0 })
        .then((response) => {
          //    console.log(response)
          if (response.length > this.activities.length) this.activities = response;
        })
        .catch((error) => {
          console.log("test");

          reject(error);
        });
    },
  },
};
</script>
<style scoped>
.BlackList {
  background-color: #000000;
}
</style>
