<template>
  <div>
    <el-col
      :xs="12"
      :sm="10"
      :md="8"
      :lg="8"
      :xl="4"
      v-for="(Item, index) in ItemsPrime"
      :key="index"
    >
      <el-card class="box-card" shadow="always" :body-style="{ padding: '0px' }">
        <el-row >
          <el-col>
            <img src class="image" />
            <div @click="AddItem(Item)">
              <span style="font-size: 11px;color: #545454;">{{ Item.Name }}</span>
              <time class="price">{{ Item.SellingPrice.toFixed(2) }} JOD</time>
            </div>
            <el-col v-permission="['admin']">
              <el-tooltip
                v-for="(Inventory, index) in Item.InventoryQty"
                :key="index"
                placement="right"
                effect="light"
              >
                <div slot="content">
                  <el-tag>رصيد {{ Inventory.InventoryName }}</el-tag>
                </div>
                <el-tag>{{ (Inventory.QtyIn - Inventory.QtyOut).toFixed(2) }}</el-tag>
              </el-tooltip>
            </el-col>
          </el-col>
        </el-row>
      </el-card>
    </el-col>
  </div>
</template>
<script>
import permission from "@/directive/permission/index.js";
import { GetActiveItem } from "@/api/Item";

export default {
  name: "ItemsPrime",
  directives: { permission },
  data() {
    return {
      ItemsPrime: []
    };
  },
  mounted() {
    this.getdata();
  },
  methods: {
    AddItem(item) {
      this.$emit("add", item, 1);
    },
    getdata() {
      GetActiveItem().then(response => {
        console.log(response)
        this.ItemsPrime = response.reverse();
      })
    }
  }
};
</script>
<style scoped>
.price {
  font-size: 11px;
  color: #f78123;
}
</style>