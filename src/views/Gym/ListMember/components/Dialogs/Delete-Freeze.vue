<template>
  <div>
    <el-button
      @click="deleteOrder"
      type="danger"
      icon="el-icon-delete"
      v-bind:disabled="MemberShipMovementOrderId == undefined"
    ></el-button>
  </div>
</template>

<script>
import { Delete } from "@/api/MembershipMovementOrder";

export default {
  props: {
    MemberShipMovementOrderId: {
      type: Number,
      require: true,
    },
  },
  methods: {
    deleteOrder() {
      if (this.MemberShipMovementOrderId) {
        Delete({ Id: this.MemberShipMovementOrderId })
          .then((response) => {
            if (response) {
              this.Visibles = false;
              this.$notify({
                title: "تم ",
                message: "تم حذف بنجاح",
                type: "success",
                duration: 2000,
              });
              this.$nextTick(() => {
                this.$router.replace({
                  path: "/redirect" + this.$route.fullPath,
                });
              });
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }
    },
  },
};
</script>
