<template>
  <el-card class="box-card">
    <el-tabs v-model="activeTab" tab-position="right">
      <el-tab-pane label="مبيعات" name="SaleInvoice">
        <Sale-Invoice />
      </el-tab-pane>
      <el-tab-pane label="اشتراكات" name="MembershipMovement">
        <Membership-Movement />
      </el-tab-pane>
      <el-tab-pane label="دفعات" name="Payment">
        <Payment />
      </el-tab-pane>
    </el-tabs>
  </el-card>
</template>
<script>
import SaleInvoice from "./SaleInvoice.vue";
import MembershipMovement from "./MembershipMovement.vue";
import Payment from "./Payment.vue";

export default {
  name: "CashPool",
  components: {
    SaleInvoice,
    MembershipMovement,
    Payment
  },
  created() {
    console.log("type", this.$route.params && this.$route.params.type);
  },
  data() {
    return {
      activeTab: "SaleInvoice"
    };
  }
};
</script>