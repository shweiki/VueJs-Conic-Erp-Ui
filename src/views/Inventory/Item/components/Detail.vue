<template>
  <div class="app-container">
    <el-row v-if="tempForm">
      <el-col :span="24" :xs="24" v-loading="loading">
        <el-card class="box-card">
          <el-tabs v-model="activeTab" tab-position="right" @tab-click="tabClick">
            <el-tab-pane label="بيانات" name="Details">
              <Item-Form :ItemId="tempForm.Id" />
            </el-tab-pane>
            <el-tab-pane label="الكمية" name="Qty">
              <Inventory-Qty :ItemId="tempForm.Id" />
            </el-tab-pane>
            <el-tab-pane label="حركات" name="Movements"
              ><Movements :Item="tempForm" />
            </el-tab-pane>
            <el-tab-pane label="مكونات" name="Ingredient">
              <ingredient :Value="tempForm.Ingredients" :ItemId="tempForm.Id"
            /></el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import InventoryQty from "@/components/Item/InventoryQty";
import ItemForm from "@/components/Item/ItemForm.vue";
import Ingredient from "@/components/Item/Ingredient.vue";
import Movements from "./Movements.vue";

import { GetItemById } from "@/api/Item";
export default {
  name: "Details",
  components: { InventoryQty, ItemForm, Ingredient, Movements },
  props: {
    isEdit: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      activeTab: "Details",
      loading: true,
      tempRoute: {},
      tempForm: null,
      ItemshipMovements: [],
      Payments: [],
      EntryMovements: [],
      log: [],
    };
  },

  created() {
    if (this.isEdit) {
      this.getdata(this.$route.params && this.$route.params.id);
      // console.log(this.$route.params )
    }
    this.tempRoute = Object.assign({}, this.$route);
  },
  methods: {
    getdata(val) {
      GetItemById({ Id: val })
        .then((response) => {
          this.tempForm = response;
          //this.GetImageItem(this.tempForm.Id);
          this.loading = false;
          //this.GetItemLogFromDevices(val);
          this.setTagsViewTitle();
          // set page title
          this.setPageTitle();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    tabClick(tab, event) {
      if (tab.label == "زيارات")
        if (tab.label == "اشتراكات")
          if (tab.label == "مقبوضات") if (tab.label == "مالية") console.log(tab);
    },
    GetImageItem(Id) {
      GetFileByObjId({ TableName: "Item", ObjId: Id })
        .then((response) => {
          if (response) this.tempForm.Avatar = response.File;
          else this.tempForm.Avatar = this.$store.getters.CompanyInfo.Logo;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    setTagsViewTitle() {
      const title = "Item";
      const route = Object.assign({}, this.tempRoute, {
        title: `${title}-${this.tempForm.Id}`,
      });
      this.$store.dispatch("tagsView/updateVisitedView", route);
    },
    setPageTitle() {
      const title = "Item";
      document.title = `${title} - ${this.tempForm.Id}`;
    },
  },
};
</script>
<style>
.el-date-editor.el-input,
.el-input__inner {
  width: 100%;
}
.el-col-8 {
  margin-left: 15px;
}
/*
.el-input.is-disabled .el-input__inner {
  color: #3399a5;
  font-weight: 650;
}*/
.BlackList {
  background: #ff1100;
}
.el-tabs__content {
  max-height: 700px;
}
</style>
