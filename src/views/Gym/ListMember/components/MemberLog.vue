<template>
  <div>
    <el-card style="margin-bottom: 20px">
      <el-row type="flex">
        <el-col :span="8">
          <el-button @click="reverse = !reverse" icon="el-icon-sort"></el-button>
        </el-col>
        <el-col :span="8">
          <add-member-log />
        </el-col>
        <el-col :span="8">
          <el-button
            :loading="loading"
            style="float: left"
            type="primary"
            icon="el-icon-refresh"
            :size="$store.getters.size"
            @click="getdata()"
          ></el-button>
        </el-col>
      </el-row>

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
            :icon="Log.User.Style.IconClass"
            :color="Log.User.Style.Color"
            size="large"
            :timestamp="Log.DateTime"
            :hide-timestamp="true"
          >
            <el-tag
              @click="
                () => {
                  let r = $router.resolve({
                    path: '/Gym/Edit/' + Log.Fk,
                  });
                  window.open(r.href, r.route.name, $store.getters.settings.windowStyle);
                }
              "
              :color="Log.User.Style.Color"
              ><strong style="font-size: 10px; cursor: pointer">{{
                Log.User.Name
              }}</strong></el-tag
            >
            <Status-Tag :Status="Log.User.Status" TableName="Member"> </Status-Tag>
            <el-tag
              v-if="Log.User.ActiveMemberShip != null"
              v-bind:type="
                Log.User.ActiveMemberShip.Type == 'Morning' ? 'warning' : 'success'
              "
              >{{ Log.User.ActiveMemberShip.Type }}</el-tag
            >
            <el-tag v-if="Log.User.TotalCredit - Log.User.TotalDebit > 0" type="info"
              >مدين</el-tag
            >
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
import { GetByStatus, RemoveDuplicate } from "@/api/DeviceLog";
import StatusTag from "@/components/Oprationsys/StatusTag";
import AddMemberLog from "./Dialogs/AddMemberLog.vue";

export default {
  name: "MemberLog",
  components: { StatusTag, AddMemberLog },
  data() {
    return {
      loading: false,
      MembersLogs: [],
      reverse: false,
      listQuery: {
        Page: 1,
        Any: "",
        limit: this.$store.getters.settings.LimitQurey,
        Sort: "-id",
        Status: undefined,
        TableName: "Member",
      },
    };
  },
  created() {
    this.getdata();
  },
  methods: {
    getdata() {
      this.loading = true;
      GetByStatus(this.listQuery)
        .then((response) => {
          if (response.length != this.MembersLogs.length) {
            this.MembersLogs = response;
            //.sort((a, b) => new Date(b.DateTime) - new Date(a.DateTime) );
            //  RemoveDuplicate();
          }
          this.loading = false;
        })
        .catch((error) => {
          reject(error);
        });
    },
  },
};
</script>
