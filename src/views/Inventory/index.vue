<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <!-- <el-button
          style="float: left"
          type="success"
          icon="el-icon-plus"
          @click="handleCreate()"
          >{{ $t("Vendors.Add") }}</el-button
        > -->
        <Add-Inventory/>
        <span>{{ $t("Inventory.Wharehouse") }}</span>
      </div>
      <el-table
        v-loading="loading"
        :data="
          tableData.filter(
            data =>
              !search || data.Name.toLowerCase().includes(search.toLowerCase())
          )
        "
        fit
        border
        max-height="900"
        highlight-current-row
        style="width: 100%"
      >
        <el-table-column prop="Id" width="80" align="center">
          <template slot="header" slot-scope="{}">
            <el-button
              type="primary"
              icon="el-icon-refresh"
              @click="getdata()"
            ></el-button>
          </template>
        </el-table-column>
        <el-table-column
          v-bind:label="$t('Inventory.StoreName')"
          prop="Name"
          align="center"
        >
          <template slot="header" slot-scope="{}">
            <el-input
              v-model="search"
              v-bind:placeholder="$t('Inventory.StoreName')"
            />
          </template>
        </el-table-column>
        <el-table-column
          v-bind:label="$t('Inventory.Date')"
          prop="ActionLogs[0].PostingDateTime"
          align="center"
        ></el-table-column>
        <el-table-column
          v-bind:label="$t('Items.Notes')"
          prop="Description"
          width="220"
          align="center"
        ></el-table-column>
        <el-table-column
          v-bind:label="$t('Items.Status')"
          width="120"
          align="center"
        >
          <template slot-scope="scope">
            <Status-Tag :Status="scope.row.Status" TableName="InventoryItem" />
          </template>
        </el-table-column>

        <el-table-column width="200">
          <template slot-scope="scope">
            <el-col :span="8">
              <el-button
                icon="el-icon-edit"
                circle
                @click="handleUpdate(scope.row)"
              ></el-button>
            </el-col>
            <el-col :span="8">
              <Next-Oprations
                :ObjId="scope.row.Id"
                :Status="scope.row.Status"
                TableName="InventoryItem"
                @Done="handleFilter"
              />
            </el-col>
            <el-col :span="8">
              <el-button
                :loading="LoadingInventoryQty"
                icon="el-icon-printer"
                type="primary"
                @click="print(scope.row.InventoryQty, scope.row.Name)"
              ></el-button>
            </el-col>
          </template>
        </el-table-column>
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-table :data="props.row.InventoryQty">
              <el-table-column
                prop="Item.Barcode"
                v-bind:label="$t('Stocks.Barcode')"
                width="130"
                align="center"
              ></el-table-column>
              <el-table-column
                prop="Item.Name"
                v-bind:label="$t('Stocks.Items')"
                width="130"
                align="center"
              ></el-table-column>
              <el-table-column
                v-bind:label="$t('Stocks.Quantity')"
                align="center"
              >
                <template slot-scope="scope">
                  <el-tag style="font-size: x-large">{{
                    scope.row.QtyIn - scope.row.QtyOut
                  }}</el-tag>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
   <el-dialog
      style="margin-top: -13vh"
      :show-close="false"
      :visible.sync="dialogFormVisible"
    >
      <div slot="title" class="dialog-footer">
        <el-col :span="4">
          <el-button
            icon="el-icon-finished"
            style="float: left"
            type="primary"
            @click="updateData()"
          />
        </el-col>
        <el-col :span="20">
          <el-divider> إضافة مخزن </el-divider>
        </el-col>
      </div>
      <el-form
        ref="dataForm"
        :rules="rulesForm"
        :model="tempForm"
        label-position="top"
        label-width="70px"
      >
        <el-form-item v-bind:label="$t('Inventory.StoreName')" prop="Name">
          <el-input type="text" v-model="tempForm.Name"></el-input>
        </el-form-item>
        <el-form-item
          v-bind:label="$t('OrderInventories.Notes')"
          prop="Description"
        >
          <el-input type="textarea" v-model="tempForm.Description"></el-input>
        </el-form-item>
      </el-form>
      <!-- <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">الغاء</el-button>
        <el-button
          type="primary"
          @click="dialogFormStatus === 'create' ? createData() : updateData()"
          >حفظ</el-button
        >
      </div>  -->
    </el-dialog>
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
        <el-form-item
          v-bind:label="$t('Inventory.OperationNote')"
          prop="Description"
        >
          <el-input
            type="textarea"
            v-model="tempOpration.Description"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button
          :type="textOpration.ClassName"
          @click="createOprationData()"
          >{{ textOpration.OprationDescription }}</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { GetInventoryItem, Create, Edit } from "@/api/InventoryItem";
import { ChangeObjStatus } from "@/api/Oprationsys";
import printJS from "print-js";
import StatusTag from "@/components/Oprationsys/StatusTag";
import { InventoryQty } from "@/api/InventoryItem";
import NextOprations from "@/components/Oprationsys/NextOprations";
import AddInventory from "@/components/Add/AddInventory.vue"

export default {
  name: "InventoryItem",
  components: { StatusTag, NextOprations, AddInventory },

  data() {
    return {
      tableData: [],
      loading: true,
      dialogFormVisible: false,
      dialogOprationVisible: false,
      dialogFormStatus: "",
      search: "",
      LoadingInventoryQty: true,
      textMapForm: {
        update: "تعديل",
        create: "إضافة"
      },
      tempForm: {
        Id: undefined,
        Name: "",
        Description: ""
      },
      textOpration: {
        OprationDescription: "",
        ArabicOprationDescription: "",
        IconClass: "",
        ClassName: ""
      },
   
      tempOpration: {
        ObjId: undefined,
        OprationId: undefined,
        Description: ""
      },
            rulesForm: {
        Name: [
          {
            required: true,
            message: "يجب إدخال إسم ",
            trigger: "blur"
          },
          {
            minlength: 3,
            maxlength: 50,
            message: "الرجاء إدخال إسم لا يقل عن 3 أحرف و لا يزيد عن 50 حرف",
            trigger: "blur"
          }
        ]
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
            message: "الرجاء إدخال إسم لا يقل عن 5 أحرف و لا يزيد عن 150 حرف",
            trigger: "blur"
          }
        ]
      }
    };
  },
  created() {
    this.getdata();
  },
  methods: {
     resetTempForm() {
      this.tempForm = {
        Id: undefined,
        Name: "",
        Description: ""
      };
    },
         createData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          console.log(this.tempForm);
          Create(this.tempForm)
            .then(response => {
              this.dialogFormVisible = false;
              this.$notify({
                title: "تم ",
                message: "تم الإضافة بنجاح",
                type: "success",
                duration: 2000
              });
            })
            .catch(error => {
              console.log(error);
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    print(InventoryQty, name) {
      let Items = InventoryQty.map(Item => ({
        Name: Item.Item.Name,
        Qty: Item.QtyIn - Item.QtyOut,
        CostPrice: Item.Item.CostPrice,
        Total: (Item.QtyIn - Item.QtyOut) * Item.Item.CostPrice
      }));
      printJS({
        printable: Items,
        properties: ["Total", "CostPrice", "Qty", "Name"],
        type: "json",
        header:
          "<center> <h2> " +
          name +
          "</h2></center><h3 style='float:right'> " +
          " - الاجمالي لقيمة المخزون :  " +
          Items.reduce((a, b) => a + b.Qty * b.CostPrice, 0).toFixed(
            this.$store.getters.settings.ToFixed
          ) +
          "</h3>",
        gridHeaderStyle: "color: red;  border: 2px solid #3971A5;",
        gridStyle: "border: 2px solid #3971A5; text-align: center;"
      });
    },
    getdata() {
      this.loading = true;
      GetInventoryItem()
        .then(response => {
          // handle success
          this.tableData = response;
          this.tableData.forEach(element => {
            InventoryQty({ Id: element.Id }).then(response => {
              element.InventoryQty = response;
              this.LoadingInventoryQty = false;
            });
          });
          this.loading = false;
        })
        .catch(error => {
          // handle error
          console.log(error);
        });
    },
    resetTempForm() {
      this.tempForm = {
        Id: undefined,
        Name: "",
        Description: ""
      };
    },
    handleCreate() {
      this.resetTempForm();
      this.dialogFormStatus = "create";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    handleUpdate(row) {
      console.log(row);
      this.tempForm.Id = row.Id;
      this.tempForm.Name = row.Name;
      this.tempForm.Description = row.Description;
      this.dialogFormStatus = "update";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    handleOprationsys(ObjId, Opration) {
      this.dialogOprationVisible = true;
      // text
      this.textOpration.OprationDescription = Opration.OprationDescription;
      this.textOpration.ArabicOprationDescription =
        Opration.ArabicOprationDescription;
      this.textOpration.IconClass = Opration.IconClass;
      this.textOpration.ClassName = Opration.ClassName;
      /// temp
      this.tempOpration.ObjId = ObjId;
      this.tempOpration.OprationId = Opration.Id;
      this.tempOpration.Description = "";
    },
 
    updateData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          Edit(this.tempForm)
            .then(response => {
              this.getdata();
              this.dialogFormVisible = false;
              this.$notify({
                title: "تم",
                message: "تم التعديل بنجاح",
                type: "success",
                duration: 2000
              });
            })
            .catch(error => {
              console.log(error);
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    createOprationData() {
      this.$refs["dataOpration"].validate(valid => {
        if (valid) {
          console.log(this.tempOpration);
          ChangeObjStatus({
            ObjId: this.tempOpration.ObjId,
            OprationId: this.tempOpration.OprationId,
            Description: this.tempOpration.Description
          })
            .then(response => {
              this.getdata();
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
          return false;
        }
      });
    }
  }
};
</script>
