<template>
  <div>
    <img id="barcodeV" style="display : none"/>
    <el-row type="flex">
      <el-col :span="10">
        <el-input  data-barcode v-model="Barcode" id="barcode" placeholder="باركود صنف">
          <i class="fa fa-barcode el-input__icon" slot="suffix"></i>
        </el-input>
      </el-col>
      <el-col style="margin-right: 10px;" :span="8">
        <el-select
          style="display: unset;"
          ref="headerSearchSelect"
          v-model="search"
          :remote-method="querySearch"
          filterable
          default-first-option
          remote
          placeholder="بحث حسب اسم الصنف"
          @change="change"
        >
          <el-option v-for="item in options" :key="item.id" :value="item" :label="item.Name">
            <span style=" color: #8492a6; font-size: 12px">( {{ item.id }} )</span>
            <span style="float: left">{{ item.Name }}</span>
            <span style=" float: right; color: #8492a6; font-size: 13px">{{ item.SellingPrice }}</span>
          </el-option>
        </el-select>
      </el-col>
            <el-col style="margin-right: 10px;" :span="4">
        <add-item />
      </el-col>
      <el-col style="margin-right: 10px;" :span="2">
        <el-switch v-model="ByQTY" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
      </el-col>
    </el-row>
    <el-dialog
      style="margin-top: -13vh"
      :show-close="false"
      title="صنف جديد"
      :visible.sync="NewItemVisible"
    >
      <el-row type="flex">
        <el-col :span="3">
          <el-button type="success" icon="el-plus" @click="NewItem()">حفظ</el-button>
        </el-col>
        <el-col :span="5">
          <el-form-item label="سعر البيع">
            <el-input-number
              v-model="SellingPrice"
              :precision="2"
              :step="0.1"
              :min="0.00"
              :max="1500"
            ></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="9">
          <el-form-item label="باركود">
            <el-input v-model="Barcode" suffix-icon="fa fa-barcode"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="إسم صنف">
            <el-input type="text" v-model="Name" placeholder="إسم صنف"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-dialog>
    <el-dialog style="margin-top: -13vh" title="QTY" :visible.sync="EnterQTYVisible" width="80%">
      <el-row type="flex">
        <el-col :span="3">
          <el-button type="success" icon="el-plus" @click="AddItemByQty">Add</el-button>
        </el-col>

        <el-col :span="12">
          <el-input-number v-model="Qty" :precision="2" :step="1" :min="0.00" :max="1000000"></el-input-number>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>
<script>
import Fuse from "fuse.js";
import { CreateItem } from "@/api/Item";
import store from "@/store";
import AddItem from "./AddItem";

export default {
  name: "ItemsSearch",
  components :{AddItem ,AddItem},
  data() {
    return {
      ByQTY: false,
      Qty: 1,
      SellingPrice: 0.0,
      NewItemVisible: false,
      EnterQTYVisible: false,
      Barcode: "",
      Name: "",
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
  mounted() {
    this.searchPool = this.Items;
    this.focusBarcode();
  },
  methods: {
    AddItem(item, Qty) {
      this.$emit("add", item, Qty);
      this.Barcode = "";
      this.Qty = 1;
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
    focusBarcode() {
      document.getElementById("barcode").focus();
    },
    resetBarcode() {
      //  console.log("10");
      let barcode = this.$barcodeScanner.getPreviousCode();
      // do something...
    },
    AddItemByQty() {
      var find = this.Items.findIndex(
        value => value.Barcode == this.$barcodeScanner.getPreviousCode()
      );
      if (find != -1) {
        this.AddItem(this.Items[find], this.Qty);
        this.EnterQTYVisible = false;
      } else {
        this.EnterQTYVisible = false;
        this.NewItemVisible = true;
      }
    },
    onBarcodeScanned(barcode) {
      if (!this.ByQTY) {
        var find = this.Items.findIndex(value => value.Barcode == this.Barcode || value.id == this.Barcode );
        if (find != -1) {
          this.AddItem(this.Items[find], 1);
        } else {
          this.NewItemVisible = true;
          this.EnterQTYVisible = false;
        }
      } else this.EnterQTYVisible = true;
    },

    NewItem() {
      CreateItem({
        Id: undefined,
        Name: this.Name,
        CostPrice: 0.0,
        SellingPrice: this.SellingPrice,
        OtherPrice: 0.0,
        LowOrder: 0,
        Tax: 0.0,
        Rate: 0,
        Barcode: this.Barcode,
        Description: "",
        Status: 0
      })
        .then(response => {
          this.Barcode = "";
          (this.Name = ""), (this.NewItemVisible = false);
          this.$notify({
            title: "تم ",
            message: "تم الإضافة بنجاح",
            type: "success",
            duration: 2000
          });
          store.dispatch("Items/GetItem");
              this.focusBarcode();

        })
        .catch(error => {
          console.log(error);
        });
    }
  },
  created() {
    this.$barcodeScanner.init(this.onBarcodeScanned);
  }
};
</script>