﻿<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header">
        <el-button
          style="float: left"
          type="success"
          icon="el-icon-plus"
          @click="handleCreate()"
        >{{ $t("Classification.Add") }}</el-button>
        <el-button
          style="float: left"
          icon="el-icon-printer"
          type="primary"
          @click="print(tableData)"
        />
        <span>{{ $t("Classification.Unit") }}</span>
      </div>
      <el-table
        v-loading="loading"
        :data="
          tableData.filter(
            data =>
              !search || data.Name.toLowerCase().includes(search.toLowerCase())
          )
        "
        fit
        border
        max-height="900"
        highlight-current-row
        style="width: 100%"
      >
        <el-table-column prop="Id" width="80" align="center">
          <template slot="header" slot-scope="{}">
            <el-button
              type="primary"
              icon="el-icon-refresh"
              @click="getdata()"
            />
          </template>
        </el-table-column>
        <el-table-column prop="Name" align="center">
          <template slot="header" slot-scope="{}">
            <el-input
              v-model="search"
              :placeholder="$t('Classification.Name')"
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="Value"
          label="القيمة"
          align="center"
        />
        <el-table-column
          prop="Type"
          label="نوع"
          align="center"
        />
        <el-table-column
          prop="ValueOfDays"
          label="عدد الايام الاضافية"
          align="center"
        />

        <el-table-column
          :label="$t('Classification.Notes')"
          prop="Description"
          width="220"
          align="center"
        />
        <el-table-column
          :label="$t('Classification.Status')"
          width="120"
          align="center"
        >
          <template slot-scope="scope">
            <Status-Tag :status="scope.row.Status" table-name="Discount" />
            <el-button
              icon="el-icon-edit"
              @click="handleUpdate(scope.row)"
            />
          </template>
        </el-table-column>
        <!--  <el-table-column align="right" width="200">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.Opration.Status != -1"
              icon="el-icon-edit"
              @click="handleUpdate(scope.row)"
            ></el-button>
            <el-button
              v-for="(NOprations, index) in scope.row.NextOprations"
              :key="index"
              :type="NOprations.ClassName"
              @click="handleOprationsys(scope.row.Id, NOprations)"
              >{{ NOprations.OprationDescription }}</el-button
            >
          </template>
        </el-table-column>-->
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
        <el-form-item :label="$t('Classification.Name')" prop="Name">
          <el-input v-model="tempForm.Name" type="text" />
        </el-form-item>
        <el-form-item label="القيمة" prop="Value">
          <el-input v-model="tempForm.Value" type="number" />
        </el-form-item>
        <el-form-item label="عدد الايام الاضافية لشهر" prop="ValueOfDays">
          <el-input v-model="tempForm.ValueOfDays" type="number" />
        </el-form-item>
        <el-select v-model="tempForm.Type" placeholder="Select">
          <el-option label="نسية" value="Percentage" />
          <el-option label="مقطوع" value="Value" />
        </el-select>
        <el-form-item
          :label="$t('Classification.Status')"
          prop="Description"
        >
          <el-input v-model="tempForm.Description" type="textarea" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">إلغاء</el-button>
        <el-button
          type="primary"
          @click="dialogFormStatus === 'create' ? createData() : updateData()"
        >حفظ</el-button>
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
        <el-form-item
          :label="$t('Classification.OperationNote')"
          prop="Description"
        >
          <el-input
            v-model="tempOpration.Description"
            type="textarea"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button
          :type="textOpration.ClassName"
          @click="createOprationData()"
        >{{ textOpration.OprationDescription }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { GetDiscount, Create, Edit } from '@/api/Discount'
import { ChangeObjStatus } from '@/api/Oprationsys'
import printJS from 'print-js'
import StatusTag from '@/components/Oprationsys/StatusTag'

export default {
  name: 'Discount',
  components: { StatusTag },
  data() {
    return {
      tableData: [],
      loading: true,
      dialogFormVisible: false,
      dialogOprationVisible: false,
      dialogFormStatus: '',
      search: '',
      textMapForm: {
        update: 'تعديل',
        create: 'إضافة'
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
        Value: 0,
        ValueOfDays: 0,
        Type: 'Percentage',
        IsPrime: false,
        Status: 0,
        Description: ''
      },
      rulesForm: {
        Name: [
          {
            required: true,
            message: 'يجب إدخال اسم ',
            trigger: 'blur'
          },
          {
            min: 3,
            max: 50,
            message: 'الرجاء إدخال اسم لا يقل عن 3 حروف و لا يزيد عن 50 حرف',
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
            message: 'يجب إدخال ملاحظة للعملية',
            trigger: 'blur'
          },
          {
            min: 5,
            max: 150,
            message: 'الرجاء إدخال اسم لا يقل عن 5 حروف و لا يزيد عن 150 حرف',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  created() {
    this.getdata()
  },
  methods: {
    print(data) {
      printJS({
        printable: data,
        properties: ['Name', 'Description'],
        type: 'json'
      })
    },
    getdata() {
      this.loading = true
      GetDiscount()
        .then(response => {
          // handle success
          console.log(response)
          this.tableData = response
          this.loading = false
        })
        .catch(error => {
          // handle error
          console.log(error)
        })
    },
    resetTempForm() {
      this.tempForm = {
        Id: undefined,
        Name: '',
        Type: 'Percentage',
        IsPrime: false,
        Status: 0,
        Description: ''
      }
    },
    handleCreate() {
      this.resetTempForm()
      this.dialogFormStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleUpdate(row) {
      console.log(row)
      this.tempForm.Id = row.Id
      this.tempForm.Name = row.Name
      this.tempForm.Type = row.Type
      this.tempForm.Value = row.Value
      this.tempForm.ValueOfDays = row.ValueOfDays

      this.tempForm.Description = row.Description
      this.dialogFormStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleOprationsys(ObjId, Opration) {
      this.dialogOprationVisible = true
      // text
      this.textOpration.OprationDescription = Opration.OprationDescription
      this.textOpration.ArabicOprationDescription =
        Opration.ArabicOprationDescription
      this.textOpration.IconClass = Opration.IconClass
      this.textOpration.ClassName = Opration.ClassName
      // / temp
      this.tempOpration.ObjId = ObjId
      this.tempOpration.OprationId = Opration.Id
      this.tempOpration.Description = ''
    },
    createData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          Create(this.tempForm)
            .then(response => {
              this.getdata()
              this.dialogFormVisible = false
              this.$notify({
                title: 'تم ',
                message: 'تم الإضافة بنجاح',
                type: 'success',
                duration: 2000
              })
            })
            .catch(error => {
              console.log(error)
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    updateData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          Edit(this.tempForm)
            .then(response => {
              this.getdata()
              this.dialogFormVisible = false
              this.$notify({
                title: 'تم',
                message: 'تم التعديل بنجاح',
                type: 'success',
                duration: 2000
              })
            })
            .catch(error => {
              console.log(error)
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    createOprationData() {
      this.$refs['dataOpration'].validate(valid => {
        if (valid) {
          console.log(this.tempOpration)
          ChangeObjStatus({
            ObjId: this.tempOpration.ObjId,
            OprationId: this.tempOpration.OprationId,
            Description: this.tempOpration.Description
          })
            .then(response => {
              this.getdata()
              this.dialogOprationVisible = false
              this.$notify({
                title: 'تم  ',
                message: 'تمت العملية بنجاح',
                type: 'success',
                duration: 2000
              })
            })
            .catch(error => {
              console.log(error)
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>
