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
      v-bind:disabled="ItemId == undefined"
    ></el-button>
  </div>
</template>
<script>
import { Delete } from "@/api/Item";

export default {
  props: {
    ItemId: {
      type: Number,
      default: undefined,
    },
  },
  data() {
    return { Visible: false, loading: false };
  },
  methods: {
    deleteData() {
      if (this.ItemId) {
        this.loading = true;
        Delete({ ItemId: this.ItemId })
          .then((response) => {
            if (response) {
              this.Visible = false;
              this.$notify({
                title: "تم  ",
                message: "تم حذف بنجاح",
                type: "success",
                duration: 2000,
              });
              this.$emit("Done");
            } else {
              this.$notify({
                title: "لا يمكن  ",
                message: "بسبب وجود حراكات ع صنف",
                type: "warning",
                duration: 2000,
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
