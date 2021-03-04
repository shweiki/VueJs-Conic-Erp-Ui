<template>
  <div>
    <el-form ref="F-SaleInvoice" :rules="rules" :model="tempForm">
      <div
        @dblclick="focusBarcode"
        class="components-container"
        v-bind:style="
          this.$i18n.locale == 'ar' ? 'direction: rtl' : 'direction: ltr'
        "
      >
        <split-pane split="horizontal" :min-percent="6" :default-percent="6">
          <template slot="paneL">
            <el-row style="margin-top: 2px; background: #f5f7fa; color: white">
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
                  <el-select
                    v-model="tempForm.VendorId"
                    filterable
                    v-bind:placeholder="$t('NewPurchaseInvoice.Acc')"
                    autocomplete="off"
                    default-first-option
                    @change="focusBarcode"
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
                    @change="focusBarcode"
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
                  icon="el-icon-plus"
                  @click="OpenNewInvoice"
                ></el-button>
              </el-col>
            </el-row>
          </template>
          <template slot="paneR">
            <split-pane
              split="vertical"
              :min-percent="60"
              :default-percent="60"
            >
              <template slot="paneL">
                <split-pane
                  split="horizontal"
                  :min-percent="88"
                  :default-percent="88"
                >
                  <template slot="paneL">
                    <el-card
                      style="background: #f5f7fa"
                      :body-style="{ padding: '1px' }"
                    >
                      <items-search @add="AddItem" @focus="focusBarcode" />
                    </el-card>
                    <items-prime
                      :WithImage="true"
                      @add="AddItem"
                      @focus="focusBarcode"
                    />
                  </template>
                  <template slot="paneR">
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
                            focusBarcode();
                          }
                        "
                        @Done="isEdit != true ? createData() : updateData()"
                      />

                      <el-button
                        :disabled="DisabledSave"
                        style="font-size: 45px"
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
                          style="font-size: 45px"
                          @click="OpenCashDrawer()"
                          type="warning"
                          icon="el-icon-takeaway-box"
                        ></el-button
                      ></el-badge>
                    </el-col>
                    <el-col :span="6">
                      <el-switch
                        @change="focusBarcode"
                        v-model="AutoPrint"
                        active-color="#13ce66"
                        inactive-color="#ff4949"
                      ></el-switch>
                      <print-button
                        v-if="OldInvoice == null ? false : true"
                        Type="SaleInvoice"
                        :Data="OldInvoice"
                        Css="font-size: 35px"
                        @focus="focusBarcode"
                      />
                    </el-col>
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
                    <el-card style="background: #f5f7fa">
                      <el-row>
                        <el-col :span="12">
                          <el-form-item prop="PaymentMethod">
                            <el-radio-group
                              @change="focusBarcode"
                              v-model="tempForm.PaymentMethod"
                              text-color="#f78123"
                            >
                              <el-radio label="Cash" border
                                ><i class="el-icon-money"></i>نقد</el-radio
                              >
                              <el-radio label="Visa" border
                                ><i class="el-icon-bank-card"></i>بطاقة
                              </el-radio>

                              <el-radio
                                v-if="tempForm.VendorId != 2"
                                label="Receivables"
                                border
                                ><i class="el-icon-s-custom"></i
                              ></el-radio>
                            </el-radio-group>
                          </el-form-item>
                        </el-col>
                        <el-col :span="12">
                          <el-form-item>
                            <el-radio-group
                              @change="focusBarcode"
                              v-model="tempForm.Type"
                              text-color="#f78123"
                            >
                              <el-radio label="takeaway" border
                                ><i class="el-icon-sell"></i>سفري</el-radio
                              >
                              <el-radio label="delivery" border
                                ><i class="el-icon-truck"></i> توصيل</el-radio
                              >
                            </el-radio-group>
                          </el-form-item>
                        </el-col></el-row
                      >
                      <el-row>
                        <el-col :span="18">
                          <el-input
                            @change="focusBarcode"
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
                                @change="focusBarcode"
                                v-bind:placeholder="
                                  $t('NewPurchaseInvoice.statement')
                                "
                                v-model="tempForm.Description"
                              ></el-input>
                            </el-form-item>
                            <el-button type="primary" slot="reference"><i class="el-icon-notebook-1"></i> {{
                               $t("NewPurchaseInvoice.statement")
                            }}</el-button>
                          </el-popover></el-col
                        >
                      </el-row>
                      <el-row v-permission="['Admin']">
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
                            @change="focusBarcode"
                            prop="Discount"
                            v-model="tempForm.Discount"
                            controls-position="right"
                            :precision="2"
                            :step="1"
                            :min="0.0"
                            :max="100"
                          ></el-input-number>
                        </el-col>
                        <el-col
                          :span="6"
                          class="TotalAmmount"
                          style="font-size: small"
                          >{{ $t("NewPurchaseInvoice.TotalDiscount") }}</el-col
                        >
                      </el-row>

                      <el-row>
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
                    </el-card>
                  </template>
                  <template slot="paneL" style="background: #f5f7fa">
                    <el-form-item prop="InventoryMovements">
                      <el-table
                        highlight-current-row
                        border
                        max-height="375"
                        :data="tempForm.InventoryMovements"
                        width="100%"
                      >
                        <el-table-column
                          prop="ItemsId"
                          width="310"
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
                              {{ scope.row.Itemx.Name }}

                              {{
                                tempForm.InventoryMovements[scope.$index]
                                  .SellingPrice
                              }}
                              X
                              <el-input-number
                                style="    width: 50%;"
                                @change="focusBarcode"
                                v-model="
                                  tempForm.InventoryMovements[scope.$index].Qty
                                "
                                :precision="2"
                                :step="1"
                                :min="0"
                                :max="1000000"
                              ></el-input-number>
                            </div>
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
                              @change="focusBarcode"
                              class="currency-input"
                              disabled
                              @focus="$event.target.select()"
                              v-model="
                                tempForm.InventoryMovements[scope.$index]
                                  .SellingPrice
                              "
                            />
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

                        <el-table-column label="#" align="center">
                          <template slot-scope="scope">
                            <el-button
                              type="danger"
                              icon="el-icon-delete"
                              @click="RemoveItem(scope.$index)"
                            ></el-button>
                          </template>
                        </el-table-column>
                      </el-table>
                      <div style="color: red">{{ ValidateDescription }}</div>
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
import checkPermission from "@/utils/permission";

// components
import ItemsSearch from "@/components/Item/ItemsSearch";
import ItemsPrime from "@/components/Item/ItemsPrime";
import EditItem from "@/components/Item/EditItem";
import RestOfBill from "@/components/Sales/RestOfBill";
import RightMenu from "@/components/RightMenu";

import LangSelect from "@/components/LangSelect";
import Screenfull from "@/components/Screenfull";
import SizeSelect from "@/components/SizeSelect";
import PrintButton from "@/components/PrintRepot/PrintButton";

// report

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
    ItemsSearch,
    ItemsPrime,
    EditItem,
    PrintButton,
    RestOfBill,
    RightMenu
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
      OpenRestOfBill: false,
      ValidateDescription: "",
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
        Type: "takeaway",
        InventoryMovements: [],
        enterPressed: false
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
    /*
    window.addEventListener("keypress", (e) => {
      e = e || window.event;
      if (e.which == "13") {
        if (!this.enterPressed) {
          this.isEdit != true ? this.createData() : this.updateData();
          return;
        }
        this.enterPressed = true;
        setTimeout( ()=> {
          this.enterPressed = false;
        }, 100);
      }

      //debugger
      console.log("key", e.code);
    });
    */
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
    OpenCashDrawer() {
      this.focusBarcode();
      OpenCashDrawer({ Com: this.$store.state.settings.CashDrawerCOM.COM })
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
                  this.ValidateDescription = "";
                  this.tempForm.Id = response;
                  this.OldInvoice = this.tempForm;
                  this.AutoPrint ? this.Print() : undefined;
                  this.restTempForm();
                  this.DisabledSave = false;
                  this.focusBarcode();
                  this.OpenRestOfBill = false;
                }
              });
            })
            .catch(error => {
              console.log(error);
            });
        } else {
          this.ValidateDescription =
            "قيمة الدائن و المدين غير متساويات أو تساوي صفر  ";
          this.focusBarcode();
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
                    this.AutoPrint ? this.Print() : undefined;
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
          this.focusBarcode();
          this.OpenRestOfBill = false;
        } else {
          console.log("error submit!!");
          this.focusBarcode();
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
.ItemName {
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
  display: inline-block;
  padding: 0 8px;
  font-size: 18px;
  vertical-align: text-bottom;
}
.TotalAmmount {
  font-size: x-large;
  font-weight: 600;
  margin-bottom: 10px;
}
</style>
