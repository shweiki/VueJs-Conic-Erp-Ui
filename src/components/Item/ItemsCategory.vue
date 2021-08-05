<template>
  <div>
    <el-col :span="24">
      <el-radio-group v-model="query" @change="getdata">
        <el-radio-button
          v-for="cat in cats"
          :key="cat.value"
          :label="cat.label"
          :value="cat.value"
        >
          {{ cat.label }}
        </el-radio-button>
        <!-- <category-tabs :label="option.label"
        :text="option.text"/> -->
        <!-- <el-radio-button label="ساندويش">ساندويش </el-radio-button>
        <el-radio-button label="وجبات"> وجبات </el-radio-button>
        <el-radio-button label="مشروبات"> مشروبات </el-radio-button>
        <el-radio-button label="إضافات"> إضافات </el-radio-button> -->
      </el-radio-group>
    </el-col>
    <!--
    <el-col :span="24">
      <el-col
        :xs="12"
        :sm="8"
        :md="6"
        :lg="6"
        :xl="4"
        v-for="(Item, index) in ['تربل', 'دبل', 'سوبر', 'عادي', 'توفير']"
        :key="index"
      >
        <el-card
          class="box-card"
          shadow="always"
          style="background:#607d8b "
          :body-style="{ padding: '12px' }"
        >
          {{ Item }}
        </el-card>
      </el-col>
    </el-col>-->
    <el-col :span="24">
      <el-col
        :xs="12"
        :sm="8"
        :md="6"
        :lg="6"
        :xl="4"
        v-for="(Item, index) in List.filter(
          data =>
            !search || data.Name.toLowerCase().includes(search.toLowerCase())
          //||data.Category.includes(search.toLowerCase())
        )"
        :key="index"
      >
        <el-card
          class="box-card"
          shadow="always"
          style="background:#607d8b "
          :body-style="{ padding: '12px' }"
        >
          <div @click="AddItem(Item)">
            <img v-if="WithImage" :src="Item.Avatar" class="image" />

            <div class="name">{{ Item.Name }}</div>
            <div class="price">
              {{ Item.SellingPrice.toFixed($store.getters.settings.ToFixed) }}
              JD
            </div>
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
import { GetItemByAny } from "@/api/Item";
import { GetFileByObjId } from "@/api/File";
import { GetActiveMenuItem } from "@/api/MenuItem";

export default {
  name: "ItemsCategory",
  directives: { permission },
  props: ["WithImage"],
  data() {
    return {
      cats: [],
      query: "",
      search: "",
      List: [],
      tabPosition: "top",
      order: false
    };
  },
  created() {
    GetActiveMenuItem()
      .then(response => {
        // handle success
        console.log(response);
        this.cats = response;
        this.query = response[0].value;
        this.getdata();
        this.loading = false;
      })
      .catch(error => {
        // handle error
        console.log(error);
      });
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
      this.List.sort((a, b) => {
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
      GetItemByAny({ Any: this.query }).then(response => {
        if (this.WithImage) {
          Promise.all(response.map(item => this.GetImageItem(item))).then(
            responses => (this.List = responses)
          );
        } else this.List = response;
      });
    },
    GetImageItem(item) {
      let defImg = this.$store.getters.CompanyInfo.Logo;
      return new Promise(function(resolve, reject) {
        GetFileByObjId({ TableName: "Item", ObjId: item.Id })
          .then(response => {
            response ? (item.Avatar = response.File) : (item.Avatar = defImg);
            resolve(item);
          })
          .catch(err => {
            reject(err);
          });
      });
    }
  }
};
</script>
<style scoped>
.price {
  font-size: 12px;
  color: #ffffff;
  text-align: center;
}
.name {
  text-align: center;
  font-size: 11px;
  color: #ffffff;
  margin-bottom: 6px;
}
.image {
  width: 100%;
  height: 55px;
  display: block;
}
</style>