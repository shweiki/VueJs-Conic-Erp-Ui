<template>
  <div>
    <el-button
      @click="Delete"
      type="danger"
      icon="el-icon-delete"
      circle
      v-bind:disabled="AccountId == undefined"
    ></el-button>
  </div>
</template>

<script>
import { Delete as DeleteAccount } from "@/api/Account";

export default {
  props: {
    AccountId: {
      type: Number,
      default: undefined,
    },
  },

  methods: {
    Delete() {
      DeleteAccount({ Id: this.AccountId }).then((res) => {
        if (res)
          this.$notify({
            title: "تم حذف بنجاح",
            message: "تم حذف بنجاح  " + res,
            type: "success",
            position: "top-left",
            duration: 2000,
            showClose: false,
            onClose: () => {
              this.$emit("Done");
            },
          });
        else
          this.$notify.error({
            title: "لا يمكنك الحذف ",
            message: "لوجود حركات في الحساب  " + res,
            type: "danger",
            position: "top-left",
            duration: 3000,
          });
      });
    },
  },
};
</script>
