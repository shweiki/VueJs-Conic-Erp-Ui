<template>
  <div>
    <el-button :disabled="enable" type="primary" icon="el-icon-plus" @click="Visibles = true">اشتراك</el-button>
    <el-dialog style="margin-top: -13vh" title="تسجيل اشتراك" :visible.sync="Visibles">
      <el-form ref="dataForm" :model="tempForm">
        <el-form-item
          label="الفترة"
          prop="Type"
          :rules="[
            {
              required: true,
              message: 'الرجاء اختيار الفترة',
              trigger: 'blur',
            },
          ]"
        >
          <el-radio-group
            v-model="tempForm.Type"
            :rules="[{ required: true, message: 'اختيار الفترة', trigger: 'blur' }]"
            @change="calc"
          >
            <el-radio label="Morning" border>Morning</el-radio>
            <el-radio label="FullDay" border>Full Day</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label="إشتراك"
          prop="MembershipId"
          :rules="[
            {
              required: true,
              message: 'الرجاء اختيار نوع اشتراك',
              trigger: 'blur',
            },
          ]"
        >
          <Select-Memberships
            @Set="(v) => {
              Membership = v;
              tempForm.MembershipId = v.Id;
              calc();
            }
            "
          />
        </el-form-item>
        <el-form-item
          label="تاريخ بدء"
          prop="StartDate"
          :rules="[
            {
              required: true,
              message: 'لايمكن ترك التاريخ فارغ',
              trigger: 'blur',
            },
          ]"
        >
          <Fake-Date
            :value="tempForm.StartDate"
            @Set="(v) => {
              tempForm.StartDate = v;
              calc();
            }
            "
          />
        </el-form-item>
        <el-form-item
          label="تاريخ انتهاء"
          prop="EndDate"
          :rules="[
            {
              required: true,
              message: 'لايمكن ترك التاريخ فارغ',
              trigger: 'blur',
            },
          ]"
        >
          <Fake-Date
            :value="tempForm.EndDate"
            @Set="(v) => {
              tempForm.EndDate = v;
            }
            "
          />
        </el-form-item>
        <el-form-item label="خصم" prop="Discount">
          <Select-Discount
            :price="Price"
            @Set="(v) => {
              tempForm.Discount = v;
              calc();
            }
            "
          />
        </el-form-item>
        <el-form-item
          label="سبب الخصم"
          prop="DiscountDescription"
          :rules="[
            {
              required: true,
              message: 'لايمكن ترك الخصم فارغ',
              trigger: 'blur',
            },
          ]"
        >
          <el-input v-model="tempForm.DiscountDescription" style="width: 220px" />
        </el-form-item>

        <el-form-item
          :rules="[{ required: true, message: 'لايمكن تركه فارغ', trigger: 'blur' }]"
          :label="$t('AddVendors.Description')"
          prop="Description"
        >
          <el-radio-group v-model="tempForm.Description">
            <el-radio label="تجديد اشتراك" border>تجديد اشتراك</el-radio>
            <el-radio label="مشترك جديد" border>مشترك جديد</el-radio>
            <el-radio label border />
          </el-radio-group>
        </el-form-item>
        <el-form-item prop="Type" label="" />
        <el-form-item :label="$t('NewPurchaseInvoice.TotalJD')">
          <span>JOD {{ tempForm.TotalAmmount }}</span>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="Visibles = false">{{ $t("AddVendors.Cancel") }}</el-button>
        <el-button :loading="EnableSave" type="primary" @click="createData()">{{
          $t("AddVendors.Save")
        }}</el-button>
      </div>
      <el-col :span="12">
        <span>{{ $t("Account.InCome") }}</span>
        <Select-In-Come-Accounts
          :in-come-account-id="$store.getters.settings.MembershipMovement.InComeAccountId"
          @Set="(v) => (InComeAccountId = v.value)"
        />
      </el-col>
    </el-dialog>
  </div>
</template>

<script>
import { Create } from '@/api/MembershipMovement'
import SelectMemberships from '@/views/Gym/components/SelectMemberships.vue'
import FakeDate from '@/components/Date/FakeDate.vue'
import SelectDiscount from '@/components/Discount/SelectDiscount.vue'
import { Create as CreateSaleInvoice } from '@/api/SaleInvoice'
import { GetActiveService } from '@/api/Service'
import { LocalDateTime, Instant } from '@js-joda/core'
import { CreateEntry } from '@/api/EntryAccounting'
import SelectInComeAccounts from '@/components/TreeAccount/SelectInComeAccounts.vue'

export default {
  components: {
    FakeDate,
    SelectMemberships,
    SelectDiscount,
    SelectInComeAccounts
  },
  props: {
    accountId: {
      type: Number,
      required: true
    },
    memberId: {
      type: String,
      required: true
    },
    enable: {
      type: Boolean,
      default: () => {
        return true
      }
    }
  },
  data() {
    return {
      InComeAccountId: 2,
      tempForm: {
        Id: undefined,
        TotalAmmount: 0,
        Tax: 0.0,
        StartDate: '',
        EndDate: '',
        Type: '',
        VisitsUsed: 0,
        DiscountDescription: '',
        Description: '',
        Status: 1,
        MemberId: undefined,
        MembershipId: undefined
      },
      EnableSave: false,
      Visibles: false,
      Discount: 0,
      Price: 0,
      Membership: {
        Description: '',
        FullDayPrice: 45,
        Id: 2,
        MaxFreezeLimitDays: 6,
        MinFreezeLimitDays: 3,
        MorningPrice: 30,
        Name: 'شهر',
        NumberDays: 30,
        Rate: 0,
        Status: 0,
        Tax: 0.01
      },
      pickerOptions: {
        disabledDate(time) {
          console.log(time)
          return time.getTime() < Date.now() - 8.64e7
        }
      }
    }
  },
  methods: {
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        this.calc()
        if (valid) {
          this.EnableSave = true
          Create(this.tempForm)
            .then((response) => {
              if (response) {
                //  if(this.Discount.ValueOfDays >0)
                CreateEntry({
                  Id: undefined,
                  FakeDate: new Date(),
                  Description: '',
                  Type: 'MembershipMovement',
                  EntryMovements: [
                    {
                      Id: undefined,
                      AccountId: this.accountId,
                      Debit: 0.0,
                      Credit: this.tempForm.TotalAmmount,
                      Description: 'اشتراك رقم ' + response.Id + ' ',
                      EntryId: undefined,
                      TableName: 'MembershipMovement',
                      Fktable: response.Id
                    },
                    {
                      Id: undefined,
                      AccountId: this.InComeAccountId,
                      Debit: this.tempForm.TotalAmmount,
                      Credit: 0.0,
                      Description: 'اشتراك رقم ' + response.Id + ' ',
                      EntryId: undefined,
                      TableName: 'MembershipMovement',
                      Fktable: response.Id
                    }
                  ]
                }).then((res) => {
                  if (res) {
                    this.Visibles = false
                    this.EnableSave = false
                    if (
                      this.$store.getters.settings.MembershipMovement
                        .OneInBodyFreeForeach30Days === true
                    ) { this.OneInBodyFreeForeach30Days(this.Membership.NumberDays) }
                    this.$notify({
                      title: 'تم ',
                      message: 'تم الإضافة بنجاح',
                      type: 'success',
                      duration: 2000
                    })
                    this.$nextTick(() => {
                      //  this.$emit("Done");
                      this.$router.replace({
                        path: '/redirect' + this.$route.fullPath
                      })
                    })
                  }
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
    },
    calc() {
      const Membership = this.Membership
      this.Price =
        this.tempForm.Type === 'Morning'
          ? Membership.MorningPrice
          : Membership.FullDayPrice

      this.tempForm.TotalAmmount = this.Price - this.tempForm.Discount
      this.tempForm.MemberId = this.memberId

      this.tempForm.EndDate = LocalDateTime.ofInstant(
        Instant.ofEpochMilli(new Date(this.tempForm.StartDate))
      )
        .plusDays(Membership.NumberDays)
        .toString()
    },
    OneInBodyFreeForeach30Days(NumberDays) {
      if (NumberDays < 30) return false
      GetActiveService()
        .then((response) => {
          //   console.log(response);
          const Service = response.find(
            (obj) => obj.Name === 'One InBody Free Foreach 30 Days'
          )
          const SaleInvoice = {
            Id: undefined,
            Name: Service.Name,
            Tax: 0.0,
            FakeDate: new Date(),
            PaymentMethod: 'Service',
            Discount: 0,
            Status: 3,
            Description: 'فاتورة خدمية ',
            MemberId: this.memberId,
            IsPrime: true,
            InventoryMovements: []
          }
          for (var i = 0; i < Math.floor(NumberDays / 30); i++) {
            SaleInvoice.InventoryMovements.push({
              Id: undefined,
              ItemsId: Service.ItemId,
              TypeMove: 'Out',
              Status: 1,
              Qty: 1.0,
              SellingPrice: 0,
              Tax: 0.0,
              Description: '',
              InventoryItemId: 1,
              SalesInvoiceId: undefined
            })
          }
          if (SaleInvoice.InventoryMovements.length > 0) {
            CreateSaleInvoice(SaleInvoice)
              .then((response) => {
                if (response) {
                  this.$notify({
                    title: 'تم ',
                    message: 'تم الإضافة One InBody Free Foreach 30 Days بنجاح',
                    type: 'success',
                    duration: 2000
                  })
                }
              })
              .catch((error) => {
                console.log(error)
              })
          }
        })
        .catch((err) => {
          console.log(err)
        })
    }
  }
}
</script>
<style scoped>
.el-date-editor.el-input,
.el-date-editor.el-input__inner {
  width: 220px;
}
</style>
