<template>
  <div style="overflow: hidden">
    <el-form ref="F-SaleInvoice" :rules="rules" :model="tempForm">
      <div
        @dblclick="focusBarcode"
        class="components-container"
        v-bind:style="this.$i18n.locale == 'ar' ? 'direction: rtl' : 'direction: ltr'"
      >
        <split-pane split="horizontal" :min-percent="6" :default-percent="6">
          <template slot="paneL">
            <el-row type="flex" style="background: #545454; color: white">
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
                    :value="tempForm.FakeDate"
                    @Set="(v) => (tempForm.FakeDate = v)"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="3">
                <el-button
                  type="primary"
                  icon="el-icon-s-home"
                  :size="$store.getters.size"
                  @click="
                    $router.replace({
                      path: '/redirect' + '' + $store.getters.defulate_redirect + '',
                    })
                  "
                ></el-button>
                <el-button
                  :size="$store.getters.size"
                  type="primary"
                  icon="el-icon-s-claim"
                  @click="
                    $router.replace({
                      path: '/redirect' + '/CashPool/Create/SaleInvoice',
                    })
                  "
                ></el-button>
                <el-button
                  :size="$store.getters.size"
                  type="primary"
                  icon="el-icon-plus"
                  @click="
                    () => {
                      let r = $router.resolve({
                        path: '/Sales/Create',
                      });
                      window.open(
                        r.href,
                        r.route.name,
                        $store.getters.settings.windowStyle
                      );
                    }
                  "
                ></el-button>
              </el-col>

              <el-col :span="3">
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
                  <vendor-search-any
                    :Id="tempForm.VendorId"
                    @Set="
                      (v) => {
                        tempForm.Name = v.Name;
                        tempForm.VendorId = v.Id;
                      }
                    "
                  />
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-form-item>
                  <el-radio-group
                    @change="focusBarcode"
                    v-model="PriceMethod"
                    text-color="#f78123"
                  >
                    <el-radio label="retail" border>مفرق</el-radio>
                    <el-radio label="wholesale" border>جملة</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>

              <el-col :span="6">
                <el-form-item prop="PaymentMethod">
                  <el-radio-group
                    @change="focusBarcode"
                    v-model="tempForm.PaymentMethod"
                    text-color="#f78123"
                  >
                    <el-radio label="Cash" border>{{
                      $t("NewPurchaseInvoice.Cash")
                    }}</el-radio>
                    <el-radio label="Visa" border>Visa</el-radio>

                    <el-radio v-if="tempForm.VendorId != 2" label="Receivables" border>{{
                      $t("NewPurchaseInvoice.Receivables")
                    }}</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>

              <el-col :span="6">
                <Right-Menu />
              </el-col>
            </el-row>
          </template>
          <template slot="paneR">
            <split-pane split="vertical" :min-percent="65" :default-percent="70">
              <template slot="paneL">
                <split-pane split="horizontal" :min-percent="88" :default-percent="88">
                  <template slot="paneL">
                    <el-card style="background: #545454" :body-style="{ padding: '1px' }">
                      <items-search
                        @add="AddItem"
                        @focus="focusBarcode"
                        :WithBarCode="true"
                      />
                    </el-card>
                    <el-form-item prop="InventoryMovements">
                      <el-table
                        highlight-current-row
                        border
                        max-height="500"
                        :data="tempForm.InventoryMovements"
                        width="100%"
                      >
                        <el-table-column prop="ItemsId" align="center">
                          <template slot="header" slot-scope="{}"
                            >{{ $t("NewPurchaseInvoice.Items") }} ({{
                              tempForm.InventoryMovements.length.toFixed(
                                $store.getters.settings.ToFixed
                              )
                            }}
                            )</template
                          >
                          <template slot-scope="scope">
                            <div class="ItemName">
                              {{ scope.row.Name }}
                              <el-tag type="primary" effect="plain">{{
                                PriceMethod == "wholesale"
                                  ? scope.row.OtherPrice.toFixed(
                                      $store.getters.settings.ToFixed
                                    )
                                  : scope.row.SellingPrice.toFixed(
                                      $store.getters.settings.ToFixed
                                    )
                              }}</el-tag>
                              <edit-item
                                @focus="focusBarcode"
                                v-if="checkPermission(['admin'])"
                                style="float: left"
                                :ItemId="
                                  tempForm.InventoryMovements[scope.$index].ItemsId
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
                              ).toFixed($store.getters.settings.ToFixed)
                            }}
                            )</template
                          >
                          <template slot-scope="scope">
                            <el-input-number
                              @change="focusBarcode"
                              v-model="tempForm.InventoryMovements[scope.$index].Qty"
                              :precision="2"
                              :step="1"
                              :min="0"
                              :max="1000000"
                              @focus="$event.target.select()"
                            ></el-input-number>
                          </template>
                        </el-table-column>
                        <el-table-column
                          v-if="checkPermission(['admin'])"
                          v-bind:label="$t('NewPurchaseInvoice.Price')"
                          width="130"
                          align="center"
                        >
                          <template slot-scope="scope">
                            <currency-input
                              class="currency-input"
                              v-model="
                                tempForm.InventoryMovements[scope.$index].SellingPrice
                              "
                              @change="focusBarcode"
                              @focus="$event.target.select()"
                            />
                          </template>
                        </el-table-column>
                        <el-table-column
                          v-if="!checkPermission(['admin'])"
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
                                tempForm.InventoryMovements[scope.$index].SellingPrice
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
                                  tempForm.InventoryMovements[scope.$index].SellingPrice *
                                  tempForm.InventoryMovements[scope.$index].Qty
                                ).toFixed($store.getters.settings.ToFixed)
                              }}
                            </div>
                          </template>
                        </el-table-column>
                        <el-table-column
                          v-if="checkPermission(['admin'])"
                          v-bind:label="$t('NewPurchaseInvoice.Inventory')"
                          width="110"
                          align="center"
                        >
                          <template slot-scope="scope">
                            <radio-active-inventory
                              :InventoryId="
                                tempForm.InventoryMovements[scope.$index].InventoryItemId
                              "
                              @Set="
                                (v) =>
                                  (tempForm.InventoryMovements[
                                    scope.$index
                                  ].InventoryItemId = v.value)
                              "
                            />
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
                      <div style="color: red">{{ ValidateDescription }}</div>
                    </el-form-item>
                  </template>
                  <template slot="paneR">
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
                        :value="$store.state.settings.CashDrawerCOM.OpenKeyBoard"
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
                      <Drawer-Print
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
                <split-pane split="horizontal" :min-percent="27" :default-percent="30">
                  <template slot="paneL">
                    <el-card style="background: #545454">
                      <el-row type="flex">
                        <el-col :span="24">
                          <el-input
                            @change="focusBarcode"
                            prop="Name"
                            placeholder="اسم المستلم"
                            v-model="tempForm.Name"
                          ></el-input>
                        </el-col>
                      </el-row>
                      <el-row v-permission="['admin']">
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
                            @focus="$event.target.select()"
                          ></el-input-number>
                        </el-col>
                        <el-col :span="6" class="TotalAmmount" style="font-size: small">{{
                          $t("NewPurchaseInvoice.TotalDiscount")
                        }}</el-col>
                      </el-row>
                      <el-row type="flex">
                        <el-col :span="24">
                          <el-form-item prop="Description">
                            <el-input
                              @change="focusBarcode"
                              v-bind:placeholder="$t('NewPurchaseInvoice.statement')"
                              v-model="tempForm.Description"
                            ></el-input>
                          </el-form-item>
                        </el-col>
                      </el-row>
                      <el-row type="flex">
                        <el-col :span="24" class="TotalAmmount">
                          <span>{{ $t("NewPurchaseInvoice.TotalJD") }}</span>
                          <el-divider direction="vertical"></el-divider>
                          <span
                            >{{
                              (
                                tempForm.InventoryMovements.reduce((prev, cur) => {
                                  return prev + cur.Qty * cur.SellingPrice;
                                }, 0) - tempForm.Discount
                              ).toFixed($store.getters.settings.ToFixed)
                            }}
                            JOD</span
                          >
                        </el-col>
                      </el-row>
                    </el-card>
                  </template>
                  <template slot="paneR">
                    <items-prime @add="AddItem" @focus="focusBarcode" />
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

import DrawerPrint from "@/components/PrintRepot/DrawerPrint";

// report

import { Create, Edit, GetSaleInvoiceById } from "@/api/SaleInvoice";

import splitPane from "vue-splitpane";
import { OpenCashDrawer } from "@/api/Device";
import RightMenu from "@/components/RightMenu";

import FakeDate from "@/components/Date/FakeDate";
import RadioActiveInventory from "@/components/Inventory/RadioActiveInventory.vue";


export default {
  Name: "NewSaleInvoice",
  directives: { permission },
  components: {
    splitPane,
    ItemsSearch,
    ItemsPrime,
    EditItem,
    DrawerPrint,
    RestOfBill,
    RightMenu,
    FakeDate,
    RadioActiveInventory,
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
      AutoPrint: false,
      PriceMethod: "retail",
      DisabledSave: false,
      OpenRestOfBill: false,
      ValidateDescription: "",
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
  mounted() {
    this.focusBarcode();
  },
  methods: {
    focusBarcode() {
      document.getElementById("barcode").focus();
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
        InventoryMovements: [],
      };
    },
    AddItem(Item, Qty) {
      this.focusBarcode();
      const find = this.tempForm.InventoryMovements.findIndex(
        (value) => value.ItemsId == Item.Id
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
          OtherPrice: Item.OtherPrice,
          SalesInvoiceId: undefined,
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
        .then((response) => {})
        .catch((err) => {
          console.log(err);
        });
    },
    checkPermission,
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
        this.tempForm.Tax = parseInt(this.tempForm.Tax);
        if (
          valid &&
          this.tempForm.InventoryMovements.reduce((prev, cur) => {
            return prev + cur.Qty * cur.SellingPrice;
          }, 0) -
            this.tempForm.Discount >
            0 &&
          this.tempForm.InventoryMovements.length > 0 &&
          this.tempForm.InventoryMovements.reduce((a, b) => a + (b["Qty"] || 0), 0) > 0
        ) {
          this.DisabledSave = true;
          Create(this.tempForm)
            .then((response) => {
              this.$notify({
                title: "تم الإضافة بنجاح",
                message: "تم الإضافة بنجاح",
                type: "success",
                position: "top-left",
                duration: 1000,
                onClose: () => {
                  this.ValidateDescription = "";
                  this.tempForm.Id = response.Id;
                  this.OldInvoice = this.tempForm;
                  this.AutoPrint  ? this.Print() : undefined;
                  this.restTempForm();
                  this.DisabledSave = false;
                  this.focusBarcode();
                  this.OpenRestOfBill = false;
                },
              });
            })
            .catch((error) => {
              console.log(error);
              this.DisabledSave = false;
            });
        } else {
          this.ValidateDescription = "قيمة الدائن و المدين غير متساويات أو تساوي صفر  ";
          this.focusBarcode();
          this.OpenRestOfBill = false;
          return false;
        }
      });
    },
    updateData() {
      this.$refs["F-SaleInvoice"].validate((valid) => {
        if (valid) {
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
                    this.tempForm.Id = response.Id;
                    this.OldInvoice = this.tempForm;
                    this.AutoPrint ? this.Print() : undefined;
                    this.OpenRestOfBill = false;
                    this.$router.go(-1);
                  },
                });
              })
              .catch((error) => {
                console.log(error);
              });
          } else
            this.ValidateDescription = "قيمة الدائن و المدين غير متساويات أو تساوي صفر  ";
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
      const title = this.$t("route.EditSaleInvoice");
      const route = Object.assign({}, this.tempRoute, {
        title: `${title}-${this.tempForm.Id}`,
      });
      this.$store.dispatch("tagsView/updateVisitedView", route);
    },
    setPageTitle() {
      const title = this.$t("route.EditSaleInvoice");
      document.title = `${title} - ${this.tempForm.Id}`;
    },
  },
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
.Right-Menu-item {
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
