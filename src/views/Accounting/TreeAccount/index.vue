
<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-button
          style="float: left"
          type="success"
          icon="el-icon-plus"
          @click="handleCreate()"
          >{{ $t("Classification.Add") }}</el-button
        >
        <span>{{ $t("Account.Account") }}</span>
      </div>
      <div class="custom-tree-container">
        <el-button
          type="primary"
          icon="el-icon-refresh"
          @click="getdata()"
        ></el-button>
        <el-col :span="6">
          <el-input placeholder="Filter keyword" v-model="filterText">
          </el-input>
        </el-col>
        <div class="block">
          <el-tree
            :data="Tree"
            show-checkbox
            node-key="Id"
            accordion
            default-expand-all
            :expand-on-click-node="false"
            :filter-node-method="filterNode"
            ref="AccountTree"
          >
            <span class="custom-tree-node" slot-scope="{ data }">
              <span>{{ data.Name }} - {{ data.Code }} </span>
              <span>
                <!--     <span>{{ data.TotalCredit }}</span>
                <span>{{ data.TotalDebit }}</span> -->
                <span>{{ data.TotalCredit - data.TotalDebit }}</span>
              </span>
              <el-col :span="2">
                <edit-account :AccountId="data.Id" />
              </el-col>
            </span>
          </el-tree>
        </div>
      </div>
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
        <el-form-item v-bind:label="$t('Account.AccName')" prop="AccountName">
          <el-input type="text" v-model="tempForm.AccountName"></el-input>
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
  </div>
</template>
<script>
import { GetTreeAccount, Create, Edit } from "@/api/Account";
import EditAccount from "./EditAccount.vue";
export default {
  components: { EditAccount },
  name: "TreeAccount",
  watch: {
    filterText(val) {
      this.$refs["AccountTree"].filter(val);
    }
  },
  data() {
    return {
      loading: true,
      dialogFormVisible: false,
      dialogFormStatus: "",
      filterText: "",
      Tree: [],
      TypeAccounts: [
        {
          label: "رئيسي",
          value: "Main"
        },
        {
          label: "عميل | مورد",
          value: "Vendor"
        },
        {
          label: "مشترك",
          value: "Vendor"
        },
        {
          label: "ايراد",
          value: "InCome"
        },
        {
          label: "خزينة كاش",
          value: "Cash"
        },
        {
          label: "بنك",
          value: "Bank"
        }
      ],
      search: "",
      textMapForm: {
        update: "تعديل",
        create: "إضافة"
      },

      tempForm: {
        Id: undefined,
        AccountName: "",
        Status: 0,
        Code: "",
        Type: undefined,
        Description: ""
      },
      rulesForm: {
        AccountName: [
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
  created() {
    this.getdata();
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true;
      return data.Name.indexOf(value) !== -1 || data.Code.indexOf(value) !== -1;
    },

    getdata() {
      this.loading = true;
      GetTreeAccount()
        .then(response => {
          // handle success
          console.log(response);
          this.Tree = this.generateTree(response);
          console.log(this.Tree);

          this.loading = false;
        })
        .catch(error => {
          // handle error
          console.log(error);
        });
    },
    generateTree(list) {
      var map = {},
        node,
        roots = [],
        i;

      for (i = 0; i < list.length; i += 1) {
        map[list[i].Id] = i; // initialize the map
        list[i].children = []; // initialize the children
      }

      for (i = 0; i < list.length; i += 1) {
        node = list[i];
        if (node.ParentId !== 0) {
          // if you have dangling branches check that map[node.parentId] exists
          list[map[node.ParentId]].children.push(node);
        } else {
          roots.push(node);
        }
      }
      return roots;
    },

    resetTempForm() {
      this.tempForm = {
        Id: undefined,
        AccountName: "",
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
      this.tempForm.AccountName = row.AccountName;
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

<style>
.el-tree-node__children {
  margin-right: 18px;
}
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
</style>

