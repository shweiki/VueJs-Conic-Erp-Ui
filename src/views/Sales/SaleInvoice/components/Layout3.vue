<template>
  <div>
    <el-form ref="F-SaleInvoice" :rules="rules" :model="tempForm">
      <div
        class="components-container"
        v-bind:style="
          this.$i18n.locale == 'ar' ? 'direction: rtl' : 'direction: ltr'
        "
      >
        <split-pane split="horizontal" :min-percent="92" :default-percent="92">
          <template slot="paneR">
            <el-row class="card">
              <el-col :span="8">
                <right-menu />
              </el-col>

              <el-col :span="4">
                <el-form-item
                  prop="VendorId"
                  :rules="[
                    {
                      required: true,
                      message: 'لايمكن ترك حساب فارغ',
                      trigger: 'blur'
                    }
                  ]"
                >
                  <vendor-select @Set="v => (tempForm.VendorId = v)" />
                </el-form-item>
              </el-col>
              <el-col v-permission="['Admin']" :span="4">
                <el-form-item
                  prop="FakeDate"
                  :rules="[
                    {
                      required: true,
                      message: 'لايمكن ترك التاريخ فارغ',
                      trigger: 'blur'
                    }
                  ]"
                >
                  <fake-date
                    :Value="tempForm.FakeDate"
                    @Set="v => (tempForm.FakeDate = v)"
                  />
                </el-form-item>
              </el-col>

              <el-col :span="8">
                <el-button
                  type="primary"
                  icon="el-icon-s-home"
                  @click="$router.replace({ path: '/redirect' + '/dashboard' })"
                ></el-button>
                <el-button
                  type="primary"
                  icon="el-icon-s-claim"
                  @click="
                    $router.replace({ path: '/redirect' + '/Sales/CashPool' })
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
          <template slot="paneL">
            <split-pane
              split="vertical"
              :min-percent="60"
              :default-percent="50"
            >
              <template slot="paneL">
                <split-pane
                  split="horizontal"
                  :min-percent="5"
                  :default-percent="5"
                >
                  <template slot="paneR">
                   <items-search :WithBarCode="false" @add="AddItem" /> 
                    <items-category :WithImage="false" @add="AddItem" />
                  </template>
                  <template slot="paneL">
                    <el-row class="card">
                      <el-col :span="6">
                        <rest-of-bill
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
                          type="success"
                          icon="el-icon-check"
                        ></el-button>
                      </el-col>
                      <el-col :span="6">
                        <el-badge
                          :value="
                            $store.state.settings.CashDrawerCOM.OpenKeyBoard
                          "
                          class="item"
                          type="primary"
                        >
                          <el-button
                            @click="OpenCashDrawer()"
                            type="warning"
                            icon="el-icon-takeaway-box"
                          ></el-button
                        ></el-badge>
                      </el-col>
                      <el-col :span="3">
                        <el-switch
                          v-model="AutoPrint"
                          active-color="#13ce66"
                          inactive-color="#ff4949"
                        ></el-switch>
                      </el-col>
                      <el-col :span="3">
                        <restaurant-print-button
                          :AutoPrint="AutoPrint"
                          :Data="OldInvoice"
                          Css="font-size: 12px"
                        />
                      </el-col>
                    </el-row>
                  </template>
                </split-pane>
              </template>
              <template slot="paneR">
                <split-pane
                  split="horizontal"
                  :min-percent="57"
                  :default-percent="60"
                >
                  <template slot="paneR">
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

                            <el-radio
                              v-if="tempForm.VendorId != 2"
                              label="Receivables"
                              border
                              ><i class="el-icon-s-custom"></i
                            ></el-radio>
                          </el-radio-group>
                        </el-form-item>
                      </el-col>
                      <el-col :span="10">
                        <el-form-item>
                          <el-radio-group v-model="tempForm.Type">
                            <el-radio-button label="takeaway" border
                              ><i class="el-icon-sell"></i>سفري</el-radio-button
                            >
                            <el-radio-button label="delivery" border
                              ><i class="el-icon-truck"></i>
                              توصيل</el-radio-button
                            >
                          </el-radio-group>
                        </el-form-item>
                      </el-col></el-row
                    >
                      <el-row type="flex" class="card">
                        <el-col :span="16">
                          <el-input
                            prop="Name"
                            placeholder="اسم المستلم"
                            v-model="tempForm.Name"
                          ></el-input>
                        </el-col>
                        <el-col :span="6">
                          <el-popover
                            placement="right"
                            width="400"
                            trigger="click"
                          >
                            <el-form-item prop="Description">
                              <el-input
                                v-bind:placeholder="
                                  $t('NewPurchaseInvoice.statement')
                                "
                                v-model="tempForm.Description"
                              ></el-input>
                            </el-form-item>
                            <el-button type="primary" slot="reference"
                              ><i class="el-icon-notebook-1"></i>
                              {{
                                $t("NewPurchaseInvoice.statement")
                              }}</el-button
                            >
                          </el-popover></el-col
                        >
                      </el-row>
                      <el-row type="flex" class="card" v-permission="['Admin']">
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
                          ></el-input-number>
                        </el-col>
                    <!--    <el-col :span="6">{{
                          $t("NewPurchaseInvoice.TotalDiscount")
                        }}</el-col> -->
                      </el-row>

                      <el-row type="flex" class="card">
                        <el-col :span="24" class="TotalAmmount">
                          <span>{{ $t("NewPurchaseInvoice.TotalJD") }}</span>
                          <el-divider direction="vertical"></el-divider>
                          <span
                            >{{
                              (
                                tempForm.InventoryMovements.reduce(
                                  (prev, cur) => {
                                    return prev + cur.Qty * cur.SellingPrice;
                                  },
                                  0
                                ) - tempForm.Discount
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
                        border
                        max-height="375"
                        :data="tempForm.InventoryMovements"
                        width="100%"
                      >
                        <el-table-column width="50" label="#">
                          <template slot-scope="scope">
                            <description
                              @Set="
                                v => {
                                  tempForm.InventoryMovements[
                                    scope.$index
                                  ].Description = v;
                                }
                              "/></template
                        ></el-table-column>
                        <el-table-column
                          prop="ItemsId"
                          width="400"
                          align="center"
                        >
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

                              {{
                                tempForm.InventoryMovements[scope.$index]
                                  .SellingPrice
                              }}
                              X
                              <el-input-number
                                style="width: 30%;"
                                v-model="
                                  tempForm.InventoryMovements[scope.$index].Qty
                                "
                                :precision="0"
                                :step="1"
                                :min="1"
                                :max="1000000"
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

                        <el-table-column width="50" label="#" align="center">
                          <template slot-scope="scope">
                            <el-button
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
import RestaurantPrintButton from "@/components/PrintRepot/RestaurantPrintButton.vue";

// report
import VendorSelect from "@/components/Vendor/VendorSelect";
import FakeDate from "@/components/Date/FakeDate";

import { Create, Edit, GetSaleInvoiceByID } from "@/api/SaleInvoice";
import { GetActiveInventory } from "@/api/InventoryItem";
import { GetActiveMenuItem } from "@/api/MenuItem";

//import { GetActiveMember } from "@/api/Member";
import splitPane from "vue-splitpane";
//import { NumericInput } from "numeric-keyboard";
import { OpenCashDrawer } from "@/api/Device";
import Description from "@/components/Item/Description.vue";

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
    RestaurantPrintButton,
    RestOfBill,
    RightMenu,
    FakeDate,
    VendorSelect,
    Description
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
      PriceMethod: "retail",
      DisabledSave: false,
      AutoPrint: true,
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
        Type: "takeaway",
        InventoryMovements: []
      },
      rules: {
        InventoryMovements: [
          {
            type: "array",
            required: true,
            message: "لا يمكن إكمال عملية البيع من غير إضافة أصناف",
            trigger: "change"
          }
        ]
      },
      TaxOptions: [
        {
          value: 0,
          label: "لا توجد ضريبة"
        },
        {
          value: 0.16,
          label: "ضريبة 16 %"
        }
      ],
      InventoryItems: [],
      MenuItems: []
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
      background: "rgba(0, 0, 0, 0.7)"
    });
    GetActiveInventory().then(response => {
      this.InventoryItems = response;
    });
    GetActiveMenuItem().then(response => {
      this.MenuItems = response;
    });
    loading.close();
  },
  methods: {
    OpenNewInvoice() {
      window.open(
        this.$router.resolve({
          path: "/Sales/Create"
        }).href,
        this.$router.resolve({
          path: "/Sales/Create"
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
        Type: "takeaway",
        InventoryMovements: []
      };
    },
    AddItem(Item, Qty) {
      var find = this.tempForm.InventoryMovements.findIndex(
        value => value.ItemsId == Item.Id
      );
      if (find != -1) this.tempForm.InventoryMovements[find].Qty += Qty;
      else {
        let SellingPrice = Item.SellingPrice;
        if (this.PriceMethod == "wholesale") SellingPrice = Item.OtherPrice;
        this.tempForm.InventoryMovements.push({
          Id: undefined,
          ItemsId: Item.Id,
          TypeMove: "Out",
          Status: 0,
          Qty: 1.0,
          SellingPrice: SellingPrice,
          Tax: 0.0,
          Description: "",
          InventoryItemId: 1,
          Name: Item.Name,
          SalesInvoiceId: undefined
        });
      }
    },
    RemoveItem(index) {
      this.tempForm.InventoryMovements.splice(index, 1);
    },
    OpenCashDrawer() {
      OpenCashDrawer({ Com: this.$store.state.settings.CashDrawerCOM.COM })
        .then(response => {})
        .catch(err => {
          console.log(err);
        });
    },
    getdata(val) {
      GetSaleInvoiceByID({ Id: val })
        .then(response => {
          this.tempForm = response;
          // set tagsview title
          this.setTagsViewTitle();

          // set page title
          this.setPageTitle();
        })
        .catch(err => {
          console.log(err);
        });
    },
    createData() {
      this.$refs["F-SaleInvoice"].validate(valid => {
        this.tempForm.PaymentMethod = this.tempForm.PaymentMethod;
        this.tempForm.Tax = parseInt(this.tempForm.Tax);
        if (
          valid &&
          this.tempForm.InventoryMovements.reduce((prev, cur) => {
            return prev + cur.Qty * cur.SellingPrice;
          }, 0) -
            this.tempForm.Discount >
            0 &&
          this.tempForm.InventoryMovements.length > 0 &&
          this.tempForm.InventoryMovements.reduce(
            (a, b) => a + (b["Qty"] || 0),
            0
          ) > 0
        ) {
          this.DisabledSave = true;
          Create(this.tempForm)
            .then(response => {
              this.$notify({
                title: "تم الإضافة بنجاح",
                message: "تم الإضافة بنجاح",
                type: "success",
                position: "top-left",
                duration: 1000,
                onClose: () => {
                  this.tempForm.Id = response;
                  this.OldInvoice = this.tempForm;
                  this.restTempForm();
                  this.DisabledSave = false;
                  this.OpenRestOfBill = false;
                }
              });
            })
            .catch(error => {
              console.log(error);
            });
        } else {
          this.OpenRestOfBill = false;
          return false;
        }
      });
    },
    updateData() {
      this.$refs["F-SaleInvoice"].validate(valid => {
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
            this.tempForm.InventoryMovements.reduce(
              (a, b) => a + (b["Qty"] || 0),
              0
            ) > 0
          ) {
            this.DisabledSave = true;
            Edit(this.tempForm)
              .then(response => {
                this.$notify({
                  title: "تم تعديل بنجاح",
                  message: "تم تعديل بنجاح",
                  type: "success",
                  position: "top-left",
                  duration: 1000,
                  showClose: false,
                  onClose: () => {
                    this.ValidateDescription = "";
                    this.tempForm.Id = response;
                    this.OldInvoice = this.tempForm;
                    this.$nextTick(() => {
                      this.OpenRestOfBill = false;
                      this.$router.go(-1);
                    });
                  }
                });
              })
              .catch(error => {
                console.log(error);
              });
          } else
            this.ValidateDescription =
              "قيمة الدائن و المدين غير متساويات أو تساوي صفر  ";
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
        title: `${title}-${this.tempForm.Id}`
      });
      this.$store.dispatch("tagsView/updateVisitedView", route);
    },
    setPageTitle() {
      const title = "Edit Sale";
      document.title = `${title} - ${this.tempForm.Id}`;
    }
  }
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
