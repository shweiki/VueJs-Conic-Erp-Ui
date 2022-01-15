<template>
  <div>
    <el-divider> الكمية المتوفرة </el-divider>
    <el-row type="flex">
      <el-col v-for="(Inventory, index) in InventoryQty" :key="index">
        <el-card style="text-align: center" class="box-card">
          <div slot="header">
            <span> اسم المخزن : {{ Inventory.InventoryName }}</span>
          </div>
          <div>
            {{ $t("Items.Incoming") }} {{ Inventory.QtyIn }}
            {{ $t("Items.Outbound") }}
            {{ Inventory.QtyOut }}
            <br />
            {{ $t("Items.Credit") }}
            <el-tag>{{
              (Inventory.QtyIn - Inventory.QtyOut).toFixed(
                $store.getters.settings.ToFixed
              )
            }}</el-tag>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { CalculateInventoryItemQty } from "@/api/Item";

export default {
  props: {
    ItemId: { type: Number },
  },
  watch: {
    ItemId(v) {
      console.log("here", v);
      this.getdata(v);
    },
  },
  data() {
    return { InventoryQty: [] };
  },
  methods: {
    getdata(id) {
      CalculateInventoryItemQty({ Id: id }).then((response) => {
        // handle success
        this.InventoryQty = response;
      });
    },
  },
};
</script>
