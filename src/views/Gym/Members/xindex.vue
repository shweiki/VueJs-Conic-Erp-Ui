<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-button
          style="float: left"
          type="success"
          icon="el-icon-plus"
          @click="handleCreate()"
          >{{ $t("Members.Add") }}</el-button
        >
        <span>{{ $t("Members.Member") }}</span>
      </div>
      <el-table
        v-loading="loading"
        :data="
          tableData.filter(
            (data) => !search || data.Name.toLowerCase().includes(search.toLowerCase())
          )
        "
        fit
        border
        max-height="900"
        highlight-current-row
        style="width: 100%"
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
        <el-table-column prop="Name" align="center">
          <template slot="header" slot-scope="{}">
            <el-input v-model="search" v-bind:placeholder="$t('Members.Search')" />
          </template>
        </el-table-column>
        <el-table-column v-bind:label="$t('Account.Credit')" width="120" align="center">
          <template slot-scope="scope">{{ scope.row.TotalCredit.toFixed(3) }}</template>
        </el-table-column>
        <el-table-column
          v-bind:label="$t('Account.Debit')"
          prop="totalDebit"
          width="120"
          align="center"
        >
          <template slot-scope="scope">{{ scope.row.TotalDebit.toFixed(3) }}</template>
        </el-table-column>
        <el-table-column v-bind:label="$t('Account.funds')" width="120" align="center">
          <template slot-scope="scope">{{
            (scope.row.TotalCredit - scope.row.TotalDebit).toFixed(3)
          }}</template>
        </el-table-column>
        <el-table-column v-bind:label="$t('Members.Status')" width="120" align="center">
          <template slot-scope="scope">
            <status-tag :Status="scope.row.Status" TableName="Member" />
          </template>
        </el-table-column>
        <el-table-column width="180" align="center">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.Opration.Status != -1"
              icon="el-icon-edit"
              circle
              @click="handleUpdate(scope.row)"
            ></el-button>
            <el-button
              v-for="(NOprations, index) in scope.row.NextOprations"
              :key="index"
              :type="NOprations.ClassName"
              round
              @click="handleOprationsys(scope.row.Id, NOprations)"
              >{{ NOprations.OprationDescription }}</el-button
            >
          </template>
        </el-table-column>
        <el-table-column type="expand" width="30">
          <template slot-scope="props">
            <el-table :data="[props.row]">
              <el-table-column
                v-bind:label="$t('Members.Address')"
                prop="Address"
                width="120"
                align="center"
              ></el-table-column>
              <el-table-column
                v-bind:label="$t('Members.Email')"
                prop="Email"
                width="140"
              ></el-table-column>
              <el-table-column
                v-bind:label="$t('Members.Phone1')"
                prop="PhoneNumber1"
                width="120"
              ></el-table-column>
              <el-table-column
                v-bind:label="$t('Members.Phone2')"
                prop="PhoneNumber2"
                width="120"
              ></el-table-column>
              <el-table-column
                v-bind:label="$t('Members.DateofBirth')"
                prop="DateofBirth"
                width="110"
              ></el-table-column>
              <el-table-column
                v-bind:label="$t('Members.CreditLimit')"
                prop="CreditLimit"
                width="110"
              ></el-table-column>
              <el-table-column
                v-bind:label="$t('Members.Description')"
                prop="Description"
                width="120"
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
      <el-form :model="tempForm" ref="dataForm" class="demo-form-inline">
        <el-form-item v-bind:label="$t('CashDrawer.Name')" prop="Name">
          <el-input type="text" v-model="tempForm.Name"></el-input>
        </el-form-item>
        <el-form-item
          label="تاريخ ميلاد"
          prop="DateofBirth"
          :rules="[
            { required: true, message: 'لايمكن ترك التاريخ فارغ', trigger: 'blur' },
          ]"
        >
          <el-date-picker
            v-model="tempForm.DateofBirth"
            type="date"
            placeholder="تاريخ ميلاد"
          ></el-date-picker>
        </el-form-item>
        <el-form-item v-bind:label="$t('AddVendors.PhoneNumber1')" prop="PhoneNumber1">
          <el-input type="text" v-model="tempForm.PhoneNumber1"></el-input>
        </el-form-item>
        <el-form-item v-bind:label="$t('AddVendors.PhoneNumber2')" prop="PhoneNumber2">
          <el-input type="text" v-model="tempForm.PhoneNumber2"></el-input>
        </el-form-item>
        <el-form-item v-bind:label="$t('AddVendors.Email')" prop="Email">
          <el-input type="text" v-model="tempForm.Email"></el-input>
        </el-form-item>
        <el-form-item v-bind:label="$t('AddVendors.Description')" prop="Description">
          <el-input type="textarea" v-model="tempForm.Description"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{
          $t("AddVendors.Cancel")
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
import { GetActiveMember, Create, Edit } from "@/api/Member";

import { ChangeObjStatus, GetOprationByTable } from "@/api/Oprationsys";
import StatusTag from "@/components/Oprationsys/StatusTag";

export default {
  name: "Member",
  components: { StatusTag },
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
        create: "إضافة",
      },
      tempForm: {
        ID: undefined,
        Name: "",
        Ssn: "",
        DateofBirth: "",
        Email: "",
        PhoneNumber1: "",
        PhoneNumber2: "",
        Description: "",
        IsPrime: false,
        Type: 7,
      },
      rulesForm: {
        Name: [
          {
            required: true,
            message: "الرجاء ادخال الاسم",
            trigger: "blur",
          },
          {
            minlength: 3,
            maxlength: 50,
            message: "الرجاء إدخال إسم لا يقل عن 3 حروف و لا يزيد عن 50 حرف",
            trigger: "blur",
          },
        ],
      },
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
      GetActiveMember().then((response) => {
        //console.log(response)
        this.tableData = response;
        this.loading = false;
      });
    },

    resetTempForm() {
      this.tempForm = {
        ID: undefined,
        Name: "",
        Ssn: "",
        DateofBirth: "",
        Email: "",
        PhoneNumber1: "",
        PhoneNumber2: "",
        Status: 0,
        Description: "",
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
      this.tempForm.Id = row.Id;
      this.tempForm.Name = row.Name;
      this.tempForm.Email = row.Email;
      this.tempForm.PhoneNumber1 = row.PhoneNumber1;
      this.tempForm.PhoneNumber2 = row.PhoneNumber2;
      this.tempForm.DateofBirth = row.DateofBirth;
      this.tempForm.Description = row.Description;
      this.tempForm.Type = row.Type;
      this.dialogFormStatus = "update";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
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
        }
      });
    },
  },
};
</script>
