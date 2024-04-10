<template>
  <div>
    <el-button
      type="warning"
      icon="el-icon-circle-plus"
      :size="$store.getters.size"
      @click="dialogFormVisible = true"
    />

    <el-dialog style="margin-top: -13vh" :show-close="false" :visible.sync="dialogFormVisible">
      <div slot="title" class="dialog-footer">
        <el-col :span="4">
          <el-button icon="fa fa-save" style="float: left" type="primary" @click="createData()" />
        </el-col>
        <el-col :span="20">
          <el-divider> إضافة جهاز </el-divider>
        </el-col>
      </div>
      <el-form ref="DeviceForm" :rules="rulesForm" :model="tempForm" label-position="top" label-width="70px">
        <el-form-item :label="$t('Classification.Name')" prop="Name">
          <el-input v-model="tempForm.Name" type="text" />
        </el-form-item>
        <el-form-item :label="$t('Classification.Type')" prop="Type">
          <el-input v-model="tempForm.Type" type="text" />
        </el-form-item>
        <el-form-item :label="$t('Classification.Ip')" prop="Ip">
          <el-input v-model="tempForm.Ip" type="text" />
        </el-form-item>
        <el-form-item :label="$t('Classification.Port')" prop="Port">
          <el-input v-model="tempForm.Port" type="text" />
        </el-form-item>
        <el-form-item prop="AutoConnect" label="اتصال دائما">
          <el-switch v-model="tempForm.AutoConnect" />
        </el-form-item>
        <el-form-item :label="$t('Classification.LastSetDateTime')" prop="LastSetDateTime">
          <el-input v-model="tempForm.LastSetDateTime" type="text" />
        </el-form-item>
        <el-form-item :label="$t('Classification.Notes')" prop="Description">
          <el-input v-model="tempForm.Description" type="textarea" />
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { Create, DeviceStatus } from '@/api/Device'
export default {
  data() {
    return {
      dialogFormVisible: false,
      tempForm: {
        Id: undefined,
        Name: '',
        Type: '',
        Ip: '',
        Port: '',
        Status: DeviceStatus.Active,
        AutoConnect: false,
        LastSetDateTime: new Date(),
        Description: ''
      },
      rulesForm: {
        Name: [
          {
            required: true,
            message: 'يجب إدخال إسم ',
            trigger: 'blur'
          },
          {
            min: 3,
            max: 50,
            message: 'الرجاء إدخال إسم لا يقل عن 3 أحرف و لا يزيد عن 50 حرف',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  created() {
    this.resetTempForm()
  },
  methods: {
    resetTempForm() {
      this.tempForm = {
        Id: undefined,
        Name: '',
        Type: '',
        Ip: '',
        Port: '',
        Status: 0,
        AutoConnect: false,
        LastSetDateTime: '',
        Description: ''
      }
    },
    createData() {
      this.$refs['DeviceForm'].validate((valid) => {
        if (valid) {
          Create(this.tempForm)
            .then((response) => {
              this.dialogFormVisible = false
              this.$notify({
                title: 'تم ',
                message: 'تم الإضافة بنجاح',
                type: 'success',
                duration: 2000
              })
            })
            .catch((error) => {
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
