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
            style="
              float: right;
              margin-left: 20px;
              padding: 10px 15px;
              border-radius: 6px;
            "
            icon="el-icon-plus"
            to="/Payment/List"
            >{{ $t("route.ListPayment") }}</router-link
          >
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
              <Vendor-Search-Any
                :VendorId="tempForm.VendorId"
                @Set="
                  (v) => {
                    AccountId = v.AccountId;
                    tempForm.VendorId = v.Id;
                  }
                "
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="طريقة الدفع" prop="PaymentMethod">
              <radio-payment-method
                Type="Payment"
                :VendorId="tempForm.VendorId"
                @Set="(v) => (tempForm.PaymentMethod = v)"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="باسم" prop="Name">
              <el-input placeholder="اسم المستلم" v-model="tempForm.Name"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex">
          <el-col :span="12">
            <el-form-item label="القيمة المقبوضة">
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
                :value-range="{ min: 0.01, max: 1000 }"
                @focus="$event.target.select()"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-bind:label="$t('AddVendors.Description')" prop="Description">
              <el-input v-model="tempForm.Description"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item
              prop="EditorName"
              :rules="[
                {
                  required: true,
                  message: 'لايمكن ترك محرر السند فارغ',
                  trigger: 'blur',
                },
              ]"
              v-bind:label="$t('AddVendors.EditorName')"
            >
              <editors-user @Set="(v) => (tempForm.EditorName = v)" />
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
      </el-card>

      <el-row type="flex">
        <el-col :span="12">
          <span>{{ $t("NewPurchaseInvoice.Box") }}</span>
          <Select-Cash-Accounts @Set="(v) => (CashAccountId = v.value)" />
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script>
import { Create, Edit, GetById } from "@/api/Payment";
import FakeDate from "@/components/Date/FakeDate";
import { CreateEntry } from "@/api/EntryAccounting";
import VendorSearchAny from "@/components/Vendor/VendorSearchAny.vue";
import SelectCashAccounts from "@/components/TreeAccount/SelectCashAccounts.vue";
import RadioPaymentMethod from "@/components/PaymentMethod/RadioPaymentMethod.vue";
import EditorsUser from "@/components/Gym/EditorsUser";

export default {
  name: "NewPayment",
  components: {
    FakeDate,
    VendorSearchAny,
    SelectCashAccounts,
    RadioPaymentMethod,
    EditorsUser,
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
      tempForm: {
        Id: undefined,
        Name: "",
        FakeDate: "",
        PaymentMethod: "Cash",
        TotalAmmount: 0,
        Description: "",
        Status: 0,
        VendorId: 2,
        IsPrime: true,
        MemberId: undefined,
        EditorName: "",
        Type: "",
      },
      AccountId: undefined,
      CashAccountId: undefined,
      tempRoute: {},
    };
  },
  created() {
    if (this.isEdit) {
      this.getdata(this.$route.params && this.$route.params.id);
    }
    this.tempRoute = Object.assign({}, this.$route);
  },
  methods: {
    restTempForm() {
      this.tempForm = {
        Id: undefined,
        Name: "",
        FakeDate: "",
        PaymentMethod: "Cash",
        TotalAmmount: 0,
        Description: "",
        Status: 0,
        VendorId: undefined,
        IsPrime: true,
        MemberId: undefined,
        EditorName: "",
        Type: "",
      };
      this.AccountId = undefined;
    },
    getdata(val) {
      GetById({ Id: val })
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
    updateData() {
      this.$refs["tempForm"].validate((valid) => {
        if (valid && this.tempForm.TotalAmmount > 0) {
          Edit(this.tempForm)
            .then((response) => {
              if (response) {
                this.$notify({
                  title: "تم تعديل  بنجاح",
                  message: "تم تعديل بنجاح",
                  type: "success",
                  position: "top-left",
                  duration: 1000,
                  showClose: false,
                });
                this.restTempForm();
                this.$confirm("هل تريد العودة ")
                  .then((_) => {
                    this.$router.push({ path: `/Payment/List` });
                  })
                  .catch((_) => {});
              }
            })
            .catch((error) => {
              console.log(error);
            });
        } else {
          this.ValidateNote = "القيمة الإجمالية تساوي صفر  ";
          return false;
        }
      });
    },
    createData() {
      this.$refs["tempForm"].validate((valid) => {
        if (valid && this.tempForm.TotalAmmount > 0) {
          this.DisabledSave = true;
          Create(this.tempForm)
            .then((response) => {
              if (response && this.$store.getters.settings.Payment.CreateEntry == true) {
                CreateEntry({
                  Id: undefined,
                  FakeDate: this.tempForm.FakeDate,
                  Description: "",
                  Type: "Auto",
                  EntryMovements: [
                    {
                      Id: undefined,
                      AccountId: this.AccountId,
                      Credit: 0.0,
                      Debit: this.tempForm.TotalAmmount,
                      Description: "سند قبض رقم " + response + " ",
                      EntryId: undefined,
                      TableName: "Payment",
                      Fktable: response,
                    },
                    {
                      Id: undefined,
                      AccountId: this.CashAccountId,
                      Debit: 0.0,
                      Credit: this.tempForm.TotalAmmount,
                      Description: "سند قبض رقم " + response + " ",
                      EntryId: undefined,
                      TableName: "Payment",
                      Fktable: response,
                    },
                  ],
                }).then((res) => {
                  if (res) {
                    this.$notify({
                      message: "تم تسجيل الفاتورة مع قيد محاسبي بنجاح",
                      title: "تم الإضافة بنجاح",
                      type: "success",
                      position: "top-left",
                      duration: 1000,
                      showClose: false,
                    });
                    this.restTempForm();
                    this.$confirm("هل تريد العودة ")
                      .then((_) => {
                        this.$router.push({ path: `/Payment/List` });
                      })
                      .catch((_) => {});
                  }
                });
              } else if (response) {
                this.$notify({
                  title: "تم إضافة  بنجاح",
                  message: "تم إضافة بنجاح",
                  type: "success",
                  position: "top-left",
                  duration: 1000,
                  showClose: false,
                });
                this.restTempForm();
                this.$confirm("هل تريد العودة ")
                  .then((_) => {
                    this.$router.push({ path: `/Payment/List` });
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
            })
            .catch((error) => {
              console.log(error);
            });
        } else {
          this.ValidateNote = "القيمة الإجمالية تساوي صفر  ";
          return false;
        }
      });
    },
    setTagsViewTitle() {
      const title = "Edit Payment";
      const route = Object.assign({}, this.tempRoute, {
        title: `${title}-${this.tempForm.Id}`,
      });
      this.$store.dispatch("tagsView/updateVisitedView", route);
    },
    setPageTitle() {
      const title = "Edit Payment";
      document.title = `${title} - ${this.tempForm.Id}`;
    },
  },
};
</script>
