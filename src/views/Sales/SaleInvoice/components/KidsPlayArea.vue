<template>
  <div style="overflow: hidden">
    <el-form ref="F-SaleInvoice" :rules="rules" :model="tempForm">
      <div
        class="components-container"
        v-bind:style="this.$i18n.locale == 'ar' ? 'direction: rtl' : 'direction: ltr'"
      >
        <split-pane split="vertical" :min-percent="40" :default-percent="45">
          <template slot="paneL">
            <split-pane split="horizontal" :min-percent="5" :default-percent="6.5">
              <template slot="paneL">
                <el-card class="card" :body-style="{ padding: '4px' }">
                  <el-row type="flex">
                    <el-col :span="3">
                      <drawer-search-invoice />
                    </el-col>
                    <el-col :span="3">
                      <el-switch
                        v-model="AutoPrint"
                        active-color="#13ce66"
                        inactive-color="#ff4949"
                      ></el-switch>
                    </el-col>
                    <el-col :span="6">
                      <Rest-Of-Bill
                        :Total="
                          tempForm.InventoryMovements.reduce((prev, cur) => {
                            return prev + cur.Qty * cur.SellingPrice;
                          }, 0) - tempForm.Discount
                        "
                        :Open="OpenRestOfBill"
                        @Closed="
                          () => {
                            OpenRestOfBill = false;
                          }
                        "
                        @Done="confirmData()"
                      />
                      <el-button
                        :disabled="DisabledSave"
                        @click="
                          $store.state.settings.showRestOfBill != true
                            ? confirmData()
                            : (OpenRestOfBill = true)
                        "
                        type="success"
                        icon="el-icon-check"
                      ></el-button>
                    </el-col>
                    <el-col :span="6">
                      <el-button
                        @click="OpenCashDrawer()"
                        type="warning"
                        icon="el-icon-takeaway-box"
                      ></el-button>
                    </el-col>
                    <el-col :span="6">
                      <Drawer-Print
                        v-bind:disabled="OldInvoice == null ? false : true"
                        Type="SaleInvoice"
                        :Data="OldInvoice"
                      />
                    </el-col>
                  </el-row>
                </el-card>
              </template>
              <template slot="paneR">
                <split-pane split="horizontal" :min-percent="90" :default-percent="95">
                  <template slot="paneL">
                    <split-pane
                      split="horizontal"
                      :min-percent="68"
                      :default-percent="70"
                    >
                      <template slot="paneL" class="card">
                        <split-pane
                          split="horizontal"
                          :min-percent="10"
                          :default-percent="12"
                        >
                          <template slot="paneL">
                            <Items-Search
                              :WithBarCode="true"
                              @add="AddItem"
                              @focus="focusBarcode"
                            />
                          </template>
                          <template slot="paneR">
                            <el-form-item prop="InventoryMovements">
                              <el-table
                                highlight-current-row
                                height="350"
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
                                      " /></template
                                ></el-table-column>
                                <el-table-column prop="ItemsId" align="center">
                                  <template slot="header" slot-scope="{}"
                                    >{{ $t("NewPurchaseInvoice.Items") }} ({{
                                      tempForm.InventoryMovements.length.toFixed(
                                        $store.getters.settings.ToFixed
                                      )
                                    }}
                                    )
                                    {{ $t("NewPurchaseInvoice.quantity") }} ({{
                                      tempForm.InventoryMovements.reduce(
                                        (a, b) => a + (b["Qty"] || 0),
                                        0
                                      ).toFixed($store.getters.settings.ToFixed)
                                    }}
                                    )</template
                                  >
                                  <template slot-scope="scope">
                                    <div class="ItemName">
                                      {{ scope.row.Name }}

                                      {{
                                        tempForm.InventoryMovements[scope.$index]
                                          .SellingPrice
                                      }}
                                      X
                                      <el-input-number
                                        :size="$store.getters.size"
                                        style="width: 37.5%"
                                        v-model="
                                          tempForm.InventoryMovements[scope.$index].Qty
                                        "
                                        :precision="0"
                                        :step="1"
                                        :min="1"
                                        :max="1000000"
                                        @focus="$event.target.select()"
                                      ></el-input-number>
                                    </div>
                                    <el-col
                                      v-if="
                                        tempForm.InventoryMovements[scope.$index]
                                          .Description != ''
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
                                  v-bind:label="$t('CashPool.Total')"
                                  align="center"
                                  width="110"
                                >
                                  <template slot-scope="scope">
                                    <div class="currency-input">
                                      JOD
                                      {{
                                        (
                                          tempForm.InventoryMovements[scope.$index]
                                            .SellingPrice *
                                          tempForm.InventoryMovements[scope.$index].Qty
                                        ).toFixed($store.getters.settings.ToFixed)
                                      }}
                                    </div>
                                  </template>
                                </el-table-column>

                                <el-table-column width="60" label="#" align="center">
                                  <template slot-scope="scope">
                                    <el-button
                                      style="float: left"
                                      type="danger"
                                      icon="el-icon-delete"
                                      @click="RemoveItem(scope.$index)"
                                    />
                                  </template>
                                </el-table-column>
                              </el-table>
                            </el-form-item>
                          </template>
                        </split-pane>
                      </template>
                      <template slot="paneR">
                        <el-row type="flex" class="card">
                          <el-col :span="24">
                            <el-form-item prop="Description">
                              <el-input
                                v-bind:placeholder="$t('NewPurchaseInvoice.statement')"
                                v-model="tempForm.Description"
                              ></el-input>
                            </el-form-item>
                          </el-col>
                        </el-row>
                        <el-row type="flex" class="card">
                          <el-col :span="12">
                            <el-form-item prop="PaymentMethod">
                              <el-radio-group v-model="tempForm.PaymentMethod">
                                <el-radio-button label="Cash" border
                                  ><i class="el-icon-money"></i>نقد</el-radio-button
                                >
                                <el-radio-button label="Visa" border
                                  ><i class="el-icon-bank-card"></i>بطاقة
                                </el-radio-button>
                              </el-radio-group>
                            </el-form-item>
                          </el-col>
                          <el-col :span="12" class="TotalAmmount">
                            <span>{{ $t("NewPurchaseInvoice.TotalJD") }}</span>
                            <el-divider direction="vertical"></el-divider>
                            <span
                              >{{
                                (
                                  tempForm.InventoryMovements.reduce((prev, cur) => {
                                    return prev + cur.Qty * cur.SellingPrice;
                                  }, 0) -
                                  tempForm.Discount +
                                  tempForm.DeliveryPrice
                                ).toFixed($store.getters.settings.ToFixed)
                              }}
                              JOD</span
                            >
                          </el-col>
                        </el-row>
                        <el-row type="flex" class="card" v-permission="['admin']">
                          <el-col :span="10">
                            <el-form-item prop="Tax">
                              <el-select
                                v-model="tempForm.Tax"
                                v-bind:placeholder="$t('Items.Tax')"
                              >
                                <el-option
                                  v-for="tax in TaxOptions"
                                  :key="tax.value"
                                  :label="tax.label"
                                  :value="tax.value"
                                ></el-option>
                              </el-select>
                            </el-form-item>
                          </el-col>
                          <el-col :span="8">
                            <el-input-number
                              prop="Discount"
                              v-model="tempForm.Discount"
                              controls-position="right"
                              :precision="2"
                              :step="1"
                              :min="0.0"
                              :max="100"
                              @focus="$event.target.select()"
                            ></el-input-number>
                          </el-col>
                        </el-row>
                      </template>
                    </split-pane>
                  </template>
                  <template slot="paneR">
                    <el-row class="card">
                      <el-col :span="10">
                        <el-form-item
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
                            :Id="tempForm.VendorId"
                            @Set="
                              (v) => {
                                tempForm.Name = v.Name;
                                tempForm.PhoneNumber = v.PhoneNumber1;
                                tempForm.Region = v.Region;
                                tempForm.VendorId = v.Id;
                              }
                            "
                          />
                          <!--  <vendor-select @Set="v => (tempForm.Vendor = v)" />-->
                        </el-form-item>
                      </el-col>
                      <el-col v-permission="['admin']" :span="8">
                        <el-form-item
                          prop="FakeDate"
                          :rules="[
                            {
                              required: true,
                              message: 'لايمكن ترك التاريخ فارغ',
                              trigger: 'blur',
                            },
                          ]"
                        >
                          <Fake-Date
                            :Value="tempForm.FakeDate"
                            @Set="(v) => (tempForm.FakeDate = v)"
                          />
                        </el-form-item>
                      </el-col>

                      <el-col :span="2">
                        <el-button
                          type="primary"
                          icon="el-icon-s-home"
                          @click="
                            $router.replace({
                              path: '/redirect' + $store.getters.defulate_redirect,
                            })
                          "
                        ></el-button>
                      </el-col>
                      <el-col :span="2">
                        <el-button
                          type="primary"
                          icon="el-icon-s-claim"
                          @click="
                            $router.replace({
                              path: '/redirect' + '/CashPool/Create/SaleInvoice',
                            })
                          "
                        ></el-button>
                      </el-col>
                      <el-col :span="2">
                        <el-button
                          type="primary"
                          icon="el-icon-plus"
                          @click="
                            let r = $router.resolve({
                              path: '/Sales/PonitOfSale',
                            });
                            window.open(
                              r.href,
                              r.route.name,
                              $store.getters.settings.windowStyle
                            );
                          "
                        ></el-button>
                      </el-col>
                    </el-row>
                  </template>
                </split-pane>
              </template>
            </split-pane>
          </template>
          <template slot="paneR">
            <split-pane split="horizontal" :min-percent="50" :default-percent="55">
              <template slot="paneR">
                <VisitIn @Done="focusBarcode()" />
              </template>
              <template slot="paneL" class="card">
                <VisitCreate @Done="focusBarcode()" :is-edit="false" />
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
import permission from "@/directive/permission/index.js";

// components
import ItemsSearch from "@/components/Item/ItemsSearch";
import RestOfBill from "@/components/Sales/RestOfBill.vue";
import RightMenu from "@/components/RightMenu";

import LangSelect from "@/components/LangSelect";
import Screenfull from "@/components/Screenfull";
import SizeSelect from "@/components/SizeSelect";
import DrawerPrint from "@/components/PrintRepot/DrawerPrint.vue";
import VisitCreate from "@/views/Visit/Create.vue";
import VisitIn from "@/views/Visit/components/VisitIn";

// report
import VendorSearchAny from "@/components/Vendor/VendorSearchAny";

import FakeDate from "@/components/Date/FakeDate";
import { PrintReport } from "@/report/FunctionalityReport";

import { Create, Edit, GetSaleInvoiceById } from "@/api/SaleInvoice";

//import { GetActiveMember } from "@/api/Member";
import splitPane from "vue-splitpane";
//import { NumericInput } from "numeric-keyboard";
import { OpenCashDrawer } from "@/api/Device";
import Description from "@/components/Item/Description.vue";
import DrawerSearchInvoice from "@/components/Sales/DrawerSearchInvoice.vue";

//import VueTouchKeyboard from "vue-touch-keyboard";

export default {
  Name: "NewSaleInvoice",
  directives: { permission },
  components: {
    splitPane,
    LangSelect,
    Screenfull,
    SizeSelect,
    ItemsSearch,
    DrawerPrint,
    RestOfBill,
    RightMenu,
    FakeDate,
    Description,
    VendorSearchAny,
    DrawerSearchInvoice,
    VisitCreate,
    VisitIn,
  },
  props: {
    isEdit: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      OldInvoice: null,
      PriceMethod: "retail",
      DisabledSave: false,
      AutoPrint: true,
      AutoSendSMS: true,
      OpenRestOfBill: false,
      tempForm: {
        Id: undefined,
        Name: "",
        Tax: 0.0,
        FakeDate: "",
        PaymentMethod: "Cash",
        Discount: 0,
        Description: "",
        VendorId: 2,
        IsPrime: false,
        Type: "Takeaway",
        DeliveryPrice: 0,
        Region: "",
        PhoneNumber: "",
        InventoryMovements: [],
      },
      rules: {
        InventoryMovements: [
          {
            type: "array",
            required: true,
            message: "لا يمكن إكمال عملية البيع من غير إضافة أصناف",
            trigger: "change",
          },
        ],
      },
      TaxOptions: [
        {
          value: 0,
          label: "لا توجد ضريبة",
        },
        {
          value: 0.16,
          label: "ضريبة 16 %",
        },
      ],
    };
  },

  created() {
    if (this.isEdit) {
      this.getdata(this.$route.params && this.$route.params.id);
    }
    this.tempRoute = Object.assign({}, this.$route);

    const loading = this.$loading({
      lock: true,
      text: "تحميل",
      spinner: "el-icon-loading",
      background: "rgba(0, 0, 0, 0.7)",
    });

    loading.close();
  },
  methods: {
    restTempForm() {
      this.tempForm = {
        Id: undefined,
        Name: "",
        Tax: 0.0,
        FakeDate: "",
        PaymentMethod: "Cash",
        Discount: 0,
        Description: "",
        VendorId: 2,
        IsPrime: false,
        Type: "Takeaway",
        DeliveryPrice: 0,
        Region: "",
        PhoneNumber: "",
        InventoryMovements: [],
      };
    },
    AddItem(Item, Qty) {
      let SellingPrice = Item.SellingPrice;
      if (this.PriceMethod == "wholesale") SellingPrice = Item.OtherPrice;
      var find = this.$store.getters.settings.PointOfSale.QtyCounter
        ? this.tempForm.InventoryMovements.findIndex((value) => value.ItemsId == Item.Id)
        : -1;
      if (find != -1) this.tempForm.InventoryMovements[find].Qty += Qty;
      else {
        this.tempForm.InventoryMovements.push({
          Id: undefined,
          ItemsId: Item.Id,
          TypeMove: "Out",
          Status: 2,
          Qty: 1.0,
          SellingPrice: SellingPrice,
          Tax: 0.0,
          Description: "",
          InventoryItemId: 1,
          Name: Item.Name,
          SalesInvoiceId: undefined,
        });
      }
      this.focusBarcode();
    },
    RemoveItem(index) {
      this.tempForm.InventoryMovements.splice(index, 1);
    },
    focusBarcode() {
      //  this.$refs["barcode"].focus();
    },
    OpenCashDrawer() {
      OpenCashDrawer({ Com: this.$store.state.settings.CashDrawerCOM.COM })
        .then((response) => {})
        .catch((err) => {
          console.log(err);
        });
    },
    getdata(val) {
      GetSaleInvoiceById({ Id: val })
        .then((response) => {
          this.tempForm = response;
          // set tagsview title
          this.setTagsViewTitle();

          // set page title
          this.setPageTitle();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    confirmData() {
      this.$refs["F-SaleInvoice"].validate(async (valid) => {
        this.tempForm.Tax = parseInt(this.tempForm.Tax);
        this.tempForm.Total =
          this.tempForm.InventoryMovements.reduce((prev, cur) => {
            return prev + cur.Qty * cur.SellingPrice;
          }, 0) - this.tempForm.Discount;
        if (
          valid &&
          this.tempForm.Total > 0 &&
          this.tempForm.InventoryMovements.length > 0 &&
          this.tempForm.InventoryMovements.reduce((a, b) => a + (b["Qty"] || 0), 0) > 0
        ) {
          let Done;
          if (this.isEdit != true) {
            Done = await Create(this.tempForm)
              .then((res) => {
                if (res) {
                  this.tempForm.Id = res.Id;
                  return res;
                } else return false;
              })
              .catch((error) => {
                return false;
              });
          } else {
            Done = await Edit(this.tempForm)
              .then((res) => {
                if (res) return res;
                else return false;
              })
              .catch((error) => {
                return false;
              });
          }
          if (Done) {
            this.OldInvoice = this.tempForm;
            if (this.AutoPrint == true) {
              PrintReport("SaleInvoice", this.OldInvoice);
            }
            this.$notify({
              title: "تم " + this.isEdit ? "تعديل" : "إضافة" + "  بنجاح",
              message: "تم " + this.isEdit ? "تعديل" : "إضافة" + " ",
              type: "success",
              position: "top-left",
              duration: 1000,
              showClose: false,
            });
          } else {
            this.$notify({
              title: "مشكلة",
              message: "حصلت مشكلة في عملية الحفظ",
              type: "error",
              position: "top-left",
              duration: 1000,
              showClose: false,
            });
          }
          this.restTempForm();
          this.DisabledSave = false;
        } else {
          this.ValidateNote = "القيمة الإجمالية تساوي صفر  ";
          this.DisabledSave = false;
          return false;
        }
      });
    },
    setTagsViewTitle() {
      const title = "Edit Sale";
      const route = Object.assign({}, this.tempRoute, {
        title: `${title}-${this.tempForm.Id}`,
      });
      this.$store.dispatch("tagsView/updateVisitedView", route);
    },
    setPageTitle() {
      const title = "Edit Sale";
      document.title = `${title} - ${this.tempForm.Id}`;
    },
  },
};
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
