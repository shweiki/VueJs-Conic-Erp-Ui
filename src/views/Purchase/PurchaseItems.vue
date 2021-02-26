<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <search-by-date
          :Value="[]"
          @Set="
            (v) => {
              date = v;
            }
          "
        />
      </div>
      <el-card class="box-card">
        <span class="demonstration">{{ $t("ItemSales.Name") }}</span>
        <el-select
          v-model="ItemId"
          filterable
          allow-create
          default-first-option
          @change="getdata"
          v-bind:placeholder="$t('ItemSales.Name')"
        >
          <el-option
            v-for="item in Items"
            :key="item.Id"
            :label="item.Name"
            :value="item.Id"
          ></el-option>
        </el-select>
      </el-card>
      <el-table
        v-loading="loading"
        :data="
          tableData.filter(
            (data) =>
              !search ||
              data.Account.AccountName.toLowerCase().includes(search.toLowerCase())
          )
        "
        fit
        border
        max-height="900"
        highlight-current-row
        style="width: 100%"
      >
        <el-table-column label="#" prop="Id" width="120" align="center">
          <template slot="header" slot-scope="{}">
            <el-button type="primary" icon="el-icon-refresh" @click="getdata"></el-button>
          </template>
        </el-table-column>
        <el-table-column
          prop="FakeDate"
          v-bind:label="$t('ItemSales.Date')"
          width="120"
          align="center"
        ></el-table-column>
        <el-table-column prop="Account.AccountName" align="center">
          <template slot="header" slot-scope="{}">
            <el-input v-model="search" v-bind:placeholder="$t('Purchase.Provider')" />
          </template>
        </el-table-column>
        <el-table-column
          prop="Qty"
          v-bind:label="$t('Purchase.PurchaseTotal')"
          width="130"
          align="center"
        >
          <template slot-scope="scope">{{ scope.row.Qty.toFixed($store.getters.settings.ToFixed) }}</template>
        </el-table-column>
        <el-table-column
          prop="SellingPrice"
          v-bind:label="$t('Purchase.SellingPrice')"
          width="120"
          align="center"
        >
          <template slot-scope="scope">{{ scope.row.SellingPrice.toFixed($store.getters.settings.ToFixed) }}</template>
        </el-table-column>
        <el-table-column
          v-bind:label="$t('Purchase.TotalAmount')"
          width="120"
          align="center"
        >
          <template slot-scope="scope">{{
            (scope.row.Qty * scope.row.SellingPrice).toFixed($store.getters.settings.ToFixed)
          }}</template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
<script>
import { GetPurchaseItem } from "@/api/PurchaseInvoice";
import { GetActiveItem } from "@/api/Item";
import SearchByDate from "@/components/Date/SearchByDate";

export default {
  name: "PurchaseItems",
  components: { SearchByDate },

  data() {
    return {
      ItemId: 2,
      Items: [],
      tableData: [],
      loading: true,
      search: "",
      date: [],
    };
  },
  created() {
    this.getdata();
  },
  methods: {
    getdata() {
      this.loading = true;

      GetPurchaseItem({
        ItemId: this.ItemId,
        DateFrom: this.date[0],
        DateTo: this.date[1],
      })
        .then((response) => {
          // handle success
          console.log(response);
          this.tableData = response;
          GetActiveItem().then((response) => {
            // handle success
            console.log(response);
            this.Items = response;
            this.loading = false;
          });
        })
        .catch((error) => {
          // handle error
          console.log(error);
        });
    },
  },
};
</script>
