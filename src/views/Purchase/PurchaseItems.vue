<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span class="demonstration">{{ $t('Sales.ByDate') }}</span>
        <el-date-picker
          v-model="date"
          format="dd/MM/yyyy"
          type="daterange"
          align="left"
          unlink-panels
          v-bind:range-separator="$t('Sales.until')"
          v-bind:start-placeholder="$t('Sales.From')"
          v-bind:end-placeholder="$t('Sales.To')"
          :default-time="['00:00:00', '23:59:59']"
          :picker-options="pickerOptions"
          style="width:40%"
          @change="changeDate"
        ></el-date-picker>
      </div>
      <el-card class="box-card">
        <span class="demonstration">{{ $t('ItemSales.name') }}</span>
        <el-select
          v-model="ItemID"
          filterable
          allow-create
          default-first-option
          @change="changeDate"
          v-bind:placeholder="$t('ItemSales.name')"
        >
          <el-option v-for="item in Items" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-card>
      <el-table
        v-loading="loading"
        :data="tableData.filter(data => !search || data.Account.AccountName.toLowerCase().includes(search.toLowerCase()))"
        fit
        border
        max-height="900"
        highlight-current-row
        style="width: 100%"
      >
        <el-table-column label="#" prop="id" width="120" align="center">
          <template slot="header" slot-scope="{}">
            <el-button  type="primary" icon="el-icon-refresh" @click="changeDate" ></el-button>
          </template>
        </el-table-column>
        <el-table-column prop="FakeDate" v-bind:label="$t('ItemSales.Date')" width="120" align="center"></el-table-column>
        <el-table-column prop="Account.AccountName" align="center">
          <template slot="header" slot-scope="{}">
            <el-input v-model="search" v-bind:placeholder="$t('Purchase.Provider')" />
          </template>
        </el-table-column>
        <el-table-column prop="Qty" v-bind:label="$t('Purchase.PurchaseTotal')" width="130" align="center">
          <template slot-scope="scope">{{(scope.row.Qty).toFixed(3) }}</template>
        </el-table-column>
        <el-table-column prop="SellingPrice" v-bind:label="$t('Purchase.SellingPrice')" width="120" align="center">
          <template slot-scope="scope">{{(scope.row.SellingPrice).toFixed(3) }}</template>
        </el-table-column>
        <el-table-column v-bind:label="$t('Purchase.TotalAmount')" width="120" align="center">
          <template slot-scope="scope">{{ (scope.row.Qty * scope.row.SellingPrice).toFixed(3) }}</template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
<script>
import { GetPurchaseItem } from "@/api/PurchaseInvoice";
import { GetActiveItem } from "@/api/Item";

export default {
  name: "PurchaseItems",
  data() {
    return {
      ItemID: 2,
      Items: [],
      tableData: [],
      loading: true,
      date: [],
      search: "",
      pickerOptions: {
        shortcuts: [
          {
            text: "قبل أسبوع",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "قبل شهر",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "قبل 3 أشهر",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "قبل 1 سنة",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 365);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      }
    };
  },
  created() {
    const end = new Date();
    const start = new Date();
    start.setTime(start.getTime() - 3600 * 1000 * 24 * 365);
    this.date = [start, end];
    this.getdata(this.ItemID, start, end);
  },
  methods: {
    getdata(itemid, datefrom, dateto) {
      this.loading = true;
      datefrom.setHours(0, 0, 0, 0);
      datefrom = JSON.parse(JSON.stringify(datefrom));
      dateto = JSON.parse(JSON.stringify(dateto));
      GetPurchaseItem({
        ItemID: itemid,
        DateFrom: datefrom,
        DateTo: dateto
      })
        .then(response => {
          // handle success
          console.log(response);
          this.tableData = response;
          GetActiveItem().then(response => {
            // handle success
            console.log(response);
            this.Items = response;
            this.loading = false;
          });
        })
        .catch(error => {
          // handle error
          console.log(error);
        });
    },
    changeDate() {
      this.loading = true;
      this.getdata(this.ItemID, this.date[0], this.date[1]);
    }
  }
};
</script>