<template>
  <el-row style="background: #2f3542; color: white">
    <el-col :span="2">
      <el-button
        type="success"
        icon="el-icon-s-shop"
        @click="$router.replace({ path: '/redirect' + '/Sales/Create' })"
      ></el-button>
    </el-col>
    <el-col :span="2">
      <el-button
        type="primary"
        icon="el-icon-unlock"
        :disabled="$store.getters.FeelDevice"
      ></el-button>
    </el-col>
    <el-col :span="2">
      <add-member />
    </el-col>
    <el-col :span="14">
       <Search-By Type="MemberSearchAny"  />
    </el-col>
  </el-row>
</template>
<script>
import AddMember from "@/components/Member/AddMember.vue";
import SearchBy from "@/components/DynamicComponents/SearchBy";

export default {
  name: "MemberSearch",
  components: { AddMember, SearchBy },
};
</script>
