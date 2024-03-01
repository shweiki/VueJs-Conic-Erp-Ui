<template>
  <div style="overflow: hidden">
    <el-form ref="F-SaleInvoice" :rules="rules" :model="tempForm">
      <div
        class="components-container"
        :style="this.$i18n.locale == 'ar' ? 'direction: rtl' : 'direction: ltr'"
      >
        <split-pane split="horizontal" :min-percent="92" :default-percent="120">
          <template slot="paneL">
            <split-pane split="vertical" :min-percent="50" :default-percent="65">
              <template slot="paneL">
                <split-pane split="horizontal" :min-percent="5" :default-percent="5">
                  <template slot="paneR">
                    <Items-Category
                      :with-image="$store.getters.settings.PointOfSale.WithImage"
                      @add="AddItem"
                    />
                  </template>
                  <template slot="paneL">
                    <el-card class="card" :body-style="{ padding: '4px' }">
                      <el-row type="flex">
                        <el-col :span="24">
                          <Rest-Of-Bill
                            :total="
                              tempForm.InventoryMovements.reduce((prev, cur) => {
                                return prev + cur.Qty * cur.SellingPrice;
                              }, 0) - tempForm.Discount
                            "
                            :open="OpenRestOfBill"
                            @Closed="
                              () => {
                                OpenRestOfBill = false;
                              }
                            "
                            @Done="isEdit != true ? createData() : updateData()"
                          />
                          <el-tooltip
                            class="item"
                            effect="dark"
                            content="Checkout"
                            placement="bottom"
                          >
                            <el-button
                              style="float: left; font-size: 40px"
                              :disabled="DisabledSave"
                              size="medium"
                              type="primary"
                              icon="el-icon-shopping-cart-2"
                              @click="
                                $store.state.settings.showRestOfBill != true
                                  ? isEdit != true
                                    ? createData()
                                    : updateData()
                                  : (OpenRestOfBill = true)
                              "
                            />
                          </el-tooltip>
                        </el-col>
                      </el-row>
                    </el-card>
                  </template>
                </split-pane>
              </template>
              <template slot="paneR">
                <split-pane split="horizontal" :min-percent="50" :default-percent="50">
                  <template slot="paneR">
                    <el-row type="flex" class="card">
                      <el-col :span="24">
                        <el-form-item prop="Description">
                          <el-input
                            ref="InvoiceDescription"
                            v-model="tempForm.Description"
                            :placeholder="$t('NewPurchaseInvoice.statement')"
                          />
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row type="flex" class="card">
                      <el-col :span="14">
                        <el-form-item prop="PaymentMethod">
                          <el-radio-group v-model="tempForm.PaymentMethod">
                            <el-radio-button
                              label="Cash"
                              border
                            ><i class="el-icon-money" />نقد</el-radio-button>
                            <el-radio-button
                              label="Visa"
                              border
                            ><i class="el-icon-bank-card" />بطاقة
                            </el-radio-button>
                          </el-radio-group>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row type="flex" class="card">
                      <el-col :span="12">
                        Table Number
                        <el-form-item prop="TableNo">
                          <el-input
                            ref="Tablenumber"
                            v-model="tempForm.TableNo"
                            placeholder="رقم الطاولة"
                          />
                        </el-form-item>
                      </el-col>
                    </el-row>

                    <el-row type="flex" class="card">
                      <el-col :span="24" class="TotalAmmount">
                        <span>{{ $t("NewPurchaseInvoice.TotalJD") }}</span>
                        <el-divider direction="vertical" />
                        <span>{{
                          (
                            tempForm.InventoryMovements.reduce((prev, cur) => {
                              return prev + cur.Qty * cur.SellingPrice;
                            }, 0) -
                            tempForm.Discount +
                            tempForm.DeliveryPrice
                          ).toFixed($store.getters.settings.ToFixed)
                        }}
                          JOD</span>
                      </el-col>
                    </el-row>
                  </template>
                  <template slot="paneL">
                    <el-form-item prop="InventoryMovements">
                      <el-table
                        highlight-current-row
                        height="300"
                        :data="tempForm.InventoryMovements"
                        style="width: 100%"
                        :size="$store.getters.size"
                      >
                        <el-table-column width="60" label="#" align="center">
                          <template slot-scope="scope">
                            <Description
                              @Set="
                                (v) => {
                                  tempForm.InventoryMovements[
                                    scope.$index
                                  ].Description = v;
                                }
                              "
                            />
                          </template>
                        </el-table-column>
                        <el-table-column prop="ItemsId" align="center">
                          <template
                            slot="header"
                            slot-scope="{}"
                          >{{ $t("NewPurchaseInvoice.Items") }} ({{
                            tempForm.InventoryMovements.length.toFixed(
                              $store.getters.settings.ToFixed
                            )
                          }}
                            ) {{ $t("NewPurchaseInvoice.quantity") }} ({{
                              tempForm.InventoryMovements.reduce(
                                (a, b) => a + (b["Qty"] || 0),
                                0
                              ).toFixed($store.getters.settings.ToFixed)
                            }}
                            )</template>
                          <template slot-scope="scope">
                            <div class="ItemName">
                              {{ scope.row.Name }}

                              {{ tempForm.InventoryMovements[scope.$index].SellingPrice }}
                              X
                              <el-input-number
                                v-model="tempForm.InventoryMovements[scope.$index].Qty"
                                :size="$store.getters.size"
                                style="width: 37.5%"
                                :precision="0"
                                :step="1"
                                :min="1"
                                :max="1000000"
                                @focus="$event.target.select()"
                              />
                            </div>
                            <el-col
                              v-if="
                                tempForm.InventoryMovements[scope.$index].Description !=
                                  ''
                              "
                              :span="24"
                            >
                              <el-tag
                                v-for="item of Array.from(
                                  (
                                    tempForm.InventoryMovements[scope.$index]
                                      .Description || ''
                                  ).split(',')
                                )"
                                :key="item"
                              >
                                {{ item }}
                              </el-tag>
                            </el-col>
                          </template>
                        </el-table-column>

                        <el-table-column
                          :label="$t('CashPool.Total')"
                          align="center"
                          width="110"
                        >
                          <template slot-scope="scope">
                            <div class="currency-input">
                              JOD
                              {{
                                (
                                  tempForm.InventoryMovements[scope.$index].SellingPrice *
                                  tempForm.InventoryMovements[scope.$index].Qty
                                ).toFixed($store.getters.settings.ToFixed)
                              }}
                            </div>
                          </template>
                        </el-table-column>

                        <el-table-column width="60" label="#" align="center">
                          <template slot-scope="scope">
                            <el-tooltip
                              class="item"
                              effect="dark"
                              content="حذف"
                              placement="bottom"
                            >
                              <el-button
                                style="float: left"
                                type="danger"
                                icon="el-icon-delete"
                                @click="RemoveItem(scope.$index)"
                              />
                            </el-tooltip>
                          </template>
                        </el-table-column>
                      </el-table>
                    </el-form-item>
                  </template>
                </split-pane>
              </template>
            </split-pane>
          </template>
        </split-pane>
      </div>
    </el-form>
  </div>
</template>

<script>
// permission
import permission from '@/directive/permission/index.js'

// components
import ItemsCategory from '@/components/Item/ItemsCategory'
import RestOfBill from '@/components/Sales/RestOfBill.vue'

import { PrintReport } from '@/report/FunctionalityReport'

import { Create, Edit, GetSaleInvoiceById } from '@/api/SaleInvoice'
import { Create as CreateRestaurnat } from '@/api/OrderRestaurant'

import splitPane from 'vue-splitpane'
import { OpenCashDrawer } from '@/api/Device'
import Description from '@/components/Item/Description.vue'
import {
  Create as CreateVendor,
  CheckIsExist as CheckVendorIsExist
} from '@/api/Vendor'
import { mapGetters } from 'vuex'
import { SendSMS } from '@/api/SMS'
import { Now } from '@/utils'

export default {
  Name: 'NewSaleInvoice',
  directives: { permission },
  components: {
    splitPane,
    RestOfBill,
    Description,
    ItemsCategory
  },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      uid: '',
      OldInvoice: null,
      PriceMethod: 'retail',
      DisabledSave: false,
      AutoPrint: true,
      AutoSendSMS: true,
      OpenRestOfBill: false,
      NewName: '',
      tempForm: {
        Id: undefined,
        Name: '',
        Tax: 0.0,
        FakeDate: '',
        PaymentMethod: 'Cash',
        Discount: 0,
        Description: '',
        VendorId: 2,
        IsPrime: false,
        Type: 'Delivery',
        DeliveryPrice: 0,
        Region: '',
        PhoneNumber: '',
        TableNo: 0,
        InventoryMovements: []
      },
      rules: {
        InventoryMovements: [
          {
            type: 'array',
            required: true,
            message: 'لا يمكن إكمال عملية البيع من غير إضافة أصناف',
            trigger: 'change'
          }
        ]
      },
      TaxOptions: [
        {
          value: 0,
          label: 'لا توجد ضريبة'
        },
        {
          value: 0.16,
          label: 'ضريبة 16 %'
        }
      ]
    }
  },
  computed: {
    ...mapGetters(['Id', 'name'])
  },
  created() {
    this.Get()
    console.log('tttttttt', this.Id)

    if (this.isEdit) {
      this.getdata(this.$route.params && this.$route.params.id)
    }
    this.tempRoute = Object.assign({}, this.$route)

    const loading = this.$loading({
      lock: true,
      text: 'تحميل',
      spinner: 'el-icon-loading',
      background: 'rgba(0, 0, 0, 0.7)'
    })
    loading.close()
  },
  methods: {
    Get() {
      this.user = {
        Id: this.Id
      }
      this.uid = this.Id
      console.log('ressssss', this.uid)
    },
    restTempForm() {
      this.tempForm = {
        Id: undefined,
        Name: '',
        Tax: 0.0,
        FakeDate: '',
        PaymentMethod: 'Cash',
        Discount: 0,
        Description: '',
        VendorId: 2,
        IsPrime: false,
        Type: 'Delivery',
        DeliveryPrice: 0,
        Region: '',
        PhoneNumber: '',
        InventoryMovements: []
      }
    },
    AddItem(Item, Qty) {
      let SellingPrice = Item.SellingPrice
      if (this.PriceMethod === 'wholesale') SellingPrice = Item.OtherPrice
      this.tempForm.InventoryMovements.push({
        Id: undefined,
        ItemsId: Item.Id,
        TypeMove: 'Out',
        Status: 2,
        Qty: 1.0,
        SellingPrice: SellingPrice,
        Tax: 0.0,
        Description: '',
        InventoryItemId: 1,
        Name: Item.Name,
        SalesInvoiceId: undefined
      })
    },
    RemoveItem(index) {
      this.tempForm.InventoryMovements.splice(index, 1)
    },
    OpenCashDrawer() {
      OpenCashDrawer({ Com: this.$store.state.settings.CashDrawerCOM.COM })
        .then((response) => {})
        .catch((err) => {
          console.log(err)
        })
    },
    getdata(val) {
      this.user = {
        Id: this.Id,
        name: this.name
      }
      GetSaleInvoiceById({ Id: val })
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
    createData() {
      this.$refs['F-SaleInvoice'].validate((valid) => {
        if (valid) {
          this.tempForm.Tax = parseInt(this.tempForm.Tax)
          const Total =
            this.tempForm.InventoryMovements.reduce((prev, cur) => {
              return prev + cur.Qty * cur.SellingPrice
            }, 0) - this.tempForm.Discount
          if (
            Total > 0 &&
            this.tempForm.InventoryMovements.length > 0 &&
            this.tempForm.InventoryMovements.reduce((a, b) => a + (b['Qty'] || 0), 0) > 0
          ) {
            this.DisabledSave = true
            this.tempForm.FakeDate = Now()
            this.tempForm.Description = this.uid
            Create(this.tempForm)
              .then((response) => {
                if (response) {
                  this.ValidateDescription = ''
                  this.tempForm.Id = response.Id
                  this.tempForm.Name = response.Name
                  this.NewName = response.Name
                  this.tempForm.PhoneNumber = response.PhoneNumber
                  this.tempForm.Total = Total
                  this.OldInvoice = this.tempForm
                  this.CreateRestaurnat(this.OldInvoice)
                  if (this.AutoPrint === true) {
                    PrintReport('SaleInvoice', this.OldInvoice, true)
                  }
                  if (
                    this.OldInvoice.PhoneNumber != null &&
                    this.AutoSendSMS &&
                    this.OldInvoice.Type === 'Delivery'
                  ) {
                    SendSMS(
                      this.OldInvoice.PhoneNumber,
                      'شكرا لإختياركم شاورما شيش , طلب رقم (' +
                        this.OldInvoice.Id.toString().slice(-4) +
                        ') القيمة مع التوصيل ' +
                        (
                          this.OldInvoice.DeliveryPrice +
                          this.OldInvoice.InventoryMovements.reduce((prev, cur) => {
                            return prev + cur.Qty * cur.SellingPrice
                          }, 0) -
                          this.OldInvoice.Discount
                        ).toFixed(2) +
                        ' JD'
                    )
                  }
                  this.$notify({
                    title: 'تم الإضافة بنجاح',
                    message: 'تم الإضافة بنجاح - ' + this.tempForm.PhoneNumber + ' ',
                    type: 'success',
                    position: 'top-left'
                  })
                  this.restTempForm()
                  this.DisabledSave = false
                  this.OpenRestOfBill = false
                } else {
                  this.$notify.error({
                    title: 'error',
                    message: 'حصلت مشكلة في ترحيل',
                    position: 'top-left'
                  })
                }
              })
              .catch((error) => {
                console.log(error)
              })
          } else {
            this.OpenRestOfBill = false
            return false
          }
        }
      })
    },
    async CreateRestaurnat(temp) {
      const items = temp.InventoryMovements
      const itemsnames = items.map(function(item) {
        return item['Name'] + ' [ ' + item['Description'] + ' ] '
      })
      CreateRestaurnat({
        Id: undefined,
        OrderId: temp.Id.toString().slice(-4),
        Name: this.NewName,
        TotalPrice: temp.Total, // temp.DeliveryPrice + temp.Total,
        Status: 0,
        Description: temp.Description,
        FakeDate: temp.FakeDate,
        PhoneNumber: temp.PhoneNumber,
        TableNo: temp.TableNo,
        DeliveryPrice: temp.DeliveryPrice,
        TotalPill: temp.Total, // temp.Total,
        Content: itemsnames.toString()
      }).then((res) => {
        if (res) {
          this.$notify({
            title: 'تم ',
            message: 'تم ارسال الطلب لشركة التوصيل بنجاح',
            type: 'success',
            duration: 2000
          })
        } else {
          this.$notify({
            position: 'top-left',
            title: 'تم ',
            message: ' حصلت مشكلة في عملية ارسال طلب التوصيل',
            type: 'error',
            duration: 20000
          })
        }
      })
    },

    CheckVendor(Name, PhoneNumber, Region) {
      CheckVendorIsExist({
        // Name: Name,
        //  Ssn: this.tempForm.Ssn,
        PhoneNumber: PhoneNumber
      }).then((res) => {
        if (!res) {
          CreateVendor({
            Id: undefined,
            Name: Name,
            Ssn: '',
            Region: Region,
            Email: '',
            PhoneNumber1: PhoneNumber,
            PhoneNumber2: '',
            Fax: '0',
            CreditLimit: 0.0,
            Description: '',
            IsPrime: false,
            Type: 'Customer'
          })
            .then((response) => {
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
          this.$notify({
            position: 'top-left',
            title: 'تم ',
            message: ' يوجد شخص يحمل نفس رقم الهاتف او الاسم',
            type: 'warning',
            duration: 20000
          })
        }
      })
    },
    updateData() {
      this.$refs['F-SaleInvoice'].validate((valid) => {
        if (valid) {
          this.tempForm.Tax = parseInt(this.tempForm.Tax)
          const Total =
            this.tempForm.InventoryMovements.reduce((prev, cur) => {
              return prev + cur.Qty * cur.SellingPrice
            }, 0) - this.tempForm.Discount
          if (
            Total > 0 &&
            this.tempForm.InventoryMovements.length > 0 &&
            this.tempForm.InventoryMovements.reduce((a, b) => a + (b['Qty'] || 0), 0) > 0
          ) {
            this.DisabledSave = true
            Edit(this.tempForm)
              .then((response) => {
                if (response) {
                  this.$notify({
                    title: 'تم تعديل بنجاح',
                    message: 'تم تعديل بنجاح',
                    type: 'success',
                    position: 'top-left',
                    duration: 1000,
                    showClose: false
                  })
                  this.ValidateDescription = ''
                  this.tempForm.Total = Total
                  this.OldInvoice = this.tempForm
                  this.DisabledSave = false
                  this.OpenRestOfBill = false
                  if (this.AutoPrint === true) {
                    PrintReport('SaleInvoice', this.OldInvoice, true)
                  }
                  if (this.AutoSendSMS && this.OldInvoice.Type === 'Delivery') {
                    SendSMS(
                      this.OldInvoice.PhoneNumber,
                      'شكرا لإختياركم شاورما شيش , طلب رقم (' +
                        this.OldInvoice.Id.toString().slice(-4) +
                        ') القيمة مع التوصيل ' +
                        (
                          this.OldInvoice.DeliveryPrice +
                          this.OldInvoice.InventoryMovements.reduce((prev, cur) => {
                            return prev + cur.Qty * cur.SellingPrice
                          }, 0) -
                          this.OldInvoice.Discount
                        ).toFixed(2) +
                        ' JD'
                    )
                  }
                  this.$confirm('هل تريد العودة ')
                    .then((_) => {
                      this.$router.go(-1)
                    })
                    .catch((_) => {})
                } else {
                  this.$notify.error({
                    title: 'error',
                    message: 'حصلت مشكلة في ترحيل',
                    position: 'top-left'
                  })
                }
              })
              .catch((error) => {
                console.log(error)
              })
          } else {
            this.ValidateDescription = 'قيمة الدائن و المدين غير متساويات أو تساوي صفر  '
            this.OpenRestOfBill = false
          }
        } else {
          console.log('error submit!!')
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
<style scoped>
.card {
  background: #3f7faf;
  color: white;
}
.ItemName {
  font-weight: 600;
  font-size: 12px;
}

.components-container {
  position: relative;
  height: 100vh;
  margin: 0px 0px;
}

.bottom {
  margin-top: 13px;
  line-height: 12px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}
.container {
  border-style: double;
  text-align: center;
  font-size: x-large;
  font-weight: 500;
}

.TotalAmmount {
  font-size: x-large;
  font-weight: 600;
  margin-bottom: 10px;
}
</style>
