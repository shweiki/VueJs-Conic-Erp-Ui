
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
        <span>{{ $t('Account.Account') }}</span>
      </div>
      <div class="custom-tree-container">

        <div class="block">
          <el-tree
            :data="data"
            show-checkbox
            node-key="id"
            default-expand-all
            :expand-on-click-node="false"
          >
                                <span>
                <el-button type="text" :size="$store.getters.size" @click="() => append(data)">إضافة</el-button>
                <el-button type="text" :size="$store.getters.size" @click="() => remove(node, data)">حذف</el-button>
              </span>
            <span class="custom-tree-node" slot-scope="{ node }">

              <span>{{ node.label }}</span>

            </span>
       
          </el-tree>
        </div>
      </div>

    </el-card>
    <el-dialog
      style="margin-top: -13vh"
      :show-close="false"
      :title="textMapForm[dialogFormStatus]"
      :visible.sync="dialogFormVisible" >
      <el-form
        ref="dataForm"
        :rules="rulesForm"
        :model="tempForm"
        label-position="top"
        label-width="70px"
      >
        <el-form-item v-bind:label="$t('Account.AccType')" prop="Type">
          <el-select v-model="tempForm.Type" filterable placeholder="الحسابات الرئيسية">
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
        <el-button @click="dialogFormVisible = false">{{ $t('Account.cancel') }}</el-button>
        <el-button
          type="primary"
          @click="dialogFormStatus==='create'?createData():updateData()"
        >{{ $t('Account.Save') }}</el-button>
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
import { GetAccount, Create, Edit } from "@/api/Account";
import { ChangeObjStatus } from "@/api/Oprationsys";
export default {
  name: "TreeAccount",
  data() {
    const data = [
      {
        id: 1,
        label: "الاصول",
        children: [
          {
            id: 4,
            label: "الاصول المتداولة",
            children: [
              {
                id: 9,
                label: "الصندوق",
                type : "Cash"
              },
              {
                id: 10,
                label: "البنك"
              },
              {
                id: 10,
                label: "المدينون"
              }
            ]
          }
        ]
      },
      {
        id: 2,
        label: "الالتزامات",
        children: [
          {
            id: 5,
            label: "الالتزامات المتداولة"
          },
          {
            id: 6,
            label: "الالتزامات غير المتداولة"
          }
        ]
      },
      {
        id: 3,
        label: "حقوق الملكية",
        children: [
          {
            id: 7,
            label: "راس المال"
          },
          {
            id: 8,
            label: "المسحوبات الشخصية"
          }
        ]
      },
            {
        id: 3,
        label: "الايرادات",
        children: [
          {
            id: 7,
            label: "ايرادات المبيعات"
          },
          {
            id: 8,
            label: "الايرادات الاخرى"
          }
        ]
      },
                  {
        id: 3,
        label: "المصروفات",
        children: [
          {
            id: 7,
            label: "تكلفة المبيعات"
          },
          {
            id: 8,
            label: "مصاريف البيع والتسويق"
          },
          {
            id: 8,
            label: "مصاريف ادارية وعمومية"
          }
        ]
      }
    ];
    return {
      data: JSON.parse(JSON.stringify(data)),

      loading: true,
      dialogFormVisible: false,
      dialogOprationVisible: false,
      dialogFormStatus: '',
      tableData: [],
      TypeAccounts: [
        {
          label: "حساب",
          value: "Vendor"
        },
        {
          label: "خزينة كاش",
          value: "Cash"
        }
      ],
      search: '',
      textMapForm: {
        update: "تعديل",
        create: "إضافة"
      },
      textOpration: {
        OprationDescription: '',
        ArabicOprationDescription: '',
        IconClass: '',
        ClassName: ''
      },
      tempForm: {
        Id: undefined,
        AccountName: '',
        Status: 0,
        Code: '',
        Type: undefined,
        Description: ''
      },
      rulesForm: {
        AccountName: [
          {
            required: true,
            message: 'يجب إدخال إسم ',
            trigger: 'blur'
          },
          {
            minlength: 3,
            maxlength: 50,
            message: "الرجاء إدخال إسم لا يقل عن 3 احرف و لا يزيد عن 50 حرف",
            trigger: 'blur'
          }
        ]
      },
      tempOpration: {
        ObjId: undefined,
        OprationId: undefined,
        Description: ''
      },
      rulesOpration: {
        Description: [
          {
            required: true,
            message: "يجب إدخال ملاحظة للعملية",
            trigger: 'blur'
          },
          {
            minlength: 5,
            maxlength: 150,
            message: "الرجاء إدخال إسم لا يقل عن 5 أحرف و لا يزيد عن 150 حرف",
            trigger: 'blur'
          }
        ]
      }
    };
  },
  created() {
    this.getdata();
  },
  methods: {
            append(data) {
        const newChild = { id: id++, label: "testtest", children: [] };
        if (!data.children) {
          this.$set(data, "children", []);
        }
        data.children.push(newChild);
      },

      remove(node, data) {
        const parent = node.parent;
        const children = parent.data.children || parent.data;
        const index = children.findIndex(d => d.Id === data.Id);
        children.splice(index, 1);
      },

      renderContent(h, { node, data, store }) {
        return (
          <span class="custom-tree-node">
            <span>{node.label}</span>
            <span>
              <el-button
                size={this.$store.getters.size}
                type="text"
                on-click={() => this.append(data)}
              >
                إضافة
              </el-button>
              <el-button
                size={$store.getters.size}
                type="text"
                on-click={() => this.remove(node, data)}
              >
                حذف
              </el-button>
            </span>
          </span>
        );
      },
    getdata() {
      this.loading = true;
      GetAccount()
        .then(response => {
          // handle success
          console.log(response)
          this.tableData = response.Accounts;
          this.loading = false
        })
        .catch(error => {
          // handle error
          console.log(error);
        })
    },
    resetTempForm() {
      this.tempForm = {
        Id: undefined,
        AccountName: '',
        Status: 0,
        Code: '',
        Type: undefined,
        Description: ''
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
      this.tempForm.AccountName = row.AccountName;
      this.tempForm.Status = row.Status;
      this.tempForm.Code = row.Code;
      this.tempForm.Type = row.Parent.Id;
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
                message: 'تم التعديل بنجاح',
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
            ObjId: this.tempOpration.ObjID,
            OprationId: this.tempOpration.OprationID,
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

<style>
.el-tree-node__children{
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

