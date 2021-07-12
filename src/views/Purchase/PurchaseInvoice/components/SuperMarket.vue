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
        <div slot="header" class="clearfix">
          <el-button
            :disabled="DisabledSave"
            style="float: left"
            type="success"
            icon="fa fa-save"
            @click="isEdit != true ? createData() : updateData()"
            >{{ isEdit != true ? "حفظ" : "تعديل" }}</el-button
          >
          <router-link
            class="pan-btn tiffany-btn"
            style="float: left; margin-left: 20px; padding: 10px 15px; border-radius: 6px"
            icon="el-icon-plus"
            to="/Purchase/List"
            >{{ $t("route.ListPurchaseInvoice") }}</router-link
          >
          <span>{{ $t("NewPurchaseInvoice.PurchaseInvoice") }}</span>
          <el-col :span="10">
            <el-form-item>
              <el-input
                v-bind:placeholder="$t('NewPurchaseInvoice.statement')"
                type="textarea"
                v-model="tempForm.Description"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-input
              prop="Name"
              placeholder="اسم المستلم"
              v-model="tempForm.Name"
            ></el-input>
          </el-col>
        </div>
        <el-row type="flex">
          <el-col :span="4">
            <el-form-item
              prop="FakeDate"
              v-bind:label="$t('NewPurchaseInvoice.ReleaseDate')"
              :rules="[
                {
                  required: true,
                  message: 'لايمكن ترك التاريخ فارغ',
                  trigger: 'blur'
                }
              ]"
            >
              <Fake-Date
                :Value="tempForm.FakeDate"
                @Set="v => (tempForm.FakeDate = v)"
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
                  <span style="float: left color: #8492a6 font-size: 13px">{{
                    item.value
                  }}</span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="طريقة الدفع" prop="PaymentMethod">
              <el-radio-group
                v-model="tempForm.PaymentMethod"
                text-color="#f78123"
              >
                <el-radio label="Cash" border>{{
                  $t("NewPurchaseInvoice.Cash")
                }}</el-radio>

                <el-radio
                  v-if="tempForm.VendorId != 2"
                  label="Receivables"
                  border
                  >{{ $t("NewPurchaseInvoice.Receivables") }}</el-radio
                >
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item
              prop="InvoicePurchaseDate"
              v-bind:label="$t('NewPurchaseInvoice.InvDate')"
              :rules="[
                {
                  required: true,
                  message: 'لايمكن ترك التاريخ فارغ',
                  trigger: 'blur'
                }
              ]"
            >
              <Fake-Date
                :Value="tempForm.InvoicePurchaseDate"
                @Set="v => (tempForm.InvoicePurchaseDate = v)"
              />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item prop="AccountInvoiceNumber" label="رقم فاتورة">
              <el-input
                placeholder="رقم فاتورة"
                v-model="tempForm.AccountInvoiceNumber"
              ></el-input>
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
          <items-search :WithBarCode="true" @add="AddItem" />
        </el-card>
        <el-table :data="tempForm.InventoryMovements" fit border>
          <el-table-column align="center" prop="Name">
            <template slot="header" slot-scope="{}"
              >{{ $t("NewPurchaseInvoice.Items") }} ({{
                TotalItems.toFixed($store.getters.settings.ToFixed)
              }})</template
            >
            <template slot-scope="scope">
              {{ tempForm.InventoryMovements[scope.$index].Name }}
              <edit-item
                :ItemId="tempForm.InventoryMovements[scope.$index].ItemsId"
              />
            </template>
          </el-table-column>

          <el-table-column width="130" align="center">
            <template slot="header" slot-scope="{}"
              >{{ $t("NewPurchaseInvoice.quantity") }} ({{
                TotalQty.toFixed($store.getters.settings.ToFixed)
              }})</template
            >
            <template slot-scope="scope">
              <el-input-number
                @change="SumTotalAmmount"
                controls-position="right"
                v-model="tempForm.InventoryMovements[scope.$index].Qty"
                :precision="2"
                :step="1"
                :min="0.0"
                :max="1000000"                            @focus="$event.target.select()"

              ></el-input-number>
            </template>
          </el-table-column>
          <el-table-column width="220" align="center">
            <template slot="header" slot-scope="{}">{{
              $t("NewPurchaseInvoice.Price")
            }}</template>
            <template slot-scope="scope">
              <currency-input
                @change="SumTotalAmmount"
                class="currency-input"
                :precision="10"
                          @focus="$event.target.select()"

                v-model="tempForm.InventoryMovements[scope.$index].SellingPrice"
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
              <el-radio-group
                v-model="
                  tempForm.InventoryMovements[scope.$index].InventoryItemId
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
          <el-table-column
            v-bind:label="$t('NewPurchaseInvoice.description')"
            width="200"
            align="center"
          >
            <template slot-scope="scope">
              <el-form-item
                :prop="'InventoryMovements.' + scope.$index + '.Description'"
              >
                <el-input
                  v-model="
                    tempForm.InventoryMovements[scope.$index].Description
                  "
                  required
                  class="input-with-select"
                >
                  <template slot="prepend">
                    <el-button
                      @click="Copy(scope.row.Description)"
                      icon="fa fa-copy"
                    ></el-button>
                  </template>
                  <template slot="append">
                    <el-button
                      @click="Paste(scope.$index)"
                      icon="fa fa-paste"
                    ></el-button>
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
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>

      <el-row type="flex">
        <el-col :span="24">
          <el-card shadow="hover">
            <el-divider direction="vertical"></el-divider>
            <span>{{ $t("NewPurchaseInvoice.Items") }}</span>
            <el-divider direction="vertical"></el-divider>
            <span>{{
              TotalItems.toFixed($store.getters.settings.ToFixed)
            }}</span>
            <el-divider direction="vertical"></el-divider>

            <span>{{ $t("NewPurchaseInvoice.QuantityAmount") }}</span>
            <el-divider direction="vertical"></el-divider>
            <span>{{ TotalQty.toFixed($store.getters.settings.ToFixed) }}</span>
            <el-divider direction="vertical"></el-divider>

            <span>{{ $t("NewPurchaseInvoice.TotalDiscount") }}</span>
            <el-divider direction="vertical"></el-divider>
            <span>
              <el-input-number
                @change="SumTotalAmmount"
                v-model="tempForm.Discount"
                :precision="2"
                :step="1"
                :min="0.0"
                :max="100"                            @focus="$event.target.select()"

              ></el-input-number>
            </span>
            <el-divider direction="vertical"></el-divider>

            <span>{{ $t("NewPurchaseInvoice.TotalJD") }}</span>
            <el-divider direction="vertical"></el-divider>
            <span
              >{{
                TotalAmmount.toFixed($store.getters.settings.ToFixed)
              }}
              JOD</span
            >
            <el-divider direction="vertical"></el-divider>
          </el-card>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script>
import { Create, Edit, GetPurchaseInvoiceById } from "@/api/PurchaseInvoice";
import FakeDate from "@/components/Date/FakeDate";

import { GetActiveInventory } from "@/api/InventoryItem";
import { GetActiveVendor } from "@/api/Vendor";
import ItemsSearch from "@/components/Item/ItemsSearch";
import EditItem from "@/components/Item/EditItem";

export default {
  name: "NewPurchaseInvoice",
  components: { ItemsSearch, EditItem, FakeDate },
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
      TotalQty: 0,
      TotalItems: 0,
      TotalAmmount: 0,
      ValidateNote: "",
      DisabledSave: false,
      tempForm: {
        Id: undefined,
        Name: "-",
        Tax: 0.0,
        AccountInvoiceNumber: "",
        FakeDate: "",
        InvoicePurchaseDate: "",
        PaymentMethod: "Cash",
        Discount: 0,
        VendorId: 2,
        Status: 0,
        InventoryMovements: []
      },
      rules: {
        InventoryMovements: [
          {
            type: "array",
            required: true,
            message: "لا يمكن إستكمال عملية الشراء من غير إضافة أصناف",
            trigger: "change"
          }
        ]
      },
      InventoryItems: [],
      CashAccounts: [],
      Vendor: [],
      tempRoute: {}
    };
  },
  created() {
    if (this.isEdit) {
      this.getdata(this.$route.params && this.$route.params.id);
    }
    this.tempRoute = Object.assign({}, this.$route);

    GetActiveInventory().then(response => {
      console.log(response);
      this.InventoryItems = response;
    });

    GetActiveVendor().then(response => {
      console.log(response);
      this.Vendor = response;
    });

    // Why need to make a copy of this.$route here?
    // Because if you enter this page and quickly switch tag, may be in the execution of the setTagsViewTitle function, this.$route is no longer pointing to the current page
    // https://github.com/PanJiaChen/vue-element-admin/issues/1221
  },
  methods: {
    getdata(val) {
      GetPurchaseInvoiceById({ Id: val })
        .then(response => {
          console.log(response);
          this.tempForm = response;
          this.SumTotalAmmount();
          // set tagsview title
          this.setTagsViewTitle();

          // set page title
          this.setPageTitle();
        })
        .catch(err => {
          console.log(err);
        });
    },
    AddItem(item) {
      this.tempForm.InventoryMovements.unshift({
        Id: undefined,
        ItemsId: item != undefined ? item.Id : undefined,
        TypeMove: "In",
        Status: 0,
        Qty: 1.0,
        SellingPrice: item.CostPrice,
        Tax: 0.0,
        InventoryItemId: 1,
          Name: item.Name,
        PurchaseInvoiceId: undefined,
        Description: ""
      });
      this.SumTotalAmmount();
    },
    RemoveItem(index) {
      this.tempForm.InventoryMovements.splice(index, 1);
      this.SumTotalAmmount();
    },
    SumTotalAmmount() {
      this.TotalItems = this.tempForm.InventoryMovements.length;
      this.TotalQty = this.tempForm.InventoryMovements.reduce(
        (a, b) => a + (b["Qty"] || 0),
        0
      );
      this.TotalAmmount = this.tempForm.InventoryMovements.reduce(function(
        prev,
        cur
      ) {
        return prev + cur.Qty * cur.SellingPrice;
      },
      0);
      this.TotalAmmount -= this.tempForm.Discount;
      document.getElementById("barcode").focus();
    },

    updateData() {
      this.$refs["tempForm"].validate(valid => {
        if (valid) {
          this.tempForm.Tax = parseInt(this.tempForm.Tax);
          if (
            this.TotalAmmount > 0 &&
            this.TotalItems > 0 &&
            this.TotalQty > 0
          ) {
            Edit(this.tempForm)
              .then(response => {
                this.$notify({
                  title: "تم تعديل  بنجاح",
                  message: "تم تعديل بنجاح",
                  type: "success",
                  position: "top-left",
                  duration: 1000,
                  showClose: false,
                  onClose: () => {
                    if (response) {
                      this.$router.push({ path: `/Report/List` });
                    }
                  }
                });
              })
              .catch(error => {
                console.log(error);
              });
          } else this.ValidateNote = "القيمة الإجمالية تساوي صفر  ";
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    createData() {
      this.$refs["tempForm"].validate(valid => {
        if (valid) {
          this.tempForm.Tax = parseInt(this.tempForm.Tax);

          if (
            this.TotalAmmount > 0 &&
            this.TotalItems > 0 &&
            this.TotalQty > 0
          ) {
            this.DisabledSave = true;

            Create(this.tempForm)
              .then(response => {
                this.$router.push({ path: `/Purchase/List` });

                this.$notify({
                  title: "تم الإضافة بنجاح",
                  message: "تم الإضافة بنجاح",
                  type: "success",
                  position: "top-left",
                  duration: 1000,
                  showClose: false
                });
              })
              .catch(error => {
                console.log(error);
                this.DisabledSave = false;
              });
          } else this.ValidateNote = "القيمة الإجمالية تساوي صفر  ";
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    setTagsViewTitle() {
      const title = "Edit Purchase";
      const route = Object.assign({}, this.tempRoute, {
        title: `${title}-${this.tempForm.Id}`
      });
      this.$store.dispatch("tagsView/updateVisitedView", route);
    },
    setPageTitle() {
      const title = "Edit Purchase";
      document.title = `${title} - ${this.tempForm.Id}`;
    }
  }
};
</script>
