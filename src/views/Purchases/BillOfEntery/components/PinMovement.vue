<template>
  <el-popover placement="top" width="160" v-model="visible">
    <p>هل انتا متاكد?</p>
    <div style="text-align: right; margin: 0">
      <el-button size="mini" type="text" @click="visible = false">الغاء</el-button>
      <el-button type="primary" size="mini" @click="SetVal()">تاكيد</el-button>
    </div>
    <el-button v-bind:icon="BillOfEnteryId == null ? 'el-icon-lock' : 'el-icon-unlock'"
      v-bind:type="BillOfEnteryId == null ? 'success' : 'danger'" slot="reference">
      {{ BillOfEnteryId == null ? "تثبيت" : "فك التثبيت" }}</el-button>
  </el-popover>
</template>
<script>
import { PinBillOfEntery } from "@/api/BillOfEntery";

export default {
  props: ["InventoryMovementsId", "BillOfEnteryId", "RootBillOfEnteryId"],
  data() {
    return {
      visible: false
    }
  },
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
        }).finally(() => {
          this.visible = false
        });
    },
  },
};
</script>
