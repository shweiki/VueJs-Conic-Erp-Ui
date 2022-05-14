<template>
  <div class="dashboard-editor-container">
    <!--  <router-menu /> -->

    <account-receivables-payables />
  </div>
</template>

<script>
//import RouterMenu from "@/components/RouterMenu";
import AccountReceivablesPayables from "@/views/Accounting/AccountReceivablesPayables.vue";

export default {
  name: "DashboardAdmin",
  components: {
    //   RouterMenu,
    AccountReceivablesPayables,
  },
};
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
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
</style>
