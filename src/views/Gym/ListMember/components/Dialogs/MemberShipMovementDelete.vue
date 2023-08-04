<template>
  <div>
    <el-dialog
      :show-close="false"
      title="هل انتا متأكد ؟"
      :visible.sync="Visible"
      width="30%"
    >
      <span slot="footer" class="dialog-footer">
        <el-button @click="Visible = false">لا</el-button>
        <el-button :loading="loading" type="primary" @click="deleteData">نعم</el-button>
      </span>
    </el-dialog>
    <el-button
      @click="Visible = true"
      type="danger"
      icon="el-icon-delete"
      v-bind:disabled="MembershipMovementId == undefined"
    ></el-button>
  </div>
</template>
<script>
import { Delete } from "@/api/MembershipMovement";

export default {
  props: {
    MembershipMovementId: {
      type: Number,
      required: true,
    },
  },
  data() {
    return { Visible: false, loading: false };
  },
  methods: {
    deleteData() {
      if (this.MembershipMovementId) {
        this.loading = true;
        Delete({ Id: this.MembershipMovementId })
          .then((response) => {
            if (response) {
              this.Visible = false;
              this.$notify({
                title: "تم  ",
                message: "تم حذف بنجاح",
                type: "success",
                duration: 2000,
              });
              this.$nextTick(() => {
                //  this.$emit("Done");
                this.$router.replace({
                  path: "/redirect" + this.$route.fullPath,
                });
              });
            }
          })
          .catch((error) => {
            console.log(error);
          })
          .finally(() => {
            this.loading = false;
          });
      }
    },
  },
};
</script>
