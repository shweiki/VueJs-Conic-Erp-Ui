<template>
  <div class="app-container">
    <el-card class="box-card">
      <div style="float: left">
        <radio-oprations
          TableName="SalesInvoice"
          @Set="
            (v) => {
              Status = v;
            }
          "
        />
        <el-button
          style="float: left"
          icon="el-icon-printer"
          type="primary"
          @click="printAll(tableData)"
        ></el-button>
      </div>
      <search-by-date
        @Set="
          (v) => {
            date = v;
          }
        "
      />
      <el-divider direction="vertical"></el-divider>
      <span>عدد الفواتير</span>
      <el-divider direction="vertical"></el-divider>
      <span>{{ tableData.length }}</span>
      <el-divider direction="vertical"></el-divider>

      <span>{{ $t("CashPool.Cash") }}</span>
      <el-divider direction="vertical"></el-divider>
      <span>{{ TotalCash.toFixed(3) }} JOD</span>
      <el-divider direction="vertical"></el-divider>

      <span>{{ $t("CashPool.Visa") }}</span>
      <el-divider direction="vertical"></el-divider>
      <span>{{ TotalVisa.toFixed(3) }} JOD</span>
      <el-divider direction="vertical"></el-divider>

      <span>الاجل</span>
      <el-divider direction="vertical"></el-divider>
      <span>{{ TotalCheque.toFixed(3) }} JOD</span>
      <el-divider direction="vertical"></el-divider>

      <span>{{ $t("CashPool.Amount") }}</span>
      <el-divider direction="vertical"></el-divider>
      <span>{{ Total.toFixed(3) }} JOD</span>
      <el-divider direction="vertical"></el-divider>
      <el-button
        style="float: left"
        icon="el-icon-printer"
        type="success"
        @click="print(tableData)"
      ></el-button>
      <el-button
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="getdata"
      >
        Search
      </el-button>
    </el-card>
    <el-table
      v-loading="loading"
      :data="
        tableData.filter(
          (data) => !search || data.Name.toLowerCase().includes(search.toLowerCase())
        )
      "
      @row-dblclick="
        (row) => {
          $router.replace({
            path: '/Sales/Edit/' + row.Id,
          });
        }
      "
      fit
      border
      max-height="900"
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column prop="Id" width="120" align="center">
        <template slot="header" slot-scope="{}">
          <el-button type="primary" icon="el-icon-refresh" @click="getdata"></el-button>
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
          <el-input v-model="search" v-bind:placeholder="$t('Sales.SearchBy')" />
        </template>
      </el-table-column>
      <el-table-column
        prop="PaymentMethod"
        sortable
        v-bind:label="$t('CashPool.Pay')"
        width="150"
        align="center"
      ></el-table-column>
      <el-table-column v-bind:label="$t('CashPool.Discount')" width="120" align="center">
        <template slot-scope="scope">{{ scope.row.Discount.toFixed(3) }}</template>
      </el-table-column>
      <el-table-column v-bind:label="$t('CashPool.Amountv')" width="120" align="center">
        <template slot-scope="scope">
          {{
            scope.row.InventoryMovements.reduce(function (prev, cur) {
              return prev + cur.Qty * cur.SellingPrice;
            }, 0)
          }}
          JOD
        </template>
      </el-table-column>

      <el-table-column v-bind:label="$t('Sales.Status')" width="120" align="center">
        <template slot-scope="scope">
          <status-tag :Status="scope.row.Status" TableName="SalesInvoice" />
        </template>
      </el-table-column>
      <el-table-column width="180" align="center">
        <template slot-scope="scope">
          <next-oprations
            :ObjID="scope.row.Id"
            :Status="scope.row.Status"
            TableName="SalesInvoice"
            @Done="getdata"
          />
          <print-button Type="SaleInvoice" :Data="scope.row" />
        </template>
      </el-table-column>
      <el-table-column type="expand" align="center">
        <template slot-scope="props">
          <el-table :data="props.row.InventoryMovements">
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
            <el-table-column v-bind:label="$t('CashPool.Price')" align="center">
              <template slot-scope="scope">{{
                scope.row.SellingPrice.toFixed(3)
              }}</template>
            </el-table-column>
            <el-table-column v-bind:label="$t('CashPool.Total')" align="center">
              <template slot-scope="scope"
                >{{ (scope.row.SellingPrice * scope.row.Qty).toFixed(3) }} JOD</template
              >
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { GetSaleInvoiceByStatus } from "@/api/SaleInvoice";
import printJS from "print-js";
import StatusTag from "@/components/Oprationsys/StatusTag";
import NextOprations from "@/components/Oprationsys/NextOprations";
import SearchByDate from "@/components/Date/SearchByDate";
import PrintButton from "@/components/PrintRepot/PrintButton";
import RadioOprations from "@/components/Oprationsys/RadioOprations";

export default {
  name: "SalesInvoice",
  components: {
    StatusTag,
    NextOprations,
    SearchByDate,
    PrintButton,
    RadioOprations,
  },
  data() {
    return {
      tableData: [],
      loading: false,
      search: "",
      TotalCash: 0,
      TotalCheque: 0,
      TotalVisa: 0,
      Total: 0,
      date: [],
      Status: 1,
    };
  },
  methods: {
    getdata() {
      this.loading = true;
      GetSaleInvoiceByStatus({
        DateFrom: this.date[0],
        DateTo: this.date[1],
        Status: this.Status,
      })
        .then((response) => {
          // handle success
          console.log(response);
          this.tableData = response;
          this.TotalCheque = this.tableData.reduce(
            (a, b) =>
              a +
              (b["PaymentMethod"] == "Receivables"
                ? b.InventoryMovements.reduce(function (prev, cur) {
                    return prev + cur.Qty * cur.SellingPrice;
                  }, 0)
                : 0),
            0
          );
          this.TotalCash = this.tableData.reduce(
            (a, b) =>
              a +
              (b["PaymentMethod"] == "Cash"
                ? b.InventoryMovements.reduce(function (prev, cur) {
                    return prev + cur.Qty * cur.SellingPrice;
                  }, 0)
                : 0),
            0
          );
          this.TotalVisa = this.tableData.reduce(
            (a, b) =>
              a +
              (b["PaymentMethod"] == "Visa"
                ? b.InventoryMovements.reduce(function (prev, cur) {
                    return prev + cur.Qty * cur.SellingPrice;
                  }, 0)
                : 0),
            0
          );

          this.Total = this.TotalCash + this.TotalVisa + this.TotalCheque;

          this.loading = false;
        })
        .catch((error) => {
          // handle error
          console.log(error);
        });
    },
    print(data) {
      data = data.map((Item) => ({
        Name: Item.Name,
        Qty: Item.Qty,
        SellingPrice: Item.SellingPrice,
        Total: (Item.SellingPrice * Item.Qty).toFixed(3),
      }));
      printJS({
        printable: data,
        properties: ["Name", "Qty", "SellingPrice", "Total"],
        type: "json",
      });
    },
    printAll(data) {
      data = data.map((Item) => ({
        Name: Item.Name,
        Qty: Item.Qty,
        SellingPrice: Item.SellingPrice,
        Total: (Item.SellingPrice * Item.Qty).toFixed(3),
      }));
      printJS({
        printable: data,
        properties: ["Name", "Qty", "SellingPrice", "Total"],
        type: "json",
      });
    },
  },
};
</script>
