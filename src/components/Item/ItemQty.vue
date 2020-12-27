<template>
  <div>
    <el-tooltip
      v-for="(Inventory, index) in InventoryQty"
      :key="index"
      placement="right"
      effect="light"
    >
      <div slot="content">
        {{ $t("Items.Incoming") }} {{ Inventory.QtyIn }}
        <br />
        {{ $t("Items.Outbound") }} {{ Inventory.QtyOut }}
        <br />
        {{ $t("Items.Credit") }}
        <el-tag>{{ (Inventory.QtyIn - Inventory.QtyOut).toFixed(2) }}</el-tag>
      </div>
      <el-button>{{ Inventory.InventoryName }}</el-button>
    </el-tooltip>
  </div>
</template>
<script>
import { CalculateInventoryItemQty } from "@/api/Item";

export default {
  name: "ItemQty",
  props: {
    ItemID: {
      type: Number,
      default: undefined,
    },
  },
  created() {
    this.getdata();
  },
  data() {
    return {
      InventoryQty: [],
    };
  },
  methods: {
    getdata() {
      console.log(this.ItemID);

      CalculateInventoryItemQty({ ID: this.ItemID }).then((response) => {
        // handle success
        this.InventoryQty = response;
      });
    },
  },
};
</script>
>
