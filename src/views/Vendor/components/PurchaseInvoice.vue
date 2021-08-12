<template>
  <div class="app-container" style="direction : rtl ">
    <el-table
      height="250"
      :data="List"
      fit
      border
      highlight-current-row
      @row-dblclick="
        row => {
          $router.replace({
            path: '/Purchase/Edit/' + row.Id
          });
        }
      "
    >
      <el-table-column label="#" prop="Id" width="120" align="center">
        <template slot="header" slot-scope="{}">
          <el-button
            type="primary"
            icon="el-icon-refresh"
            @click="getdata()"
          ></el-button>
        </template>
      </el-table-column>
      <el-table-column
        prop="FakeDate"
        v-bind:label="$t('CashPool.Date')"
        width="120"
        align="center"
      >
        <template slot-scope="{ row }">{{
          row.FakeDate
        }}</template></el-table-column
      >
      <el-table-column
        prop="PaymentMethod"
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
          scope.row.Discount.toFixed($store.getters.settings.ToFixed)
        }}</template>
      </el-table-column>
      <el-table-column
        v-bind:label="$t('CashPool.Amountv')"
        width="120"
        align="center"
      >
        <template slot-scope="scope">
          {{
            scope.row.InventoryMovements.reduce((prev, cur) => {
              return prev + cur.Qty * cur.SellingPrice;
            }, 0).toFixed($store.getters.settings.ToFixed)
          }}
          JOD
        </template>
      </el-table-column>
      <el-table-column label="الحالة" align="center">
        <template slot-scope="scope">
          <Status-Tag :Status="scope.row.Status" TableName="PurchaseInvoice" />
        </template>
      </el-table-column>
      <el-table-column width="60" align="center">
        <template slot-scope="scope">
          <Drawer-Print Type="PurchaseInvoice" :Data="scope.row" />
        </template>
      </el-table-column>
      <el-table-column type="expand">
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
                scope.row.SellingPrice.toFixed($store.getters.settings.ToFixed)
              }}</template>
            </el-table-column>
            <el-table-column v-bind:label="$t('CashPool.Total')" align="center">
              <template slot-scope="scope"
                >{{
                  (scope.row.SellingPrice * scope.row.Qty).toFixed(
                    $store.getters.settings.ToFixed
                  )
                }}
                JOD</template
              >
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import checkPermission from "@/utils/permission";
import StatusTag from "@/components/Oprationsys/StatusTag";
import DrawerPrint from "@/components/PrintRepot/DrawerPrint";
import { GetPurchaseInvoiceByVendorId } from "@/api/PurchaseInvoice";

export default {
  components: { StatusTag, DrawerPrint },
  props: {
    VendorId: {
      type: Number,
      default: () => {
        return undefined;
      }
    }
  },
  data() {
    return {
      List: []
    };
  },
  created() {
    this.getdata();
  },
  methods: {
    checkPermission,
    getdata() {
      GetPurchaseInvoiceByVendorId({
        Id: this.VendorId
      }).then(response => {
        //   console.log("log :", response);
        this.List = response;
      });
    }
  }
};
</script>

