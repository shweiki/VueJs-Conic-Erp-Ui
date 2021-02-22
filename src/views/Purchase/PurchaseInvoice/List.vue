<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <search-by-date
          :Value="date"
          @Set="
            (v) => {
              date = v;
            }
          "
          @focus="getdata()"
        />
        <router-link
          class="pan-btn tiffany-btn"
          style="float: left; margin-left: 20px; padding: 10px 15px; border-radius: 6px"
          icon="el-icon-plus"
          to="/Purchase/Create"
          >{{ $t("route.NewPurchaseInvoice") }}</router-link
        >
      </div>

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
        @row-dblclick="
          (row) => {
            $router.replace({
              path: '/Purchase/Edit/' + row.Id,
            });
          }
        "
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
        <el-table-column width="150" prop="Name" align="center">
          <template slot="header" slot-scope="{}">
            <el-input v-model="search" v-bind:placeholder="$t('Purchase.Provider')" />
          </template>
        </el-table-column>
        <el-table-column
          prop="AccountInvoiceNumber"
          sortable
          label="AccountInvoiceNumber"
          width="160"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="InvoicePurchaseDate"
          sortable
          label="InvoicePurchaseDate"
          width="160"
          align="center"
        >
        </el-table-column>
        <el-table-column
          sortable
          v-bind:label="$t('CashPool.Pay')"
          width="120"
          align="center"
        >
          <template slot-scope="scope">{{ scope.row.PaymentMethod }}</template>
        </el-table-column>
        <el-table-column
          v-bind:label="$t('CashPool.Discount')"
          width="120"
          align="center"
        >
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
        <el-table-column label="الصافي" width="120" align="center">
          <template slot-scope="scope">
            {{
              (
                scope.row.InventoryMovements.reduce(function (prev, cur) {
                  return prev + cur.Qty * cur.SellingPrice;
                }, 0) - scope.row.Discount
              ).toFixed(3)
            }}
            JOD
          </template>
        </el-table-column>
        <el-table-column prop="Description" label="ملاحظات" width="120" align="center">
        </el-table-column>
        <el-table-column v-bind:label="$t('Sales.Status')" width="120" align="center">
          <template slot-scope="scope">
            <status-tag :Status="scope.row.Status" TableName="PurchaseInvoice" />
          </template>
        </el-table-column>
        <el-table-column width="150" align="center">
          <template slot-scope="scope">
            <next-oprations
              :ObjID="scope.row.Id"
              :Status="scope.row.Status"
              TableName="PurchaseInvoice"
            />
            <print-button Type="PurchaseInvoice" :Data="scope.row" />
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
              <el-table-column v-bind:label="$t('CashPool.Price')" align="center">
                <template slot-scope="scope">{{
                  scope.row.SellingPrice.toFixed(3)
                }}</template>
              </el-table-column>
              <el-table-column v-bind:label="$t('CashPool.Total')" align="center">
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
import SearchByDate from "@/components/Date/SearchByDate";
import StatusTag from "@/components/Oprationsys/StatusTag";
import NextOprations from "@/components/Oprationsys/NextOprations";
import { GetPurchaseInvoice } from "@/api/PurchaseInvoice";
import { ChangeObjStatus } from "@/api/Oprationsys";
import PrintButton from "@/components/PrintRepot/PrintButton.vue";

export default {
  name: "PurchaseInvoice",
  components: { StatusTag, NextOprations, SearchByDate, PrintButton },
  data() {
    return {
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
      GetPurchaseInvoice({
        DateFrom: this.date[0],
        DateTo: this.date[1],
      })
        .then((response) => {
          // handle success
          console.log(response);
          //  this.formTheadOptions = Object.keys(response[0]);
          this.tableData = response;
          this.loading = false;
        })
        .catch((error) => {
          // handle error
          console.log(error);
        });
    },
  },
};
</script>
