<template>
  <div class="app-container">
    <el-form
      ref="tempForm"
      :model="tempForm"
      label-position="top"
      label-width="70px"
      class="demo-ruleForm"
    >
      <el-row class="card" type="flex">
        <el-col :span="18">
          <Drawer-Print
            :disabled="OldVisit == null ? false : true"
            type="Visit"
            :data="OldVisit"
          />
        </el-col>
        <el-col :span="3">
          <el-switch
            v-model="AutoPrint"
            active-color="#13ce66"
            inactive-color="#ff4949"
          />
        </el-col>
        <el-col :span="3">
          <el-button
            :disabled="DisabledSave"
            style="float: left"
            type="success"
            icon="fa fa-save"
            @click="confirmData()"
          >{{ isEdit != true ? "حفظ" : "تعديل" }}</el-button>
        </el-col>
      </el-row>
      <el-row type="flex">
        <el-col :span="12">
          <el-form-item
            prop="FakeDate"
            :label="$t('Visit.ReleaseDate')"
            :rules="[
              {
                required: true,
                message: 'لايمكن ترك التاريخ فارغ',
                trigger: 'blur',
              },
            ]"
          >
            <Fake-Date :value="tempForm.FakeDate" @Set="(v) => (tempForm.FakeDate = v)" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('Visit.PaymentMethod')" prop="PaymentMethod">
            <el-radio-group v-model="tempForm.PaymentMethod" text-color="#f78123">
              <el-radio label="Cash" border>{{ $t("Visit.Cash") }}</el-radio>
              <el-radio label="Visa" border>{{ $t("Visit.Visa") }}</el-radio>
              <el-radio label="Coupon" border>{{ $t("Visit.Coupon") }}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex">
        <el-col :span="12">
          <el-form-item
            :label="$t('Visit.Name')"
            prop="Name"
            :rules="[
              {
                required: true,
                message: 'لايمكن ترك التاريخ فارغ',
                trigger: 'blur',
              },
            ]"
          >
            <el-input
              v-model="tempForm.Name"
              required
              :size="$store.getters.size"
              suffix-icon="fa fa-child"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('Visit.PhoneNumber')">
            <el-input
              v-model="tempForm.PhoneNumber"
              required
              :size="$store.getters.size"
              suffix-icon="fa fa-mobile-alt"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="tempForm.PaymentMethod != 'Coupon'" type="flex">
        <el-col :span="8">
          <el-form-item :label="$t('Visit.PersonCount')" prop="PersonCount">
            <el-input-number
              v-model="tempForm.PersonCount"
              :size="$store.getters.size"
              :precision="0"
              :step="1"
              :min="1"
              :max="1000000"
              @focus="$event.target.select()"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('Visit.HourCount')" prop="HourCount">
            <el-input-number
              v-model="tempForm.HourCount"
              :size="$store.getters.size"
              :precision="2"
              :step="0.5"
              :min="0.5"
              :max="18"
              @focus="$event.target.select()"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('Visit.HourPrice')" prop="HourPrice">
            <el-input-number
              v-model="tempForm.HourPrice"
              :disabled="!checkPermission(['admin'])"
              :size="$store.getters.size"
              :precision="0"
              :step="1"
              :min="1"
              :max="1000000"
              @focus="$event.target.select()"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="tempForm.PaymentMethod == 'Coupon'" type="flex">
        <el-col :span="12">
          <el-form-item :label="$t('Visit.CouponId')" prop="CouponId">
            <el-input
              v-model="tempForm.CouponId"
              :size="$store.getters.size"
              suffix-icon="fa fa-ticket-alt"
              @focus="$event.target.select()"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('Visit.CouponNoteId')" prop="CouponNoteId">
            <el-input
              v-model="tempForm.CouponNoteId"
              :size="$store.getters.size"
              suffix-icon="fa fa-book"
              @focus="$event.target.select()"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex">
        <el-col>
          <span style="color: #f56c6c; font-size: 16px; text-align: center">{{
            ValidateNote
          }}</span>
        </el-col>
      </el-row>
      <el-row type="flex">
        <el-col :span="8">
          <span style="font-size: 18px">{{ $t("Visit.statement") }}</span>
          <el-form-item prop="Description">
            <el-input v-model="tempForm.Description" type="textarea" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <span style="font-size: 18px">خصم</span>
          <el-form-item prop="Discount">
            <el-input-number
              v-model="tempForm.Discount"
              :precision="2"
              :step="1"
              :min="0.0"
              :max="100"
              @focus="$event.target.select()"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8" class="TotalAmmount card">
          <span>{{ $t("Visit.TotalJD") }}</span>
          <span>{{
            (
              tempForm.PersonCount * (tempForm.HourCount * 2) * tempForm.HourPrice -
              tempForm.Discount
            ).toFixed($store.getters.settings.ToFixed)
          }}
            JOD</span>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script>
import { Create, Edit, GetById } from '@/api/Visit'
import FakeDate from '@/components/Date/FakeDate'
import checkPermission from '@/utils/permission'
import { PrintReport } from '@/report/FunctionalityReport'
import DrawerPrint from '@/components/PrintRepot/DrawerPrint.vue'
import { Now, addMinutes } from '@/utils'

export default {
  name: 'Visit',
  components: {
    FakeDate,
    DrawerPrint
  },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      OldVisit: null,
      AutoPrint: true,
      ValidateNote: '',
      DisabledSave: false,
      tempForm: {
        Id: undefined,
        Name: '',
        Tax: 0.0,
        FakeDate: '',
        PaymentMethod: 'Cash',
        Discount: 0,
        Status: 0,
        PersonCount: 1,
        HourCount: 0.5,
        HourPrice: 1,
        PhoneNumber: '',
        Type: '',
        Description: ''
      },
      tempRoute: {}
    }
  },
  created() {
    if (this.isEdit) {
      this.getdata(this.$route.params && this.$route.params.id)
    }
    this.tempRoute = Object.assign({}, this.$route)
    // Why need to make a copy of this.$route here?
    // Because if you enter this page and quickly switch tag, may be in the execution of the setTagsViewTitle function, this.$route is no longer pointing to the current page
    // https://github.com/PanJiaChen/vue-element-admin/issues/1221
  },
  methods: {
    checkPermission,
    getdata(val) {
      GetById({ Id: val })
        .then((response) => {
          //  console.log(response);
          this.tempForm = response
          // set tagsview title
          this.setTagsViewTitle()
          // set page title
          this.setPageTitle()
        })
        .catch((err) => {
          console.log(err)
        })
    },
    restTempForm() {
      this.tempForm = {
        Id: undefined,
        Name: '',
        Tax: 0.0,
        FakeDate: '',
        PaymentMethod: 'Cash',
        Discount: 0,
        Status: 0,
        PersonCount: 1,
        HourCount: 0.5,
        HourPrice: 1,
        PhoneNumber: '',
        Type: '',
        Description: ''
      }
    },
    confirmData() {
      this.$refs['tempForm'].validate(async(valid) => {
        if (this.tempForm.PaymentMethod == 'Coupon') {
          this.tempForm.PersonCount = 1
          this.tempForm.HourCount = 0.5
          this.tempForm.HourPrice = 0
          this.tempForm.Description =
            'كوبون رقم ' +
            this.tempForm.CouponId +
            ' من دفتر رقم ' +
            this.tempForm.CouponNoteId +
            ' '
        }
        this.tempForm.Total = (
          this.tempForm.PersonCount *
            (this.tempForm.HourCount * 2) *
            this.tempForm.HourPrice -
          this.tempForm.Discount
        ).toFixed(this.$store.getters.settings.ToFixed)
        if (valid) {
          this.tempForm.Tax = parseInt(this.tempForm.Tax)
          this.DisabledSave = true
          this.tempForm.FakeDate = Now()
          this.tempForm.TimeOut = addMinutes(new Date(), this.tempForm.HourCount)
          let Done
          if (this.isEdit != true) {
            Done = await Create(this.tempForm)
              .then((res) => {
                if (res) {
                  return res
                } else return false
              })
              .catch((error) => {
                return false
              })
          } else {
            Done = await Edit(this.tempForm)
              .then((res) => {
                if (res) return res
                else return false
              })
              .catch((error) => {
                return false
              })
          }
          if (Done) {
            this.tempForm.Id = Done
            this.OldVisit = this.tempForm
            if (this.AutoPrint == true) {
              PrintReport('Visit', this.OldVisit)
            }
            this.DisabledSave = false
            this.restTempForm()
            this.$notify({
              title: 'تم الإضافة بنجاح',
              message: 'تم الإضافة بنجاح',
              type: 'success',
              position: 'top-left',
              duration: 1000,
              showClose: false
            })
          } else {
            this.$notify({
              title: 'مشكلة',
              message: 'حصلت مشكلة في عملية الحفظ',
              type: 'error',
              position: 'top-left',
              duration: 1000,
              showClose: false
            })
          }
          this.restTempForm()
          this.DisabledSave = false
        } else {
          this.ValidateNote = 'القيمة الإجمالية تساوي صفر  '
          this.DisabledSave = false
          return false
        }
      })
    },
    setTagsViewTitle() {
      const title = this.$t('route.EditVisit')
      const route = Object.assign({}, this.tempRoute, {
        title: `${title}-${this.tempForm.Id}`
      })
      this.$store.dispatch('tagsView/updateVisitdView', route)
    },
    setPageTitle() {
      const title = this.$t('route.EditVisit')
      document.title = `${title} - ${this.tempForm.Id}`
    }
  }
}
</script>
<style scoped>
.card {
  background: #3f7faf;
  color: white;
}
.TotalAmmount {
  padding: 25px;
  font-size: 22px;
  border: dotted;
  font-weight: 700;
}
.el-row--flex {
  padding: 0.5px;
}
.el-form-item {
  margin-bottom: 7px;
}
</style>
