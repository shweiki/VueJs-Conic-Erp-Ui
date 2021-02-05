<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <router-link
          class="pan-btn tiffany-btn"
          style="float: left; padding: 10px 15px; border-radius: 6px"
          icon="el-icon-plus"
          to="/Accounting/NewAccountingEntry"
          >{{ $t("Accounting.NewAccountingEntry") }}</router-link
        >
        <!-- <el-button
            style="float: left"
              icon="el-icon-printer"
              type="primary"
              @click="printAll(tableData)"
            ></el-button> -->
        <search-by-date
          :Value="date"
          @Set="
            (v) => {
              date = v;
            }
          "
          @focus="getdata()"
        />
      </div>
      <el-card class="box-card">
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

        <el-table-column v-bind:label="$t('Sales.Status')" width="120" align="center">
          <template slot-scope="scope">
            <status-tag :Status="scope.row.Status" TableName="Membership" />
          </template>
        </el-table-column>
        <el-table-column width="180" align="center">
          <template slot-scope="scope">
            <el-button
              v-for="(NOprations, index) in scope.row.NextOprations"
              :key="index"
              :type="NOprations.ClassName"
              round
              @click="handleOprationsys(scope.row.Id, NOprations)"
              >{{ NOprations.OprationDescription }}</el-button
            >
            <el-button
              icon="el-icon-printer"
              type="primary"
              @click="print(scope.row.InventoryMovements)"
            ></el-button>
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
    </el-card>
    <el-dialog
      style="margin-top: -13vh"
      :show-close="false"
      :title="textOpration.OprationDescription"
      :visible.sync="dialogOprationVisible"
    >
      <el-form
        ref="dataOpration"
        :rules="rulesOpration"
        :model="tempOpration"
        label-position="top"
        label-width="70px"
        style="width: 400px margin-left:50px"
      >
        <el-form-item label="ملاحظات للعملية " prop="Description">
          <el-input type="textarea" v-model="tempOpration.Description"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button :type="textOpration.ClassName" @click="createOprationData()">{{
          textOpration.OprationDescription
        }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { GetSaleInvoice } from "@/api/SaleInvoice";
import { ChangeObjStatus } from "@/api/Oprationsys";
import printJS from "print-js";
import StatusTag from "@/components/Oprationsys/StatusTag";
import SearchByDate from "@/components/Date/SearchByDate";

export default {
  name: "SalesInvoice",
  components: { StatusTag, SearchByDate },
  data() {
    return {
      tableData: [],
      loading: true,
      search: "",
      TotalCash: 0,
      TotalCheque: 0,
      TotalVisa: 0,
      Total: 0,
      date: "",
      dialogOprationVisible: false,
      textOpration: {
        OprationDescription: "",
        ArabicOprationDescription: "",
        IconClass: "",
        ClassName: "",
      },
      tempOpration: {
        ObjID: undefined,
        OprationID: undefined,
        Description: "",
      },
      rulesOpration: {
        Description: [
          {
            required: true,
            message: "يجب إدخال ملاحظة للعملية",
            trigger: "blur",
          },
          {
            minlength: 5,
            maxlength: 150,
            message: "الرجاء إدخال اسم لا يقل عن 5 حروف و لا يزيد عن 150 حرف",
            trigger: "blur",
          },
        ],
      },
    };
  },
  created() {
    this.getdata();
  },
  methods: {
    getdata() {
      this.loading = true;

      GetSaleInvoice({
        DateFrom: this.date[0],
        DateTo: this.date[1],
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

    handleOprationsys(ObjID, Opration) {
      this.dialogOprationVisible = true;
      // text
      this.textOpration.OprationDescription = Opration.OprationDescription;
      this.textOpration.ArabicOprationDescription = Opration.ArabicOprationDescription;
      this.textOpration.IconClass = Opration.IconClass;
      this.textOpration.ClassName = Opration.ClassName;
      /// temp
      this.tempOpration.ObjID = ObjID;
      this.tempOpration.OprationID = Opration.Id;
      this.tempOpration.Description = "";
    },
    createOprationData() {
      this.$refs["dataOpration"].validate((valid) => {
        if (valid) {
          ChangeObjStatus({
            ObjID: this.tempOpration.ObjID,
            OprationID: this.tempOpration.OprationID,
            Description: this.tempOpration.Description,
          })
            .then((response) => {
              this.getdata(this.date[0], this.date[1]);
              this.dialogOprationVisible = false;
              this.$notify({
                title: "تم  ",
                message: "تمت العملية بنجاح",
                type: "success",
                duration: 2000,
              });
            })
            .catch((error) => {
              console.log(error);
            });
        } else {
          console.log("error submit!!");
        }
      });
    },
  },
};
</script>
