<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <radio-oprations TableName="SalesInvoice" @Change="getdata" />

        <el-button
          style="float: left"
          icon="el-icon-printer"
          type="primary"
          @click="printAll(tableData)"
        ></el-button>
        <search-by-date @change="getdata" />
      </div>
      <el-table
        v-loading="loading"
        :data="
          tableData.filter(
            data =>
              !search || data.Name.toLowerCase().includes(search.toLowerCase())
          )
        "
        @row-dblclick="
          row => {
            $router.replace({
              path: '/Sales/Edit/' + row.Id
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
            <el-button
              type="primary"
              icon="el-icon-refresh"
              @click="getdata"
            ></el-button>
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
              v-bind:placeholder="$t('Sales.SearchBy')"
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="PaymentMethod"
          sortable
          v-bind:label="$t('CashPool.Pay')"
          width="150"
          align="center"
        ></el-table-column>
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

        <el-table-column
          v-bind:label="$t('Sales.Status')"
          width="120"
          align="center"
        >
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
                <template slot-scope="scope"
                  >{{
                    (scope.row.SellingPrice * scope.row.Qty).toFixed(3)
                  }}
                  JOD</template
                >
              </el-table-column>
            </el-table>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
<script>
import { GetSaleInvoice } from "@/api/SaleInvoice";
import { ChangeObjStatus } from "@/api/Oprationsys";
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
    RadioOprations
  },
  data() {
    return {
      tableData: [],
      loading: true,
      search: ""
    };
  },
  created() {
    this.getdata();
  },
  methods: {
    getdata() {
      this.loading = true;

      GetSaleInvoice({
        DateFrom: this.$store.state.settings.datepickerQuery[0],
        DateTo: this.$store.state.settings.datepickerQuery[1]
      })
        .then(response => {
          // handle success
          console.log(response);
          this.tableData = response;
          this.loading = false;
        })
        .catch(error => {
          // handle error
          console.log(error);
        });
    },
    printAll(data) {
      data = data.map(Item => ({
        Name: Item.Name,
        Qty: Item.Qty,
        SellingPrice: Item.SellingPrice,
        Total: (Item.SellingPrice * Item.Qty).toFixed(3)
      }));
      printJS({
        printable: data,
        properties: ["Name", "Qty", "SellingPrice", "Total"],
        type: "json"
      });
    }
  }
};
</script>
