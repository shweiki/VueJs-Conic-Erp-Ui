<template>
  <div>
    <el-button
      style="float: left"
      type="success"
      icon="el-icon-plus"
      @click="handleCreate()"
    />
    <el-dialog
      style="margin-top: -13vh"
      :show-close="false"
      title="إضافة منطقة"
      :visible.sync="dialogFormVisible"
    >
      <el-form
        ref="AreaForm"
        :rules="rulesForm"
        :model="tempForm"
        label-position="top"
        label-width="70px"
      >
        <el-form-item :label="$t('Area.City')" prop="Adress1">
          <el-input v-model="tempForm.Adress1" type="text" />
        </el-form-item>
        <el-form-item :label="$t('Area.Address1')" prop="Adress2">
          <el-input v-model="tempForm.Adress2" type="text" />
        </el-form-item>
        <el-form-item :label="$t('Area.Address2')" prop="Adress3">
          <el-input v-model="tempForm.Adress3" type="text" />
        </el-form-item>
        <el-form-item :label="$t('Area.DelievryPrice')" prop="DelievryPrice">
          <el-input-number
            v-model="tempForm.DelievryPrice"
            :precision="2"
            :step="0.1"
            :min="0.0"
            :max="1500"
            @focus="$event.target.select()"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{
          $t("Classification.cancel")
        }}</el-button>
        <el-button type="primary" @click="createData()">{{
          $t("AddVendors.Save")
        }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { Create } from '@/api/Area'

export default {
  data() {
    return {
      dialogFormVisible: false,
      tempForm: {
        Id: undefined,
        Adress1: '',
        Adress2: '',
        Adress3: '',
        DelievryPrice: 0.0
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
  methods: {
    resetTempForm() {
      this.tempForm = {
        Id: undefined,
        Adress1: '',
        Adress2: '',
        Adress3: '',
        DelievryPrice: 0.0
      }
    },
    handleCreate() {
      this.resetTempForm()
      this.dialogFormVisible = true
      this.$refs['AreaForm'].clearValidate()
    },
    createData() {
      this.$refs['AreaForm'].validate((valid) => {
        if (valid) {
          Create(this.tempForm)
            .then((response) => {
              if (response) {
                this.$emit('Done')
                this.dialogFormVisible = false
                this.$notify({
                  title: 'تم ',
                  message: 'تم الإضافة بنجاح',
                  type: 'success',
                  duration: 2000
                })
              }
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
