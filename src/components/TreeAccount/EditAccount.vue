<template>
  <div>
    <el-button
      type="success"
      icon="el-icon-edit"
      :disabled="AccountId == undefined"

      @click="getdata()"
    />
    <el-dialog
      style="margin-top: -13vh"
      :show-close="false"
      :visible.sync="Visible"
      @opened="$refs['Name'].focus()"
    >
      <div slot="title" class="dialog-footer">
        <el-col :span="4">
          <el-button
            icon="fa fa-save"
            style="float: left"
            type="primary"
            @click="updateData()"
          />
        </el-col>
        <el-col :span="20">
          <el-divider> تعديل حساب {{ tempForm.Id }}</el-divider>
        </el-col>
      </div>
      <el-form
        ref="dataForm"
        :rules="rulesForm"
        :model="tempForm"
        label-position="top"
        label-width="70px"
      >
        <el-form-item :label="$t('Account.AccType')" prop="Type">
          <select-accounts-type
            :value="tempForm.Type"
            @Set="(v) => (tempForm.Type = v)"
          />
        </el-form-item>
        <el-form-item :label="$t('Account.AccName')" prop="Name">
          <el-input ref="Name" v-model="tempForm.Name" type="text" />
        </el-form-item>
        <el-form-item :label="$t('Account.Code')" prop="Code">
          <el-input v-model="tempForm.Code" type="text" />
        </el-form-item>
        <el-form-item label="تحت قائمة" prop="ParentId">
          <SelectParent
            :value="tempForm.ParentId"
            @Set="
              (v) => {
                tempForm.ParentId = v.Code;
              }
            "
          />
        </el-form-item>
        <el-form-item :label="$t('Account.Notes')" prop="Description">
          <el-input v-model="tempForm.Description" type="textarea" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="Visible = false">{{ $t("Account.cancel") }}</el-button>
        <el-button type="primary" @click="updateData()">{{
          $t("Account.Save")
        }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { Edit, GetById } from '@/api/Account'
import SelectAccountsType from '@/components/TreeAccount/SelectAccountsType.vue'
import SelectParent from '@/components/TreeAccount/SelectParent.vue'

export default {
  components: { SelectAccountsType, SelectParent },
  props: {
    AccountId: {
      type: Number,
      default: undefined
    }
  },
  data() {
    return {
      Visible: false,
      tempForm: {
        Id: undefined,
        Name: '',
        Status: 0,
        Code: '',
        Type: undefined,
        Description: '',
        ParentId: 0
      },
      rulesForm: {
        Name: [
          {
            required: true,
            message: 'الرجاء ادخال الاسم',
            trigger: 'blur'
          },
          {
            min: 3,
            max: 50,
            message: 'الرجاء إدخال إسم لا يقل عن 3 حروف و لا يزيد عن 50 حرف',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    getdata() {
      GetById({ Id: this.AccountId }).then((response) => {
        // handle success
        this.tempForm = response
        this.Visible = true
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          Edit(this.tempForm)
            .then((response) => {
              this.$emit('Done')
              this.Visible = false
              this.$notify({
                title: 'تم ',
                message: 'تم تعديل بنجاح',
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
