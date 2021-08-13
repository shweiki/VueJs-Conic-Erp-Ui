<template>
  <div>
    <el-button
      type="primary"
      icon="el-icon-edit"
      @click="getdata()"
      circle
    ></el-button>
    <el-dialog
      style="margin-top: -13vh"
      :show-close="false"
      :visible.sync="Visible"
      @opened="$refs['Name'].focus()"
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
          <el-divider> تعديل حساب {{ tempForm.Id }}</el-divider>
        </el-col>
      </div>
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
            @Set="v => (tempForm.Type = v)"
          />
        </el-form-item>
        <el-form-item v-bind:label="$t('Account.AccName')" prop="Name">
          <el-input ref="Name" type="text" v-model="tempForm.Name"></el-input>
        </el-form-item>
        <el-form-item v-bind:label="$t('Account.Code')" prop="Code">
          <el-input type="text" v-model="tempForm.Code"></el-input>
        </el-form-item>
        <el-form-item label="تحت قائمة" prop="ParentId">
          <select-parent
            :Value="tempForm.ParentId"
            @Set="
              v => {
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
        <el-button @click="Visible = false">{{
          $t("Account.cancel")
        }}</el-button>
        <el-button type="primary" @click="updateData()">{{
          $t("Account.Save")
        }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { Edit, GetById } from "@/api/Account";
import SelectAccountsType from "./SelectAccountsType.vue";
import SelectParent from "./SelectParent.vue";

export default {
  components: { SelectAccountsType, SelectParent },
  props: {
    AccountId: {
      type: Number,
      default: undefined
    }
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
        Description: "",
        ParentId: 0
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
      }
    };
  },
  methods: {
    getdata() {
      GetById({ Id: this.AccountId }).then(response => {
        // handle success
        this.tempForm = response;
        this.Visible = true;
      });
    },
    updateData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          Edit(this.tempForm)
            .then(response => {
              this.Visible = false;
              this.$notify({
                title: "تم ",
                message: "تم تعديل بنجاح",
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
