<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header">
        <el-button style="float: left" type="success" icon="el-icon-plus" @click="handleCreate()">إضافة مستخدم
        </el-button>
        <span>بيانات المستخدمين و صلاحياتهم</span>
      </div>

      <el-table :data="tableData.filter(
        (data) =>
          !search || data.UserName.toLowerCase().includes(search.toLowerCase())
      )
        " style="width: 100%" max-height="750" v-loading="loading">
        <el-table-column prop="avatar" width="120">
          <template slot="header" slot-scope="{}">
            <el-button type="primary" icon="el-icon-refresh" @click="getdata()"></el-button>
          </template>
          <template slot-scope="scope">
            <pan-thumb width="90px" height="90px" :image="scope.row.avatar" style="cursor: pointer">
              <div style="padding: 25px 20px 20px 20px"></div>
            </pan-thumb>
          </template>
        </el-table-column>

        <el-table-column prop="UserName" width="120">
          <template slot="header" slot-scope="{}">
            <el-input v-model="search" v-bind:placeholder="$t('permission.UserName')" />
          </template>
        </el-table-column>
        <el-table-column label="Email" prop="Email"></el-table-column>
        <el-table-column label="Phone Number" prop="PhoneNumber"></el-table-column>
        <el-table-column label="Roles">
          <template slot-scope="scope">
            <el-tag :key="role" v-for="role in scope.row.Roles" effect="plain" closable :disable-transitions="false"
              @close="RemoveRole(scope.row.UserName, role)">{{ role }}</el-tag>
            <el-button type="success" icon="el-icon-plus" :size="$store.getters.size"
              @click="() => { UserName = scope.row.UserName; dialogAddRoleVisible = true; }"></el-button>
          </template>
        </el-table-column>
        <el-table-column label="Status">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.Active" active-color="#13ce66" inactive-color="#ff4949"
              @change="SetActive(scope.row.UserName, scope.row.Active)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="Actions" align="left">
          <template slot-scope="scope">
            <el-row type="flex">
              <el-col :span="12">
                <add-user-router :userId="scope.row.Id" :router="scope.row.router" :redirect="scope.row.Redirect" />
              </el-col>
              <el-col :span="12">
                <el-button v-if="!scope.row.LockoutEnabled" type="success" icon="el-icon-unlock"
                  :size="$store.getters.size" @click="UnLockOut(scope.row.UserName)"> </el-button>
                <el-button v-if="scope.row.LockoutEnabled" type="danger" icon="el-icon-lock" :size="$store.getters.size"
                  @click="LockOut(scope.row.UserName)">
                </el-button>
              </el-col>
            </el-row>

          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog style="margin-top: -13vh" width="65%" :show-close="false" :title="textMapForm[dialogFormStatus]"
      :visible.sync="dialogFormVisible">
      <el-form :model="tempForm" ref="addUserDataForm" :rules="rulesForm" class="demo-form-inline">
        <el-form-item label="User name" prop="UserName">
          <el-input type="text" v-model="tempForm.UserName"></el-input>
        </el-form-item>
        <el-form-item label="Number Phone" prop="PhoneNumber" :rules="[
          {
            required: true,
            message: 'Please input Number Phone ',
            trigger: 'blur',
          },
        ]">
          <el-input type="text" v-model="tempForm.PhoneNumber"></el-input>
        </el-form-item>
        <el-form-item prop="Email" label="Email" :rules="[
          {
            required: true,
            message: 'Please input email address',
            trigger: 'blur',
          },
          {
            type: 'email',
            message: 'Please input correct email address',
            trigger: ['blur', 'change'],
          },
        ]">
          <el-input v-model="tempForm.Email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="Password" prop="Password">
          <el-input type="password" v-model="tempForm.Password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="Confirm" prop="ConfirmPassword">
          <el-input type="password" v-model="tempForm.ConfirmPassword" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{
          $t("AddVendors.Cancel")
        }}</el-button>
        <el-button type="primary" @click="dialogFormStatus === 'create' ? createData() : updateData()">{{
          $t("AddVendors.Save") }}</el-button>
      </div>
    </el-dialog>
    <el-dialog style="margin-top: -13vh" :show-close="false" title="اضافة صلاحية" :visible.sync="dialogAddRoleVisible">
      <el-select v-model="RoleName" placeholder=" صلاحية">
        <el-option v-for="item in Roles" :key="item.Id" :label="item.Name" :value="item.Name"></el-option>
      </el-select>
      <div slot="footer" class="dialog-footer">
        <el-button type="success" @click="AddRole()">Add</el-button>
      </div>
    </el-dialog>
    <role />
  </div>
</template>

<script>
import { GetUsers, Register, AddRoleUser, DeleteRoleUser, UnLockout, Lockout, SetActive } from "@/api/User";
import { GetRoles, AddRole, Edit } from "@/api/Role";

import PanThumb from "@/components/PanThumb";
import Role from "./components/Role";
import AddUserRouter from "./components/AddUserRouter";

export default {
  name: "permission",
  components: { PanThumb, Role, AddUserRouter },
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("Please input the password"));
      } else {
        if (this.tempForm.ConfirmPassword !== "") {
          this.$refs["addUserDataForm"].validateField("ConfirmPassword");
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
      dialogAddRoleVisible: false,
      dialogFormStatus: "",
      search: "",
      RoleName: "",
      UserName: "",
      tableData: [],
      Roles: [],
      textMapForm: {
        update: "تعديل",
        create: "إضافة",
      },
      tempForm: {
        UserName: "",
        Email: "",
        Password: "",
        PhoneNumber: "",
        ConfirmPassword: "",
      },
      rulesForm: {
        UserName: [
          {
            required: true,
            message: "يجب إدخال إسم ",
            trigger: "blur",
          },
          {
            min: 3,
            max: 50,
            message: "الرجاء إدخال إسم لا يقل عن 3 أحرف و لا يزيد عن 50 حرف",
            trigger: ["blur", "change"],
          },
        ],
        Password: [
          {
            required: true,
            message: "Please input password ",
            trigger: "blur",
          },
          {
            min: 6,
            max: 50,
            message: "الرجاء إدخال كلمة السر لا تقل عن 6 حروف و لا يزيد عن 50 حرف",
            trigger: "blur",
          },
          {
            validator: validatePass,
            trigger: "blur",
          },
        ],
        ConfirmPassword: [
          {
            required: true,
            message: "Please input password ",
            trigger: "blur",
          },
          {
            min: 6,
            max: 50,
            message: "الرجاء إدخال كلمة السر لا تقل عن 6 حروف و لا يزيد عن 50 حرف",
            trigger: "blur",
          },
          {
            validator: validatePass2,
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
      GetUsers()
        .then((response) => {
          // handle success
          this.tableData = response;
          GetRoles()
            .then((response) => {
              // handle success

              this.Roles = response;
              this.loading = false;
            })
            .catch((error) => {
              // handle error
              console.log(error);
            });
        })
        .catch((error) => {
          // handle error
          console.log(error);
        });
    },
    RemoveRole(username, rolername) {
      console.log(username + rolername);
      DeleteRoleUser({ UserName: username, RoleName: rolername })
        .then((response) => {
          // handle success

          this.getdata();
        })
        .catch((error) => {
          // handle error
          console.log(error);
        });
    },
    SetActive(username, isactive) {
      SetActive({ UserName: username, isActive: isactive })
        .then((response) => {
          // handle success

          this.getdata();
        })
        .catch((error) => {
          // handle error
          console.log(error);
        });
    },
    AddRole() {
      AddRoleUser({ UserName: this.UserName, RoleName: this.RoleName })
        .then((response) => {
          // handle success

          this.dialogAddRoleVisible = false;
          this.getdata();
        })
        .catch((error) => {
          // handle error
          console.log(error);
        });
    },
    UnLockOut(userName) {
      UnLockout({ UserName: userName })
        .then((response) => {
          // handle success
          if (response)
            this.$notify({
              title: "Success",
              message: "This is a success message " + response + ".",
              type: "success",
            });
          this.getdata();
        })
        .catch((error) => {
          // handle error
          console.log(error);
        });
    },
    LockOut(userName) {
      Lockout({ UserName: userName })
        .then((response) => {
          // handle success
          if (response)
            this.$notify({
              title: "Success",
              message: "This is a success message " + response + ".",
              type: "success",
            });
          this.getdata();
        })
        .catch((error) => {
          // handle error
          console.log(error);
        });
    },
    resetTempForm() {
      this.tempForm = {
        UserName: "",
        Email: "",
        Password: "",
        PhoneNumber: "",
        ConfirmPassword: "",
      };
    },
    handleCreate() {
      this.resetTempForm();
      this.dialogFormStatus = "create";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["addUserDataForm"].clearValidate();
      });
    },
    handleUpdate(row) {
      console.log(row);
      this.tempForm.UserName = row.UserName;
      this.tempForm.Email = row.Email;
      this.tempForm.PhoneNumber = row.PhoneNumber;
      this.tempForm.Password = row.Password;
      this.tempForm.ConfirmPassword = row.ConfirmPassword;
      this.dialogFormStatus = "update";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["addUserDataForm"].clearValidate();
      });
    },
    createData() {
      this.$refs["addUserDataForm"].validate((valid) => {
        if (valid) {
          Register(this.tempForm)
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
      this.$refs["addUserDataForm"].validate((valid) => {
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
