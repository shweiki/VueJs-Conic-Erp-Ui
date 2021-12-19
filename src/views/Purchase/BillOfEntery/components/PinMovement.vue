<template>
  <el-popconfirm title="هل انتا متاكد" @confirm="SetVal">
    <el-button
      v-bind:icon="BillOfEnteryId == null ? 'el-icon-lock' : 'el-icon-unlock'"
      v-bind:type="BillOfEnteryId == null ? 'success' : 'danger'"
      slot="reference"
    >
      {{ BillOfEnteryId == null ? "تثبيت" : "فك التثبيت" }}</el-button
    >
  </el-popconfirm>
</template>
<script>
import { PinBillOfEntery } from "@/api/BillOfEntery";

export default {
  props: ["InventoryMovementsId", "BillOfEnteryId", "RootBillOfEnteryId"],
  methods: {
    SetVal() {
      PinBillOfEntery({
        InventoryMovementsId: this.InventoryMovementsId,
        BillOfEnteryId:
          this.BillOfEnteryId == null ? this.RootBillOfEnteryId : this.BillOfEnteryId,
        Pin: this.BillOfEnteryId == null ? true : false,
      })
        .then((response) => {
          if (response) this.$emit("Done", response);
        })
        .catch((error) => {
          reject(error);
        });
    },
  },
};
</script>
