<template>
  <div>
    <panel-group
      :Totals="Totals"
      @handleSetLineChartData="handleSetLineChartData"
    />
    <el-row
      v-if="checkPermission(['admin'])"
      style="background: #fff; padding: 16px 16px 0; margin-bottom: 32px"
    >
      <line-chart :chart-data="lineChartData" />
    </el-row>
    <div v-if="checkPermission(['admin'])" class="chart-container">
      <mix-chart :chart-data="Statistics" height="100%" width="100%" />
    </div>
    <Public v-if="$store.getters.settings.Dashboard.Layout == 'Public'" />

    <Gym v-if="$store.getters.settings.Dashboard.Layout == 'Gym'" />
  </div>
</template>

<script>
import Gym from "./components/Gym.vue";
import Public from "./components/Public.vue";
import PanelGroup from "./components/PanelGroup";
import LineChart from "@/components/Charts/LineChart";
import MixChart from "@/components/Charts/MixChart";
import { GetTotal, GetStatistics } from "@/api/Dashboard";
import checkPermission from "@/utils/permission";

export default {
  name: "Dashboard",
  components: { PanelGroup, LineChart, MixChart, Public, Gym },
  data() {
    return {
      Totals: null,
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
      GetStatistics().then((response) => {
        this.Statistics = response;
      });
      GetTotal().then((response) => {
        this.Totals = response;
      });
    },
    handleSetLineChartData(type) {
      this.lineChartData = this.Totals[type];
    },
  },
};
</script>
<style lang="scss" scoped>
.chart-container {
  position: relative;
  width: 100%;
  height: calc(100vh - 84px);
}
@media (max-width: 1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
