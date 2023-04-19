<template>
  <el-popconfirm
    @confirm="Delete"
    confirm-button-text="OK"
    cancel-button-text="No, Thanks"
    icon="el-icon-info"
    icon-color="red"
    title="Are you sure to delete this?"
  >
    <el-button type="danger" slot="reference" icon="el-icon-delete"></el-button>
  </el-popconfirm>
</template>
<script>
import { Delete } from "@/api/SalaryAdjustmentLog";

export default {
  props: ["Id"],
  data() {
    return {
      dialogFormVisible: false,
    };
  },
  methods: {
    Delete() {
      Delete({ Id: this.Id })
        .then((response) => {
          this.$notify({
            title: "تم ",
            message: "تم حذف بنجاح" + response,
            type: "danger",
            duration: 2000,
          });
          this.$emit("done");
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
};
</script>
