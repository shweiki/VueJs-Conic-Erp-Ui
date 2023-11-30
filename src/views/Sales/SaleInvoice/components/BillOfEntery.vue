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
        <el-row slot="header" type="flex">
          <el-col :span="20">
            <Drawer-Print
              :disabled="tempForm == null ? false : true"
              type="SaleInvoice"
              :data="tempForm"
            />
          </el-col>
          <el-col :span="4">
            <el-button
              :disabled="DisabledSave"
              type="success"
              icon="fa fa-save"
              @click="confirmData()"
            >{{ isEdit != true ? "حفظ" : "تعديل" }}</el-button>
          </el-col>
        </el-row>
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
              <vendor-search-any
                :id="tempForm.VendorId"
                @Set="
                  (v) => {
                    Vendor = v;
                    tempForm.VendorId = v.Id;
                  }
                "
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              label="طريقة الدفع"
              prop="PaymentMethod"
              :rules="[
                {
                  required: true,
                  message: 'Please Choose Payment Method',
                  trigger: 'blur',
                },
              ]"
            >
              <radio-payment-method
                :value="tempForm.PaymentMethod"
                :vendor-id="tempForm.VendorId"
                type="SaleInvoice"
                @Set="(v) => (tempForm.PaymentMethod = v)"
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
          <el-col>
            <span style="color: #f56c6c; font-size: 16px; text-align: center">{{
              ValidateNote
            }}</span>
          </el-col>
        </el-row>
        <el-card style="background: #545454" :body-style="{ padding: '1px' }">
          <items-search :with-bar-code="true" @add="AddItem" />
        </el-card>
        <el-table :data="tempForm.InventoryMovements" fit border>
          <el-table-column align="center" prop="Name">
            <template
              slot="header"
              slot-scope="{}"
            >{{ $t("NewPurchaseInvoice.Items") }} ({{
              tempForm.InventoryMovements.length.toFixed(
                $store.getters.settings.ToFixed
              )
            }})</template>
            <template slot-scope="scope">
              <el-row type="flex">
                <el-col :span="24">
                  {{ tempForm.InventoryMovements[scope.$index].Name }}
                </el-col>
              </el-row>
            </template>
          </el-table-column>
          <el-table-column
            v-if="isEdit == false"
            label="المتوفر"
            width="80"
            align="center"
          >
            <template slot-scope="scope">
              {{ scope.row.Item.TotalIn - scope.row.Item.TotalOut }}
            </template>
          </el-table-column>
          <el-table-column width="130" align="center">
            <template
              slot="header"
              slot-scope="{}"
            >{{ $t("NewPurchaseInvoice.quantity") }} ({{
              tempForm.InventoryMovements.reduce(
                (a, b) => a + (b["Qty"] || 0),
                0
              ).toFixed($store.getters.settings.ToFixed)
            }})</template>
            <template slot-scope="scope">
              <el-input-number
                v-model="tempForm.InventoryMovements[scope.$index].Qty"
                controls-position="right"
                :precision="2"
                :step="1"
                :min="0.0"
                :max="1000000"
                select
                @focus="$event.target.select()"
              />
            </template>
          </el-table-column>
          <el-table-column width="220" align="center">
            <template slot="header" slot-scope="{}">{{
              $t("NewPurchaseInvoice.Price")
            }}</template>
            <template slot-scope="scope">
              <currency-input
                v-model="tempForm.InventoryMovements[scope.$index].SellingPrice"
                class="currency-input"
                :precision="10"
                @focus="$event.target.select()"
              />
            </template>
          </el-table-column>
          <el-table-column width="120" align="center">
            <template slot="header" slot-scope="{}">{{
              $t("NewPurchaseInvoice.TotalValue")
            }}</template>
            <template slot-scope="scope">{{
              (
                tempForm.InventoryMovements[scope.$index].SellingPrice *
                tempForm.InventoryMovements[scope.$index].Qty
              ).toFixed($store.getters.settings.ToFixed)
            }}</template>
          </el-table-column>
          <el-table-column align="center">
            <template slot="header" slot-scope="{}">{{
              $t("NewPurchaseInvoice.BillOfEntery")
            }}</template>
            <template slot-scope="scope">
              <SelectBillOfEntery
                :id="scope.row.BillOfEnteryId"
                :item-id="scope.row.ItemsId"
                @Set="
                  (v) => (tempForm.InventoryMovements[scope.$index].BillOfEnteryId = v)
                "
              />
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('NewPurchaseInvoice.description')"
            width="200"
            align="center"
          >
            <template slot-scope="scope">
              <el-form-item :prop="'InventoryMovements.' + scope.$index + '.Description'">
                <el-input
                  v-model="tempForm.InventoryMovements[scope.$index].Description"
                  required
                  class="input-with-select"
                >
                  <template slot="prepend">
                    <el-button
                      icon="fa fa-copy"
                      @click="Copy(scope.row.Description)"
                    />
                  </template>
                  <template slot="append">
                    <el-button
                      icon="fa fa-paste"
                      @click="Paste(scope.$index)"
                    />
                  </template>
                </el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column width="55">
            <template slot-scope="scope">
              <el-button
                type="danger"
                icon="el-icon-delete"
                @click="RemoveItem(scope.$index)"
              />
            </template>
          </el-table-column>
        </el-table>
      </el-card>
      <el-row type="flex">
        <el-col :span="24">
          <el-card shadow="hover">
            <el-divider direction="vertical" />
            <span>{{ $t("NewPurchaseInvoice.Items") }}</span>
            <el-divider direction="vertical" />
            <span>{{
              tempForm.InventoryMovements.length.toFixed($store.getters.settings.ToFixed)
            }}</span>
            <el-divider direction="vertical" />

            <span>{{ $t("NewPurchaseInvoice.QuantityAmount") }}</span>
            <el-divider direction="vertical" />
            <span>{{
              tempForm.InventoryMovements.reduce(
                (a, b) => a + (b["Qty"] || 0),
                0
              ).toFixed($store.getters.settings.ToFixed)
            }}</span>
            <el-divider direction="vertical" />

            <span>{{ $t("NewPurchaseInvoice.TotalDiscount") }}</span>
            <el-divider direction="vertical" />
            <span>
              <el-input-number
                v-model="tempForm.Discount"
                :precision="2"
                :step="1"
                :min="0.0"
                :max="100000"
                @focus="$event.target.select()"
              />
            </span>
            <el-divider direction="vertical" />

            <span>{{ $t("NewPurchaseInvoice.Tax") }}</span>
            <el-divider direction="vertical" />
            <span>
              <el-input-number
                v-model="tempForm.Tax"
                :precision="2"
                :step="1"
                :min="0.0"
                :max="100000"
                @focus="$event.target.select()"
              />
            </span>
            <el-divider direction="vertical" />

            <span>{{ $t("NewPurchaseInvoice.TotalJD") }}</span>
            <el-divider direction="vertical" />
            <span>{{
              (
                tempForm.Tax +
                (tempForm.InventoryMovements.reduce((prev, cur) => {
                  return prev + cur.Qty * cur.SellingPrice;
                }, 0) -
                  tempForm.Discount)
              ).toFixed($store.getters.settings.ToFixed)
            }}
              JOD</span>
            <el-divider direction="vertical" />
          </el-card>
        </el-col>
      </el-row>
      <el-col :span="10">
        <el-form-item>
          <el-input
            v-model="tempForm.Description"
            :placeholder="$t('NewPurchaseInvoice.statement')"
            type="textarea"
          />
        </el-form-item>
      </el-col>
      <el-row type="flex">
        <el-col :span="12">
          <span>{{ $t("NewPurchaseInvoice.Box") }}</span>
          <Select-Cash-Accounts @Set="(v) => (CashAccountId = v.value)" />
        </el-col>
        <el-col :span="12">
          <span>{{ $t("Account.InCome") }}</span>
          <Select-In-Come-Accounts @Set="(v) => (InComeAccountId = v.value)" />
        </el-col>
        <el-col :span="12">
          <span>{{ $t("Account.Bank") }}</span>
          <Select-Bank-Accounts @Set="(v) => (BankAccountId = v.value)" />
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script>
import { Create, Edit, GetSaleInvoiceById } from '@/api/SaleInvoice'
import FakeDate from '@/components/Date/FakeDate'
import { EditEntryByFktable, GenerateSaleInvoiceEntry } from '@/api/EntryAccounting'
import ItemsSearch from '@/components/Item/ItemsSearch'
import VendorSearchAny from '@/components/Vendor/VendorSearchAny.vue'
import SelectCashAccounts from '@/components/TreeAccount/SelectCashAccounts.vue'
import SelectBillOfEntery from '@/views/Purchases/BillOfEntery/components/SelectBillOfEntery.vue'
import SelectBankAccounts from '@/components/TreeAccount/SelectBankAccounts.vue'
import SelectInComeAccounts from '@/components/TreeAccount/SelectInComeAccounts.vue'
import RadioPaymentMethod from '@/components/PaymentMethod/RadioPaymentMethod.vue'
import DrawerPrint from '@/components/PrintRepot/DrawerPrint.vue'

export default {
  name: 'NewSalesInvoice',
  components: {
    ItemsSearch,
    FakeDate,
    VendorSearchAny,
    SelectBillOfEntery,
    SelectInComeAccounts,
    SelectCashAccounts,
    RadioPaymentMethod,
    SelectBankAccounts,
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
      OldInvoice: null,
      ValidateNote: '',
      DisabledSave: false,
      tempForm: {
        Id: undefined,
        Name: '',
        Tax: 0.0,
        AccountInvoiceNumber: '',
        FakeDate: '',
        PaymentMethod: 'Receivables',
        Discount: 0,
        VendorId: 2,
        Status: this.$store.getters.settings.PointOfSale.CreateEntry === true ? 1 : 0,
        InventoryMovements: []
      },
      rules: {
        InventoryMovements: [
          {
            type: 'array',
            required: true,
            message: 'لا يمكن إستكمال عملية الشراء من غير إضافة أصناف',
            trigger: 'change'
          }
        ]
      },
      CashAccountId: undefined,
      InComeAccountId: undefined,
      BankAccountId: undefined,
      Vendor: {},
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
        Tax: 0.0,
        CashAccountId: undefined,
        InComeAccountId: undefined,
        AccountInvoiceNumber: '',
        FakeDate: '',
        PaymentMethod: 'Receivables',
        Discount: 0,
        VendorId: 2,
        Status: this.$store.getters.settings.PointOfSale.CreateEntry === true ? 1 : 0,

        InventoryMovements: []
      }
    },
    getdata(val) {
      GetSaleInvoiceById({ Id: val })
        .then((response) => {
          console.log(response)
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
    AddItem(item) {
      const find = this.$store.getters.settings.PointOfSale.QtyCounter
        ? this.tempForm.InventoryMovements.findIndex((value) => value.ItemsId === item.Id)
        : -1
      if (find !== -1) this.tempForm.InventoryMovements[find].Qty += 1
      else {
        this.tempForm.InventoryMovements.unshift({
          Id: undefined,
          ItemsId: item !== undefined ? item.Id : undefined,
          TypeMove: 'Out',
          Status: 0,
          Qty: 1.0,
          SellingPrice: item.SellingPrice,
          Tax: 0.0,
          InventoryItemId: 1,
          Name: item.Name,
          Description: '',
          Item: item,
          BillOfEnteryId: null,
          TotalIn: item.TotalIn,
          TotalOut: item.TotalOut
        })
      }
    },
    RemoveItem(index) {
      this.tempForm.InventoryMovements.splice(index, 1)
    },
    confirmData() {
      this.$refs['tempForm'].validate(async(valid) => {
        this.tempForm.Tax = parseInt(this.tempForm.Tax)
        this.tempForm.Total =
          this.tempForm.Tax +
          (this.tempForm.InventoryMovements.reduce((prev, cur) => {
            return prev + cur.Qty * cur.SellingPrice
          }, 0) -
            this.tempForm.Discount)
        if (
          valid &&
          this.tempForm.Total > 0 &&
          this.tempForm.InventoryMovements.length > 0 &&
          this.tempForm.InventoryMovements.reduce((a, b) => a + (b['Qty'] || 0), 0) > 0
        ) {
          let Done
          if (this.isEdit !== true) {
            Done = await Create(this.tempForm)
              .then((res) => {
                if (res) {
                  this.tempForm.Id = res.Id
                  return res
                } else return false
              })
          } else {
            Done = await Edit(this.tempForm)
              .then((res) => {
                if (res) return res
                else return false
              })
          }

          if (Done && this.$store.getters.settings.PointOfSale.CreateEntry === true) {
            EditEntryByFktable({
              TableName: 'SaleInvoice',
              Fktable: this.tempForm.Id,
              collection: await GenerateSaleInvoiceEntry(
                this.tempForm,
                this.Vendor,
                this.InComeAccountId,
                this.CashAccountId,
                this.BankAccountId
              )
            })
              .then((res) => {
                if (res) {
                  this.$notify({
                    title: 'تم ' + this.isEdit ? 'تعديل' : 'إضافة' + ' ',
                    message:
                      'تم ' + this.isEdit
                        ? 'تعديل'
                        : 'إضافة' + ' الفاتورة مع قيد محاسبي بنجاح',
                    type: 'success',
                    position: 'top-left',
                    duration: 1000,
                    showClose: false
                  })
                  return res
                } else return false
              })
          }
          if (Done) {
            this.OldInvoice = this.tempForm
            this.$notify({
              title: 'تم ' + this.isEdit ? 'تعديل' : 'إضافة' + '  بنجاح',
              message: 'تم ' + this.isEdit ? 'تعديل' : 'إضافة' + ' ',
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
          if (!this.isEdit) this.restTempForm()
          this.DisabledSave = false
        } else {
          this.ValidateNote = 'القيمة الإجمالية تساوي صفر  '
          this.DisabledSave = false
          return false
        }
      })
    },
    setTagsViewTitle() {
      const title = this.$t('route.EditSaleInvoice')
      const route = Object.assign({}, this.tempRoute, {
        title: `${title}-${this.tempForm.Id}`
      })
      this.$store.dispatch('tagsView/updateVisitedView', route)
    },
    setPageTitle() {
      const title = this.$t('route.EditSaleInvoice')
      document.title = `${title} - ${this.tempForm.Id}`
    }
  }
}
</script>
