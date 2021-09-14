<template>
  <div>
    <el-card style="margin-bottom: 20px">
      <el-button
        style="float: left"
        type="primary"
        icon="el-icon-refresh"
        :size="$store.getters.size"
        @click="getdata()"
      ></el-button>
      <el-button @click="reverse = !reverse" icon="el-icon-sort"></el-button>
      <add-member-log />

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
            :icon="Log.Style.IconClass"
            :color="Log.Style.Color"
            size="large"
            :timestamp="Log.DateTime"
            :hide-timestamp="true"
          >
            <el-tag
              @click="
                () => {
                  let r = $router.resolve({
                    path: '/Gym/Edit/' + Log.MemberId,
                  });
                  window.open(r.href, r.route.name, $store.getters.settings.windowStyle);
                }
              "
              :color="Log.Style.Color"
              ><strong style="font-size: 10px; cursor: pointer">{{
                Log.Name
              }}</strong></el-tag
            >
            <Status-Tag :Status="Log.Status" TableName="Member"> </Status-Tag>
            <el-tag
              v-if="Log.ActiveMemberShip != null"
              v-bind:type="Log.ActiveMemberShip.Type == 'Morning' ? 'warning' : 'success'"
              >{{ Log.ActiveMemberShip.Type }}</el-tag
            >
            <el-tag v-if="Log.TotalCredit - Log.TotalDebit > 0" type="info">مدين</el-tag>
            <el-time-picker
              :size="$store.getters.size"
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
import { GetMemberLogByStatus, RemoveDuplicate } from "@/api/MemberLog";
import StatusTag from "@/components/Oprationsys/StatusTag";
import AddMemberLog from "./Dialogs/AddMemberLog.vue";

export default {
  name: "MemberLog",
  components: { StatusTag, AddMemberLog },
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
          if (response.length != this.MembersLogs.length) {
            this.MembersLogs = response.sort(
              (a, b) => new Date(b.DateTime) - new Date(a.DateTime)
            );
            RemoveDuplicate();
          }
        })
        .catch((error) => {
          reject(error);
        });
    },
  },
};
</script>
