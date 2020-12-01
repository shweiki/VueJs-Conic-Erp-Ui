<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-button
          style="float: left"
          type='success'
          icon="el-icon-plus"
          @click="handleCreate()"
        >{{ $t('Classification.Add') }}</el-button>
        <span>{{ $t('CashDrawer.CashDrawer') }}</span>
      </div>
      <el-table
        v-loading="loading"
        :data="tableData.filter(data => !search || data.Name.toLowerCase().includes(search.toLowerCase()))"
        fit
        border
        max-height="900"
        highlight-current-row
        style="width: 100%"
      >
        <el-table-column prop="Id" width="80" align="center">
          <template slot="header" slot-scope="{}">
            <el-button circle type='success' icon="el-icon-refresh" @click="getdata()" size="small"></el-button>
          </template>
        </el-table-column>
        <el-table-column
          v-bind:label="$t('CashDrawer.CashNumber')"
          prop="Name"
          width="200"
          align="center"
        >
          <template slot="header" slot-scope="{}">
            <el-input v-model="search" v-bind:placeholder="$t('CashDrawer.Name')" />
          </template>
        </el-table-column>
        <el-table-column
          v-bind:label="$t('CashDrawer.PCIP')"
          prop="PCIP"
          width="200"
          align="center"
        ></el-table-column>
        <el-table-column
          v-bind:label="$t('CashDrawer.BTCash')"
          prop="BTCash"
          width="120"
          align="center"
        ></el-table-column>
        <el-table-column
          v-bind:label="$t('Stocks.Description')"
          prop="Description"
          width="120"
          align="center"
        ></el-table-column>
        <el-table-column v-bind:label="$t('Items.Status')" align="center" width="100">
          <template slot-scope="scope">
            <el-tag
              size="medium"
              :type="scope.row.Opration.ClassName"
            >{{ scope.row.Opration.ArabicOprationDescription }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column width="120" align="center">
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
              @click="handleOprationsys(scope.row.Id , NOprations)"
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
        <el-form-item v-bind:label="$t('CashDrawer.CashNumber')" prop="Name">
          <el-input type="text" v-model="tempForm.Name"></el-input>
        </el-form-item>
        <el-form-item v-bind:label="$t('CashDrawer.PCIP')" prop="PCIP">
          <el-input type="text" v-model="tempForm.PCIP"></el-input>
        </el-form-item>
        <el-form-item v-bind:label="$t('CashDrawer.BTCash')" prop="BTCash">
          <el-input type="text" v-model="tempForm.BTCash"></el-input>
        </el-form-item>

        <el-form-item v-bind:label="$t('Items.Notes')" prop="Description">
          <el-input type="textarea" v-model="tempForm.Description"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{ $t('Classification.cancel') }}</el-button>
        <el-button
          type="primary"
          @click="dialogFormStatus==='create'?createData():updateData()"
        >{{$t('AddVendors.Save')}}</el-button>
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
        <el-form-item v-bind:label="$t('Classification.OperationNote')" prop="Description">
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
import { GetCash, Create, Edit } from "@/api/Cash";
import { ChangeObjStatus } from "@/api/Oprationsys";
export default {
  name: "Cash",
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
      textOpration: {
        OprationDescription: "",
        ArabicOprationDescription: "",
        IconClass: "",
        ClassName: ""
      },
      tempForm: {
        ID: undefined,
        Name: "",
        PCIP: "",
        Description: "",
        BTCash: "",
        IsPrime: false
      },
      rulesForm: {},
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
            message: "الرجاء إدخال إسم لا يقل عن 5 احرف و لا يزيد عن 150 حرف",
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
      GetCash()
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
    resetTempForm() {
      this.tempForm = {
        ID: undefined,
        Name: "",
        PCIP: "",
        Description: "",
        BTCash: "",
        IsPrime: false
      };
    },
    handleCreate() {
      this.resetTempForm();
      this.dialogFormStatus = "create";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      })
    },
    handleUpdate(row) {
      console.log(row);
      this.tempForm.Id = row.Id;
      this.tempForm.Name = row.Name;
      this.tempForm.PCIP = row.PCIP;
      this.tempForm.BTCash = row.BTCash;
      this.tempForm.Description = row.Description;
      this.dialogFormStatus = "update";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      })
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
                type: 'success',
                duration: 2000
              })
            })
            .catch(error => {
              console.log(error);
            })
        } else {
          console.log("error submit!!");
          return false;
        }
      })
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
                type: 'success',
                duration: 2000
              })
            })
            .catch(error => {
              console.log(error);
            })
        } else {
          console.log("error submit!!");
          return false;
        }
      })
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
                type: 'success',
                duration: 2000
              })
            })
            .catch(error => {
              console.log(error);
            })
        } else {
          console.log("error submit!!");
          return false;
        }
      })
    }
  }
};
</script>

