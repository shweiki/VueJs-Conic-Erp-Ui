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
        <el-button
          style="float: left; "
          icon="el-icon-printer"
          type="primary"
          @click="print(tableData)"
        ></el-button>
        <span>جميع الخدمات</span>
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
        <el-table-column prop="Id" width="80" align="center">
          <template slot="header" slot-scope="{}">
            <el-button type="primary" icon="el-icon-refresh" @click="getdata()"></el-button>
          </template>
        </el-table-column>
        <el-table-column prop="Name" align="center">
          <template slot="header" slot-scope="{}">
            <el-input v-model="search" v-bind:placeholder="$t('Classification.Name')" />
          </template>
        </el-table-column>
        <el-table-column prop="ItemName" label="الصنف" align="center"></el-table-column>
        <el-table-column prop="Qty" label="العدد" align="center"></el-table-column>
        <el-table-column prop="SellingPrice" label="سعر البيع" align="center"></el-table-column>

        <el-table-column prop="Type" label="نوع" align="center"></el-table-column>

        <el-table-column
          v-bind:label="$t('Classification.Notes')"
          prop="Description"
          align="center"
        ></el-table-column>
        <el-table-column v-bind:label="$t('Classification.Status')" width="120" align="center">
          <template slot-scope="scope">
            <el-tag
            >{{ scope.row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="right" >
          <template slot-scope="scope">
            <el-button
              icon="el-icon-edit"
              circle
              @click="handleUpdate(scope.row)"
            ></el-button>
       
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
        <el-form-item v-bind:label="$t('Classification.Name')" prop="Name">
          <el-input type="text" v-model="tempForm.Name"></el-input>
        </el-form-item>
        <el-form-item prop="ItemId">
          <el-select
            v-model="tempForm.ItemId"
            filterable
            v-bind:placeholder="$t('Items.Item')"
            autocomplete="off"
          >
            <el-option v-for="item in Items" :key="item.Id" :label="item.Name" :value="item.Id">
              <span style="float: right">{{ item.Id }}</span>
              <span style="float: left color: #8492a6 font-size: 13px">{{ item.Name }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="العدد" prop="Qty">
          <el-input type="number" v-model="tempForm.Qty"></el-input>
        </el-form-item>
        <el-form-item v-bind:label="$t('Items.SellingPrice')" prop="SellingPrice">
          <currency-input class="currency-input" v-model="tempForm.SellingPrice" />
        </el-form-item>

        <el-form-item v-bind:label="$t('Classification.Status')" prop="Description">
          <el-input type="textarea" v-model="tempForm.Description"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">إلغاء</el-button>
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
import { GetService, Create, Edit } from "@/api/Service";
import { GetActiveItem } from "@/api/Item";

import { ChangeObjStatus } from "@/api/Oprationsys";
import printJS from "print-js";
export default {
  name: "Service",
  data() {
    return {
      tableData: [],
      loading: true,
      Items: [],
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
        Id: undefined,
        Name: '',
        Qty: 0,
        ItemId: undefined,
        SellingPrice: 0,
        Type: "OneByOne",
        IsPrime: false,
        Status: 0,
        Description: ''
      },
      rulesForm: {
        Name: [
          {
            required: true,
            message: "يجب إدخال اسم ",
            trigger: 'blur'
          },
          {
            minlength: 3,
            maxlength: 50,
            message: "الرجاء إدخال اسم لا يقل عن 3 حروف و لا يزيد عن 50 حرف",
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
            message: "الرجاء إدخال اسم لا يقل عن 5 حروف و لا يزيد عن 150 حرف",
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
    print(data) {
      printJS({
        printable: data,
        properties: ["Name", "Description"],
        type: "json"
      })
    },
    getdata() {
      this.loading = true;
      GetService()
        .then(response => {
          // handle success
          console.log(response)
          this.tableData = response;
          this.loading = false
        })
        .catch(error => {
          // handle error
          console.log(error);
        })
      GetActiveItem()
        .then(response => {
          // handle success
          console.log(response)
          this.Items = response;
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
        Name: '',
        Qty: 0,
        ItemId: undefined,
        SellingPrice: 0,
        Type: "OneByOne",
        IsPrime: false,
        Status: 0,
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
      this.tempForm.Name = row.Name;
      this.tempForm.ItemId = row.ItemId;
      this.tempForm.SellingPrice = row.SellingPrice;
      this.tempForm.Type = row.Type;
      this.tempForm.Qty = row.Qty;
      this.tempForm.Description = row.Description;
      this.dialogFormStatus = "update";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      })
    },
    handleOprationsys(ObjId, Opration) {
      this.dialogOprationVisible = true;
      // text
      this.textOpration.OprationDescription = Opration.OprationDescription;
      this.textOpration.ArabicOprationDescription =
        Opration.ArabicOprationDescription;
      this.textOpration.IconClass = Opration.IconClass;
      this.textOpration.ClassName = Opration.ClassName;
      /// temp
      this.tempOpration.ObjId = ObjId;
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
            ObjId: this.tempOpration.ObjId,
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

