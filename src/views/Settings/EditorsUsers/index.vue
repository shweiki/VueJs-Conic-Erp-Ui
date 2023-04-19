<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" >
        <el-button
          style="float: left"
          type='success'
          icon="el-icon-plus"
          @click="handleCreate()"
        >{{ $t('Classification.Add') }}</el-button>

        <span>محررو السندات</span>
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
        <el-table-column align="right" width="200">
          <template slot-scope="scope">
            <el-button icon="el-icon-edit"  @click="handleUpdate(scope.row)"></el-button>
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
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">إلغاء</el-button>
        <el-button type="primary" @click="dialogFormStatus==='create'?createData():updateData()">حفظ</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { GetEditorsUser, Create, Edit } from "@/api/EditorsUser";
export default {
  name: "EditorsUsers",
  data() {
    return {
      tableData: [],
      loading: true,
      search: '',
      dialogFormVisible: false,
      dialogFormStatus: '',
      textMapForm: {
        update: "تعديل",
        create: "إضافة"
      },
      tempForm: {
        Id: undefined,
        Name: ''
      },
      rulesForm: {
        Name: [
          {
            required: true,
            message: "يجب إدخال اسم ",
            trigger: 'blur'
          },
          {
            min: 3,
            max: 50,
            message: "الرجاء إدخال اسم لا يقل عن 3 حروف و لا يزيد عن 50 حرف",
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
    getdata() {
      this.loading = true;
      GetEditorsUser()
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
    },
    resetTempForm() {
      this.tempForm = {
        Id: undefined,
        Name: ''
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

      this.dialogFormStatus = "update";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      })
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
    }
  }
};
</script>

