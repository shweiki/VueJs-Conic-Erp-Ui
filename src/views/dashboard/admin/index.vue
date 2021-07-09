<template>
  <div class="dashboard-editor-container">
    <router-menu />

    <panel-group />
    <el-card class="box-card">
      <el-tabs v-model="activeTab" tab-position="right">
        <el-tab-pane v-bind:label="$t('PanelGroup.Receivables')" name="Receivables">
          <receivables />
        </el-tab-pane>
        <el-tab-pane v-bind:label="$t('PanelGroup.Creditor')" name="Payable">
          <payable />
        </el-tab-pane>
        <el-tab-pane v-bind:label="$t('PanelGroup.MinimumOrder')" name="LowOrderItem">
          <Low-Order-Item />
        </el-tab-pane>
        <el-tab-pane v-bind:label="$t('PanelGroup.expiredItems')" name="EXPItem">
          <EXP-Item />
        </el-tab-pane>
        <el-tab-pane
          v-if="$store.state.settings.BusinessType == 'GymManagment'"
          label="طلبات التجميد و اضافي"
          name="MembershipmentOrdar"
        >
          <membershipment-ordar />
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
import PanelGroup from "./components/PanelGroup";
import MembershipmentOrdar from "./components/MembershipmentOrdar";
import Receivables from "./components/Receivables";
import Payable from "./components/Payable";
import LowOrderItem from "./components/LowOrderItem.vue";
import EXPItem from "./components/EXPItem.vue";

import RouterMenu from "@/components/RouterMenu";

export default {
  name: "DashboardAdmin",
  components: {
    RouterMenu,
    PanelGroup,
    MembershipmentOrdar,
    Receivables,
    Payable,
    LowOrderItem,
    EXPItem
  },
  data() {
    return {
      activeTab: "Receivables"
    };
  }
};
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 5px;
  position: relative;

  .github-corner {
    position: absolute;
    top: 0px;
    border: 0;
    right: 0;
  }

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}

@media (max-width: 1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
