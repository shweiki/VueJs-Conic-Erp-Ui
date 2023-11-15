<template>
  <div>
    <el-button
      style="width: 100px"
      type="primary"
      icon="el-icon-plus"
      @click="Visibles = true"
    >تجميد</el-button>
    <el-dialog style="margin-top: -13vh" title="تسجيل تجميد" :visible.sync="Visibles">
      <el-form
        ref="dataForm"
        :model="tempForm"
        label-position="top"
        class="demo-form-inline"
      >
        عدد الايام المسموحة لتجميد : من {{ MinFreezeLimit }} الى {{ MaxFreezeLimit }} ايام
        <el-row type="flex">
          <el-col :span="24">
            <el-form-item prop="FreezeBetween" label="الفترة">
              <el-date-picker
                v-model="FreezeBetween"
                :picker-options="pickerOptions"
                :format="$store.getters.settings.DateTimeFormat"
                type="daterange"
                align="left"
                unlink-panels
                :range-separator="$t('Sales.until')"
                :start-placeholder="$t('Sales.From')"
                :end-placeholder="$t('Sales.To')"
                :default-time="['00:00:00', '23:59:59']"
                style="width: 80%"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex">
          <el-col :span="24">
            <el-form-item
              prop="Description"
              :rules="[
                {
                  required: true,
                  message: 'لايمكن ترك ملاحظات فارغ',
                  trigger: 'blur',
                },
              ]"
              :label="$t('AddVendors.Description')"
            >
              <el-input v-model="tempForm.Description" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex">
          <el-col :span="24">
            مجموع الايام حسب الفترة المطلوبة
            {{
              Math.round(
                Math.abs(
                  (new Date(FreezeBetween[0]) - new Date(FreezeBetween[1])) /
                    (24 * 60 * 60 * 1000)
                )
              )
            }}
            ايام
          </el-col>
        </el-row>
        <el-col>
          <span style="color: #f56c6c; font-size: 16px; text-align: center">{{
            ValidateNote
          }}</span>
        </el-col>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="Visibles = false">{{ $t("AddVendors.Cancel") }}</el-button>
        <el-button :disabled="EnableSave" type="primary" @click="create()">{{
          $t("AddVendors.Save")
        }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { Create } from '@/api/MembershipMovementOrder'

export default {
  props: {
    MemberShipMovementId: {
      type: Number,
      default: () => {
        return undefined
      }
    },
    MinFreezeLimit: {
      type: Number,
      default: () => {
        return undefined
      }
    },
    MaxFreezeLimit: {
      type: Number,
      default: () => {
        return undefined
      }
    }
  },
  data() {
    return {
      EnableSave: false,
      tempForm: {
        Id: undefined,
        Type: 'Freeze',
        StartDate: '',
        EndDate: '',
        Status: 0,
        Description: '',
        MemberShipMovementId: this.MemberShipMovementId
      },
      FreezeBetween: '',
      Visibles: false,
      Days: 0,
      ValidateNote: '',
      pickerOptions: {
        disabledDate(time) {
          console.log(time)
          return time.getTime() < Date.now() - 8.64e7
        }
      }
    }
  },
  methods: {
    create() {
      this.Days = Math.round(
        Math.abs(
          (new Date(this.FreezeBetween[0]) - new Date(this.FreezeBetween[1])) /
            (24 * 60 * 60 * 1000)
        )
      )
      console.log(this.Days)
      if (this.Days >= this.MinFreezeLimit && this.Days <= this.MaxFreezeLimit) {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.EnableSave = true
            this.tempForm.StartDate = this.FreezeBetween[0]
            this.tempForm.EndDate = this.FreezeBetween[1]
            Create(this.tempForm)
              .then((response) => {
                if (response) {
                  this.Visibles = false
                  this.EnableSave = false
                  this.$notify({
                    title: 'تم ',
                    message: 'تم الإضافة بنجاح',
                    type: 'success',
                    duration: 2000
                  })
                  this.$nextTick(() => {
                    this.$router.replace({
                      path: '/redirect' + this.$route.fullPath
                    })
                  })
                }
              })
              .catch((error) => {
                console.log(error)
              })
          }
        })
      } else {
        this.ValidateNote = 'عدد الايام المطلوب تجميدها غير المسموح بها'
      }
    }
  }
}
</script>
