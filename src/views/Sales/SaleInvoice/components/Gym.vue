<template>
  <div style="overflow: hidden">
    <el-form ref="F-SaleInvoice" :rules="rules" :model="tempForm">
      <div
        class="components-container"
        v-bind:style="this.$i18n.locale == 'ar' ? 'direction: rtl' : 'direction: ltr'"
      >
        <split-pane split="horizontal" :min-percent="8" :default-percent="8">
          <template slot="paneL">
            <el-row class="card">
              <el-col :span="6">
                <Right-Menu />
              </el-col>
              <el-col :span="4">
                <el-radio-group v-model="PriceMethod" text-color="#f78123">
                  <el-radio label="retail" border>مفرق</el-radio>
                  <el-radio label="wholesale" border>جملة</el-radio>
                </el-radio-group>
              </el-col>
              <el-col :span="5">
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
                    :VendorId="tempForm.VendorId"
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
              <el-col :span="1">
                <edit-vendor :VendorId="tempForm.VendorId" />
              </el-col>

              <el-col v-permission="['admin']" :span="3">
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
              <el-col :span="4">
                <el-button
                  type="primary"
                  icon="el-icon-s-home"
                  @click="
                    $router.replace({
                      path: '/redirect' + $store.getters.defulate_redirect,
                    })
                  "
                ></el-button>
                <el-button
                  type="primary"
                  icon="el-icon-s-claim"
                  @click="
                    $router.replace({
                      path: '/redirect' + '/CashPool/Create/SaleInvoice',
                    })
                  "
                ></el-button>
                <el-button
                  type="primary"
                  icon="el-icon-plus"
                  @click="OpenNewInvoice"
                ></el-button>
              </el-col>
            </el-row>
          </template>
          <template slot="paneR">
            <split-pane split="vertical" :min-percent="50" :default-percent="55">
              <template slot="paneL">
                <split-pane split="horizontal" :min-percent="95" :default-percent="93.5">
                  <template slot="paneL">
                    <!--  <items-search :WithBarCode="false" @add="AddItem" />-->
                    <Items-Category :WithImage="true" @add="AddItem" />
                  </template>
                  <template slot="paneR">
                    <el-card class="card" :body-style="{ padding: '4px' }">
                      <el-row type="flex">
                        <el-col :span="6">
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
                            @Done="isEdit != true ? createData() : updateData()"
                          />

                          <el-button
                            :disabled="DisabledSave"
                            @click="
                              $store.state.settings.showRestOfBill != true
                                ? isEdit != true
                                  ? createData()
                                  : updateData()
                                : (OpenRestOfBill = true)
                            "
                            style="font-size: 18px"
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
                            Type="SaleInvoice"
                            :Data="OldInvoice"
                            Css="font-size: 12px"
                          />
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
                            v-bind:placeholder="$t('NewPurchaseInvoice.statement')"
                            v-model="tempForm.Description"
                          ></el-input>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row type="flex" class="card">
                      <el-col :span="14">
                        <el-form-item prop="PaymentMethod">
                          <el-radio-group v-model="tempForm.PaymentMethod">
                            <el-radio-button label="Cash" border
                              ><i class="el-icon-money"></i>نقد</el-radio-button
                            >
                            <el-radio-button label="Visa" border
                              ><i class="el-icon-bank-card"></i>بطاقة
                            </el-radio-button>
                            <!--
                            <el-radio-button
                              v-if="tempForm.VendorId != 2"
                              label="Receivables"
                              border
                              ><i class="el-icon-s-custom"></i
                              >ذمم</el-radio-button
                            > -->
                          </el-radio-group>
                        </el-form-item>
                      </el-col>
                      <el-col :span="10">
                        <el-form-item>
                          <el-radio-group
                            @change="
                              (v) => {
                                v == 'Takeaway' ? (tempForm.DeliveryPrice = 0) : null;
                              }
                            "
                            v-model="tempForm.Type"
                          >
                            <el-radio-button label="Takeaway" border
                              ><i class="el-icon-sell"></i>سفري</el-radio-button
                            >
                            <el-radio-button label="Delivery" border
                              ><i class="el-icon-truck"></i> توصيل</el-radio-button
                            >
                          </el-radio-group>
                        </el-form-item>
                      </el-col></el-row
                    >
                    <el-row v-if="tempForm.Type == 'Delivery'" type="flex" class="card">
                      <el-col :span="24">
                        <delivery-el
                          :name="tempForm.Name"
                          :phone="tempForm.PhoneNumber"
                          :region="tempForm.Region"
                          :deliveryprice="tempForm.DeliveryPrice"
                          @Set="(v) => (tempForm.Description = v)"
                          @SetRegion="(v) => (tempForm.Region = v)"
                          @SetPhoneNumber="(v) => (tempForm.PhoneNumber = v)"
                          @SetName="(v) => (tempForm.Name = v)"
                          @SetDeliveryPrice="(v) => (tempForm.DeliveryPrice = v)"
                        />
                        <el-col :span="6">
                          <el-switch
                            v-model="AutoSendSMS"
                            active-color="#13ce66"
                            inactive-color="#ff4949"
                          ></el-switch>
                        </el-col>
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
                      <!--    <el-col :span="6">{{
                          $t("NewPurchaseInvoice.TotalDiscount")
                        }}</el-col> -->
                    </el-row>
                    <el-row type="flex" class="card">
                      <el-col
                        v-if="tempForm.Type == 'Delivery'"
                        :span="12"
                        class="TotalAmmount"
                      >
                        <span>سعر التوصيل</span>
                        <el-divider direction="vertical"></el-divider>
                        <span
                          >{{
                            tempForm.DeliveryPrice.toFixed(
                              $store.getters.settings.ToFixed
                            )
                          }}
                          JOD</span
                        >
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
                  </template>
                  <template slot="paneL" class="card">
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
                              " /></template
                        ></el-table-column>
                        <el-table-column prop="ItemsId" align="center">
                          <template slot="header" slot-scope="{}"
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
                            )</template
                          >
                          <template slot-scope="scope">
                            <div class="ItemName">
                              {{ scope.row.Name }}
                              <el-tag type="primary" effect="plain">{{
                                scope.row.SellingPrice.toFixed(
                                  $store.getters.settings.ToFixed
                                )
                              }}</el-tag>
                              X
                              <el-input-number
                                :size="$store.getters.size"
                                style="width: 37.5%"
                                v-model="tempForm.InventoryMovements[scope.$index].Qty"
                                :precision="0"
                                :step="1"
                                :min="1"
                                :max="1000000"
                                @focus="$event.target.select()"
                              ></el-input-number>
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
                          v-bind:label="$t('CashPool.Total')"
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
import ItemsCategory from "@/components/Item/ItemsCategory";
import EditItem from "@/components/Item/EditItem";
import RestOfBill from "@/components/Sales/RestOfBill";
import RightMenu from "@/components/RightMenu";

import LangSelect from "@/components/LangSelect";
import Screenfull from "@/components/Screenfull";
import SizeSelect from "@/components/SizeSelect";
import DrawerPrint from "@/components/PrintRepot/DrawerPrint.vue";

// report
import VendorSelect from "@/components/Vendor/VendorSelect";
import VendorSearchAny from "@/components/Vendor/VendorSearchAny";

import FakeDate from "@/components/Date/FakeDate.vue";
import { PrintReport } from "@/Report/FunctionalityReport";

import { Create, Edit, GetSaleInvoiceById } from "@/api/SaleInvoice";
import { GetActiveMenuItem } from "@/api/MenuItem";

//import { GetActiveMember } from "@/api/Member";
import splitPane from "vue-splitpane";
//import { NumericInput } from "numeric-keyboard";
import { OpenCashDrawer } from "@/api/Device";
import Description from "@/components/Item/Description.vue";
import DeliveryEl from "@/components/Sales/DeliveryEl.vue";
import EditVendor from "@/components/Vendor/EditVendor";
import { Now } from "@/utils";

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
    ItemsCategory,
    EditItem,
    DrawerPrint,
    RestOfBill,
    RightMenu,
    FakeDate,
    VendorSelect,
    Description,
    DeliveryEl,
    VendorSearchAny,
    EditVendor,
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
      AutoPrint: false,
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
      MenuItems: [],
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

    GetActiveMenuItem().then((response) => {
      this.MenuItems = response;
    });
    loading.close();
  },
  methods: {
    OpenNewInvoice() {
      window.open(
        this.$router.resolve({
          path: "/Sales/Create",
        }).href,
        this.$router.resolve({
          path: "/Sales/Create",
        }).name,
        "toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=" +
          screen.availWidth +
          ",height=" +
          screen.availHeight +
          ",top=" +
          55 +
          ",left=" +
          500 +
          ""
      );
    },
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
    },
    RemoveItem(index) {
      this.tempForm.InventoryMovements.splice(index, 1);
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
    createData() {
      this.$refs["F-SaleInvoice"].validate((valid) => {
        this.tempForm.PaymentMethod = this.tempForm.PaymentMethod;
        this.tempForm.Tax = parseInt(this.tempForm.Tax);
        let Total =
          this.tempForm.InventoryMovements.reduce((prev, cur) => {
            return prev + cur.Qty * cur.SellingPrice;
          }, 0) - this.tempForm.Discount;
        if (
          valid &&
          Total > 0 &&
          this.tempForm.InventoryMovements.length > 0 &&
          this.tempForm.InventoryMovements.reduce((a, b) => a + (b["Qty"] || 0), 0) > 0
        ) {
          this.DisabledSave = true;
          //  this.tempForm.Type == "Delivery"
          //   ? (this.tempForm.Status = 0)
          //    : (this.tempForm.Status = 2);
          this.tempForm.FakeDate = Now();

          Create(this.tempForm)
            .then((response) => {
              if (response) {
                this.$notify({
                  title: "تم الإضافة بنجاح",
                  message: "تم الإضافة بنجاح - " + this.tempForm.PhoneNumber + " ",
                  type: "success",
                  position: "top-left",
                });
                this.tempForm.Id = response.Id;
                this.tempForm.Total = Total;

                this.OldInvoice = this.tempForm;
                if (this.AutoPrint == true) {
                  PrintReport("SaleInvoice", this.OldInvoice);
                }
                this.restTempForm();
                this.DisabledSave = false;
                this.OpenRestOfBill = false;
              } else {
                this.$notify.error({
                  title: "error",
                  message: "حصلت مشكلة في ترحيل",
                  position: "top-left",
                });
              }
            })
            .catch((error) => {
              console.log(error);
            });
        } else {
          this.OpenRestOfBill = false;
          return false;
        }
      });
    },
    updateData() {
      this.$refs["F-SaleInvoice"].validate((valid) => {
        if (valid) {
          this.tempForm.PaymentMethod = this.tempForm.PaymentMethod;
          this.tempForm.Tax = parseInt(this.tempForm.Tax);
          if (
            this.tempForm.InventoryMovements.reduce((prev, cur) => {
              return prev + cur.Qty * cur.SellingPrice;
            }, 0) -
              this.tempForm.Discount >
              0 &&
            this.tempForm.InventoryMovements.length > 0 &&
            this.tempForm.InventoryMovements.reduce((a, b) => a + (b["Qty"] || 0), 0) > 0
          ) {
            this.DisabledSave = true;
            this.tempForm.FakeDate = Now();

            Edit(this.tempForm)
              .then((response) => {
                this.$notify({
                  title: "تم تعديل بنجاح",
                  message: "تم تعديل بنجاح",
                  type: "success",
                  position: "top-left",
                  duration: 1000,
                  showClose: false,
                  onClose: () => {
                    this.ValidateDescription = "";
                    this.OldInvoice = this.tempForm;
                    this.$nextTick(() => {
                      this.OpenRestOfBill = false;
                      this.$router.go(-1);
                    });
                  },
                });
              })
              .catch((error) => {
                console.log(error);
              });
          } else
            this.ValidateDescription = "قيمة الدائن و المدين غير متساويات أو تساوي صفر  ";
          this.OpenRestOfBill = false;
        } else {
          console.log("error submit!!");
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
