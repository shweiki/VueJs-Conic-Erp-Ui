<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header">
        <el-button
          style="float: left"
          type="success"
          icon="el-icon-plus"
          @click="handleCreate()"
          >{{ $t("Classification.Add") }}</el-button
        >
        <span>{{ $t("OperationSys.Operations") }}</span>
      </div>

      <el-table
        :data="
          tableData.filter(
            (data) =>
              !search || data.TableName.toLowerCase().includes(search.toLowerCase())
          )
        "
        style="width: 100%"
        max-height="750"
        v-loading="loading"
      >
        <el-table-column prop="Id" width="100">
          <template slot="header" slot-scope="{}">
            <el-button
              type="primary"
              icon="el-icon-refresh"
              @click="getdata()"
            ></el-button>
          </template>
        </el-table-column>
        <el-table-column
          v-bind:label="$t('OperationSys.OprationName')"
          prop="OprationName"
        ></el-table-column>
        <el-table-column prop="TableName" width="120">
          <template slot="header" slot-scope="{}">
            <el-input
              v-model="search"
              v-bind:placeholder="$t('OperationSys.TableName')"
            />
          </template>
        </el-table-column>

        <el-table-column
          v-bind:label="$t('OperationSys.ControllerName')"
          prop="ControllerName"
        ></el-table-column>
        <el-table-column
          v-bind:label="$t('OperationSys.RoleName')"
          prop="RoleName"
        ></el-table-column>
        <el-table-column
          v-bind:label="$t('OperationSys.OprationDescription')"
          prop="OprationDescription"
        ></el-table-column>
        <el-table-column
          v-bind:label="$t('OperationSys.ArabicOprationDescription')"
          prop="ArabicOprationDescription"
        ></el-table-column>
        <el-table-column
          v-bind:label="$t('OperationSys.IconClass')"
          prop="IconClass"
        ></el-table-column>
        <el-table-column
          v-bind:label="$t('OperationSys.ClassName')"
          prop="ClassName"
        ></el-table-column>
        <el-table-column
          v-bind:label="$t('OperationSys.Status')"
          prop="Status"
        ></el-table-column>
        <el-table-column
          v-bind:label="$t('OperationSys.ReferenceStatus')"
          prop="ReferenceStatus"
        ></el-table-column>
        <el-table-column width="120" align="left">
          <template slot-scope="scope">
            <el-button
              icon="el-icon-edit"
              circle
              @click="handleUpdate(scope.row)"
            ></el-button>
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
      <el-form ref="dataForm" :rules="rulesForm" :model="tempForm" label-position="right">
        <el-form-item v-bind:label="$t('OperationSys.TableName')" prop="TableName">
          <el-input type="text" v-model="tempForm.TableName"></el-input>
        </el-form-item>
        <el-form-item v-bind:label="$t('OperationSys.Color')" prop="Color">
          <el-color-picker
            v-model="tempForm.Color"
            show-alpha
            :predefine="predefineColors"
          >
          </el-color-picker>
        </el-form-item>
        <el-form-item v-bind:label="$t('OperationSys.OprationName')" prop="OprationName">
          <el-input type="text" v-model="tempForm.OprationName"></el-input>
        </el-form-item>
        <div class="row">
          <div class="col">
            <el-form-item v-bind:label="$t('OperationSys.Status')" prop="Status">
              <el-input-number
                v-model="tempForm.Status"
                :step="1"
                :max="15"
                @focus="$event.target.select()"
              ></el-input-number>
            </el-form-item>
          </div>
          <div class="col">
            <el-form-item
              v-bind:label="$t('OperationSys.ReferenceStatus')"
              prop="ReferenceStatus"
            >
              <el-input-number
                v-model="tempForm.ReferenceStatus"
                :step="1"
                :max="15"
                @focus="$event.target.select()"
              ></el-input-number>
            </el-form-item>
          </div>
        </div>
        <el-form-item v-bind:label="$t('OperationSys.IconClass')" prop="IconClass">
          <el-input type="text" v-model="tempForm.IconClass"></el-input>
        </el-form-item>
        <el-form-item v-bind:label="$t('OperationSys.ClassName')" prop="ClassName">
          <el-input type="text" v-model="tempForm.ClassName"></el-input>
        </el-form-item>
        <el-form-item
          v-bind:label="$t('OperationSys.ArabicOprationDescription')"
          prop="ArabicOprationDescription"
        >
          <el-input type="text" v-model="tempForm.ArabicOprationDescription"></el-input>
        </el-form-item>
        <el-form-item
          v-bind:label="$t('OperationSys.OprationDescription')"
          prop="OprationDescription"
        >
          <el-input type="text" v-model="tempForm.OprationDescription"></el-input>
        </el-form-item>
        <el-form-item
          v-bind:label="$t('OperationSys.ControllerName')"
          prop="ControllerName"
        >
          <el-input type="text" v-model="tempForm.ControllerName"></el-input>
        </el-form-item>
        <el-form-item v-bind:label="$t('OperationSys.RoleName')" prop="RoleName">
          <el-input type="text" v-model="tempForm.RoleName"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{
          $t("Account.cancel")
        }}</el-button>
        <el-button
          type="primary"
          @click="dialogFormStatus === 'create' ? createData() : updateData()"
          >حفظ</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { GetOpration, Create, Edit } from "@/api/Oprationsys";
export default {
  name: "Oprationsys",
  data() {
    return {
      loading: true,
      dialogFormVisible: false,
      dialogFormStatus: "",
      search: "",
      tableData: [],
      textMapForm: {
        update: "تعديل",
        create: "إضافة",
      },
      tempForm: {
        Id: undefined,
        TableName: "",
        ControllerName: "",
        RoleName: "",
        OprationName: "",
        OprationDescription: "",
        ArabicOprationDescription: "",
        Status: 0,
        ReferenceStatus: null,
        IconClass: "",
        ClassName: "",
        Color: "",
      },
      rulesForm: {
        TableName: [
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
      predefineColors: [
        "#ff4500",
        "#ff8c00",
        "#ffd700",
        "#90ee90",
        "#00ced1",
        "#1e90ff",
        "#c71585",
        "#c7158577",
      ],
    };
  },
  created() {
    this.getdata();
  },
  methods: {
    getdata() {
      this.loading = true;
      GetOpration()
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
        TableName: "",
        ControllerName: "",
        RoleName: "",
        OprationName: "",
        OprationDescription: "",
        ArabicOprationDescription: "",
        Status: 0,
        ReferenceStatus: undefined,
        IconClass: "",
        ClassName: "",
        Color: "",
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
      this.tempForm.TableName = row.TableName;
      this.tempForm.ControllerName = row.ControllerName;
      this.tempForm.RoleName = row.RoleName;
      this.tempForm.OprationName = row.OprationName;
      this.tempForm.OprationDescription = row.OprationDescription;
      this.tempForm.ArabicOprationDescription = row.ArabicOprationDescription;
      this.tempForm.Status = row.Status;
      this.tempForm.ReferenceStatus = row.ReferenceStatus;
      this.tempForm.IconClass = row.IconClass;
      this.tempForm.ClassName = row.ClassName;
      this.tempForm.Color = row.Color;
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
  },
};
</script>
