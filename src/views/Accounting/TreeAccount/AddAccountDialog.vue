<template>
  <div>
    <el-button
      type="success"
      icon="el-icon-plus"
      @click="Visible = true"
      circle
    ></el-button>
    <el-dialog
      style="margin-top: -13vh"
      :show-close="false"
      title="إضافة حساب"
      :visible.sync="Visible"
    >
      <el-form
        ref="dataForm"
        :rules="rulesForm"
        :model="tempForm"
        label-position="top"
        label-width="70px"
      >
        <el-form-item v-bind:label="$t('Account.AccType')" prop="Type">
          <select-accounts-type
            :Value="tempForm.Type"
            @Set="(v) => (tempForm.Type = v)"
          />
        </el-form-item>
        <el-form-item v-bind:label="$t('Account.AccName')" prop="Name">
          <el-input type="text" v-model="tempForm.Name"></el-input>
        </el-form-item>
        <el-form-item v-bind:label="$t('Account.Code')" prop="Code">
          <el-input type="text" v-model="tempForm.Code"></el-input>
        </el-form-item>
        <el-form-item label="تحت قائمة" prop="ParentId">
          <Select-Parent
            :Value="tempForm.ParentId"
            @Set="
              (v) => {
                tempForm.ParentId = v;
              }
            "
          />
        </el-form-item>
        <el-form-item v-bind:label="$t('Account.Notes')" prop="Description">
          <el-input type="textarea" v-model="tempForm.Description"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="Visible = false">{{ $t("Account.cancel") }}</el-button>
        <el-button type="primary" @click="createData()">{{
          $t("Account.Save")
        }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { Create } from "@/api/Account";
import SelectAccountsType from "./SelectAccountsType.vue";

import SelectParent from "./SelectParent.vue";
export default {
  components: { SelectParent, SelectAccountsType },
  props: ["ParentId", "Code"],
  watch: {
    ParentId(v) {
      this.tempForm.ParentId = v;
    },
    Code(v) {
      this.tempForm.Code = v;
    },
  },
  data() {
    return {
      Visible: false,
      tempForm: {
        Id: undefined,
        Name: "",
        Status: 0,
        Code: "",
        Type: undefined,
        ParentId: 0,
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
            message: "الرجاء إدخال إسم لا يقل عن 3 احرف و لا يزيد عن 50 حرف",
            trigger: "blur",
          },
        ],
      },
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
        ParentId: 0,
        Description: "",
      };
    },
    handleCreate() {
      //this.resetTempForm();
      this.Visible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    createData() {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          Create(this.tempForm)
            .then((response) => {
              this.$emit("Done");
              this.Visible = false;
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
  },
};
</script>
