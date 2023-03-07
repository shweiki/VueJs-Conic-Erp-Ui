<template>
  <div>
     <el-popconfirm title="هل انتا متاكد" @confirm="deleteData">
      <el-button icon="el-icon-delete" type="danger" slot="reference">
        حذف اشتراك رقم {{ MembershipMovementId }}</el-button>
    </el-popconfirm>

  </div>
</template>

<script>
import { Delete } from "@/api/MembershipMovement";

export default {
  props: {
    MembershipMovementId: {
      type: Number,
      default: undefined,
    },
  },

  methods: {

    deleteData() {
      Delete({ Id: this.MembershipMovementId })
        .then((response) => {
          if (response) {
            this.$notify({
              title: "تم ",
              message: "تم حذف بنجاح",
              type: "success",
              duration: 2000,
            });
            this.$emit("Done");
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
};
</script>
