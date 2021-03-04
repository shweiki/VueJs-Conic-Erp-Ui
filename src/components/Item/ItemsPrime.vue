<template>
  <div
    style="flex-wrap: nowrap; white-space: nowrap; overflow: auto; height: 100%"
  >
    <el-input
      @change="focus"
      v-model="search"
      v-bind:placeholder="$t('ItemSales.ItemName')"
    >
      <el-button
        slot="append"
        @click="SortByName"
        icon="el-icon-sort"
      ></el-button>
    </el-input>
    <el-col
      :xs="12"
      :sm="10"
      :md="8"
      :lg="6"
      :xl="4"
      v-for="(Item, index) in ItemsPrime.filter(
        data =>
          !search || data.Name.toLowerCase().includes(search.toLowerCase())
        //||data.Category.includes(search.toLowerCase())
      )"
      :key="index"
    >
      <el-card
        class="box-card"
        shadow="always"
        :body-style="{ padding: '3.5px' }"
      >
        <div @click="AddItem(Item)">
          <img v-if="WithImage" :src="Item.Avatar" class="image" />

          <span style="font-size: 10px; color: #545454">{{ Item.Name }}</span>
          <time class="price">{{
            Item.SellingPrice.toFixed($store.getters.settings.ToFixed)
          }}</time>
        </div>
        <!--  <el-col v-permission="['Admin']"> 
              <el-tooltip
                v-for="(Inventory, index) in Item.InventoryQty"
                :key="index"
                placement="right"
                effect="light"
              >
                <div slot="content">
                  <el-tag>رصيد {{ Inventory.InventoryName }}</el-tag>
                </div>
                <el-tag>{{ (Inventory.QtyIn - Inventory.QtyOut).toFixed($store.getters.settings.ToFixed) }}</el-tag>
              </el-tooltip>
        </el-col>-->
      </el-card>
    </el-col>
    <!--
    <el-tabs type="card" :tab-position="tabPosition">
      <el-tab-pane label="All">
       </el-tab-pane
      >
      <el-tab-pane>
        <span slot="label">
          <el-dropdown :size="$store.getters.size" type="primary">
            <i class="el-icon-more el-icon--right"></i>
            <el-dropdown-menu slot="dropdown">
              <el-radio-group v-model="tabPosition">
                <el-radio-button label="top">top</el-radio-button>
                <el-radio-button label="right">right</el-radio-button>
                <el-radio-button label="bottom">bottom</el-radio-button>
                <el-radio-button label="left">left</el-radio-button>
              </el-radio-group>
            </el-dropdown-menu>
          </el-dropdown></span
        >
      </el-tab-pane>
    </el-tabs>
    -->
  </div>
</template>
<script>
import permission from "@/directive/permission/index.js";
import { GetIsPrimeItem } from "@/api/Item";
import { GetFileByObjID } from "@/api/File";

export default {
  name: "ItemsPrime",
  directives: { permission },
  props: ["WithImage"],
  data() {
    return {
      search: "",
      ItemsPrime: [],
      tabPosition: "top",
      order: false
    };
  },
  created() {
    this.getdata();
  },
  methods: {
    AddItem(item) {
      this.$emit("add", item, 1);
    },
    focus() {
      this.$emit("focus");
    },
    SortByName() {
      this.order = !this.order;
      this.ItemsPrime.sort((a, b) => {
        var x = a.Name.toUpperCase(); // ignore upper and lowercase
        var y = b.Name.toUpperCase(); // ignore upper and lowercase
        if (this.order ? x > y : x < y) {
          return -1;
        }
        if (!this.order ? x > y : x < y) {
          return 1;
        }
        // names must be equal
        return 0;
      });
      this.focus();
    },
    getdata() {
      GetIsPrimeItem().then(response => {
        this.ItemsPrime = response;
        this.SortByName();

        if (this.WithImage) this.ItemsPrime.map(item => this.GetImageItem(item.Id));
      });
    },

    GetImageItem(ID) {
      GetFileByObjID({ TableName: "Item", ObjID: ID })
        .then(response => {
          if (response) {
            this.ItemsPrime.find(element => element.Id == ID).Avatar =
              response.File;
          } else
            this.ItemsPrime.find(
              element => element.Id == ID
            ).Avatar = this.$store.getters.CompanyInfo.Logo;
        })
        .catch(err => {
          console.log(err);
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
.image {
  width: 100%;
  height: 55px;
  display: block;
}
</style>
