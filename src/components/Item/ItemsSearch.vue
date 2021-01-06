<template>
  <div>
    <img id="barcodeV" style="display: none" />
    <el-row>
      <el-col :span="2">
        <add-item :visible="OpenAddItem" :barcode="Barcode" @focus="focus" />
      </el-col>
      <el-col :span="2">
        <search-item @add="AddItem" @focus="focus" />
      </el-col>
      <el-col :span="2">
        <el-switch
          v-model="ByQTY"
          active-color="#13ce66"
          inactive-color="#ff4949"
        ></el-switch>
      </el-col>

      <el-col :span="8">
        <el-select
          style="display: unset"
          ref="headerSearchSelect"
          v-model="search"
          :remote-method="querySearch"
          filterable
          default-first-option
          remote
          placeholder="بحث حسب اسم الصنف"
          @change="change"
        >
          <el-option
            v-for="item in options"
            :key="item.id"
            :value="item"
            :label="item.Name"
          >
            <span style="color: #8492a6; font-size: 12px"
              >( {{ item.id }} )</span
            >
            <span style="float: left">{{ item.Name }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{
              item.SellingPrice
            }}</span>
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="10">
        <el-input
          data-barcode
          v-model="Barcode"
          id="barcode"
          placeholder="باركود صنف"
          @focus="
            () => {
              Barcode = '';
            }
          "
        >
          <i class="fa fa-barcode el-input__icon" slot="suffix"></i>
        </el-input>
      </el-col>
    </el-row>
    <el-dialog
      style="margin-top: -13vh"
      title="QTY"
      :visible.sync="EnterQTYVisible"
      width="80%"
    >
      <el-row>
        <el-col :span="3">
          <el-button type="success" icon="el-plus" @click="AddItemByQty"
            >Add</el-button
          >
        </el-col>

        <el-col :span="12">
          <el-input-number
            v-model="Qty"
            :precision="2"
            :step="1"
            :min="0.0"
            :max="1000000"
          ></el-input-number>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>
<script>
import Fuse from "fuse.js";
import store from "@/store";
import AddItem from "./AddItem";
import SearchItem from "./SearchItem";

export default {
  name: "ItemsSearch",
  components: { AddItem, SearchItem },
  data() {
    return {
      ByQTY: false,
      Qty: 1,
      OpenAddItem: false,
      SellingPrice: 0.0,
      NewItemVisible: false,
      EnterQTYVisible: false,
      Barcode: "",
      search: "",
      options: [],
      searchPool: [],
      fuse: undefined
    };
  },
  computed: {
    Items() {
      return this.$store.getters.AllItems;
    }
  },
  watch: {
    Items() {
      this.searchPool = this.Items;
    },
    searchPool(list) {
      this.initFuse(list);
    }
  },
  created() {
    // Add barcode scan listener and pass the callback function
    this.$barcodeScanner.init(this.onBarcodeScanned);
  },

  mounted() {
    this.searchPool = this.Items;
  },
  methods: {
    AddItem(item, Qty) {
      if (this.ByQTY) {
        this.EnterQTYVisible = true;
        return;
      }
      this.Barcode = "";
      this.$emit("add", item, Qty);
    },
    change(val) {
      this.AddItem(val, 1);
      this.search = "";
      this.options = [];
    },
    initFuse(list) {
      this.fuse = new Fuse(list, {
        shouldSort: true,
        threshold: 0.4,
        location: 0,
        distance: 100,
        maxPatternLength: 32,
        minMatchCharLength: 1,
        keys: [
          {
            name: "ID",
            weight: 0.7
          },
          {
            name: "Name",
            weight: 0.3
          }
        ]
      });
    },
    querySearch(query) {
      if (query !== "") {
        this.options = this.fuse.search(query);
      } else {
        this.options = [];
      }
    },
    focus() {
      this.OpenAddItem = false;
      this.$emit("focus");
    },

    resetBarcode() {
      //  console.log("10");
      let barcode = this.$barcodeScanner.getPreviousCode();
      // do something...
    },
    AddItemByQty() {
      var find = this.Items.findIndex(
        value => value.Barcode == this.Barcode || value.id == this.Barcode
      );
      if (find != -1) {
        this.AddItem(this.Items[find], this.Qty);
        this.EnterQTYVisible = false;
      } else {
        this.EnterQTYVisible = false;
        this.OpenAddItem = !this.OpenAddItem;
      }
    },
    onBarcodeScanned(barcode) {
      this.OpenAddItem = false;
      var find = this.Items.findIndex(
        value =>
          value.Barcode == barcode ||
          (this.$store.getters.settings.BarcodeIsID == true
            ? value.id == this.Barcode
            : this.$store.getters.settings.BarcodeIsID)
      );
      if (find != -1) {
        this.AddItem(this.Items[find], 1);
      } else {
        this.OpenAddItem = true;
      }
    }
  }
};
</script>
