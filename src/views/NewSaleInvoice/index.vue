<template>
  <div>
    <el-form ref="F-SaleInvoice" :rules="rules" :model="tempForm" label-position="right">
      <div class="components-container" style="direction: rtl; ">
        <split-pane split="horizontal" :min-percent="6" :default-percent="6">
          <template slot="paneL">
            <el-row type="flex" style=" margin-top: 2px; background : #545454; color: white;">
              <el-col :span="7">
                <el-button
                  type="primary"
                  icon="el-icon-s-home"
                  @click="$router.replace({ path: '/redirect' + '/dashboard' })"
                ></el-button>
                <el-button
                  type="primary"
                  icon="el-icon-s-claim"
                  @click="$router.replace({ path: '/redirect' + '/Sales/CashPool' })"
                ></el-button>
                <el-button type="primary" icon="el-icon-refresh" @click="getdata()"></el-button>
              </el-col>
              <el-col v-permission="['admin']" :span="6">
                <el-form-item
                  prop="FakeDate"
                  :rules="[{type: 'date', required: true, message: 'لايمكن ترك التاريخ فارغ', trigger: 'blur' } ]"
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
                <el-form-item
                  prop="VendorID"
                  :rules="[{ required: true, message: 'لايمكن ترك حساب فارغ', trigger: 'blur' }, ]"
                >
                  <el-select
                    v-model="tempForm.VendorID"
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
                      <span style="float: left color: #8492a6 font-size: 13px">{{ item.value }}</span>
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item prop="PaymentMethod">
                  <el-radio-group v-model="tempForm.PaymentMethod" text-color="#f78123">
                    <el-radio label="Cash" border>{{ $t('NewPurchaseInvoice.Cash') }}</el-radio>
                    <el-radio label="Visa" border>Visa</el-radio>

                    <el-radio
                      v-if="tempForm.VendorID != 2"
                      label="Receivables"
                      border
                    >{{ $t('NewPurchaseInvoice.Receivables') }}</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :span="3">
                <size-select id="size-select" class="right-menu-item hover-effect" />
                <screenfull id="screenfull" class="right-menu-item hover-effect" />
                <lang-select class="right-menu-item hover-effect" />
              </el-col>
            </el-row>
          </template>
          <template slot="paneR">
            <split-pane split="vertical" :min-percent="65" :default-percent="70">
              <template slot="paneL">
                <split-pane split="horizontal" :min-percent="88" :default-percent="88">
                  <template slot="paneL">
                    <el-card style="background: #545454;" :body-style="{ padding: '1px',  }">
                      <items-search @add="AddItem" />
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
                          <template
                            slot="header"
                            slot-scope="{}"
                          >{{ $t('NewPurchaseInvoice.Items') }} ({{tempForm.InventoryMovements.length.toFixed(2)}} )</template>
                          <template slot-scope="scope">
                            <div class="ItemName">
                              {{scope.row.Itemx.name}}
                              <el-tag
                                type="primary"
                                effect="plain"
                              >{{scope.row.Itemx.SellingPrice.toFixed(2)}}</el-tag>
                            </div>
                          </template>
                        </el-table-column>
                        <el-table-column width="160" align="center">
                          <template
                            slot="header"
                            slot-scope="{}"
                          >{{ $t('NewPurchaseInvoice.quantity') }} ({{tempForm.InventoryMovements.reduce((a, b) => a + (b["Qty"] || 0),0 ).toFixed(2)}} )</template>
                          <template slot-scope="scope">
                            <el-input-number
                              v-model="tempForm.InventoryMovements[scope.$index].Qty"
                              :precision="2"
                              :step="1"
                              :min="0"
                              :max="1000000"
                            ></el-input-number>
                          </template>
                        </el-table-column>
                     
                        <el-table-column
                         
                          v-bind:label="$t('NewPurchaseInvoice.Price')"
                          width="130"
                          align="center"
                        >
                          <template slot-scope="scope">
                            <currency-input
                          disabled
                              class="currency-input"
                              v-model="tempForm.InventoryMovements[scope.$index].SellingPrice"
                            />
                          </template>
                        </el-table-column>
                        <el-table-column
                          v-bind:label="$t('CashPool.Total')"
                          width="130"
                          align="center"
                        >
                          <template slot-scope="scope">
                            <div
                              class="currency-input"
                            >JOD {{(tempForm.InventoryMovements[scope.$index].SellingPrice * tempForm.InventoryMovements[scope.$index].Qty).toFixed(2)}}</div>
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
                           <el-table-column
                         v-if="checkPermission(['admin'])"
                          v-bind:label="$t('NewPurchaseInvoice.Price')"
                          width="130"
                          align="center"
                        >
                          <template slot-scope="scope">
                            <currency-input
                              class="currency-input"
                              v-model="tempForm.InventoryMovements[scope.$index].SellingPrice"
                            />
                          </template>
                        </el-table-column>
                          <el-table-column
                         v-if="checkPermission(['admin'])"
                          v-bind:label="$t('NewPurchaseInvoice.Inventory')"
                          width="110"
                          align="center"
                        >
                          <template slot-scope="scope">
                            <el-radio-group
                              v-model="tempForm.InventoryMovements[scope.$index].InventoryItemID"
                            >
                              <el-radio-button
                                v-for="(item , index ) in InventoryItems"
                                :key="index"
                                :label="item.value"
                              >{{item.label}}</el-radio-button>
                            </el-radio-group>
                          </template>
                        </el-table-column>
                      </el-table>
                    </el-form-item>
                  </template>
                  <template slot="paneR">
                    <el-col :span="6">
                      <el-button
                        style="font-size: 45px;"
                        @click="createData()"
                        type="success"
                        icon="el-icon-check"
                      ></el-button>
                    </el-col>
                    <el-col :span="6">
                      <el-button
                        style="font-size: 45px;"
                        @click="OpenCashDrawer()"
                        type="warning"
                        icon="el-icon-takeaway-box"
                      ></el-button>
                    </el-col>
                    <el-col :span="6">
                      <el-switch
                        v-model="AutoPrint"
                        active-color="#13ce66"
                        inactive-color="#ff4949"
                      ></el-switch>
                      <el-button
                        v-bind:disabled="(OldInvoice != null) ? false: true "
                        style="font-size: 35px;"
                        @click="Print()"
                        type="primary"
                        icon="el-icon-printer"
                      ></el-button>
                    </el-col>
                  </template>
                </split-pane>
              </template>
              <template slot="paneR">
                <split-pane split="horizontal" :min-percent="25" :default-percent="30">
                  <template slot="paneL">
                    <el-card style="background: #545454;">
                      <el-row type="flex">
                        <el-col :span="24">
                          <el-input prop="name" placeholder="اسم المستلم" v-model="tempForm.name"></el-input>
                        </el-col>
                      </el-row>
                      <el-row type="flex" v-permission="['admin']">
                        <el-col
                          :span="6"
                          class="TotalAmmount"
                          style="font-size: medium"
                        >{{$t('NewPurchaseInvoice.TotalDiscount')}}</el-col>
                        <el-col :span="8">
                          <el-input-number
                            prop="Discount"
                            v-model="tempForm.Discount"
                            controls-position="right"
                            :precision="2"
                            :step="1"
                            :min="0.00"
                            :max="100"
                          ></el-input-number>
                        </el-col>
                        <el-col :span="12">
                          <el-form-item prop="Tax">
                            <el-select v-model="tempForm.Tax" v-bind:placeholder="$t('Items.Tax')">
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
                      <el-row type="flex">
                        <el-col :span="24">
                          <el-form-item prop="description">
                            <el-input
                              v-bind:placeholder="$t('NewPurchaseInvoice.statement')"
                              v-model="tempForm.Description"
                            ></el-input>
                          </el-form-item>
                        </el-col>
                      </el-row>
                      <el-row type="flex">
                        <el-col :span="24" class="TotalAmmount">
                          <span>{{ $t('NewPurchaseInvoice.TotalJD') }}</span>
                          <el-divider direction="vertical"></el-divider>
                          <span>{{(tempForm.InventoryMovements.reduce(function(prev, cur) {return prev + cur.Qty * cur.SellingPrice;}, 0) - tempForm.Discount).toFixed(2)}} JOD</span>
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
import ItemsSearch from "./components/ItemsSearch";
import ItemsPrime from "./components/ItemsPrime";

import LangSelect from "@/components/LangSelect";
import Screenfull from "@/components/Screenfull";
import SizeSelect from "@/components/SizeSelect";

// report
import printJS from "print-js";
import { Invoice1 } from "@/Report/POSInvoice";

import { Create } from "@/api/SaleInvoice";
import { GetActiveInventory } from "@/api/InventoryItem";
import { GetActiveMenuItem } from "@/api/MenuItem";
import { GetActiveVendor } from "@/api/Vendor";

//import { GetActiveMember } from "@/api/Member";
import splitPane from "vue-splitpane";
//import { NumericInput } from "numeric-keyboard";

//import VueTouchKeyboard from "vue-touch-keyboard";
export default {
  name: "NewSaleInvoice",
  directives: { permission },
  components: {
    splitPane,
    LangSelect,
    Screenfull,
    SizeSelect,
    printJS,
    ItemsSearch,
    ItemsPrime
  },

  data() {
    return {
      OldInvoice: null,
      AutoPrint: false,
      tempForm: {
        ID: undefined,
        Name: "",
        Tax: 0.0,
        FakeDate: new Date(),
        PaymentMethod: "Cash",
        Discount: 0,
        Description: "",
        VendorID: 2,
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
  methods: {
    restTempForm() {
      this.tempForm = {
        ID: undefined,
        Name: "",
        Tax: 0.0,
        FakeDate: new Date(),
        PaymentMethod: "Cash",
        Discount: 0,
        Description: "",
        VendorID: 2,
        IsPrime: false,
        InventoryMovements: []
      };
    },
    AddItem(Item, Qty) {
      console.log(Item);

      var find = this.tempForm.InventoryMovements.findIndex(
        value => value.ItemsID == Item.id
      );
      console.log(find);

      if (find != -1) this.tempForm.InventoryMovements[find].Qty += Qty;
      else {
        let SellingPrice = Item.SellingPrice;
        if(this.tempForm.VendorID != 2) SellingPrice = Item.OtherPrice
        this.tempForm.InventoryMovements.push({
          ID: undefined,
          ItemsID: Item.id,
          TypeMove: "Out",
          Status: 0,
          Qty: 1.0,
          SellingPrice: SellingPrice,
          Tax: 0.0,
          Description: "",
          InventoryItemID: 1,
          Itemx: Item,
          SalesInvoiceID: undefined
        });
      }
      this.Barcode = "";
      this.name = "";
    },
    RemoveItem(index) {
      this.tempForm.InventoryMovements.splice(index, 1);
    },
    OpenCashDrawer() {},
    checkPermission,
    getdata() {
      const loading = this.$loading({
        lock: true,
        text: "تحميل",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      GetActiveInventory().then(response => {
        console.log(response);
        this.InventoryItems = response;
      });
      GetActiveMenuItem().then(response => {
        console.log(response);
        this.MenuItems = response;
      });

      GetActiveVendor().then(response => {
        console.log(response);
        this.Vendor = response;
        loading.close();
      });
    },
    createData() {
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
                    this.tempForm.id = response;
                    this.OldInvoice = this.tempForm;
                    this.AutoPrint ? this.Print() : undefined;
                    this.restTempForm();
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
    }
  },
  mounted() {
    this.getdata();
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