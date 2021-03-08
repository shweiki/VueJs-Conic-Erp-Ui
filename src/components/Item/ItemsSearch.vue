<template>
  <div>
    <el-row>
      <el-col :span="2">
        <add-item :visible="OpenAddItem" :barcode="Barcode" @focus="focus" />
      </el-col>
      <el-col v-permission="['Admin']" :span="2">
        <dialog-search-item @add="AddItem" @focus="focus" />
      </el-col>
      <el-col :span="2">
        <el-switch
          @change="focus"
          v-model="ByQTY"
          active-color="#13ce66"
          inactive-color="#ff4949"
        ></el-switch>
      </el-col>

      <el-col :span="8">
        <item-search-any @Set="v => AddItem(v, 1)" />
      </el-col>
      <el-col :span="8">
        <el-input
          data-barcode
          ref="Barcode"
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
import AddItem from "./AddItem";
import DialogSearchItem from "./DialogSearchItem";
import { GetItemByBarcode, GetItemByID } from "@/api/Item";
import ItemSearchAny from "./ItemSearchAny";
import permission from "@/directive/permission/index.js";

export default {
  name: "ItemsSearch",
  components: { AddItem, DialogSearchItem, ItemSearchAny },
  directives: { permission },
  data() {
    return {
      ByQTY: false,
      Qty: 1,
      OpenAddItem: false,
      SellingPrice: 0.0,
      NewItemVisible: false,
      EnterQTYVisible: false,
      Barcode: "",

      searchPool: [],
      fuse: undefined
    };
  },
  created() {
    // Add barcode scan listener and pass the callback function
    this.$barcodeScanner.init(this.onBarcodeScanned);
  },

  methods: {
    AddItem(item, Qty) {
      if (this.ByQTY) {
        this.EnterQTYVisible = true;
        return;
      }
      this.Barcode = "";
      this.$emit("add", item, Qty);
      this.focus();
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

      if (this.Barcode != "" || this.Barcode) {
        GetItemByBarcode({ BarCode: this.Barcode }).then(res => {
          if (res) this.AddItem(res, 1);
          else {
            if (this.$store.getters.settings.BarcodeIsID == true) {
              GetItemByID({ ID: this.Barcode }).then(res => {
                if (res) this.AddItem(res, 1);
                else this.OpenAddItem = true;
              });
            } else this.OpenAddItem = true;
          }
        });
      }
    }
  }
};
</script>
