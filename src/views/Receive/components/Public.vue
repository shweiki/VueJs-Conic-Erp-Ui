<template>
  <div class="app-container">
    <el-form
      ref="tempForm"
      :model="tempForm"
      label-position="top"
      label-width="70px"
      class="demo-ruleForm"
    >
      <el-card class="box-card">
        <div slot="header">
          <el-button
            :disabled="DisabledSave"
            style="float: left"
            type="success"
            icon="fa fa-save"
            @click="isEdit != true ? createData() : updateData()"
          >{{ isEdit != true ? "حفظ" : "تعديل" }}</el-button>
          <router-link
            class="pan-btn tiffany-btn"
            style="
              float: right;
              margin-left: 20px;
              padding: 10px 15px;
              border-radius: 6px;
            "
            icon="el-icon-plus"
            to="/Receive/List"
          >{{ $t("route.ListReceive") }}</router-link>
        </div>
        <el-row type="flex">
          <el-col :span="4">
            <el-form-item
              prop="FakeDate"
              :label="$t('NewPurchaseInvoice.ReleaseDate')"
              :rules="[
                {
                  required: true,
                  message: 'لايمكن ترك التاريخ فارغ',
                  trigger: 'blur',
                },
              ]"
            >
              <Fake-Date
                :value="tempForm.FakeDate"
                @Set="(v) => (tempForm.FakeDate = v)"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              label="الى حساب"
              prop="VendorId"
              :rules="[
                {
                  required: true,
                  message: 'لايمكن ترك حساب فارغ',
                  trigger: 'blur',
                },
              ]"
            >
              <Vendor-Search-Any
                :id="tempForm.VendorId"
                @Set="
                  (v) => {
                    AccountId = v.AccountId;
                    tempForm.VendorId = v.Id;
                  }
                "
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="طريقة الصرف" prop="ReceiveMethod">
              <Radio-Receive-Method
                type="Receive"
                :vendor-id="tempForm.VendorId"
                @Set="(v) => (tempForm.ReceiveMethod = v)"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="باسم" prop="Name">
              <el-input v-model="tempForm.Name" placeholder="اسم المستلم" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex">
          <el-col :span="12">
            <el-form-item label="القيمة المصروفة">
              <currency-input
                v-model="tempForm.TotalAmmount"
                :rules="[
                  {
                    required: true,
                    message: 'لايمكن ترك القيمة فارغ',
                    trigger: 'blur',
                  },
                ]"
                class="currency-input"
                :value-range="{ min: 0.01, max: 1000000 }"
                @focus="$event.target.select()"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('AddVendors.Description')" prop="Description">
              <el-input v-model="tempForm.Description" />
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
      </el-card>

      <el-row type="flex">
        <el-col :span="12">
          <span>{{ $t("NewPurchaseInvoice.Box") }}</span>
          <Select-Cash-Accounts @Set="(v) => (CashAccountId = v.value)" />
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script>
import { Create, Edit, GetById } from '@/api/Receive'
import FakeDate from '@/components/Date/FakeDate'
import { CreateEntry, EditEntryByFktable } from '@/api/EntryAccounting'
import VendorSearchAny from '@/components/Vendor/VendorSearchAny.vue'
import SelectCashAccounts from '@/components/TreeAccount/SelectCashAccounts.vue'
import RadioReceiveMethod from '@/components/ReceiveMethod/RadioReceiveMethod.vue'

export default {
  components: {
    FakeDate,
    VendorSearchAny,
    SelectCashAccounts,
    RadioReceiveMethod
  },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      ValidateNote: '',
      DisabledSave: false,
      tempForm: {
        Id: undefined,
        Name: '',
        FakeDate: '',
        ReceiveMethod: 'Cash',
        TotalAmmount: 0,
        Description: '',
        Status: 0,
        VendorId: 2,
        IsPrime: true,
        MemberId: undefined,
        Type: ''
      },
      AccountId: undefined,
      CashAccountId: undefined,
      tempRoute: {}
    }
  },
  created() {
    if (this.isEdit) {
      this.getdata(this.$route.params && this.$route.params.id)
    }
    this.tempRoute = Object.assign({}, this.$route)
  },
  methods: {
    restTempForm() {
      this.tempForm = {
        Id: undefined,
        Name: '',
        FakeDate: '',
        Receive: 'Cash',
        TotalAmmount: 0,
        Description: '',
        Status: 0,
        VendorId: undefined,
        IsPrime: true,
        MemberId: undefined,
        Type: ''
      }
      this.AccountId = undefined
    },
    getdata(val) {
      GetById({ Id: val })
        .then((response) => {
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
    updateData() {
      this.$refs['tempForm'].validate((valid) => {
        if (valid && this.tempForm.TotalAmmount > 0) {
          Edit(this.tempForm)
            .then((response) => {
              if (response && this.$store.getters.settings.Receive.CreateEntry == true) {
                EditEntryByFktable({
                  TableName: 'Receive',
                  Fktable: this.tempForm.Id,
                  collection: {
                    Id: undefined,
                    FakeDate: this.tempForm.FakeDate,
                    Description: '',
                    Type: 'Receive',
                    EntryMovements: [
                      {
                        Id: undefined,
                        AccountId: this.AccountId,
                        Debit: 0.0,
                        Credit: this.tempForm.TotalAmmount,
                        Description: 'سند صرف رقم ' + this.tempForm.Id + ' ',
                        EntryId: undefined,
                        TableName: 'Receive',
                        Fktable: this.tempForm.Id
                      },
                      {
                        Id: undefined,
                        AccountId: this.CashAccountId,
                        Credit: 0.0,
                        Debit: this.tempForm.TotalAmmount,
                        Description:
                          ' صرف الى ' +
                          this.tempForm.Name +
                          '   رقم ' +
                          this.tempForm.Id +
                          ' ',
                        EntryId: undefined,
                        TableName: 'Receive',
                        Fktable: this.tempForm.Id
                      }
                    ]
                  }
                }).then((res) => {
                  if (res) {
                    this.$notify({
                      message: 'تم تسجيل سند صرف مع قيد محاسبي بنجاح',
                      title: 'تم الإضافة بنجاح',
                      type: 'success',
                      position: 'top-left',
                      duration: 1000,
                      showClose: false
                    })
                    this.$confirm('هل تريد العودة ')
                      .then((_) => {
                        this.$router.back()
                      })
                      .catch((_) => {})
                  }
                })
              } else if (response) {
                this.$notify({
                  title: 'تم إضافة  بنجاح',
                  message: 'تم إضافة بنجاح',
                  type: 'success',
                  position: 'top-left',
                  duration: 1000,
                  showClose: false
                })
                this.restTempForm()
                this.$confirm('هل تريد العودة ')
                  .then((_) => {
                    this.$router.back()
                  })
                  .catch((_) => {})
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
            })
            .catch((error) => {
              console.log(error)
            })
        } else {
          this.ValidateNote = 'القيمة الإجمالية تساوي صفر  '
          return false
        }
      })
    },
    createData() {
      this.$refs['tempForm'].validate((valid) => {
        if (valid && this.tempForm.TotalAmmount > 0) {
          this.DisabledSave = true
          Create(this.tempForm)
            .then((response) => {
              if (response && this.$store.getters.settings.Receive.CreateEntry == true) {
                CreateEntry({
                  Id: undefined,
                  FakeDate: this.tempForm.FakeDate,
                  Description: '',
                  Type: 'Receive',
                  EntryMovements: [
                    {
                      Id: undefined,
                      AccountId: this.AccountId,
                      Debit: 0.0,
                      Credit: this.tempForm.TotalAmmount,
                      Description: 'سند صرف رقم ' + response + ' ',
                      EntryId: undefined,
                      TableName: 'Receive',
                      Fktable: response
                    },
                    {
                      Id: undefined,
                      AccountId: this.CashAccountId,
                      Credit: 0.0,
                      Debit: this.tempForm.TotalAmmount,
                      Description: 'سند صرف رقم ' + response + ' ',
                      EntryId: undefined,
                      TableName: 'Receive',
                      Fktable: response
                    }
                  ]
                }).then((res) => {
                  if (res) {
                    this.$notify({
                      message: 'تم تسجيل سند صرف مع قيد محاسبي بنجاح',
                      title: 'تم الإضافة بنجاح',
                      type: 'success',
                      position: 'top-left',
                      duration: 1000,
                      showClose: false
                    })
                    this.restTempForm()
                    this.$confirm('هل تريد العودة ')
                      .then((_) => {
                        this.$router.back()
                      })
                      .catch((_) => {})
                  }
                })
              } else if (response) {
                this.$notify({
                  title: 'تم إضافة  بنجاح',
                  message: 'تم إضافة بنجاح',
                  type: 'success',
                  position: 'top-left',
                  duration: 1000,
                  showClose: false
                })
                this.restTempForm()
                this.$confirm('هل تريد العودة ')
                  .then((_) => {
                    this.$router.push({ path: `/Receive/List` })
                  })
                  .catch((_) => {})
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
            })
            .catch((error) => {
              console.log(error)
            })
        } else {
          this.ValidateNote = 'القيمة الإجمالية تساوي صفر  '
          return false
        }
      })
    },
    setTagsViewTitle() {
      const title = this.$t('route.EditReceive')
      const route = Object.assign({}, this.tempRoute, {
        title: `${title}-${this.tempForm.Id}`
      })
      this.$store.dispatch('tagsView/updateVisitedView', route)
    },
    setPageTitle() {
      const title = this.$t('route.EditReceive')
      document.title = `${title} - ${this.tempForm.Id}`
    }
  }
}
</script>
