<template>
  <div class="app-container">
    <el-tabs v-model="activeTab" tab-position="top" >
      <el-tab-pane label="مبيعات" name="Sales"><Sales-Items /> </el-tab-pane>
      <el-tab-pane label="مشتريات" name="Purchases"
        ><Purchase-Items />
      </el-tab-pane>
      <el-tab-pane label="سندات مخزون" name="OrderInventory">
        <Order-Inventories-Items />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import SalesItems from "@/views/Sales/SalesItems.vue";
import PurchaseItems from "@/views/Purchases/PurchaseItems.vue";
import OrderInventoriesItems from "@/views/Inventory/OrderInventories/OrderInventoriesItems.vue";

export default {
  name: "ItemMove",
  components: { SalesItems, PurchaseItems, OrderInventoriesItems },

  data() {
    return {
      activeTab: "Sales"
    };
  }
};
</script>
