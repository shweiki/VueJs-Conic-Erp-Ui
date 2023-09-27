<template>
  <el-row>
    <List v-if="type == 'ML'" />

    <MembershipmentOrdar v-if="type == 'MO'" />

    <Receivables v-if="type == 'RM'" />

    <Payable v-if="type == 'PM'" />
  </el-row>
</template>

<script>
import List from "@/views/Gym/Members/components/List.vue";
import MembershipmentOrdar from "@/views/Gym/components/MembershipmentOrdar.vue";
import Receivables from "@/views/Gym/components/Receivables";
import Payable from "@/views/Gym/components/Payable";
export default {
  components: {
    List,
    MembershipmentOrdar,
    Receivables,
    Payable,
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: "success",
        draft: "info",
        deleted: "danger",
      };
      return statusMap[status];
    },
  },
  props: {
    type: {
      type: String,
      default: "ML",
    },
  },
  data() {
    return {
      list: null,
      listQuery: {
        page: 1,
        limit: 5,
        type: this.type,
        sort: "+id",
      },
      loading: false,
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      this.loading = true;
      this.$emit("create"); // for test

      this.loading = false;
    },
  },
};
</script>
