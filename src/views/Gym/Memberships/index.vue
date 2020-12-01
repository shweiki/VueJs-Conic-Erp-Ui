<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-button
          style="float: left"
          type='success'
          icon="el-icon-plus"
          @click="handleCreate()"
        >{{ $t('Vendors.Add') }}</el-button>
        <span>{{ $t('CashPool.Memberships') }}</span>
      </div>
      <el-table
        v-loading="loading"
        :data="tableData.filter(data => !search || data.Name.toLowerCase().includes(search.toLowerCase()))"
        fit
        border
        max-height="900"
        highlight-current-row
        style="width: 100%"
      >
        <el-table-column prop="Id" width="120" align="center">
          <template slot="header" slot-scope="{}">
            <el-button type="primary" icon="el-icon-refresh" @click="getdata()"></el-button>
          </template>
        </el-table-column>

        <el-table-column prop="Name" align="center">
          <template slot="header" slot-scope="{}">
            <el-input v-model="search" v-bind:placeholder="$t('AddVendors.Name')" />
          </template>
        </el-table-column>
        <el-table-column v-bind:label="$t('Members.TotalMembers')" width="220" align="center">
          <template slot-scope="scope">{{ scope.row.TotalMembers }}</template>
        </el-table-column>
        <el-table-column v-bind:label="$t('Sales.Status')" width="100" align="center">
          <template slot-scope="scope">
            <el-tag
              :type="scope.row.Opration.ClassName"
            >{{ scope.row.Opration.ArabicOprationDescription }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column width="120" align="center">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.Opration.Status!=-1"
              icon="el-icon-edit"
              circle
              @click="handleUpdate(scope.row)"
            ></el-button>
            <el-button
              v-for="(NOprations, index) in scope.row.NextOprations"
              :key="index"
              :type="NOprations.ClassName"
              round
              @click="handleOprationsys(scope.row.Id , NOprations)"
            >{{NOprations.OprationDescription}}</el-button>
          </template>
        </el-table-column>
        <el-table-column type="expand" width="30" align="center">
          <template slot-scope="props">
            <el-table :data="[props.row]">
              <el-table-column align="center" v-bind:label="$t('Members.NumberDays')">
                <template slot-scope="scope">
                  <i class="el-icon-time"></i>
                  {{ scope.row.NumberDays }}
                </template>
              </el-table-column>
              <el-table-column align="center" label="الحد الادنى لتجميد">
                <template slot-scope="scope">
                  <i class="el-icon-time"></i>
                  {{ scope.row.MinFreezeLimitDays }}
                </template>
              </el-table-column>
              <el-table-column align="center" label="الحد الاعلى لتجميد">
                <template slot-scope="scope">
                  <i class="el-icon-time"></i>
                  {{ scope.row.MaxFreezeLimitDays }}
                </template>
              </el-table-column>
              <el-table-column align="center" v-bind:label="$t('Members.MorningPrice')">
                <template slot-scope="scope">
                  <i class="el-icon-money"></i>
                  {{ scope.row.MorningPrice.toFixed(2) }}
                </template>
              </el-table-column>
              <el-table-column v-bind:label="$t('Members.FullDayPrice')" align="center">
                <template slot-scope="scope">
                  <i class="el-icon-money"></i>
                  {{ scope.row.FullDayPrice.toFixed(2) }}
                </template>
              </el-table-column>
              <el-table-column v-bind:label="$t('Members.Tax')" align="center" prop="Tax"></el-table-column>
              <el-table-column v-bind:label="$t('Members.Rate')" align="center" prop="Rate"></el-table-column>
              <el-table-column
                align="center"
                v-bind:label="$t('Members.Notes')"
                prop="Description"
                width="150"
              ></el-table-column>
            </el-table>
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
      <el-form
        ref="dataForm"
        :rules="rulesForm"
        :model="tempForm"
        label-position="top"
        label-width="70px"
      >
        <el-row type="flex">
          <el-col :span="24">
            <el-form-item v-bind:label="$t('Members.Name')" prop="Name">
              <el-input type="text" v-model="tempForm.Name"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row type="flex">
          <el-col :span="8">
            <el-form-item v-bind:label="$t('Members.NumberDays')" prop="NumberDays">
              <el-input-number v-model="tempForm.NumberDays" :step="1" :min="1" :max="1000"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item v-bind:label="$t('Members.MorningPrice')" prop="MorningPrice">
              <el-input-number
                v-model="tempForm.MorningPrice"
                :precision="2"
                :step="0.1"
                :min="0.00"
                :max="1500"
              ></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item v-bind:label="$t('Members.FullDayPrice')" prop="FullDayPrice">
              <el-input-number
                v-model="tempForm.FullDayPrice"
                :precision="2"
                :step="0.1"
                :min="0.00"
                :max="1500"
              ></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row type="flex">
          <el-col :span="8">
            <el-form-item v-bind:label="$t('Members.Tax')" prop="Tax">
              <el-input-number
                v-model="tempForm.Tax"
                :precision="2"
                :step="0.01"
                :min="0.01"
                :max="1"
              ></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="الحد الادنى لتجميد" prop="MinFreezeLimitDays">
              <el-input-number
                v-model="tempForm.MinFreezeLimitDays"
                :precision="2"
                :step="1"
                :min="1"
                :max="365"
              ></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="الحد الاعلى لتجميد" prop="MaxFreezeLimitDays">
              <el-input-number
                v-model="tempForm.MaxFreezeLimitDays"
                :precision="2"
                :step="1"
                :min="1"
                :max="365"
              ></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex">
          <el-col :span="24">
            <el-form-item v-bind:label="$t('Members.Notes')" prop="Description">
              <el-input type="textarea" v-model="tempForm.Description"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{ $t('permission.cancel') }}</el-button>
        <el-button type="primary" @click="dialogFormStatus==='create'?createData():updateData()">حفظ</el-button>
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
        <el-form-item label="ملاحظات للعملية " prop="Description">
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
import { GetMembership, Create, Edit } from "@/api/Membership";

import { ChangeObjStatus } from "@/api/Oprationsys";
export default {
  name: "Membership",
  data() {
    return {
      tableData: [],
      loading: true,
      dialogFormVisible: false,
      dialogOprationVisible: false,
      dialogFormStatus: '',
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
        ID: undefined,
        Name: '',
        NumberDays: 30,
        MorningPrice: 0.0,
        FullDayPrice: 0.0,
        Tax: 0.0,
        Rate: 0,
        Description: '',
        MinFreezeLimitDays: 3,
        MaxFreezeLimitDays: 0
      },
      rulesForm: {
        Name: [
          {
            required: true,
            message: 'يجب إدخال إسم ',
            trigger: 'blur'
          },
          {
            minlength: 3,
            maxlength: 50,
            message: 'الرجاء إدخال إسم لا يقل عن 3 أحرف و لا يزيد عن 50 حرف',
            trigger: 'blur'
          }
        ]
      },
      tempOpration: {
        ObjID: undefined,
        OprationID: undefined,
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
  methods: {
    getdata() {
      this.loading = true;
      GetMembership().then(response => {
        // handle success
        console.log(response)
        this.tableData = response;
        this.loading = false
      })
    },
    resetTempForm() {
      this.tempForm = {
        ID: undefined,
        Name: '',
        NumberDays: 30,
        MorningPrice: 0.0,
        FullDayPrice: 0.0,
        Tax: 0.0,
        Rate: 0,
        Description: '',
        MinFreezeLimitDays: 3,
        MaxFreezeLimitDays: 0
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
      this.tempForm.Name = row.Name;
      this.tempForm.NumberDays = row.NumberDays;
      this.tempForm.MorningPrice = row.MorningPrice;
      this.tempForm.FullDayPrice = row.FullDayPrice;
      this.tempForm.Tax = row.Tax;
      this.tempForm.Rate = row.Rate;
      this.tempForm.Description = row.Description;
      this.tempForm.MinFreezeLimitDays = row.MinFreezeLimitDays;
      this.tempForm.MaxFreezeLimitDays = row.MaxFreezeLimitDays;
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
            ObjID: this.tempOpration.ObjID,
            OprationID: this.tempOpration.OprationID,
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
  },
  created() {
    this.getdata();
  }
};
</script>
