<template>
  <el-card class="box-card">
    <el-tabs v-model="activeTab" tab-position="top">
      <el-tab-pane v-bind:label="$t('PanelGroup.Receivables')" name="Receivables">
        <receivables />
      </el-tab-pane>
      <el-tab-pane v-bind:label="$t('PanelGroup.Creditor')" name="Payable">
        <payable />
      </el-tab-pane>
      <el-tab-pane v-bind:label="$t('PanelGroup.MinimumOrder')" name="LowOrderItem">
        <low-order-item />
      </el-tab-pane>
      <el-tab-pane v-bind:label="$t('PanelGroup.expiredItems')" name="EXPItem">
        <EXPItem />
      </el-tab-pane>
      <el-tab-pane label="طلبات التجميد و اضافي" name="MembershipmentOrdar">
        <Membershipment-Ordar />
      </el-tab-pane>
    </el-tabs>
  </el-card>
</template>

<script>
import MembershipmentOrdar from "@/views/Gym/components/MembershipmentOrdar.vue";
import Receivables from "@/views/Gym/components/Receivables";
import Payable from "@/views/Gym/components/Payable";
import LowOrderItem from "@/components/Item/LowOrderItem.vue";
import EXPItem from "@/components/Item/EXPItem.vue";

export default {
  name: "DashboardAdmin",
  components: {
    MembershipmentOrdar,
    Receivables,
    Payable,
    LowOrderItem,
    EXPItem,
  },
  data() {
    return {
      activeTab: "Receivables",
    };
  },
};
</script>
<style>
.el-tabs__nav-scroll {
  float: right;
  direction: ltr;
}
</style>
