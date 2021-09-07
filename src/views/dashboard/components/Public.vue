<template>
  <div class="dashboard-editor-container">
    <router-menu />
    <panel-group />
    <account-receivables-payables />
  </div>
</template>

<script>
import PanelGroup from "./PanelGroup";

import RouterMenu from "@/components/RouterMenu";
import AccountReceivablesPayables from "@/views/Accounting/AccountReceivablesPayables.vue";
export default {
  name: "DashboardAdmin",
  components: {
    RouterMenu,
    PanelGroup,
    AccountReceivablesPayables,
  },
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
