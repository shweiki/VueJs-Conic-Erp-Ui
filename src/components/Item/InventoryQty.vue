<template>
  <div>
    <el-divider> الكمية المتوفرة </el-divider>
    <el-row type="flex">
      <el-col v-for="(Inventory, index) in InventoryQty" :key="index">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span> اسم المخزن : {{ Inventory.InventoryName }}</span>
          </div>
          <div>
            {{ $t("Items.Incoming") }} {{ Inventory.QtyIn }}
            {{ $t("Items.Outbound") }}
            {{ Inventory.QtyOut }}
            <br />
            {{ $t("Items.Credit") }}
            <el-tag>{{ (Inventory.QtyIn - Inventory.QtyOut).toFixed(2) }}</el-tag>
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
    ItemID: { type: Number, default: undefined },
  },
  mounted() {
    this.getdata();
  },
  data() {
    return { InventoryQty: [] };
  },
  methods: {
    getdata() {
      CalculateInventoryItemQty({ ID: this.ItemID }).then((response) => {
        // handle success
        this.InventoryQty = response;
      });
    },
  },
};
</script>
