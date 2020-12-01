<template>
  <el-form :model="tempForm" ref="dataForm" :rules="rulesForm" class="demo-form-inline">
    <el-form-item label="Old Password" prop="OldPassword">
      <el-input type="password" v-model="tempForm.OldPassword" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="New Password" prop="NewPassword">
      <el-input type="password" v-model="tempForm.NewPassword" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="Confirm" prop="ConfirmPassword">
      <el-input type="password" v-model="tempForm.ConfirmPassword" autocomplete="off"></el-input>
    </el-form-item>
    <el-button type='success' @click="submit()">{{$t('AddVendors.Save')}}</el-button>
  </el-form>
</template>

<script>
import { ChangePassword } from "@/api/User";
export default {
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
      } else if (value !== this.tempForm.NewPassword) {
        callback(new Error("Two inputs don't match!"));
      } else {
        callback();
      }
    };
    return {
      tempForm: {
        OldPassword: "",
        NewPassword: "",
        ConfirmPassword: ""
      },
      rulesForm: {
        OldPassword: {
          required: true,
          message: "يجب كلمة السر القديمة ",
          trigger: "blur"
        },
        NewPassword: [{ validator: validatePass, trigger: "blur" }],
        ConfirmPassword: [{ validator: validatePass2, trigger: "blur" }]
      }
    };
  },
  methods: {
    submit() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          ChangePassword(this.tempForm)
            .then(response => {
              this.resetTempForm();
              this.$notify({
                title: "تم ",
                message: "تم تغير كلمة السر بنجاح",
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
    resetTempForm() {
      this.tempForm = {
        OldPassword: "",
        NewPassword: "",
        ConfirmPassword: ""
      };
    }
  }
};
</script>
