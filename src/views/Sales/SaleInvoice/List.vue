<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
                <router-link
          class="pan-btn tiffany-btn"
          style="float: left; padding: 10px 15px; border-radius: 6px;"
          icon="el-icon-plus"
          to="/Accounting/NewAccountingEntry"
        >{{ $t('Accounting.NewAccountingEntry') }}</router-link>
            <!-- <el-button
            style="float: left"
              icon="el-icon-printer"
              type="primary"
              @click="printAll(tableData)"
            ></el-button> -->
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
          style="width:60%"
          @change="changeDate"
        ></el-date-picker>
      </div>
      <el-table
        v-loading="loading"
        :data="tableData.filter(data => !search || data.Account.AccountName.toLowerCase().includes(search.toLowerCase()))"
        fit
        border
        max-height="900"
        highlight-current-row
        style="width: 100%"
      >
        <el-table-column prop="Id" width="120" align="center">
          <template slot="header" slot-scope="{}">
            <el-button type="primary" icon="el-icon-refresh" @click="changeDate"></el-button>
          </template>
        </el-table-column>
        <el-table-column prop="FakeDate" v-bind:label="$t('Sales.Date')" width="120" align="center"></el-table-column>
        <el-table-column prop="Name" align="center">
          <template slot="header" slot-scope="{}">
            <el-input v-model="search" v-bind:placeholder="$t('Sales.SearchBy')" />
          </template>
        </el-table-column>
        <el-table-column prop="PaymentMethod"  sortable v-bind:label="$t('CashPool.Pay')" width="150" align="center"></el-table-column>
        <el-table-column v-bind:label="$t('CashPool.Discount')" width="120" align="center">
          <template slot-scope="scope">{{(scope.row.Discount).toFixed(3) }}</template>
        </el-table-column>
        <el-table-column v-bind:label="$t('CashPool.Amountv')" width="120" align="center">
          <template slot-scope="scope">
            {{scope.row.InventoryMovements.reduce(
            function(prev, cur) {return prev + cur.Qty * cur.SellingPrice;},0) }} JOD
          </template>
        </el-table-column>

        <el-table-column v-bind:label="$t('Sales.Status')" width="120" align="center">
          <template slot-scope="scope">
            <el-tag
              
              :type="scope.row.Opration.ClassName"
            >{{ scope.row.Opration.ArabicOprationDescription }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column width="180" align="center">
          <template slot-scope="scope">
            <el-button
              v-for="(NOprations, index) in scope.row.NextOprations"
              :key="index"
              :type="NOprations.ClassName"
              round
              @click="handleOprationsys(scope.row.Id , NOprations)"
            >{{NOprations.OprationDescription}}</el-button>
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
              <el-table-column prop="Qty" v-bind:label="$t('CashPool.quantity')" align="center"></el-table-column>
              <el-table-column v-bind:label="$t('CashPool.Price')" align="center">
                <template slot-scope="scope">{{(scope.row.SellingPrice).toFixed(3) }}</template>
              </el-table-column>
              <el-table-column v-bind:label="$t('CashPool.Total')" align="center">
                <template
                  slot-scope="scope"
                >{{(scope.row.SellingPrice * scope.row.Qty).toFixed(3) }} JOD</template>
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
        <el-button
          :type="textOpration.ClassName"
          @click="createOprationData()"
        >{{textOpration.OprationDescription}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { GetSaleInvoice } from "@/api/SaleInvoice";
import { ChangeObjStatus } from "@/api/Oprationsys";
import printJS from "print-js";

export default {
  name: "SalesInvoice",
  data() {
    return {
      tableData: [],
      loading: true,
      date: [],
      search: "",
      dialogOprationVisible: false,
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
      },
      textOpration: {
        OprationDescription: "",
        ArabicOprationDescription: "",
        IconClass: "",
        ClassName: ""
      },
      tempOpration: {
        ObjID: undefined,
        OprationID: undefined,
        Description: ""
      },
      rulesOpration: {
        Description: [
          {
            required: true,
            message: "يجب إدخال ملاحظة للعملية",
            trigger: "blur"
          },
          {
            minlength: 5,
            maxlength: 150,
            message: "الرجاء إدخال اسم لا يقل عن 5 حروف و لا يزيد عن 150 حرف",
            trigger: "blur"
          }
        ]
      }
    };
  },
  created() {
    const end = new Date();
    const start = new Date();
    start.setTime(start.getTime() - 3600 * 1000 * 24 * 1);
    this.date = [start, end];
    this.getdata(start, end);
  },
  methods: {
    getdata(datefrom, dateto) {
      this.loading = true;
      datefrom.setHours(0, 0, 0, 0);
      datefrom = JSON.parse(JSON.stringify(datefrom));
      dateto = JSON.parse(JSON.stringify(dateto));
      GetSaleInvoice({
        DateFrom: datefrom,
        DateTo: dateto
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
        })
    },
    print(data) {
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
      })
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
      })
    },
    changeDate() {
      this.loading = true;
      this.getdata(this.date[0], this.date[1]);
    },
    handleOprationsys(ObjID, Opration) {
      this.dialogOprationVisible = true;
      // text
      this.textOpration.OprationDescription = Opration.OprationDescription;
      this.textOpration.ArabicOprationDescription =
        Opration.ArabicOprationDescription;
      this.textOpration.IconClass = Opration.IconClass;
      this.textOpration.ClassName = Opration.ClassName;
      /// temp
      this.tempOpration.ObjID = ObjID;
      this.tempOpration.OprationID = Opration.Id;
      this.tempOpration.Description = "";
    },
    createOprationData() {
      this.$refs["dataOpration"].validate(valid => {
        if (valid) {
          ChangeObjStatus({
            ObjID: this.tempOpration.ObjID,
            OprationID: this.tempOpration.OprationID,
            Description: this.tempOpration.Description
          })
            .then(response => {
              this.getdata(this.date[0], this.date[1]);
              this.dialogOprationVisible = false;
              this.$notify({
                title: "تم  ",
                message: "تمت العملية بنجاح",
                type: 'success',
                duration: 2000
              })
            })
            .catch(error => {
              console.log(error);
            })
        } else {
          console.log("error submit!!");
        }
      })
    }
  }
};
</script>