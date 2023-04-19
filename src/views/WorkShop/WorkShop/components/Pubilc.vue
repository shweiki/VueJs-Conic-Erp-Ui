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
        <div slot="header">
          <el-row type="flex">
            <el-col :span="12">
              <el-input
                prop="Name"
                placeholder="اسم الورشة"
                v-model="tempForm.Name"
              ></el-input>
            </el-col>
            <el-col :span="2">
              <span>{{ $t("WorkShop.TAmount") }}</span>
            </el-col>
            <el-col :span="6">
              <currency-input
                :rules="[
                  {
                    required: true,
                    message: 'لايمكن ترك القيمة فارغ',
                    trigger: 'blur',
                  },
                ]"
                class="currency-input"
                v-model="tempForm.TotalAmmount"
                :value-range="{ min: 0.0, max: 10000000 }"
                @focus="$event.target.select()"
              />
            </el-col>
            <el-col :span="3"
              >صافي الربح :
              {{
                (
                  tempForm.TotalAmmount -
                  (tempForm.InventoryMovements.reduce((prev, cur) => {
                    return prev + cur.Qty * cur.SellingPrice;
                  }, 0) -
                    tempForm.Discount)
                ).toFixed($store.getters.settings.ToFixed)
              }}</el-col
            >
            <el-col :span="3">
              <el-button
                :disabled="DisabledSave"
                style="float: left"
                type="success"
                icon="fa fa-save"
                @click="isEdit != true ? createData() : updateData()"
                >{{ isEdit != true ? "حفظ" : "تعديل" }}</el-button
              >
            </el-col>
          </el-row>
        </div>
        <el-row type="flex">
          <el-col :span="6" align="center">
            <el-form-item
              prop="FakeDate"
              v-bind:label="$t('WorkShop.StartDate')"
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
          <el-col :span="12" align="right">
            <el-form-item
              label="الى حساب"
              align="center"
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
                    tempForm.VendorId = v.Id;
                  }
                "
              />
            </el-form-item>
          </el-col>
          <el-col :span="6" align="center">
            <el-form-item
              prop="DeliveryDate"
              v-bind:label="$t('WorkShop.EndDate')"
              :rules="[
                {
                  required: true,
                  message: 'لايمكن ترك التاريخ فارغ',
                  trigger: 'blur',
                },
              ]"
            >
              <Fake-Date
                :Value="tempForm.DeliveryDate"
                @Set="(v) => (tempForm.DeliveryDate = v)"
              />
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
          <items-search :WithBarCode="false" @add="AddItem" />
        </el-card>
        <el-table :data="tempForm.InventoryMovements" fit border>
          <el-table-column align="center" prop="Name">
            <template slot="header" slot-scope="{}"
              >{{ $t("WorkShop.Items") }} ({{
                tempForm.InventoryMovements.length.toFixed(
                  $store.getters.settings.ToFixed
                )
              }})</template
            >
            <template slot-scope="scope">
              {{ tempForm.InventoryMovements[scope.$index].Name }}
              <edit-item :ItemId="tempForm.InventoryMovements[scope.$index].ItemsId" />
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
          <el-table-column width="" align="center">
            <template slot="header" slot-scope="{}">{{
              $t("NewPurchaseInvoice.Price")
            }}</template>
            <template slot-scope="scope">
              <currency-input
                class="currency-input"
                :precision="3"
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
            <span>{{ $t("WorkShop.Items") }}</span>
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
                :precision="1"
                :step="1"
                :min="0.0"
                :max="100"
                @focus="$event.target.select()"
              ></el-input-number>
            </span>
            <el-divider direction="vertical"></el-divider>

            <span>{{ $t("NewPurchaseInvoice.TotalJD") }}</span>
            <el-divider direction="vertical"></el-divider>
            <span
              >{{
                tempForm.InventoryMovements.reduce((prev, cur) => {
                  return prev + cur.Qty * cur.SellingPrice;
                }, 0).toFixed($store.getters.settings.ToFixed)
              }}
              JOD</span
            >
            <el-divider direction="vertical"></el-divider>
          </el-card>
        </el-col>
      </el-row>
      <el-form-item>
        <el-input
          v-bind:placeholder="$t('NewPurchaseInvoice.statement')"
          type="textarea"
          v-model="tempForm.Description"
        ></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { Create, Edit, GetWorkShopById } from "@/api/WorkShop";
import FakeDate from "@/components/Date/FakeDate";

import ItemsSearch from "@/components/Item/ItemsSearch";
import EditItem from "@/components/Item/EditItem";
import ExpDate from "@/components/Date/ExpDate";
import VendorSearchAny from "@/components/Vendor/VendorSearchAny.vue";
import SelectItemExpColumn from "@/components/Item/SelectItemExpColumn.vue";

export default {
  name: "NewWorkShop",
  components: {
    ItemsSearch,
    EditItem,
    FakeDate,
    ExpDate,
    VendorSearchAny,
    SelectItemExpColumn,
  },
  props: {
    isEdit: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    const validateRequire = (rule, value, callback) => {
      if (value === "") {
        this.$message({
          message: rule.field + "اواي",
          type: "error",
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
            type: "error",
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
      ValidateNote: "",
      DisabledSave: false,
      tempForm: {
        Id: undefined,
        Name: "",
        Tax: 0.0,
        FakeDate: "",
        PaymentMethod: "Receivables",
        TotalAmmount: 0,
        Discount: 0,
        DeliveryDate: "",
        LowCost: 0,
        Description: "",
        Status: 0,
        VendorId: 2,
        InventoryMovements: [],
      },
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
        Name: "",
        Tax: 0.0,
        FakeDate: "",
        PaymentMethod: "Receivables",
        TotalAmmount: 0,
        Discount: 0,
        DeliveryDate: "",
        LowCost: 0,
        Description: "",
        Status: 0,
        VendorId: 2,
        InventoryMovements: [],
      };
    },
    getdata(val) {
      GetWorkShopById({ Id: val })
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
      this.tempForm.InventoryMovements.push({
        Id: undefined,
        ItemsId: item != undefined ? item.Id : undefined,
        TypeMove: "Out",
        Status: 0,
        Qty: 1.0,
        SellingPrice: item.CostPrice,
        Tax: 0.0,
        InventoryItemId: 1,
        Name: item.Name,
        PurchaseInvoiceId: undefined,
        Description: "",
      });
    },
    RemoveItem(index) {
      this.tempForm.InventoryMovements.splice(index, 1);
    },
    updateData() {
      this.$refs["tempForm"].validate((valid) => {
        if (valid) {
          this.tempForm.Tax = parseInt(this.tempForm.Tax);
          if (
            this.tempForm.TotalAmmount > 0 &&
            this.tempForm.InventoryMovements.length > 0 &&
            this.tempForm.InventoryMovements.reduce((a, b) => a + (b["Qty"] || 0), 0) > 0
          ) {
            Edit(this.tempForm)
              .then((response) => {
                this.$notify({
                  title: "تم تعديل  بنجاح",
                  message: "تم تعديل بنجاح",
                  type: "success",
                  position: "top-left",
                  duration: 1000,
                  showClose: false,
                  onClose: () => {
                    if (response) {
                      this.restTempForm();
                      this.$router.push({ path: `/WorkShop/List` });
                    }
                  },
                });
              })
              .catch((error) => {
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
      this.$refs["tempForm"].validate((valid) => {
        if (valid) {
          this.tempForm.Tax = parseInt(this.tempForm.Tax);

          if (
            this.tempForm.TotalAmmount > 0 &&
            this.tempForm.InventoryMovements.length > 0 &&
            this.tempForm.InventoryMovements.reduce((a, b) => a + (b["Qty"] || 0), 0) > 0
          ) {
            this.DisabledSave = true;

            Create(this.tempForm)
              .then((response) => {
                if (response) {
                  this.$notify({
                    title: "تم الإضافة بنجاح",
                    message: "تم الإضافة بنجاح",
                    type: "success",
                    position: "top-left",
                    duration: 1000,
                    showClose: false,
                  });
                  this.restTempForm();
                  this.$router.push({ path: `/WorkShop/List` });
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
              })
              .catch((error) => {
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
    Copy(Text) {
      this.Text = Text;
    },
    Paste(Index) {
      this.tempForm.InventoryMovements[Index].Description = this.Text;
    },
    setTagsViewTitle() {
      const title = this.$t("route.EditWorkShop");
      const route = Object.assign({}, this.tempRoute, {
        title: `${title}-${this.tempForm.Id}`,
      });
      this.$store.dispatch("tagsView/updateVisitedView", route);
    },
    setPageTitle() {
      const title = this.$t("route.EditWorkShop");
      document.title = `${title} - ${this.tempForm.Id}`;
    },
  },
};
</script>
