<template>
  <div class="app-container">
    <el-card class="box-card">
    <Add-Cheque/>
      <el-table
        v-loading="loading"
        :data="
          tableData.filter(
            (data) => !search || data.Payee.toLowerCase().includes(search.toLowerCase())
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
              type="success"
              icon="el-icon-refresh"
              @click="getdata()"
              :size="$store.getters.size"
            ></el-button>
          </template>
        </el-table-column>
        <el-table-column
          v-bind:label="$t('Classification.Name')"
          prop="Name"
          width="200"
          align="center"
        >
          <template slot="header" slot-scope="{}">
            <el-input v-model="search" v-bind:placeholder="$t('Cheque.Name')" />
          </template>
        </el-table-column>
        <el-table-column
          v-bind:label="$t('Cheque.Payee')"
          prop="Payee"
          width="200"
          align="center"
        ></el-table-column>
        <el-table-column
          v-bind:label="$t('Cheque.BankName')"
          prop="BankName"
          width="300"
          align="center"
        ></el-table-column>

        <el-table-column
          v-bind:label="$t('Cheque.FakeDate')"
          prop="FakeDate"
          width="120"
          align="center"
        ></el-table-column>
        <el-table-column
          v-bind:label="$t('Cheque.ChequeAmount')"
          prop="ChequeAmount"
          width="130"
          align="center"
        ></el-table-column>

        <el-table-column v-bind:label="$t('Items.Status')" align="center" width="100">
          <template slot-scope="scope">
            <Status-Tag :Status="scope.row.Status" TableName="Cheque" />
          </template>
        </el-table-column>
        <el-table-column width="120" align="center" v-bind:label="$t('Cheque.Operation')">
          <template slot-scope="scope">
            <el-button
              v-for="(NOprations, index) in scope.row.NextOprations"
              :key="index"
              :type="NOprations.ClassName"
              :size="$store.getters.size"
              @click="handleOprationsys(scope.row.Id, NOprations)"
              >{{ NOprations.OprationDescription }}</el-button
            >
          </template>
        </el-table-column>
        <el-table-column type="expand" width="30">
          <template slot-scope="props">
            <el-table :data="[props.row]">
              <el-table-column
                v-bind:label="$t('Cheque.PaymentType')"
                prop="PaymentType"
                width="150"
                align="center"
              ></el-table-column>
              <el-table-column
                v-bind:label="$t('Cheque.Currency')"
                prop="Currency"
                width="150"
                align="center"
              ></el-table-column>
              <el-table-column
                v-bind:label="$t('Cheque.ChequeNumber')"
                prop="ChequeNumber"
                width="500"
                align="center"
              ></el-table-column>
              <el-table-column
                v-bind:label="$t('Cheque.BankAddress')"
                prop="BankAddress"
                width="150"
                align="center"
              ></el-table-column>
              <el-table-column
                v-bind:label="$t('Stocks.Description')"
                prop="Description"
                width="200"
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
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item v-bind:label="$t('Cheque.From')" prop="VendorId">
              <el-select
                v-model="tempForm.VendorId"
                filterable
                placeholder="$t('Cheque.From')"
              >
                <el-option
                  v-for="item in Vendors"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-bind:label="$t('Cheque.BankName')" prop="BankName">
              <el-select v-model="tempForm.BankName" filterable placeholder="BankName">
                <el-option
                  v-for="item in BanksNames"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item v-bind:label="$t('Cheque.ChequeAmount')" prop="ChequeAmount">
              <el-input-number
                v-model="tempForm.ChequeAmount"
                :precision="2"
                :step="0.1"
                :min="0.0"
                :max="1500"                            @focus="$event.target.select()"

              ></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              prop="FakeDate"
              v-bind:label="$t('Cheque.FakeDate')"
              :rules="[
                { required: true, message: 'لايمكن ترك التاريخ فارغ', trigger: 'blur' },
              ]"
            >
              <el-date-picker
                v-model="tempForm.FakeDate"
                type="date"
                v-bind:placeholder="$t('NewPurchaseInvoice.Date')"
                :format="$store.getters.settings.DateTimeFormat"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item v-bind:label="$t('Cheque.ChequeNumber')" prop="ChequeNumber">
          <el-input type="text" v-model="tempForm.ChequeNumber"></el-input>
        </el-form-item>
        <el-form-item v-bind:label="$t('Cheque.Payee')" prop="Payee">
          <el-input type="text" v-model="tempForm.Payee"></el-input>
        </el-form-item>
        <el-form-item v-bind:label="$t('Cheque.Currency')" prop="Currency">
          <el-input type="text" v-model="tempForm.Currency"></el-input>
        </el-form-item>
        <el-form-item v-bind:label="$t('Cheque.PaymentType')" prop="PaymentType">
          <el-input type="text" v-model="tempForm.PaymentType"></el-input>
        </el-form-item>

        <el-form-item v-bind:label="$t('Cheque.BankAddress')" prop="BankAddress">
          <el-input type="textarea" v-model="tempForm.BankAddress"></el-input>
        </el-form-item>
        <el-form-item v-bind:label="$t('Items.Notes')" prop="Description">
          <el-input type="textarea" v-model="tempForm.Description"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{
          $t("Classification.cancel")
        }}</el-button>
        <el-button
          type="primary"
          @click="dialogFormStatus === 'create' ? createData() : updateData()"
          >{{ $t("AddVendors.Save") }}</el-button
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
        <el-form-item
          v-bind:label="$t('Classification.OperationNote')"
          prop="Description"
        >
          <el-input type="textarea" v-model="tempOpration.Description"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogOprationVisible = false">{{
          $t("Classification.cancel")
        }}</el-button>
        <el-button :type="textOpration.ClassName" @click="createOprationData()">{{
          textOpration.OprationDescription
        }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { GetCheques, Create } from "@/api/Cheque";
import { GetVendor, GetVendorCheque } from "@/api/Vendor";
import { ChangeObjStatus } from "@/api/Oprationsys";
import StatusTag from "@/components/Oprationsys/StatusTag";
import AddCheque from "@/components/Add/AddCheque";
export default {
  name: "Cheque",
  components: { StatusTag, AddCheque },
  data() {
    return {
      tableData: [],
      loading: true,
      dialogFormVisible: false,
      dialogOprationVisible: false,
      dialogFormStatus: "",
      search: "",
      Vendors: [],
 
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
        Id: undefined,
        BankAddress: "",
        BankName: "",
        ChequeAmount: "",
        FakeDate: new Date(),
        Payee: "",
        PaymentType: "",
        ChequeNumber: "",
        Currency: "",
        Description: "",
        IsPrime: false,
        VendorId: undefined,
      },
      rulesForm: {
        ChequeNumber: [
          {
            required: true,
            message: "يجب إدخال إسم ",
            trigger: "blur",
          },
          {
            min: 3,
            max: 50,
            message: "الرجاء إدخال إسم لا يقل عن 3 أحرف و لا يزيد عن 50 حرف",
            trigger: "blur",
          },
        ],
      },
      tempOpration: {
        ObjId: undefined,
        OprationId: undefined,
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
            min: 5,
            max: 150,
            message: "الرجاء إدخال إسم لا يقل عن 5 احرف و لا يزيد عن 150 حرف",
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
      GetCheques()
        .then((response) => {
          // handle success
          console.log(response);
          this.tableData = response;
          this.loading = false;
        })
        .catch((error) => {
          // handle error
          console.log(error);
        });

 
    },
    resetTempForm() {
      this.tempForm = {
        Id: undefined,
        BankAddress: "",
        BankName: "",
        ChequeAmount: "",
        FakeDate: new Date(),
        Payee: "",
        PaymentType: "",
        ChequeNumber: "",
        Currency: "",
        Description: "",
        IsPrime: false,
        VendorId: undefined,
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
    // handleUpdate(row) {
    //   console.log(row);
    //   this.tempForm.Id = row.Id;
    //   this.tempForm.BankName = row.BankName;
    //   this.tempForm.Description = row.Description;
    //   this.dialogFormStatus = "update";
    //   this.dialogFormVisible = true;
    //   this.$nextTick(() => {
    //     this.$refs["dataForm"].clearValidate();
    //   })
    // },
    handleOprationsys(ObjId, Opration) {
      this.dialogOprationVisible = true;
      // text
      this.textOpration.OprationDescription = Opration.OprationDescription;
      this.textOpration.ArabicOprationDescription = Opration.ArabicOprationDescription;
      this.textOpration.IconClass = Opration.IconClass;
      this.textOpration.ClassName = Opration.ClassName;
      /// temp
      this.tempOpration.ObjId = ObjId;
      this.tempOpration.OprationId = Opration.Id;
      this.tempOpration.Description = "";
    },
    createData() {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          Create(this.tempForm)
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
            ObjId: this.tempOpration.ObjId,
            OprationId: this.tempOpration.OprationId,
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
};
</script>
