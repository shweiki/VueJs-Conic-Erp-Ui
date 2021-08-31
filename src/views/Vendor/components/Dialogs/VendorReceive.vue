<template>
  <div>
    <el-button
      type="primary"
      icon="el-icon-plus"
      :size="$store.getters.size"
      @click="Open = true"
      >سند صرف</el-button
    >
    <el-drawer direction="ttb" size="80%" :visible.sync="Open">
      <template slot="title">
        <el-row type="flex">
          <el-col :span="24">
            <ElTag type="success">تسجيل سند صرف</ElTag>
          </el-col>
        </el-row>
      </template>
      <Create-Com />
    </el-drawer>
  </div>
</template>

<script>
import CreateCom from "@/views/Receive/Create.vue";

export default {
  components: { CreateCom },
  data() {
    return {
      Open: false,
    };
  },
};
</script>
