<template>
  <div>
    <el-button icon="el-icon-edit" @click="Visibles = true" />

    <el-dialog
      style="margin-top: -13vh; text-align: center"
      title="تسجيل تجميد"
      :visible.sync="Visibles"
      @opened="getdata"
    >
      <el-form ref="dataForm" :model="tempForm" label-position="top" class="demo-form-inline">
        عدد الايام المسموحة لتجميد : من {{ MinFreezeLimit }} الى {{ MaxFreezeLimit }} ايام
        <el-row type="flex">
          <el-col :span="24">
            <el-form-item prop="FreezeBetween" label="الفترة">
              <el-date-picker
                v-model="FreezeBetween"
                format="yyyy-MM-dd"
                type="daterange"
                align="left"
                unlink-panels
                :range-separator="$t('Sales.until')"
                :start-placeholder="$t('Sales.From')"
                :end-placeholder="$t('Sales.To')"
                :default-time="['00:00:00', '23:59:59']"
                style="width: 100%"
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
import { Edit, GetById } from '@/api/MembershipMovementOrder'
import {
  LocalDateTime,
  DateTimeFormatter,
  Instant
} from '@js-joda/core'
export default {
  props: {
    MemberShipMovementOrderId: {
      type: Number,
      required: true
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
      tempForm: {},
      FreezeBetween: [],
      Visibles: false,
      Days: 0,
      ValidateNote: ''
    }
  },
  methods: {
    getdata() {
      GetById({ Id: this.MemberShipMovementOrderId })
        .then((response) => {
          console.log(response)
          this.tempForm = response
          this.FreezeBetween = [this.tempForm.StartDate, this.tempForm.EndDate]
          this.Visibles = true
        })
        .catch((err) => {
          console.log(err)
        })
    },
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
            this.tempForm.StartDate = LocalDateTime.ofInstant(Instant.ofEpochMilli(this.FreezeBetween[0])).format(
              DateTimeFormatter.ofPattern('yyyy-MM-dd HH:mm'))
            this.tempForm.EndDate = LocalDateTime.ofInstant(Instant.ofEpochMilli(this.FreezeBetween[1])).format(
              DateTimeFormatter.ofPattern('yyyy-MM-dd HH:mm'))
            Edit(this.tempForm)
              .then((response) => {
                if (response) {
                  this.Visibles = false
                  this.EnableSave = false
                  this.$notify({
                    title: 'تم ',
                    message: 'تم تعديل بنجاح',
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
