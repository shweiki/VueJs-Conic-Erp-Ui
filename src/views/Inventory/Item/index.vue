<template>
      <router-view />
</template>
<!--
<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <add-item style="float: left" />

        <el-button
          style="float: left"
          icon="el-icon-printer"
          type="primary"
          @click="print(tableData)"
        ></el-button>
        <span>{{ $t("CashPool.Items") }}</span>
      </div>
      <el-card style="background: #545454" :body-style="{ padding: '1px' }">
        <items-search :WithBarCode="true" @add="AddItem" />
      </el-card>
      <el-table
        v-loading="loading"
        :data="
          tableData.filter(
            (data) => !search || data.Name.toLowerCase().includes(search.toLowerCase())
          )
        "
        fit
        border
        max-height="900"
        highlight-current-row
      >
        <el-table-column
          prop="Id"
          v-bind:label="$t('Items.Id')"
          width="120"
        ></el-table-column>
        <el-table-column
          v-bind:label="$t('Items.Barcode')"
          prop="Barcode"
          width="120"
          align="center"
        ></el-table-column>

        <el-table-column prop="Name" align="center">
          <template slot="header" slot-scope="{}">
            <el-input v-model="search" v-bind:placeholder="$t('Items.Item')" />
          </template>
        </el-table-column>
        <el-table-column
          v-bind:label="$t('Items.QuantityInventory')"
          align="center"
          width="220"
        >
          <template slot-scope="scope">
            <item-qty :ItemId="scope.row.Id" />
          </template>
        </el-table-column>
        <el-table-column label="#" align="center" width="50">
          <template slot-scope="scope">
            <el-button
              icon="el-icon-s-management"
              type="success"
              @click="printlabel(scope.row)"
            ></el-button>
          </template>
        </el-table-column>
        <el-table-column v-bind:label="$t('Items.Status')" align="center" width="100">
          <template slot-scope="scope">
            <status-tag :Status="scope.row.Status" TableName="Item" />
          </template>
        </el-table-column>
        <el-table-column width="40">
          <template slot-scope="scope">
            <edit-item :ItemId="scope.row.Id" />
          </template>
        </el-table-column>
        <el-table-column type="expand" width="30">
          <template slot-scope="props">
            <el-table :data="[props.row]">
              <el-table-column v-bind:label="$t('Items.Cost')" align="center">
                <template slot-scope="scope">
                  <i class="el-icon-money"></i>
                  {{ scope.row.CostPrice.toFixed($store.getters.settings.ToFixed) }}
                </template>
              </el-table-column>
              <el-table-column v-bind:label="$t('Items.Packeges')" align="center">
                <template slot-scope="scope">
                  <i class="el-icon-money"></i>
                  {{ scope.row.OtherPrice.toFixed($store.getters.settings.ToFixed) }}
                </template>
              </el-table-column>
              <el-table-column v-bind:label="$t('Items.Retail')" align="center">
                <template slot-scope="scope">
                  <i class="el-icon-money"></i>
                  {{ scope.row.SellingPrice.toFixed($store.getters.settings.ToFixed) }}
                </template>
              </el-table-column>
              <el-table-column
                v-bind:label="$t('Items.LowerOrder')"
                prop="LowOrder"
                width="110"
                align="center"
              ></el-table-column>
              <el-table-column
                v-bind:label="$t('Items.Tax')"
                prop="Tax"
                width="100"
                align="center"
              ></el-table-column>
              <el-table-column
                v-bind:label="$t('Items.Rate')"
                prop="Rate"
                width="100"
                align="center"
              ></el-table-column>
              <el-table-column
                v-bind:label="$t('Items.Notes')"
                prop="Description"
                width="150"
                align="center"
              ></el-table-column>
            </el-table>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
<script>
import {  GetItemById } from "@/api/Item";
import printJS from "print-js";
import ItemsSearch from "@/components/Item/ItemsSearch.vue";
import { Label1 } from "@/Report/ItemLabel";

import StatusTag from "@/components/Oprationsys/StatusTag.vue";
import ItemQty from "@/components/Item/ItemQty.vue";
import EditItem from "@/components/Item/EditItem.vue";
import AddItem from "@/components/Item/AddItem.vue";
export default {
  name: "Item",
  components: { ItemsSearch, AddItem, EditItem, ItemQty, StatusTag },

  data() {
    return {
      tableData: [],
      loading: false,
      dialogFormVisible: false,
      dialogOprationVisible: false,
      dialogFormStatus: "",
      search: "",
      Items: [],
      textMapForm: {
        update: "تعديل",
        create: "إضافة",
      },
      textOpration: {
        OprationDescription: "",
        ArabicOprationDescription: "",
        IconClass: "",
        ClassName: "",
      },
      tempForm: {
        Id: undefined,
        Name: "",
        CostPrice: 0.0,
        SellingPrice: 0.0,
        OtherPrice: 0.0,
        LowOrder: 0,
        Tax: 0.0,
        Rate: 0,
        IsPrime: false,
        Barcode: "",
        Description: "",
      },
    };
  },
  methods: {
    AddItem(item) {
      this.loading = true;

      GetItemById({ Id: item.Id }).then((response) => {
        // handle success
        console.log(response);
        this.tableData.push(response);
        this.loading = false;
      });
    },
    print(data) {
      printJS({
        printable: data,
        properties: ["Barcode", "Name", "SellingPrice", "Description"],
        type: "json",
      });
    },
    printlabel(item) {
      console.log(item);
      printJS({
        printable: Label1(item),
        type: "pdf",
        base64: true,
        showModal: true,
      });
    },
  },
};
</script>
 -->