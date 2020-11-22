<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span class="demonstration">{{ $t('Stocks.SearchBy') }}</span>

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
          style="width:70%"
          @change="changeDate"
        ></el-date-picker>
        <!-- <el-button 
              style="float: left; "
              icon="el-icon-printer"
              type="primary"
              @click="printAll(tableData)"
        ></el-button>-->
        <router-link
          class="pan-btn tiffany-btn"
          style="float: left ; "
          icon="el-icon-plus"
          to="/NewStock"
        >{{ $t('route.NewStock') }}</router-link>
      </div>
      <el-table
        v-loading="loading"
        :data="tableData.filter(data => !search || data.FakeDate.toLowerCase().includes(search.toLowerCase()))"
        fit
        border
        max-height="900"
        highlight-current-row
        style="width: 100%"
      >
        <el-table-column prop="id" width="120" align="center">
          <template slot="header" slot-scope="{}">
            <el-button type="primary" icon="el-icon-refresh" @click="changeDate"></el-button>
          </template>
        </el-table-column>
        <el-table-column
          prop="FakeDate"
          v-bind:label="$t('Stocks.Date')"
          width="120"
          align="center"
        ></el-table-column>
        <el-table-column prop="description" v-bind:label="$t('Stocks.BondType')" align="center"></el-table-column>
        <el-table-column v-bind:label="$t('Stocks.Status')" width="120" align="center">
          <template slot-scope="scope">
            <el-tag
              :type="scope.row.Opration.ClassName"
            >{{ scope.row.Opration.ArabicOprationDescription }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column width="200" align="center">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.Opration.Status!=-1"
              type="success"
              circle
              @click="ConvertToOrderInventory(scope.row)"
            >ترصيد</el-button>

            <el-button
              v-for="(NOprations, index) in scope.row.NextOprations"
              :key="index"
              :type="NOprations.ClassName"
              round
              @click="handleOprationsys(scope.row.id , NOprations)"
            >{{NOprations.OprationDescription}}</el-button>

            <el-button
              icon="el-icon-printer"
              type="primary"
              @click="print(scope.row.StockMovements)"
            ></el-button>
          </template>
        </el-table-column>
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-table :data="props.row.StockMovements">
              <el-table-column prop="Barcode" v-bind:label="$t('Stocks.Barcode')" width="130"></el-table-column>
              <el-table-column prop="name" v-bind:label="$t('Stocks.Items')" width="130"></el-table-column>
              <el-table-column prop="Qty" v-bind:label="$t('Stocks.Quantity')"></el-table-column>
              <el-table-column prop="InventoryName" v-bind:label="$t('Stocks.Store')"></el-table-column>
              <el-table-column prop="description" v-bind:label="$t('Stocks.Description')"></el-table-column>
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
        <el-form-item label="ملاحظات للعملية " prop="description">
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
import { GetStockInventory } from "@/api/StockInventory";
import { Create } from "@/api/OrderInventory";
import { ChangeObjStatus ,ChangeObjStatusByTableName } from "@/api/Oprationsys";
import printJS from "print-js";

export default {
  name: "StockItem",
  data() {
    return {
      tableData: [],
      Movements: [],
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
    start.setTime(start.getTime() - 3600 * 1000 * 24 * 365);
    this.date = [start, end];
    this.getdata(start, end);
  },
  methods: {
    print(data) {
      console.log(data);
      printJS({
        printable: data,
        properties: ["Barcode", "Name", "Qty"],
        type: "json"
      });
    },
    printAll(data) {
      console.log(data);
      data = data.map(Item => ({
        Name: Item.name,
        Qty: Item.Qty,
        Barcode: Item.Barcode
      }));
      printJS({
        printable: data,
        properties: ["Barcode", "Name", "Qty"],
        type: "json"
      });
    },
    ConvertToOrderInventory(StockInventory) {
      console.log(StockInventory);
      const tempForm = {
        ID: undefined,
        FakeDate: JSON.parse(JSON.stringify(new Date())),
        OrderType: "إدخال ناتج عن جرد رقم " + StockInventory.id + "",
        Description: "" + StockInventory.Description + "",
        InventoryMovements: []
      };
      StockInventory.StockMovements.forEach(i => {
        tempForm.InventoryMovements.push({
          ID: undefined,
          ItemsID: i.ItemsID,
          TypeMove: "In",
          Status: 0,
          Qty: i.Qty,
          SellingPrice: 0,
          Tax: 0.0,
          Description: i.Description,
          InventoryItemID: i.InventoryItemID,
          OrderInventoryID: undefined
        });
      });
      console.log(tempForm);

      Create(tempForm)
        .then(response => {
          ChangeObjStatusByTableName({
            ObjID: StockInventory.id,
            TableName: "StocktakingInventory",
            Status: -1,
            Description: "ترصيد جرد"
          }).then(response => {
            console.log(response);
          });

          this.$notify({
            title: "تم الإضافة بنجاح",
            message: "تم الإضافة بنجاح",
            type: "success",
            position: "top-left",
            duration: 1000,
            showClose: false,
            onClose: () => {
              Object.assign(this.$data, this.$options.data());
            }
          });
        })
        .catch(error => {
          console.log(error);
        });
    },
    getdata(datefrom, dateto) {
      this.loading = true;
      datefrom.setHours(0, 0, 0, 0);
      datefrom = JSON.parse(JSON.stringify(datefrom));
      dateto = JSON.parse(JSON.stringify(dateto));
      GetStockInventory({
        DateFrom: datefrom,
        DateTo: dateto
      }).then(response => {
        console.log(response);
        this.tableData = response;
        this.Movements = response.StockMovements;
        this.loading = false;
      });
    },
    changeDate() {
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
      this.tempOpration.OprationID = Opration.id;
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
                type: "success",
                duration: 2000
              });
            })
            .catch(error => {
              console.log(error);
            });
        } else {
          console.log("error submit!!");
        }
      });
    }
  }
};
</script>