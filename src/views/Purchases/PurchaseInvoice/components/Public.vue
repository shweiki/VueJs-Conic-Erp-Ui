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
        <el-row type="flex" slot="header">
          <el-col :span="10">
            <router-link
              class="pan-btn tiffany-btn"
              style="
                float: right;
                margin-left: 20px;
                padding: 10px 15px;
                border-radius: 6px;
              "
              icon="el-icon-plus"
              to="/Purchases/List"
              >{{ $t("route.ListPurchaseInvoice") }}</router-link
            >
          </el-col>
          <el-col :span="6"
            ><Add-Bill-Of-Entery
              :PurchaseId="tempForm.Id"
              @Done="(v) => (BillOfEntery = v)"
          /></el-col>

          <el-col :span="4">
            <Drawer-Print
              v-bind:disabled="tempForm == null ? false : true"
              Type="PurchaseInvoice"
              :Data="tempForm"
            />
          </el-col>
          <el-col :span="4">
            <el-button
              :disabled="DisabledSave"
              style="float: left"
              type="success"
              icon="fa fa-save"
              @click="isEdit != true ? confirmData() : confirmData()"
              >{{ isEdit != true ? "حفظ" : "تعديل" }}</el-button
            >
          </el-col>
        </el-row>
        <el-row type="flex">
          <el-col :span="4">
            <el-form-item
              prop="FakeDate"
              v-bind:label="$t('NewPurchaseInvoice.ReleaseDate')"
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

          <el-col :span="8">
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
              <vendor-search-any
                :Id="tempForm.VendorId"
                @Set="
                  (v) => {
                    Vendor = v;
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
              v-bind:label="$t('NewPurchaseInvoice.InvDate')"
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
                tempForm.InventoryMovements.length.toFixed(
                  $store.getters.settings.ToFixed
                )
              }})</template
            >
            <template slot-scope="scope">
              {{ tempForm.InventoryMovements[scope.$index].Name }}
              <el-button
                style="float: left"
                icon="el-icon-edit"
                type="primary"
                @click="
                  () => {
                    let r = $router.resolve({
                      path:
                        '/Item/Edit/' + tempForm.InventoryMovements[scope.$index].ItemsId,
                    });
                    window.open(
                      r.href,
                      r.route.name,
                      $store.getters.settings.windowStyle
                    );
                  }
                "
              ></el-button>
            </template>
          </el-table-column>
          <el-table-column align="center" label="وحدة القياس" prop="UnitItem">
            <template slot-scope="scope">
              {{ tempForm.InventoryMovements[scope.$index].UnitItem }}
            </template>
          </el-table-column>
          <el-table-column width="130" align="center">
            <template slot="header" slot-scope="{}"
              >{{ $t("NewPurchaseInvoice.quantity") }} ({{
                tempForm.InventoryMovements.reduce(
                  (a, b) => a + (b["Qty"] || 0),
                  0
                ).toFixed($store.getters.settings.ToFixed)
              }})</template
            >
            <template slot-scope="scope">
              <el-input-number
                controls-position="right"
                v-model="tempForm.InventoryMovements[scope.$index].Qty"
                :precision="2"
                :step="1"
                :min="0.0"
                :max="1000000"
                @focus="$event.target.select()"
              ></el-input-number>
            </template>
          </el-table-column>
          <el-table-column width="220" align="center">
            <template slot="header" slot-scope="{}">{{
              $t("NewPurchaseInvoice.Price")
            }}</template>
            <template slot-scope="scope">
              <currency-input
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
              <radio-active-inventory
                :InventoryId="tempForm.InventoryMovements[scope.$index].InventoryItemId"
                @Set="
                  (v) =>
                    (tempForm.InventoryMovements[scope.$index].InventoryItemId = v.value)
                "
              />
            </template>
          </el-table-column>
          <el-table-column
            v-bind:label="$t('NewPurchaseInvoice.description')"
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
              tempForm.InventoryMovements.length.toFixed($store.getters.settings.ToFixed)
            }}</span>
            <el-divider direction="vertical"></el-divider>

            <span>{{ $t("NewPurchaseInvoice.QuantityAmount") }}</span>
            <el-divider direction="vertical"></el-divider>
            <span>{{
              tempForm.InventoryMovements.reduce(
                (a, b) => a + (b["Qty"] || 0),
                0
              ).toFixed($store.getters.settings.ToFixed)
            }}</span>
            <el-divider direction="vertical"></el-divider>

            <span>{{ $t("NewPurchaseInvoice.TotalDiscount") }}</span>
            <el-divider direction="vertical"></el-divider>
            <span>
              <el-input-number
                v-model="tempForm.Discount"
                :precision="2"
                :step="1"
                :min="0.0"
                :max="10000"
                @focus="$event.target.select()"
              ></el-input-number>
            </span>
            <el-divider direction="vertical"></el-divider>
            <span>{{ $t("NewPurchaseInvoice.Tax") }}</span>
            <el-divider direction="vertical"></el-divider>
            <span>
              <el-input-number
                v-model="tempForm.Tax"
                :precision="2"
                :step="1"
                :min="0.0"
                :max="10000"
                @focus="$event.target.select()"
              ></el-input-number>
            </span>
            <span>{{ $t("NewPurchaseInvoice.TotalJD") }}</span>
            <el-divider direction="vertical"></el-divider>
            <span
              >{{
                (
                  tempForm.Tax +
                  (tempForm.InventoryMovements.reduce((prev, cur) => {
                    return prev + cur.Qty * cur.SellingPrice;
                  }, 0) -
                    tempForm.Discount)
                ).toFixed($store.getters.settings.ToFixed)
              }}
              JOD</span
            >
            <el-divider direction="vertical"></el-divider>
          </el-card>
        </el-col>
      </el-row>

      <el-col :span="10">
        <el-form-item>
          <el-input
            v-bind:placeholder="$t('NewPurchaseInvoice.statement')"
            type="textarea"
            v-model="tempForm.Description"
          ></el-input>
        </el-form-item>
      </el-col>

      <el-col :span="6">
        <el-input
          prop="Name"
          placeholder="اسم المستلم"
          v-model="tempForm.Name"
        ></el-input>
      </el-col>
    </el-form>
  </div>
</template>
<script>
import { Create, Edit, GetPurchaseInvoiceById } from "@/api/PurchaseInvoice";
import FakeDate from "@/components/Date/FakeDate";
import {
  Create as CreateBillOfEntery,
  Edit as EditBillOfEntery,
} from "@/api/BillOfEntery";
import ItemsSearch from "@/components/Item/ItemsSearch";
import EditItem from "@/components/Item/EditItem";
import RadioActiveInventory from "@/components/Inventory/RadioActiveInventory.vue";
import AddBillOfEntery from "@/views/Purchases/BillOfEntery/components/AddBillOfEntery.vue";
import DrawerPrint from "@/components/PrintRepot/DrawerPrint.vue";
import VendorSearchAny from "@/components/Vendor/VendorSearchAny.vue";

export default {
  name: "NewPurchaseInvoice",
  components: {
    ItemsSearch,
    EditItem,
    FakeDate,
    DrawerPrint,
    RadioActiveInventory,
    AddBillOfEntery,
    VendorSearchAny,
  },
  props: {
    isEdit: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      ValidateNote: "",
      DisabledSave: false,
      OldInvoice: {},
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
        InventoryMovements: [],
      },
      BillOfEntery: {},

      rules: {
        InventoryMovements: [
          {
            type: "array",
            required: true,
            message: "لا يمكن إستكمال عملية الشراء من غير إضافة أصناف",
            trigger: "change",
          },
        ],
      },
      Vendor: {},
      CashAccounts: [],
      tempRoute: {},
    };
  },
  created() {
    if (this.isEdit) {
      this.getdata(this.$route.params && this.$route.params.id);
    }
    this.tempRoute = Object.assign({}, this.$route);

    // Why need to make a copy of this.$route here?
    // Because if you enter this page and quickly switch tag, may be in the execution of the setTagsViewTitle function, this.$route is no longer pointing to the current page
    // https://github.com/PanJiaChen/vue-element-admin/issues/1221
  },
  methods: {
    restTempForm() {
      this.tempForm = {
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
        InventoryMovements: [],
      };
    },
    getdata(val) {
      GetPurchaseInvoiceById({ Id: val })
        .then((response) => {
          console.log(response);
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
    AddItem(item) {
      let find = this.tempForm.InventoryMovements.findIndex(
        (value) => value.ItemsId == item.Id
      );
      //console.log(qty);
      if (find != -1) this.tempForm.InventoryMovements[find].Qty += 1;
      else {
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
          UnitItem: item.UnitItem,
          PurchaseInvoiceId: undefined,
          Description: "",
        });
      }
    },
    RemoveItem(index) {
      this.tempForm.InventoryMovements.splice(index, 1);
    },

    confirmData() {
      this.$refs["tempForm"].validate(async (valid) => {
        this.tempForm.Tax = parseInt(this.tempForm.Tax);
        this.tempForm.Total =
          this.tempForm.Tax +
          (this.tempForm.InventoryMovements.reduce((prev, cur) => {
            return prev + cur.Qty * cur.SellingPrice;
          }, 0) -
            this.tempForm.Discount);
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
                  this.BillOfEntery.PurchaseInvoiceId = res;
                  this.restTempForm();

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

          if (Done && this.$store.getters.settings.Purchase.BillOfEntery == true) {
            let DoneBillOfEntery;
            if (this.isEdit != true) {
              DoneBillOfEntery = await CreateBillOfEntery(this.BillOfEntery)
                .then((res) => {
                  return res;
                })
                .catch((error) => {
                  return false;
                });
            } else {
              DoneBillOfEntery = await EditBillOfEntery(this.BillOfEntery)
                .then((res) => {
                  if (res) return res;
                  else return false;
                })
                .catch((error) => {
                  return false;
                });
            }
            if (DoneBillOfEntery) {
              this.$notify({
                title: "تم " + this.isEdit === true ? "تعديل" : "إضافة" + " ",
                message:
                  "تم " + this.isEdit === true ? "تعديل" : "إضافة" + " بيان جمركي بنجاح",
                type: "success",
                position: "top-left",
                duration: 1000,
                showClose: false,
              });
            }
          }
          if (Done) {
            this.OldInvoice = this.tempForm;
            this.$notify({
              title: "تم " + !this.isEdit === true ? "تعديل" : "إضافة" + "  بنجاح",
              message: "تم " + !this.isEdit === true ? "تعديل" : "إضافة" + " ",
              type: "success",
              position: "top-left",
              duration: 1000,
              showClose: false,
            });
            this.$confirm("هل تريد العودة ")
              .then((_) => {
                this.$router.back();
              })
              .catch((_) => {});
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
          this.DisabledSave = false;
        } else {
          this.ValidateNote = "القيمة الإجمالية تساوي صفر  ";
          this.DisabledSave = false;
          return false;
        }
      });
    },
    setTagsViewTitle() {
      const title = this.$t("route.EditPurchaseInvoice");
      const route = Object.assign({}, this.tempRoute, {
        title: `${title}-${this.tempForm.Id}`,
      });
      this.$store.dispatch("tagsView/updateVisitedView", route);
    },
    setPageTitle() {
      const title = this.$t("route.EditPurchaseInvoice");
      document.title = `${title} - ${this.tempForm.Id}`;
    },
  },
};
</script>
