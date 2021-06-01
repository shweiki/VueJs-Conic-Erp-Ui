<template>
  <div>
    <el-tag>{{ (Inventory.QtyIn - Inventory.QtyOut).toFixed($store.getters.settings.ToFixed) }}</el-tag>
  </div>
</template>
<script>
import { CalculateInventoryItemQty } from "@/api/Item";

export default {
  props: {
    ItemId: { type: Number, default: undefined },
  },
  created() {
    this.getdata();
  },
  data() {
    return { Inventory: {} };
  },
  methods: {
    getdata() {
      CalculateInventoryItemQty({ Id: this.ItemID }).then((response) => {
        // handle success
        console.log(response[0]);
        this.Inventory = response[0];
        let Qty = response[0].QtyIn - response[0].QtyOut;
        if (Qty <= 1) {
          this.$emit("LowQty", "background-color: #ff4949;");
          this.$message.error(
            "Oops,لم يبقى كمية من الصنف العدد المتوفر  " +
              Qty +
              " الرجاء الانتباه قبل نفاذ الكمية"
          );
        }
        console.log(Qty);
      });
    },
  },
};
</script>
