<template>
  <div>
    <el-button
      type="primary"
      icon="el-icon-plus"
      :size="$store.getters.size"
      @click="Open = true"
      >سند قيد</el-button
    >
    <el-drawer direction="ttb" size="80%" :visible.sync="Open">
      <Create />
    </el-drawer>
  </div>
</template>

<script>
import Create from "@/views/Accounting/EntryAccounting/Create.vue";

export default {
  components: { Create },
  data() {
    return {
      Open: false,
    };
  },
};
</script>
