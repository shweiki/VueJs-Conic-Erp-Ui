<template>
  <div id="list-complete-demo" class="demo" style="text-align-last: center;">
    <el-card class="box-card">
      <el-button class="pan-btn gray-btn" v-on:click="filter('Accounting')">{{ $t('Report.Accounting') }}</el-button>
      <el-button class="pan-btn yellow-btn" v-on:click="filter('S&P')">{{ $t('Report.Salesand') }}</el-button>
      <el-button class="pan-btn pink-btn" v-on:click="filter('Inventory')">{{ $t('Report.Inventory') }}</el-button>
      <el-button class="pan-btn green-btn" v-on:click="filter('Classifications')">{{ $t('Report.Classification') }}</el-button>
      <el-button class="pan-btn blue-btn" v-on:click="filter('all')">{{ $t('Report.All') }}</el-button>
    </el-card>
    <el-card class="box-card" style="margin-bottom:50px;">
      <transition-group name="list-complete" class="list-complete" tag="section">
        <el-col
          style="margin-top: 20px;"
          :span="4"
          class="list-complete-item"
          v-for="item in filteredItems"
          v-bind:key="item.id"
        >
          <router-link :class="item.class" icon="el-icon-plus" :to="item.link">{{ item.name }}</router-link>
        </el-col>
      </transition-group>
    </el-card>
  </div>
</template>
<script>
export default {
  element: "list-complete-demo",
  data() {
    return {
      items: [
//"Sales Items"
        {
          id: 1,
          name: this.$t('Report.ItemSales'),
          link: "/Sales/SalesItems",
          tags: ["all", "S&P"],
          class: "pan-btn yellow-btn"
        },
        {
          id: 2,
          name: this.$t('Report.Purchase'),
          link: "/Purchases/PurchaseInvoice",
          tags: ["all", "S&P"],
          class: "pan-btn yellow-btn"
        },
        {
          id: 3,
          name: this.$t('Report.ItemPurchase'),
          link: "/Purchases/PurchaseItems",
          tags: ["all", "S&P"],
          class: "pan-btn yellow-btn"
        },
                {
          id: 4,
          name: this.$t('Report.Vendor'),
          link: "/Vendor/index",
          tags: ["all", "Accounting"],
          class: "pan-btn gray-btn"
        },
        {
          id: 5,
          name: this.$t('Report.TableAccount'),
          link: "/Accounting/TableAccount",
          tags: ["all", "Accounting"],
          class: "pan-btn gray-btn"
        },
        {
          id: 6,
          name: this.$t('Report.EntryAccounting'),
          link: "/Accounting/EntryAccounting",
          tags: ["all", "Accounting"],
          class: "pan-btn gray-btn"
        },
        {
          id: 7,
          name: this.$t('Report.Item'),
          link: "/Items",
          tags: ["all", "Inventory"],
          class: "pan-btn pink-btn"
        },
        {
          id: 8,
          name: this.$t('Report.OrderInventories'),
          link: "/OrderInventories",
          tags: ["all", "Inventory"],
          class: "pan-btn pink-btn"
        },
        {
          id: 9,
          name: this.$t('Report.Inventory'),
          link: "/Inventory",
          tags: ["all", "Inventory"],
          class: "pan-btn pink-btn"
        },
        {
          id: 10,
          name: this.$t('Report.ListItem'),
          link: "/MenuItem",
          tags: ["all", "Classifications"],
          class: "pan-btn green-btn"
        },
        {
          id: 11,
          name: this.$t('Report.OriginItem'),
          link: "/OriginItem",
          tags: ["all", "Classifications"],
          class: "pan-btn green-btn"
        },
        {
          id: 12,
          name: this.$t('Report.UnitItem'),
          link: "/UnitItem",
          tags: ["all", "Classifications"],
          class: "pan-btn green-btn"
        }
      ],
      currentTag: "all"
    };
  },
  computed: {
    filteredItems: function() {
      var filter = this.currentTag;
      return this.items.filter(function(item) {
        return item.tags.indexOf(filter) !== -1;
      });
    }
  },
  methods: {
    shuffle: function() {
      this.items = _.shuffle(this.items);
    },
    filter: function(tag) {
      this.currentTag = tag;
    }
  }
};
</script>
