<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-button
          style="float: left"
          type="success"
          icon="el-icon-plus"
          @click="handleCreate()"
        >{{ $t('Vendors.Add') }}</el-button>
        <span>{{ $t('Vendors.Vendor') }}</span>
      </div>
      <el-table
        v-loading="loading"
        :data="tableData.filter(data => !search || data.name.toLowerCase().includes(search.toLowerCase()))"
        fit
        border
        max-height="900"
        highlight-current-row
        style="width: 100%"
      >
        <el-table-column label="#" prop="id" width="120" align="center">
          <template slot="header" slot-scope="{}">
            <el-button type="primary" icon="el-icon-refresh" @click="getdata()"></el-button>
          </template>
        </el-table-column>
        <el-table-column prop="name" align="center">
          <template slot="header" slot-scope="{}">
            <el-input v-model="search" v-bind:placeholder="$t('Vendors.Search')" />
          </template>
        </el-table-column>
        <el-table-column v-bind:label="$t('Accounting.Credit')" width="120" align="center">
          <template slot-scope="scope">{{(scope.row.totalCredit).toFixed(3) }}</template>
        </el-table-column>
        <el-table-column
          v-bind:label="$t('Accounting.Debit')"
          prop="totalDebit"
          width="120"
          align="center"
        >
          <template slot-scope="scope">{{(scope.row.totalDebit).toFixed(3) }}</template>
        </el-table-column>
        <el-table-column v-bind:label="$t('Accounting.funds')" width="120" align="center">
          <template
            slot-scope="scope"
          >{{ (scope.row.totalCredit - scope.row.totalDebit).toFixed(3) }}</template>
        </el-table-column>
        <el-table-column v-bind:label="$t('Vendors.Status')" width="120" align="center">
          <template slot-scope="scope">
            <el-tag
              :type="scope.row.status"
            >{{ scope.row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column width="120">
          <template slot-scope="scope" v-if="scope.row.id !=1">
            <el-button
              icon="el-icon-edit"
              circle
              @click="handleUpdate(scope.row)"
            ></el-button>
          </template>
        </el-table-column>
        <el-table-column type="expand" width="30">
          <template slot-scope="scope" v-if="scope.row.id !=1">
            <el-table :data="[scope.row]">
              <el-table-column
                v-bind:label="$t('Vendors.Address')"
                prop="Address"
                width="200"
                align="center"
              ></el-table-column>
              <el-table-column
                v-bind:label="$t('Vendors.Email')"
                prop="email"
                width="200"
                align="center"
              ></el-table-column>
              <el-table-column
                v-bind:label="$t('Vendors.Phone1')"
                prop="phoneNumber1"
                width="150"
                align="center"
              ></el-table-column>
              <el-table-column
                v-bind:label="$t('Vendors.Phone2')"
                prop="phoneNumber2"
                width="150"
                align="center"
              ></el-table-column>
              <el-table-column
                v-bind:label="$t('Vendors.Fax')"
                prop="fax"
                width="110"
                align="center"
              ></el-table-column>
              <el-table-column
                v-bind:label="$t('Vendors.CreditLimit')"
                prop="creditLimit"
                width="110"
                align="center"
              ></el-table-column>
              <el-table-column
                v-bind:label="$t('Vendors.Description')"
                prop="description"
                align="center"
              ></el-table-column>
            </el-table>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog
      style="margin-top: -13vh"
      width="65%"
      :show-close="false"
      :title="textMapForm[dialogFormStatus]"
      :visible.sync="dialogFormVisible"
    >
      <el-form
        :model="tempForm"
        :rules="rulesForm"
        ref="dataForm"
        label-position="top"
        label-width="70px"
      >
        <div>
          <el-radio v-model="tempForm.Type" label="Customer" border>{{ $t('AddVendors.Customer') }}</el-radio>
          <el-radio v-model="tempForm.Type" label="Supplier" border>{{ $t('AddVendors.Supplier') }}</el-radio>
        </div>
        <el-form-item v-bind:label="$t('AddVendors.name')" prop="name">
          <el-input type="text" v-model="tempForm.name"></el-input>
        </el-form-item>
        <el-form-item v-bind:label="$t('AddVendors.CreditLimit')" prop="CreditLimit">
          <el-input-number
            v-model="tempForm.CreditLimit"
            :precision="2"
            :step="1"
            :min="0.00"
            :max="10000000"
          ></el-input-number>
        </el-form-item>
        <el-form-item v-bind:label="$t('AddVendors.Fax')" prop="Fax">
          <el-input type="text" v-model="tempForm.fax"></el-input>
        </el-form-item>
        <el-form-item v-bind:label="$t('AddVendors.phoneNumber1')" prop="phoneNumber1">
          <el-input type="text" v-model="tempForm.phoneNumber1"></el-input>
        </el-form-item>
        <el-form-item v-bind:label="$t('AddVendors.PhoneNumber2')" prop="PhoneNumber2">
          <el-input type="text" v-model="tempForm.phoneNumber2"></el-input>
        </el-form-item>
        <el-form-item v-bind:label="$t('AddVendors.Email')" prop="Email">
          <el-input type="text" v-model="tempForm.email"></el-input>
        </el-form-item>
        <el-form-item v-bind:label="$t('AddVendors.Address')" prop="Address">
          <el-input type="text" v-model="tempForm.address"></el-input>
        </el-form-item>
        <el-form-item v-bind:label="$t('AddVendors.Description')" prop="description">
          <el-input type="textarea" v-model="tempForm.description"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{$t('AddVendors.Cancel')}}</el-button>
        <el-button
          type="primary"
          @click="dialogFormStatus==='create'?createData():updateData()"
        >{{$t('AddVendors.Save')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { GetVendor, Create, Edit } from "@/api/Vendor";
import { ChangeObjStatus } from "@/api/Oprationsys";

export default {
  name: "Vendor",
  data() {
    return {
      tableData: [],
      loading: true,
      dialogFormVisible: false,
      dialogOprationVisible: false,
      dialogFormStatus: "",
      search: "",
      textMapForm: {
        update: "تعديل",
        create: "إضافة"
      },
      tempForm: {
        ID: undefined,
        Name: "",
        Address: "",
        Email: "",
        phoneNumber1: "0096278",
        PhoneNumber2: "0096279",
        Fax: "0",
        CreditLimit: 0.0,
        Description: "",
        IsPrime: false,
        Type: "Customer"
      },
      rulesForm: {
        Name: [
          {
            required: true,
            message: "الرجاء ادخال الاسم",
            trigger: "blur"
          },
          {
            minlength: 3,
            maxlength: 50,
            message: "الرجاء إدخال إسم لا يقل عن 3 حروف و لا يزيد عن 50 حرف",
            trigger: "blur"
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
    this.getdata();
  },
  methods: {
    getdata() {
      this.loading = true;
      GetVendor().then(response => {
        //console.log(response);
        this.tableData = response;
        this.loading = false;
      });
    },
    resetTempForm() {
      this.tempForm = {
        ID: undefined,
        Name: "",
        Address: "",
        Email: "",
        phoneNumber1: "",
        PhoneNumber2: "",
        Fax: "0",
        CreditLimit: 0.0,
        Description: "",
        IsPrime: false,
        Type: "Customer"
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
      this.tempForm.id = row.id;
      this.tempForm.name = row.name;
      this.tempForm.Address = row.Address;
      this.tempForm.Email = row.Email;
      this.tempForm.phoneNumber1 = row.phoneNumber1;
      this.tempForm.PhoneNumber2 = row.PhoneNumber2;
      this.tempForm.Fax = row.Fax;
      this.tempForm.CreditLimit = row.CreditLimit;
      this.tempForm.Description = row.Description;
      this.tempForm.Type = row.Type;
      this.dialogFormStatus = "update";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    createData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          Create(this.tempForm)
            .then(response => {
              this.getdata();
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
        }
      });
    }
  }
};
</script>