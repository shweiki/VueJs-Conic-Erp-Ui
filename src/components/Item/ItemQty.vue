<template>
  <div>
    <el-button icon="el-icon-view" circle @click="getdata()"></el-button>

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
        <el-tag>{{
          (Inventory.QtyIn - Inventory.QtyOut).toFixed(
            $store.getters.settings.ToFixed
          )
        }}</el-tag>
      </div>
      <el-button>{{ Inventory.InventoryName }}</el-button>
    </el-tooltip>
  </div>
</template>
<script>
import { CalculateInventoryItemQty } from "@/api/Item";

export default {
  props: {
    ItemId: {
      type: Number,
      default: undefined
    }
  },
  data() {
    return {
      InventoryQty: []
    };
  },
  methods: {
    getdata() {
      CalculateInventoryItemQty({ ID: this.ItemId }).then(response => {
        // handle success
        this.InventoryQty = response;
      });
    }
  }
};
</script>
>
