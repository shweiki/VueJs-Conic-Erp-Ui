<template>
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
        <el-select
          v-model="tempForm.Type"
          filterable
          placeholder="الحسابات الرئيسية"
        >
          <el-option
            v-for="item in TypeAccounts"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-bind:label="$t('Account.AccName')" prop="Name">
        <el-input type="text" v-model="tempForm.Name"></el-input>
      </el-form-item>
      <el-form-item v-bind:label="$t('Account.Code')" prop="Code">
        <el-input type="text" v-model="tempForm.Code"></el-input>
      </el-form-item>
      <el-form-item v-bind:label="$t('Account.Notes')" prop="Description">
        <el-input type="textarea" v-model="tempForm.Description"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false">{{
        $t("Account.cancel")
      }}</el-button>
      <el-button
        type="primary"
        @click="dialogFormStatus === 'create' ? createData() : updateData()"
        >{{ $t("Account.Save") }}</el-button
      >
    </div>
  </el-dialog>
</template>
<script>
import {  Create, Edit } from "@/api/Account";

export default {
  data() {
    return {
      tempForm: {
        Id: undefined,
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
      }
    };
  },
  methods: {
    resetTempForm() {
      this.tempForm = {
        Id: undefined,
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
      this.tempForm.Id = row.Id;
      this.tempForm.Name = row.Name;
      this.tempForm.Status = row.Status;
      this.tempForm.Code = row.Code;
      this.tempForm.Type = row.Parent.Id;
      this.tempForm.Description = row.Description;
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
    }
  }
};
</script>