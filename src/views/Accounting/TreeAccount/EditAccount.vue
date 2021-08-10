<template>
  <div>
    <el-button
      type="success"
      icon="el-icon-edit"
      @click="getdata()"
    ></el-button>
    <el-dialog
      style="margin-top: -13vh"
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
        :model="tempForm"
        :rules="rulesForm"
        ref="dataForm"
        class="demo-form-inline"
        label-position="top"
      >
        <div>
          <el-radio v-model="tempForm.Type" label="Customer" border>{{
            $t("AddVendors.Customer")
          }}</el-radio>
          <el-radio v-model="tempForm.Type" label="Supplier" border>{{
            $t("AddVendors.Supplier")
          }}</el-radio>
        </div>
        <el-row type="flex">
          <el-col :span="24">
            <el-form-item v-bind:label="$t('CashDrawer.Name')" prop="Name">
              <el-input
                type="text"
                ref="Name"
                v-model="tempForm.Name"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item
          v-bind:label="$t('AddVendors.Description')"
          prop="Description"
        >
          <el-input type="textarea" v-model="tempForm.Description"></el-input>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { Edit, GetById } from "@/api/Account";

export default {
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
        Ssn: "",
        Region: "",
        Email: "",
        PhoneNumber1: "",
        PhoneNumber2: "",
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
