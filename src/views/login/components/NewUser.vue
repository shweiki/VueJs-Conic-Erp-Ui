<template>
  <div class="New User">
     <el-button type="text"
     @click="handleCreate()"
     >New User?</el-button>
   <el-dialog
      style="margin-top: -13vh"
      width="65%"
      :show-close="false"
      title="New User"
      :visible.sync="dialogFormVisible"
    >
      <el-form
        :model="tempForm"
        ref="dataForm"
        :rules="rulesForm"
        class="demo-form-inline"
      >
        <el-form-item label="User name" prop="UserName">
          <el-input type="text" v-model="tempForm.UserName"></el-input>
        </el-form-item>
        <el-form-item
          label="Number Phone"
          prop="PhoneNumber"
          :rules="[
            {
              required: true,
              message: 'Please input Number Phone ',
              trigger: 'blur'
            }
          ]"
        >
          <el-input type="text" v-model="tempForm.PhoneNumber"></el-input>
        </el-form-item>
        <el-form-item
          prop="Email"
          label="Email"
          :rules="[
            {
              required: true,
              message: 'Please input email address',
              trigger: 'blur'
            },
            {
              type: 'email',
              message: 'Please input correct email address',
              trigger: ['blur', 'change']
            }
          ]"
        >
          <el-input v-model="tempForm.Email"></el-input>
        </el-form-item>
        <el-form-item label="Password" prop="Password">
          <el-input
            type="password"
            v-model="tempForm.Password"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="Confirm" prop="ConfirmPassword">
          <el-input
            type="password"
            v-model="tempForm.ConfirmPassword"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{
          $t("AddVendors.Cancel")
        }}</el-button>
        <el-button
          type="primary"
          @click="createData()"
          >{{ $t("AddVendors.Save") }}</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
// import openWindow from '@/utils/open-window'
import { GetUsers, Register, AddRoleUser, DeleteRoleUser, UnLockout } from "@/api/User";
export default {
  name: "NewUserSignUp",
  data() {
      var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("Please input the password"));
      } else {
        if (this.tempForm.ConfirmPassword !== "") {
          this.$refs["dataForm"].validateField("ConfirmPassword");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("Please input the password again"));
      } else if (value !== this.tempForm.Password) {
        callback(new Error("Two inputs don't match!"));
      } else {
        callback();
      }
    };
  return {
    loading: true,
    dialogFormVisible: false,
    UserName: "",
       tempForm: {
        UserName: "",
        Email: "",
        Password: "",
        PhoneNumber: "",
        ConfirmPassword: ""
      },
            rulesForm: {
        UserName: [
          {
            required: true,
            message: "يجب إدخال إسم ",
            trigger: "blur"
          },
          {
            minlength: 3,
            maxlength: 50,
            message: "الرجاء إدخال إسم لا يقل عن 3 أحرف و لا يزيد عن 50 حرف",
            trigger: "blur"
          }
        ],
        Password: [{ validator: validatePass, trigger: "blur" }],
        ConfirmPassword: [{ validator: validatePass2, trigger: "blur" }]
      }
  }
  },
  methods: {
      resetTempForm() {
      this.tempForm = {
        UserName: "",
        Email: "",
        Password: "",
        PhoneNumber: "",
        ConfirmPassword: ""
      };
    },
 handleCreate() {
      this.resetTempForm();
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
        createData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          Register(this.tempForm)
            .then(response => {
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
  }
}
</script>

