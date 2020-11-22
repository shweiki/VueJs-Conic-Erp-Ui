<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-button
          style="float: left"
          type="success"
          icon="el-icon-plus"
          @click="handleCreate()"
        >{{ $t('Classification.Add') }}</el-button>
        <span>{{ $t('Account.Account') }}</span>
      </div>
      <el-table
        v-loading="loading"
        :data="tableData.filter(data => !search || data.name.toLowerCase().includes(search.toLowerCase()))"
        fit
        max-height="700"
        highlight-current-row
        style="width: 100%"
      >
        <el-table-column label="#" prop="id" width="50"></el-table-column>
        <el-table-column prop="Code" width="60">
          <template slot="header" slot-scope="{}">
            <el-button circle type="success" icon="el-icon-refresh" @click="getdata()" size="small"></el-button>
          </template>
        </el-table-column>
        <el-table-column prop="name" align="center">
          <template slot="header" slot-scope="{}">
            <el-input v-model="search" v-bind:placeholder="$t('Account.name')" />
          </template>
        </el-table-column>
        <el-table-column
          v-bind:label="$t('Account.MainAccount')"
          prop="Type"
          width="150"
        ></el-table-column>

        <el-table-column
          v-bind:label="$t('Account.Credit')"
          prop="totalCredit"
          width="100"
          align="center"
        >
          <template slot-scope="scope">{{(scope.row.totalCredit).toFixed(3) }}</template>
        </el-table-column>
        <el-table-column
          v-bind:label="$t('Account.Debit')"
          prop="totalDebit"
          width="100"
          align="center"
        >
          <template slot-scope="scope">{{(scope.row.totalDebit).toFixed(3) }}</template>
        </el-table-column>
        <el-table-column v-bind:label="$t('Account.funds')" width="100" align="center">
          <template
            slot-scope="scope"
          >{{ (scope.row.totalCredit - scope.row.totalDebit).toFixed(3)}}</template>
        </el-table-column>
        <el-table-column v-bind:label="$t('Account.Status')" align="center" width="70">
          <template slot-scope="scope">
            <el-tag
              size="medium"
              :type="scope.row.Opration.ClassName"
            >{{ scope.row.Opration.ArabicOprationDescription }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="right" width="200">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.Opration.Status!=-1"
              icon="el-icon-edit"
              size="mini"
              circle
              @click="handleUpdate(scope.row)"
            ></el-button>
            <el-button
              v-for="(NOprations, index) in scope.row.NextOprations"
              :key="index"
              :type="NOprations.ClassName"
              size="mini"
              round
              @click="handleOprationsys(scope.row.id , NOprations)"
            >{{NOprations.OprationDescription}}</el-button>
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
        <el-form-item v-bind:label="$t('Account.AccType')" prop="Type">
          <el-select v-model="tempForm.Type" filterable placeholder="الحسابات الرئيسية">
            <el-option
              v-for="item in TypeAccounts"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-bind:label="$t('Account.AccName')" prop="name">
          <el-input type="text" v-model="tempForm.name"></el-input>
        </el-form-item>
        <el-form-item v-bind:label="$t('Account.Code')" prop="Code">
          <el-input type="text" v-model="tempForm.Code"></el-input>
        </el-form-item>
        <el-form-item v-bind:label="$t('Account.Notes')" prop="description">
          <el-input type="textarea" v-model="tempForm.Description"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{ $t('Account.cancel') }}</el-button>
        <el-button
          type="primary"
          @click="dialogFormStatus==='create'?createData():updateData()"
        >{{ $t('Account.Save') }}</el-button>
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
        <el-form-item v-bind:label="$t('Classification.OperationNote')" prop="description">
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
import { GetAccount, Create, Edit } from "@/api/Account";
import { ChangeObjStatus } from "@/api/Oprationsys";
export default {
  name: "TableAccount",
  data() {
    return {
      loading: true,
      dialogFormVisible: false,
      dialogOprationVisible: false,
      dialogFormStatus: "",
      tableData: [],
      TypeAccounts: [
        {
          label: "حساب",
          value: "Vendor"
        },
                {
          label: "خزينة كاش",
          value: "Cash"
        },
      ],
      search: "",
      textMapForm: {
        update: "تعديل",
        create: "إضافة"
      },
      textOpration: {
        OprationDescription: "",
        ArabicOprationDescription: "",
        IconClass: "",
        ClassName: ""
      },
      tempForm: {
        ID: undefined,
        Name: "",
        Status: 0,
        Code: "",
        Type: undefined,
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
            message: "الرجاء إدخال إسم لا يقل عن 3 احرف و لا يزيد عن 50 حرف",
            trigger: "blur"
          }
        ]
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
    getdata() {
      this.loading = true;
      GetAccount()
        .then(response => {
          // handle success
          console.log(response);
          this.tableData = response.Accounts;
          this.loading = false;
        })
        .catch(error => {
          // handle error
          console.log(error);
        });
    },
    resetTempForm() {
      this.tempForm = {
        ID: undefined,
        Name: "",
        Status: 0,
        Code: "",
        Type: undefined,
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
      this.tempForm.id = row.id;
      this.tempForm.name = row.name;
      this.tempForm.Status = row.Status;
      this.tempForm.Code = row.Code;
      this.tempForm.Type = row.Parent.id;
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
      this.textOpration.ArabicOprationDescription =
        Opration.ArabicOprationDescription;
      this.textOpration.IconClass = Opration.IconClass;
      this.textOpration.ClassName = Opration.ClassName;
      /// temp
      this.tempOpration.ObjID = ObjID;
      this.tempOpration.OprationID = Opration.id;
      this.tempOpration.Description = "";
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
    createOprationData() {
      this.$refs["dataOpration"].validate(valid => {
        if (valid) {
          console.log(this.tempOpration);
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
          return false;
        }
      });
    }
  }
};
</script>