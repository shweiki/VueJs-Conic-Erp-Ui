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
            style="float: left; margin-left: 20px; padding: 10px 15px; border-radius: 6px"
            icon="el-icon-plus"
            to="/Purchases/List"
          >{{ $t("route.ListPurchaseInvoice") }}</router-link>
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

          <el-col :span="4">
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
                    tempForm.Name = v.Name;
                    tempForm.VendorId = v.Id;
                  }
                "
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="طريقة الدفع" prop="PaymentMethod">
              <el-radio-group v-model="tempForm.PaymentMethod" text-color="#f78123">
                <el-radio label="Cash" border>{{
                  $t("NewPurchaseInvoice.Cash")
                }}</el-radio>

                <el-radio v-if="tempForm.VendorId != 2" label="Receivables" border>{{
                  $t("NewPurchaseInvoice.Receivables")
                }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item
              prop="InvoicePurchaseDate"
              :label="$t('NewPurchaseInvoice.InvDate')"
              :rules="[
                {
                  required: true,
                  message: 'لايمكن ترك التاريخ فارغ',
                  trigger: 'blur',
                },
              ]"
            >
              <Fake-Date
                :value="tempForm.InvoicePurchaseDate"
                @Set="(v) => (tempForm.InvoicePurchaseDate = v)"
              />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item prop="AccountInvoiceNumber" label="رقم فاتورة">
              <el-input
                v-model="tempForm.AccountInvoiceNumber"
                placeholder="رقم فاتورة"
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
        <el-card style="background: #545454" :body-style="{ padding: '1px' }">
          <items-search :with-bar-code="true" @add="AddItem" />
        </el-card>
        <el-table :data="tempForm.InventoryMovements" fit border>
          <el-table-column align="center" prop="Name">
            <template
              slot="header"
              slot-scope="{}"
            >{{ $t("NewPurchaseInvoice.Items") }} ({{
              TotalItems.toFixed($store.getters.settings.ToFixed)
            }})</template>
            <template slot-scope="scope">
              {{ tempForm.InventoryMovements[scope.$index].Name }}
              <edit-item :item-id="tempForm.InventoryMovements[scope.$index].ItemsId" />
            </template>
          </el-table-column>
          <el-table-column label="EXP" width="175" align="center">
            <template slot-scope="scope">
              <Select-Item-Exp-Column
                :value="tempForm.InventoryMovements[scope.$index].EXP"
                :item-id="tempForm.InventoryMovements[scope.$index].ItemsId"
                @SetVal="
                  (v) => {
                    tempForm.InventoryMovements[scope.$index].EXP = v;
                  }
                "
              />
            </template>
          </el-table-column>
          <el-table-column width="130" align="center">
            <template
              slot="header"
              slot-scope="{}"
            >{{ $t("NewPurchaseInvoice.quantity") }} ({{
              TotalQty.toFixed($store.getters.settings.ToFixed)
            }})</template>
            <template slot-scope="scope">
              <el-input-number
                v-model="tempForm.InventoryMovements[scope.$index].Qty"
                controls-position="right"
                :precision="2"
                :step="1"
                :min="0.0"
                :max="1000000"
                @change="SumTotalAmmount"
                @focus="$event.target.select()"
              />
            </template>
          </el-table-column>
          <el-table-column width="" align="center">
            <template slot="header" slot-scope="{}">{{
              $t("NewPurchaseInvoice.Price")
            }}</template>
            <template slot-scope="scope">
              <currency-input
                v-model="tempForm.InventoryMovements[scope.$index].SellingPrice"
                class="currency-input"
                :precision="3"
                @change="SumTotalAmmount"
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
              $t("NewPurchaseInvoice.Inventory")
            }}</template>
            <template slot-scope="scope">
              <radio-active-inventory
                :inventory-id="tempForm.InventoryMovements[scope.$index].InventoryItemId"
                @Set="
                  (v) =>
                    (tempForm.InventoryMovements[scope.$index].InventoryItemId = v.value)
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
            <span>{{ TotalItems.toFixed($store.getters.settings.ToFixed) }}</span>
            <el-divider direction="vertical" />

            <span>{{ $t("NewPurchaseInvoice.QuantityAmount") }}</span>
            <el-divider direction="vertical" />
            <span>{{ TotalQty.toFixed($store.getters.settings.ToFixed) }}</span>
            <el-divider direction="vertical" />

            <span>{{ $t("NewPurchaseInvoice.TotalDiscount") }}</span>
            <el-divider direction="vertical" />
            <span>
              <el-input-number
                v-model="tempForm.Discount"
                :precision="2"
                :step="1"
                :min="0.0"
                :max="100"
                @change="SumTotalAmmount"
                @focus="$event.target.select()"
              />
            </span>
            <el-divider direction="vertical" />

            <span>{{ $t("NewPurchaseInvoice.TotalJD") }}</span>
            <el-divider direction="vertical" />
            <span>{{ TotalAmmount.toFixed($store.getters.settings.ToFixed) }} JOD</span>
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
      <el-col :span="12">
        <el-input
          v-model="tempForm.Name"
          prop="Name"
          placeholder="اسم المستلم"
        />
      </el-col>
    </el-form>
  </div>
</template>
<script>
import { Create, Edit, GetPurchaseInvoiceById } from '@/api/PurchaseInvoice'
import FakeDate from '@/components/Date/FakeDate'

import ItemsSearch from '@/components/Item/ItemsSearch'
import EditItem from '@/components/Item/EditItem'
import VendorSearchAny from '@/components/Vendor/VendorSearchAny.vue'
import SelectItemExpColumn from '@/components/Item/SelectItemExpColumn.vue'
import RadioActiveInventory from '@/components/Inventory/RadioActiveInventory.vue'

export default {
  name: 'NewPurchaseInvoice',
  components: {
    ItemsSearch,
    EditItem,
    FakeDate,
    VendorSearchAny,
    SelectItemExpColumn,
    RadioActiveInventory
  },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      TotalQty: 0,
      TotalItems: 0,
      TotalAmmount: 0,
      ValidateNote: '',
      DisabledSave: false,
      tempForm: {
        Id: undefined,
        Name: '',
        Tax: 0.0,
        AccountInvoiceNumber: '',
        FakeDate: '',
        InvoicePurchaseDate: '',
        PaymentMethod: 'Cash',
        Discount: 0,
        VendorId: 2,
        Status: 0,
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
      CashAccounts: [],
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
    getdata(val) {
      GetPurchaseInvoiceById({ Id: val })
        .then((response) => {
          console.log(response)
          this.tempForm = response
          this.SumTotalAmmount()
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
      this.tempForm.InventoryMovements.push({
        Id: undefined,
        ItemsId: item !== undefined ? item.Id : undefined,
        TypeMove: 'In',
        Status: 0,
        Qty: 1.0,
        SellingPrice: item.CostPrice,
        Tax: 0.0,
        InventoryItemId: 1,
        Name: item.Name,
        PurchaseInvoiceId: undefined,
        Description: ''
      })
      this.SumTotalAmmount()
    },
    RemoveItem(index) {
      this.tempForm.InventoryMovements.splice(index, 1)
      this.SumTotalAmmount()
    },
    SumTotalAmmount() {
      this.TotalItems = this.tempForm.InventoryMovements.length
      this.TotalQty = this.tempForm.InventoryMovements.reduce(
        (a, b) => a + (b['Qty'] || 0),
        0
      )
      this.TotalAmmount = this.tempForm.InventoryMovements.reduce(function(prev, cur) {
        return prev + cur.Qty * cur.SellingPrice
      }, 0)
      this.TotalAmmount -= this.tempForm.Discount
      document.getElementById('barcode').focus()
    },

    updateData() {
      this.$refs['tempForm'].validate((valid) => {
        if (valid) {
          this.tempForm.Tax = parseInt(this.tempForm.Tax)
          if (this.TotalAmmount > 0 && this.TotalItems > 0 && this.TotalQty > 0) {
            Edit(this.tempForm)
              .then((response) => {
                this.$notify({
                  title: 'تم تعديل  بنجاح',
                  message: 'تم تعديل بنجاح',
                  type: 'success',
                  position: 'top-left',
                  duration: 1000,
                  showClose: false,
                  onClose: () => {
                    if (response) {
                      this.$router.push({ path: `/Purchases/List` })
                    }
                  }
                })
              })
              .catch((error) => {
                console.log(error)
              })
          } else this.ValidateNote = 'القيمة الإجمالية تساوي صفر  '
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    createData() {
      this.$refs['tempForm'].validate((valid) => {
        if (valid) {
          this.tempForm.Tax = parseInt(this.tempForm.Tax)

          if (this.TotalAmmount > 0 && this.TotalItems > 0 && this.TotalQty > 0) {
            this.DisabledSave = true

            Create(this.tempForm)
              .then((response) => {
                this.$router.push({ path: `/Purchases/List` })

                this.$notify({
                  title: 'تم الإضافة بنجاح',
                  message: 'تم الإضافة بنجاح',
                  type: 'success',
                  position: 'top-left',
                  duration: 1000,
                  showClose: false
                })
              })
              .catch((error) => {
                console.log(error)
                this.DisabledSave = false
              })
          } else this.ValidateNote = 'القيمة الإجمالية تساوي صفر  '
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    Copy(Text) {
      this.Text = Text
    },
    Paste(Index) {
      this.tempForm.InventoryMovements[Index].Description = this.Text
    },
    setTagsViewTitle() {
      const title = this.$t('route.EditPurchaseInvoice')
      const route = Object.assign({}, this.tempRoute, {
        title: `${title}-${this.tempForm.Id}`
      })
      this.$store.dispatch('tagsView/updateVisitedView', route)
    },
    setPageTitle() {
      const title = this.$t('route.EditPurchaseInvoice')
      document.title = `${title} - ${this.tempForm.Id}`
    }
  }
}
</script>
