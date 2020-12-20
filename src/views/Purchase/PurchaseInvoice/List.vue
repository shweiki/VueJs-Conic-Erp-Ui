<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span class="demonstration">{{ $t("Sales.ByDate") }}</span>
        <el-date-picker
          v-model="$store.getters.Settings.datepickerQuery"
          format="dd/MM/yyyy"
          type="daterange"
          align="left"
          unlink-panels
          v-bind:range-separator="$t('Sales.until')"
          v-bind:start-placeholder="$t('Sales.From')"
          v-bind:end-placeholder="$t('Sales.To')"
          :default-time="$store.getters.Settings.defaulttimeQuery"
          :picker-options="$store.getters.Settings.pickerOptions"
          style="width: 80%"
          @change="getdata"
        ></el-date-picker>
        <router-link
          class="pan-btn tiffany-btn"
          style="
            float: left;
            margin-left: 20px;
            padding: 10px 15px;
            border-radius: 6px;
          "
          icon="el-icon-plus"
          to="/Purchase/Create"
          >{{ $t("route.NewPurchaseInvoice") }}</router-link
        >
      </div>
      <el-table
        v-loading="loading"
        :data="
          tableData.filter(
            data =>
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
        <el-table-column prop="Id" width="120" align="center">
          <template slot="header" slot-scope="{}">
            <el-button
              type="primary"
              icon="el-icon-refresh"
              @click="getdata"
            ></el-button>
          </template>
          <template slot-scope="scope">
            <router-link :to="'/Purchase/Edit/' + scope.row.Id">
              <strong style="font-size: 10px; cursor: pointer">{{
                scope.row.Id
              }}</strong>
            </router-link>
          </template>
        </el-table-column>
        <el-table-column
          prop="FakeDate"
          v-bind:label="$t('Sales.Date')"
          width="120"
          align="center"
        ></el-table-column>
        <el-table-column prop="Name" align="center">
          <template slot="header" slot-scope="{}">
            <el-input
              v-model="search"
              v-bind:placeholder="$t('Purchase.Provider')"
            />
          </template>
          <template slot-scope="scope">
            <router-link :to="'/Purchase/Edit/' + scope.row.Id">
              <strong style="font-size: 10px; cursor: pointer">{{
                scope.row.Name
              }}</strong>
            </router-link>
          </template>
        </el-table-column>
        <el-table-column
          sortable
          v-bind:label="$t('CashPool.Pay')"
          width="160"
          align="center"
        >
          <template slot-scope="scope">{{
            scope.row.PaymentMethod == "Cash" ? "ذمم" : "كاش"
          }}</template>
        </el-table-column>
        <el-table-column
          v-bind:label="$t('CashPool.Discount')"
          width="120"
          align="center"
        >
          <template slot-scope="scope">{{
            scope.row.Discount.toFixed(3)
          }}</template>
        </el-table-column>
        <el-table-column
          v-bind:label="$t('CashPool.Amountv')"
          width="120"
          align="center"
        >
          <template slot-scope="scope">
            {{
              scope.row.InventoryMovements.reduce(function(prev, cur) {
                return prev + cur.Qty * cur.SellingPrice;
              }, 0)
            }}
            JOD
          </template>
        </el-table-column>
        <el-table-column vlabel="الصافي" width="120" align="center">
          <template slot-scope="scope">
            {{
              (
                scope.row.InventoryMovements.reduce(function(prev, cur) {
                  return prev + cur.Qty * cur.SellingPrice;
                }, 0) - scope.row.Discount
              ).toFixed(3)
            }}
            JOD
          </template>
        </el-table-column>
        <el-table-column
          v-bind:label="$t('Sales.Status')"
          width="120"
          align="center"
        >
          <template slot-scope="scope">
            <el-tag >{{
              scope.row.Status
            }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column width="150" align="center">
          <template slot-scope="scope">
            <el-button
              icon="el-icon-printer"
              type="primary"
              @click="printInvoice(scope.row)"
            ></el-button>

          </template>
        </el-table-column>
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-table :data="props.row.InventoryMovements">
              <el-table-column
                prop="InventoryName"
                v-bind:label="$t('NewPurchaseInvoice.Inventory')"
                width="130"
                align="center"
              ></el-table-column>
              <el-table-column
                prop="Name"
                v-bind:label="$t('CashPool.Items')"
                width="130"
                align="center"
              ></el-table-column>
              <el-table-column
                prop="Qty"
                v-bind:label="$t('CashPool.quantity')"
                align="center"
              ></el-table-column>
              <el-table-column
                v-bind:label="$t('CashPool.Price')"
                align="center"
              >
                <template slot-scope="scope">{{
                  scope.row.SellingPrice.toFixed(3)
                }}</template>
              </el-table-column>
              <el-table-column
                v-bind:label="$t('CashPool.Total')"
                align="center"
              >
                <template slot-scope="scope">{{
                  (scope.row.SellingPrice * scope.row.Qty).toFixed(3)
                }}</template>
              </el-table-column>
            </el-table>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

  </div>
</template>
<script>
import { GetPurchaseInvoice } from "@/api/PurchaseInvoice";
import { ChangeObjStatus } from "@/api/Oprationsys";
import printJS from "print-js";
import { Invoice1 } from "@/Report/PurchaseInvoice";
export default {
  name: "PurchaseInvoice",
  data() {
    return {
      tableData: [],
      loading: true,
      date: [],
      search: '',


    };
  },
  created() {
    this.getdata();
  },
  methods: {
    getdata() {
      this.loading = true;
     var datefrom = this.$store.getters.Settings.datepickerQuery[0],
        dateto = this.$store.getters.Settings.datepickerQuery[1];

      datefrom = JSON.parse(JSON.stringify(datefrom));
      dateto = JSON.parse(JSON.stringify(dateto));
      GetPurchaseInvoice({
        DateFrom: datefrom,
        DateTo: dateto
      })
        .then(response => {
          // handle success
          console.log(response)
          this.tableData = response;
          this.loading = false
        })
        .catch(error => {
          // handle error
          console.log(error);
        })
    },

    printInvoice(data) {
      Invoice1(data);
    }
  }
};
</script>