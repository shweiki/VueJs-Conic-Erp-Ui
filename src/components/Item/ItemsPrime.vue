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
      <el-card class="box-card" shadow="always" :body-style="{ padding: '3.5px' }">
        <div @click="AddItem(Item)">
          <span style="font-size: 11px;color: #545454;">{{ Item.Name }}</span>
         <time class="price">{{ Item.SellingPrice.toFixed(2) }}</time>
        </div>
        <!--  <el-col v-permission="['admin']"> 
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
        </el-col>-->
      </el-card>
    </el-col>
  </div>
</template>
<script>
import permission from "@/directive/permission/index.js";
import { GetIsPrimeItem } from "@/api/Item";

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
      GetIsPrimeItem().then(response => {
        
        response.sort(function(a, b) {
          var nameA = a.Name.toUpperCase(); // ignore upper and lowercase
          var nameB = b.Name.toUpperCase(); // ignore upper and lowercase
          if (nameA < nameB) {
            return -1;
          }
          if (nameA > nameB) {
            return 1;
          }

          // names must be equal
          return 0;
        });
        this.ItemsPrime = response;
      });
    }
  }
};
</script>
<style scoped>
.price {
  font-size: 9px;
  color: #f78123;
}
</style>