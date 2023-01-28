<template>
  <div class="dashboard-editor-container">
    <panel-group v-if="checkPermission(['admin'])" :Totals="Totals" @handleSetLineChartData="handleSetLineChartData" />
    <el-card class="box-card chart-wrapper" v-if="checkPermission(['admin'])">
      <el-tabs v-model="activeTab" tab-position="right" @tab-click="tabClick">
        <el-tab-pane v-bind:label="$t('dashboard.lastWeek')" name="lastWeek">
          <el-row class="chart-container" >
            <line-chart :chart-data="lineChartData" :autoResize="autoResize" height="100%" width="100%" />
          </el-row>
        </el-tab-pane>
        <el-tab-pane v-bind:label="$t('dashboard.Statistics')" name="Statistics">
          <el-row class="chart-container">
              <mix-chart :chart-data="Statistics" :autoResize="autoResize" height="100%" width="100%" />
          </el-row>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <el-row v-if="$store.getters.settings.Dashboard.Layout == 'Public'">
      <Public />
    </el-row>
    <el-row v-if="$store.getters.settings.Dashboard.Layout == 'Gym'">
      <Gym />
    </el-row>
  </div>
</template>

<script>
import Gym from "./components/Gym.vue";
import Public from "./components/Public.vue";
import PanelGroup from "./components/PanelGroup";
import LineChart from "./components/LineChart";
import MixChart from "./components/MixChart.vue";
import { GetTotal, GetStatistics } from "@/api/Dashboard";
import checkPermission from "@/utils/permission";

export default {
  name: "Dashboard",
  components: { PanelGroup, LineChart, MixChart, Public, Gym },
  data() {
    return {
      activeTab: "lastWeek",
      autoResize: true,
      Totals: {
        Items: 0,
        Purchases: 0,
        Sales: {
          Count: 0,
          xAxisdata: [],
          expectedData: [],
          actualData: []
        },
        Clients: 0,
        Suppliers: 0,
        Members: 0,
        MembersActive: 0,
        MsgCredit: 0
      },
      Statistics: {},
      lineChartData: {},
    };
  },
  created() {
    this.getdata();
  },
  methods: {
    checkPermission,
    getdata() {
      GetTotal().then((response) => {
        this.Totals = response;
        this.lineChartData = this.Totals['Sales'];
      });
      GetStatistics({ By: "MonthOfYear" }).then((response) => {
        this.Statistics = response;
      });
    },
    handleSetLineChartData(type) {
      this.lineChartData = this.Totals[type];
    },
    tabClick(tab) {
     this.autoResize = !this.autoResize;
    }

  },
};
</script>
<style lang="scss" scoped>
.chart-container {
  position: relative;
  width: 100%;
  height: 500px //calc(100vh - 84px);
}

.el-tabs__content {
  max-height: 700px;
}

.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}

@media (max-width:1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>