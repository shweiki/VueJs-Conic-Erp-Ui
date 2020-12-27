<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-button
          style="float: left"
          type="success"
          icon="el-icon-plus"
          @click="handleCreate()"
          >{{ $t("Vendors.Add") }}</el-button
        >
        <el-button
          style="float: left"
          icon="el-icon-printer"
          type="primary"
          @click="print(tableData)"
        ></el-button>
        <span>{{ $t("CashPool.Items") }}</span>
      </div>
      <el-table
        v-loading="loading"
        :data="
          $store.getters.AllItems.filter(
            (data) => !search || data.Name.toLowerCase().includes(search.toLowerCase())
          )
        "
        fit
        border
        max-height="900"
        highlight-current-row
        style="width: 100%"
      >
        <el-table-column prop="Id" width="120">
          <template slot="header" slot-scope="{}">
            <el-button
              type="primary"
              icon="el-icon-refresh"
              @click="getdata()"
            ></el-button>
          </template>
        </el-table-column>
        <el-table-column
          v-bind:label="$t('Items.Barcode')"
          prop="Barcode"
          width="120"
          align="center"
        ></el-table-column>

        <el-table-column prop="Name" align="center">
          <template slot="header" slot-scope="{}">
            <el-input v-model="search" v-bind:placeholder="$t('Items.Item')" />
          </template>
        </el-table-column>
        <el-table-column
          v-bind:label="$t('Items.QuantityInventory')"
          align="center"
          width="220"
        >
          <template slot-scope="scope">
            <item-qty :ItemID="scope.row.Id" />
          </template>
        </el-table-column>
        <el-table-column v-bind:label="$t('Items.Status')" align="center" width="100">
          <template slot-scope="scope">
            <status-tag :Status="scope.row.Status" TableName="Item" />
          </template>
        </el-table-column>
        <!--   <el-table-column width="120" align="center">
          <template slot-scope="scope">
            <el-button v-if="scope.row.Opration.Status!=-1" icon="el-icon-edit" circle @click="handleUpdate(scope.row)">
            </el-button>
            <el-button v-for="(NOprations, index) in scope.row.NextOprations" :key="index" :type="NOprations.ClassName"
              round @click="handleOprationsys(scope.row.Id , NOprations)">{{NOprations.OprationDescription}}</el-button>
          </template>
        </el-table-column>-->
        <el-table-column width="40">
          <template slot-scope="scope">
            <el-button
              icon="el-icon-edit"
              circle
              @click="handleUpdate(scope.row)"
            ></el-button>
          </template>
        </el-table-column>
        <el-table-column type="expand" width="30">
          <template slot-scope="props">
            <el-table :data="[props.row]">
              <el-table-column v-bind:label="$t('Items.Cost')" align="center">
                <template slot-scope="scope">
                  <i class="el-icon-money"></i>
                  {{ scope.row.CostPrice.toFixed(2) }}
                </template>
              </el-table-column>
              <el-table-column v-bind:label="$t('Items.Packeges')" align="center">
                <template slot-scope="scope">
                  <i class="el-icon-money"></i>
                  {{ scope.row.OtherPrice.toFixed(2) }}
                </template>
              </el-table-column>
              <el-table-column v-bind:label="$t('Items.Retail')" align="center">
                <template slot-scope="scope">
                  <i class="el-icon-money"></i>
                  {{ scope.row.SellingPrice.toFixed(2) }}
                </template>
              </el-table-column>
              <el-table-column
                v-bind:label="$t('Items.LowerOrder')"
                prop="LowOrder"
                width="110"
                align="center"
              ></el-table-column>
              <el-table-column
                v-bind:label="$t('Items.Tax')"
                prop="Tax"
                width="100"
                align="center"
              ></el-table-column>
              <el-table-column
                v-bind:label="$t('Items.Rate')"
                prop="Rate"
                width="100"
                align="center"
              ></el-table-column>
              <el-table-column
                v-bind:label="$t('Items.Notes')"
                prop="Description"
                width="150"
                align="center"
              ></el-table-column>
            </el-table>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog
      style="margin-top: -13vh"
      :show-close="false"
      :title="textMapForm[dialogFormStatus]"
      :visible.sync="dialogFormVisible"
    >
      <el-form
        ref="dataForm"
        :rules="rulesForm"
        :model="tempForm"
        label-position="top"
        label-width="70px"
      >
        <!--
        <div class="row">
          <div class="col">
            <el-form-item v-bind:label="$t('Items.Origin')" prop="OriginID">
              <el-select v-model="tempForm.OriginID" filterable placeholder="حدد المنشأ">
                <el-option
                  v-for="item in OriginItems"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="col">
            <el-form-item v-bind:label="$t('Items.Group')" prop="MenuID">
              <el-select v-model="tempForm.MenuID" filterable placeholder="حدد المجموعة">
                <el-option
                  v-for="item in MenuItems"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="col">
            <el-form-item v-bind:label="$t('Items.Unit')" prop="UnitID">
              <el-select v-model="tempForm.UnitID" filterable placeholder="حدد وحدة القياس">
                <el-option
                  v-for="item in UnitItems"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>
        </div>-->
        <el-form-item v-bind:label="$t('Items.ItemName')" prop="Name">
          <el-input type="text" v-model="tempForm.Name"></el-input>
        </el-form-item>
        <el-checkbox v-model="tempForm.IsPrime">اظهار على شاشة المبيعات</el-checkbox>

        <el-row>
          <el-col :span="8">
            <el-form-item v-bind:label="$t('Items.Cost')" prop="CostPrice">
              <el-input-number
                v-model="tempForm.CostPrice"
                :precision="2"
                :step="0.1"
                :min="0.0"
                :max="1500"
              ></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="سعر بيع الموظف" prop="OtherPrice">
              <el-input-number
                v-model="tempForm.OtherPrice"
                :precision="2"
                :step="0.1"
                :min="0.0"
                :max="1500"
              ></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item v-bind:label="$t('Items.SellingPrice')" prop="SellingPrice">
              <el-input-number
                v-model="tempForm.SellingPrice"
                :precision="2"
                :step="0.1"
                :min="0.0"
                :max="1500"
              ></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item v-bind:label="$t('Items.LowerOrder')" prop="LowOrder">
              <el-input-number
                v-model="tempForm.LowOrder"
                :min="1"
                :max="100000000"
              ></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-bind:label="$t('Items.Tax')" prop="Tax">
              <el-input-number
                v-model="tempForm.Tax"
                :precision="2"
                :step="0.01"
                :min="0.01"
                :max="1"
              ></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item v-bind:label="$t('Items.Barcode')" prop="Barcode">
              <el-input v-model="tempForm.Barcode" suffix-icon="fa fa-barcode"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-bind:label="$t('Items.Notes')" prop="Description">
              <el-input type="textarea" v-model="tempForm.Description"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{
          $t("permission.cancel")
        }}</el-button>
        <el-button
          type="primary"
          @click="dialogFormStatus === 'create' ? createData() : updateData()"
          >حفظ</el-button
        >
      </div>
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
import { GetActiveItem, GetItem, CreateItem, Edit } from "@/api/Item";
import printJS from "print-js";
import { ChangeObjStatus } from "@/api/Oprationsys";
import StatusTag from "@/components/Oprationsys/StatusTag";
import ItemQty from "@/components/Item/ItemQty";

export default {
  name: "Item",
  components: { StatusTag, ItemQty },
  data() {
    return {
      tableData: [],
      loading: true,
      dialogFormVisible: false,
      dialogOprationVisible: false,
      dialogFormStatus: "",
      search: "",
      Items: [],
      textMapForm: {
        update: "تعديل",
        create: "إضافة",
      },
      textOpration: {
        OprationDescription: "",
        ArabicOprationDescription: "",
        IconClass: "",
        ClassName: "",
      },
      tempForm: {
        ID: undefined,
        Name: "",
        CostPrice: 0.0,
        SellingPrice: 0.0,
        OtherPrice: 0.0,
        LowOrder: 0,
        Tax: 0.0,
        Rate: 0,
        IsPrime: false,
        Barcode: "",
        Description: "",
      },
      rulesForm: {
        Name: [
          {
            required: true,
            message: "يجب إدخال إسم ",
            trigger: "blur",
          },
          {
            minlength: 3,
            maxlength: 50,
            message: "الرجاء إدخال إسم لا يقل عن 3 أحرف و لا يزيد عن 50 حرف",
            trigger: "blur",
          },
        ],
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
            message: "الرجاء إدخال إسم لا يقل عن 5 أحرف و لا يزيد عن 150 حرف",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    print(data) {
      printJS({
        printable: data,
        properties: ["Barcode", "Name", "SellingPrice", "Description"],
        type: "json",
      });
    },
    getdata() {
      this.loading = true;
      this.tableData = this.$store.getters.AllItems;
      this.loading = false;
      /*
      GetItem().then((response) => {
        // handle success
        console.log(response);
        this.tableData = this.$store.getters.AllItems;
        this.loading = false;
      });*/
    },
    resetTempForm() {
      this.tempForm = {
        ID: undefined,
        Name: "",
        CostPrice: 0.0,
        SellingPrice: 0.0,
        OtherPrice: 0.0,
        LowOrder: 0,
        Tax: 0.0,
        Rate: 0,
        Barcode: "",
        IsPrime: false,
        Description: "",
        Status: 0,
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
      this.tempForm.CostPrice = row.CostPrice;
      this.tempForm.SellingPrice = row.SellingPrice;
      this.tempForm.OtherPrice = row.OtherPrice;
      this.tempForm.LowOrder = row.LowOrder;
      this.tempForm.Tax = row.Tax;
      this.tempForm.Rate = row.Rate;
      this.tempForm.Barcode = row.Barcode;
      this.tempForm.IsPrime = row.IsPrime;

      this.tempForm.Description = row.Description;
      this.dialogFormStatus = "update";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
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
    createData() {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          CreateItem(this.tempForm)
            .then((response) => {
              this.getdata();
              this.dialogFormVisible = false;
              this.$notify({
                title: "تم ",
                message: "تم الإضافة بنجاح",
                type: "success",
                duration: 2000,
              });
            })
            .catch((error) => {
              console.log(error);
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    updateData() {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          Edit(this.tempForm)
            .then((response) => {
              this.getdata();
              this.dialogFormVisible = false;
              this.$notify({
                title: "تم",
                message: "تم التعديل بنجاح",
                type: "success",
                duration: 2000,
              });
            })
            .catch((error) => {
              console.log(error);
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    createOprationData() {
      this.$refs["dataOpration"].validate((valid) => {
        if (valid) {
          console.log(this.tempOpration);
          ChangeObjStatus({
            ObjID: this.tempOpration.ObjID,
            OprationID: this.tempOpration.OprationID,
            Description: this.tempOpration.Description,
          })
            .then((response) => {
              this.getdata();
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
          return false;
        }
      });
    },
  },
  created() {
    this.getdata();
  },
};
</script>
