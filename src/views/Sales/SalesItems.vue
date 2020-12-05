<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span class="demonstration">{{ $t("Sales.ByDate") }}</span>
        <el-date-picker
          v-model="$store.getters.SettingsApp.datepickerQuery"
          format="dd/MM/yyyy"
          type="daterange"
          align="left"
          unlink-panels
          v-bind:range-separator="$t('Sales.until')"
          v-bind:start-placeholder="$t('Sales.From')"
          v-bind:end-placeholder="$t('Sales.To')"
          :default-time="$store.getters.SettingsApp.defaulttimeQuery"
          :picker-options="$store.getters.SettingsApp.pickerOptions"
          style="width: 80%"
          @change="getdata"
        ></el-date-picker>
      </div>
      <el-card class="box-card">
        <span class="demonstration">{{ $t("ItemSales.Name") }}</span>
        <el-select
          v-model="ItemID"
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
        <el-divider direction="vertical"></el-divider>
        <span>عدد الفواتير</span>
        <el-divider direction="vertical"></el-divider>
        <span>{{ tableData.length }}</span>
        <el-divider direction="vertical"></el-divider>

        <span>العدد الكلي</span>
        <el-divider direction="vertical"></el-divider>
        <span>{{ TotalQty.toFixed(3) }} JOD</span>
        <el-divider direction="vertical"></el-divider>

        <span>القمية الكلية</span>
        <el-divider direction="vertical"></el-divider>
        <span>{{ TotalAmmount.toFixed(3) }} JOD</span>
        <el-divider direction="vertical"></el-divider>

        <el-button
          style="float: left"
          icon="el-icon-printer"
          type="primary"
          @click="print(tableData)"
        ></el-button>
      </el-card>

      <el-table
        v-loading="loading"
        :data="
          tableData.filter(
            (data) =>
              !search ||
              data.Account.AccountName.toLowerCase().includes(
                search.toLowerCase()
              )
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
            <el-button
              type="primary"
              icon="el-icon-refresh"
              @click="getdata"
            ></el-button>
          </template>
        </el-table-column>
        <el-table-column
          prop="FakeDate"
          v-bind:label="$t('ItemSales.Date')"
          width="120"
          align="center"
        ></el-table-column>
        <el-table-column prop="Name" align="center">
          <template slot="header" slot-scope="{}">
            <el-input
              v-model="search"
              v-bind:placeholder="$t('ItemSales.Customer')"
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="Qty"
          v-bind:label="$t('ItemSales.quantity')"
          width="120"
          align="center"
        >
          <template slot-scope="scope">{{ scope.row.Qty.toFixed(3) }}</template>
        </el-table-column>
        <el-table-column
          prop="SellingPrice"
          v-bind:label="$t('ItemSales.Price')"
          width="120"
          align="center"
        >
          <template slot-scope="scope">{{
            scope.row.SellingPrice.toFixed(3)
          }}</template>
        </el-table-column>
        <el-table-column
          v-bind:label="$t('ItemSales.Amountv')"
          width="120"
          align="center"
        >
          <template slot-scope="scope"
            >{{
              (scope.row.Qty * scope.row.SellingPrice).toFixed(3)
            }}
            JOD</template
          >
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
<script>
import { GetSaleItem } from "@/api/SaleInvoice";
import { GetActiveItem } from "@/api/Item";
import printJS from "print-js";
export default {
  name: "SalesItem",
  data() {
    return {
      ItemID: 2,
      Items: [],
      tableData: [],
      loading: true,
      TotalQty: 0,
      TotalAmmount: 0,
      search: '',
    };
  },

  created() {

    this.getdata();
    GetActiveItem().then((response) => {
      // handle success
      console.log(this.$store.getters.SettingsApp.datepickerQuery);
      this.Items = response;
      this.loading = false
    })
  },
  methods: {
    print(data) {
      data = data.map((Item) => ({
        Name: Item.Name,
        Qty: Item.Qty,
        SellingPrice: Item.SellingPrice,
        Total: (Item.SellingPrice * Item.Qty).toFixed(3),
      }));
      printJS({
        printable: data,
        properties: [
          { field: "Name", displayName: "اسم الزبون" },
          { field: "Qty", displayName: "الكمية" },
          { field: "SellingPrice", displayName: "سعر البيع" },
          { field: "Total", displayName: "القيمة" },
        ],
        type: "json",
        header:
          "<center> <h2>مبيعات الصنف " +
          this.Items.find((obj) => {
            return obj.Id == this.ItemID;
          }).Name +
          "</h2></center> <h3 style='float:left'>   الاجمالي الكمية:  " +
          this.TotalQty.toFixed(3) +
          "</h3><h3 style='float:right'>  الفترة  : " +
          this.formatDate(this.date[0]) +
          " - " +
          this.formatDate(this.date[1]) +
          "</h3>",
        gridHeaderStyle: "color: red;  border: 2px solid #3971A5;",
        gridStyle: "border: 2px solid #3971A5; text-align: center;",
      })
    },

    getdata() {
      var itemid = this.ItemID, 
      datefrom = this.$store.getters.SettingsApp.datepickerQuery[0],
      dateto = this.$store.getters.SettingsApp.datepickerQuery[1]

      this.loading = true;
      datefrom = JSON.parse(JSON.stringify(datefrom));
      dateto = JSON.parse(JSON.stringify(dateto));
      GetSaleItem({
        ItemID: itemid,
        DateFrom: datefrom,
        DateTo: dateto,
      })
        .then((response) => {
          // handle success
          console.log(response)
          this.tableData = response;
          this.TotalQty = this.tableData.reduce((a, b) => a + b.Qty, 0);
          this.TotalAmmount = this.tableData.reduce(
            (a, b) => a + b.Qty * b.SellingPrice,
            0
          );
          this.loading = false
        })
        .catch((error) => {
          // handle error
          console.log(error);
        })
    },

    formatDate(date) {
      let d = new Date(date),
        day = "" + d.getDate(),
        month = "" + (d.getMonth() + 1),
        year = d.getFullYear();
      if (month.length < 2) month = "0" + month;
      if (day.length < 2) day = "0" + day;

      return [day, month, year].join("/");
    },
  },
};
</script>