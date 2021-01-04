<template>
  <div>
    <el-form
      ref="F-SaleInvoice"
      :rules="rules"
      :model="tempForm"
    >
      <div
      @dblclick="focusBarcode"
        class="components-container"
        v-bind:style="
          this.$i18n.locale == 'ar' ? 'direction: rtl' : 'direction: ltr'
        "
      >
        <split-pane split="horizontal" :min-percent="6" :default-percent="6">
          <template slot="paneL">
            <el-row style="margin-top: 2px; background: #545454; color: white">
              <el-col :span="2">
                <size-select
                  id="size-select"
                  class="right-menu-item hover-effect"
                />
                <screenfull
                  id="screenfull"
                  class="right-menu-item hover-effect"
                />
                <lang-select class="right-menu-item hover-effect" />
              </el-col>
              <el-col :span="6">
                <el-form-item prop="PaymentMethod">
                  <el-radio-group
                    v-model="tempForm.PaymentMethod"
                    text-color="#f78123"
                  >
                    <el-radio label="Cash" border>{{
                      $t("NewPurchaseInvoice.Cash")
                    }}</el-radio>
                    <el-radio label="Visa" border>Visa</el-radio>

                    <el-radio
                      v-if="tempForm.VendorId != 2"
                      label="Receivables"
                      border
                      >{{ $t("NewPurchaseInvoice.Receivables") }}</el-radio
                    >
                  </el-radio-group>
                </el-form-item>
              </el-col>

              <el-col :span="4" v-if="checkPermission(['Admin'])">
                <el-form-item>
                  <el-radio-group v-model="PriceMethod" text-color="#f78123">
                    <el-radio label="retail" border>مفرق</el-radio>
                    <el-radio label="wholesale" border>جملة</el-radio>
                  </el-radio-group>
                </el-form-item>
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
                  <el-select
                    v-model="tempForm.VendorId"
                    filterable
                    v-bind:placeholder="$t('NewPurchaseInvoice.Acc')"
                    autocomplete="off"
                    default-first-option
                  >
                    <el-option
                      v-for="item in Vendor"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    >
                      <span style="float: right">{{ item.label }}</span>
                      <span
                        style="float: left color: #8492a6 font-size: 13px"
                        >{{ item.value }}</span
                      >
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col v-permission="['Admin']" :span="4">
                <el-form-item
                  prop="FakeDate"
                  :rules="[
                    {
                      type: 'date',
                      required: true,
                      message: 'لايمكن ترك التاريخ فارغ',
                      trigger: 'blur'
                    }
                  ]"
                >
                  <el-date-picker
                    v-model="tempForm.FakeDate"
                    type="date"
                    v-bind:placeholder="$t('CashPool.Date')"
                    format="dd/MM/yyyy"
                  ></el-date-picker>
                </el-form-item>
              </el-col>

              <el-col :span="4">
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
                  icon="el-icon-refresh"
                  @click="getdata()"
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
            <split-pane
              split="vertical"
              :min-percent="65"
              :default-percent="70"
            >
              <template slot="paneL">
                <split-pane
                  split="horizontal"
                  :min-percent="88"
                  :default-percent="88"
                >
                  <template slot="paneL">
                    <el-card
                      style="background: #545454"
                      :body-style="{ padding: '1px' }"
                    >
                      <items-search @add="AddItem" @focus="focusBarcode" />
                    </el-card>
                    <el-form-item prop="InventoryMovements">
                      <el-table
                        highlight-current-row
                        border
                        max-height="500"
                        :data="tempForm.InventoryMovements"
                        width="100%"
                      >
                        <el-table-column prop="ItemsID" align="center">
                          <template slot="header" slot-scope="{}"
                            >{{ $t("NewPurchaseInvoice.Items") }} ({{
                              tempForm.InventoryMovements.length.toFixed(2)
                            }}
                            )</template
                          >
                          <template slot-scope="scope">
                            <div class="ItemName">
                              {{ scope.row.Itemx.Name }}
                              <el-tag type="primary" effect="plain">{{
                                PriceMethod == "wholesale"
                                  ? scope.row.Itemx.OtherPrice.toFixed(2)
                                  : scope.row.Itemx.SellingPrice.toFixed(2)
                              }}</el-tag>
                              <edit-item
                                v-if="checkPermission(['Admin'])"
                                style="float: left"
                                :ItemID="
                                  tempForm.InventoryMovements[scope.$index]
                                    .ItemsID
                                "
                              />
                            </div>
                          </template>
                        </el-table-column>
                        <el-table-column width="160" align="center">
                          <template slot="header" slot-scope="{}"
                            >{{ $t("NewPurchaseInvoice.quantity") }} ({{
                              tempForm.InventoryMovements.reduce(
                                (a, b) => a + (b["Qty"] || 0),
                                0
                              ).toFixed(2)
                            }}
                            )</template
                          >
                          <template slot-scope="scope">
                            <el-input-number
                              @change="focusBarcode()"
                              v-model="
                                tempForm.InventoryMovements[scope.$index].Qty
                              "
                              :precision="2"
                              :step="1"
                              :min="0"
                              :max="1000000"
                            ></el-input-number>
                          </template>
                        </el-table-column>
                        <el-table-column
                          v-if="checkPermission(['Admin'])"
                          v-bind:label="$t('NewPurchaseInvoice.Price')"
                          width="130"
                          align="center"
                        >
                          <template slot-scope="scope">
                            <currency-input
                              class="currency-input"
                              v-model="
                                tempForm.InventoryMovements[scope.$index]
                                  .SellingPrice
                              "
                              @focus="$event.target.select()"
                            />
                          </template>
                        </el-table-column>
                        <el-table-column
                          v-if="!checkPermission(['Admin'])"
                          v-bind:label="$t('NewPurchaseInvoice.Price')"
                          width="130"
                          align="center"
                        >
                          <template slot-scope="scope">
                            <currency-input
                              @change="focusBarcode()"
                              class="currency-input"
                              disabled
                              v-model="
                                tempForm.InventoryMovements[scope.$index]
                                  .SellingPrice
                              "
                            />
                          </template>
                        </el-table-column>
                        <el-table-column
                          v-bind:label="$t('CashPool.Total')"
                          width="130"
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
                                ).toFixed(2)
                              }}
                            </div>
                          </template>
                        </el-table-column>
                        <el-table-column
                          v-if="checkPermission(['Admin'])"
                          v-bind:label="$t('NewPurchaseInvoice.Inventory')"
                          width="110"
                          align="center"
                        >
                          <template slot-scope="scope">
                            <el-radio-group
                              v-model="
                                tempForm.InventoryMovements[scope.$index]
                                  .InventoryItemID
                              "
                            >
                              <el-radio-button
                                v-for="(item, index) in InventoryItems"
                                :key="index"
                                :label="item.value"
                                >{{ item.label }}</el-radio-button
                              >
                            </el-radio-group>
                          </template>
                        </el-table-column>
                        <el-table-column label="#" width="75" align="center">
                          <template slot-scope="scope">
                            <el-button
                              type="danger"
                              icon="el-icon-delete"
                              @click="RemoveItem(scope.$index)"
                            ></el-button>
                          </template>
                        </el-table-column>
                      </el-table>
                    </el-form-item>
                  </template>
                  <template slot="paneR">
                    <el-col :span="6">
                      <el-button
                        :disabled="DisabledSave"
                        style="font-size: 45px"
                        @click="isEdit != true ? createData() : updateData()"
                        type="success"
                        icon="el-icon-check"
                      ></el-button>
                    </el-col>
                    <el-col :span="6">
                    <el-badge value="F4" class="item" type="primary">
                      <el-button
                        style="font-size: 45px"
                        @click="
                          OpenCashDrawer($store.state.settings.CashDrawerCOM)
                        "
                        type="warning"
                        icon="el-icon-takeaway-box"
                      ></el-button></el-badge>

                    </el-col>
                    <el-col :span="6">
                      <el-switch
                        v-model="AutoPrint"
                        active-color="#13ce66"
                        inactive-color="#ff4949"
                      ></el-switch>
                      <el-button
                        v-bind:disabled="OldInvoice != null ? false : true"
                        style="font-size: 35px"
                        @click="Print()"
                        type="primary"
                        icon="el-icon-printer"
                      ></el-button>
                    </el-col>
                  </template>
                </split-pane>
              </template>
              <template slot="paneR">
                <split-pane
                  split="horizontal"
                  :min-percent="23"
                  :default-percent="25"
                >
                  <template slot="paneL">
                    <el-card style="background: #545454">
                      <el-row>
                        <el-col :span="24">
                          <el-input
                            prop="Name"
                            placeholder="اسم المستلم"
                            v-model="tempForm.Name"
                          ></el-input>
                        </el-col>
                      </el-row>
                      <el-row v-permission="['admin']">
                        <el-col
                          :span="6"
                          class="TotalAmmount"
                          style="font-size: medium"
                          >{{ $t("NewPurchaseInvoice.TotalDiscount") }}</el-col
                        >
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
                        <el-col :span="12">
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
                      </el-row>
                      <el-row>
                        <el-col :span="24">
                          <el-form-item prop="Description">
                            <el-input
                              v-bind:placeholder="
                                $t('NewPurchaseInvoice.statement')
                              "
                              v-model="tempForm.Description"
                            ></el-input>
                          </el-form-item>
                        </el-col>
                      </el-row>
                      <el-row>
                        <el-col :span="24" class="TotalAmmount">
                          <span>{{ $t("NewPurchaseInvoice.TotalJD") }}</span>
                          <el-divider direction="vertical"></el-divider>
                          <span
                            >{{
                              (
                                tempForm.InventoryMovements.reduce(function(
                                  prev,
                                  cur
                                ) {
                                  return prev + cur.Qty * cur.SellingPrice;
                                },
                                0) - tempForm.Discount
                              ).toFixed(2)
                            }}
                            JOD</span
                          >
                        </el-col>
                      </el-row>
                    </el-card>
                  </template>
                  <template slot="paneR" style="background: #545454">
                    <items-prime @add="AddItem" />
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
import checkPermission from "@/utils/permission";

// components
import ItemsSearch from "@/components/Item/ItemsSearch";
import ItemsPrime from "@/components/Item/ItemsPrime";
import EditItem from "@/components/Item/EditItem";

import LangSelect from "@/components/LangSelect";
import Screenfull from "@/components/Screenfull";
import SizeSelect from "@/components/SizeSelect";

// report
import printJS from "print-js";
import { Invoice1 } from "@/Report/POSInvoice";

import { Create, Edit, GetSaleInvoiceByID } from "@/api/SaleInvoice";
import { GetActiveInventory } from "@/api/InventoryItem";
import { GetActiveMenuItem } from "@/api/MenuItem";
import { GetActiveVendor } from "@/api/Vendor";

//import { GetActiveMember } from "@/api/Member";
import splitPane from "vue-splitpane";
//import { NumericInput } from "numeric-keyboard";
import { OpenCashDrawer } from "@/api/Device";

//import VueTouchKeyboard from "vue-touch-keyboard";
export default {
  Name: "NewSaleInvoice",
  directives: { permission },
  components: {
    splitPane,
    LangSelect,
    Screenfull,
    SizeSelect,
    printJS,
    ItemsSearch,
    ItemsPrime,
    EditItem
  },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const validateRequire = (rule, value, callback) => {
      if (value === "") {
        this.$message({
          message: rule.field + "اواي",
          type: "error"
        });
        callback(new Error(rule.field + "اي"));
      } else {
        callback();
      }
    };
    const validateSourceUri = (rule, value, callback) => {
      if (value) {
        if (validURL(value)) {
          callback();
        } else {
          this.$message({
            message: "اه",
            type: "error"
          });
          callback(new Error("اوه"));
        }
      } else {
        callback();
      }
    };
    return {
      OldInvoice: null,
      AutoPrint: false,
      PriceMethod: "retail",
      DisabledSave: false,
      tempForm: {
        Id: undefined,
        Name: "",
        Tax: 0.0,
        FakeDate: new Date(),
        PaymentMethod: "Cash",
        Discount: 0,
        Description: "",
        VendorId: 2,
        IsPrime: false,
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
      MenuItems: [],
      Vendor: []
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

    GetActiveVendor().then(response => {
      this.Vendor = response;
      loading.close();
    });
  },
  mounted() {
    this.focusBarcode();
  },
  methods: {
    OpenNewInvoice() {
      window.open(
        this.$router.resolve({
          path: "/Sales/Create"
        }).href,
        name,
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
    focusBarcode() {
      document.getElementById("barcode").focus();
    },
    restTempForm() {
      this.tempForm = {
        Id: undefined,
        Name: "",
        Tax: 0.0,
        FakeDate: new Date(),
        PaymentMethod: "Cash",
        Discount: 0,
        Description: "",
        VendorId: 2,
        IsPrime: false,
        InventoryMovements: []
      };
    },
    AddItem(Item, Qty) {
      this.focusBarcode();

      var find = this.tempForm.InventoryMovements.findIndex(
        value => value.ItemsID == Item.Id
      );

      if (find != -1) this.tempForm.InventoryMovements[find].Qty += Qty;
      else {
        let SellingPrice = Item.SellingPrice;
        if (this.PriceMethod == "wholesale") SellingPrice = Item.OtherPrice;
        this.tempForm.InventoryMovements.push({
          Id: undefined,
          ItemsID: Item.Id,
          TypeMove: "Out",
          Status: 0,
          Qty: 1.0,
          SellingPrice: SellingPrice,
          Tax: 0.0,
          Description: "",
          InventoryItemID: 1,
          Itemx: Item,
          Name: Item.Name,
          SalesInvoiceId: undefined
        });
      }
    },
    RemoveItem(index) {
      this.tempForm.InventoryMovements.splice(index, 1);
      this.focusBarcode();
    },
    OpenCashDrawer(COM) {
      OpenCashDrawer({ Com: COM })
        .then(response => {})
        .catch(err => {
          console.log(err);
        });
    },
    checkPermission,
    getdata(val) {
      GetSaleInvoiceByID({ Id: val })
        .then(response => {
          this.tempForm = response;
          this.tempForm.FakeDate = new Date(this.tempForm.FakeDate);
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
        if (valid) {
          this.DisabledSave = true;
          this.tempForm.PaymentMethod = this.tempForm.PaymentMethod;
          this.tempForm.Tax = parseInt(this.tempForm.Tax);
          if (
            this.tempForm.InventoryMovements.reduce(function(prev, cur) {
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
            Create(this.tempForm)
              .then(response => {
                this.$notify({
                  title: "تم الإضافة بنجاح",
                  message: "تم الإضافة بنجاح",
                  type: "success",
                  position: "top-left",
                  duration: 1000,
                  showClose: false,
                  onClose: () => {
                    this.tempForm.Id = response;
                    this.OldInvoice = this.tempForm;
                    this.AutoPrint ? this.Print() : undefined;
                    this.restTempForm();
                    this.DisabledSave = false;
                    this.focusBarcode();
                  }
                });
              })
              .catch(error => {
                console.log(error);
              });
          } else
            this.ValidateDescription =
              "قيمة الدائن و المدين غير متساويات أو تساوي صفر  ";
        } else {
          console.log("error submit!!");
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
            this.tempForm.InventoryMovements.reduce(function(prev, cur) {
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
                    this.tempForm.Id = response;
                    this.OldInvoice = this.tempForm;
                    this.AutoPrint ? this.Print() : undefined;
                    this.$nextTick(() => {
                      this.$router.back();
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
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    Print() {
      printJS({
        printable: Invoice1(this.OldInvoice),
        type: "pdf",
        base64: true,
        showModal: true
      });
      this.focusBarcode();
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
.ItemName {
  color: #545454;
  font-weight: 600;
  font-size: 12px;
}
.el-card__body {
  padding: 3px;
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

.button {
  padding: 0;
  float: right;
}
.image {
  width: 100%;
  display: block;
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
  color: mediumseagreen;
}
.right-menu-item {
  color: #ffffff;
  display: inline-block;
  padding: 0 8px;
  font-size: 18px;
  vertical-align: text-bottom;
}
.TotalAmmount {
  font-size: x-large;
  font-weight: 600;
  color: white;
  margin-bottom: 10px;
}
.el-form-item__label {
  color: white;
}
</style>
