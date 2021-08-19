<template>
  <el-card class="box-card">
    <el-tabs v-model="activeTab" tab-position="right">
      <el-tab-pane label="مبيعات" name="SaleInvoice">
        <sale-invoice />
      </el-tab-pane>
      <el-tab-pane label="اشتراكات" name="MembershipMovement">
        <membership-movement />
      </el-tab-pane>
      <el-tab-pane label="دفعات" name="Payment">
        <payment />
      </el-tab-pane>
    </el-tabs>
  </el-card>
</template>
<script>
import  SaleInvoice  from "./components/SaleInvoice";
import  MembershipMovement  from "./components/MembershipMovement";
import  Payment  from "./components/Payment";

export default {
  name: "CashPool",
  components: {
    SaleInvoice,
    MembershipMovement,
    Payment
  },
  data() {
    return {
      activeTab: "SaleInvoice",
    };
  }
};
</script>