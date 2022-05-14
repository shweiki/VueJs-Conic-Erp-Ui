<template>
  <div>
    <el-row type="flex">
      <el-col :span="6">
        <Drawer-Print :Data="OldPayment" Type="Payment" />
      </el-col>
      <el-col :span="18">
        <el-button
          :disabled="Enable"
          type="success"
          icon="el-icon-plus"
          @click="Visibles = true"
          >اشتراك و قبض</el-button
        >
      </el-col></el-row
    >
    <el-dialog
      style="margin-top: -13vh"
      title="تسجيل اشتراك"
      :visible.sync="Visibles"
    >
      <el-form :model="tempForm" ref="dataForm">
        <el-form-item
          label="الفترة"
          prop="Type"
          :rules="[
            {
              required: true,
              message: 'الرجاء اختيار الفترة',
              trigger: 'blur',
            },
          ]"
        >
          <el-radio-group v-model="tempForm.Type" @change="calc">
            <el-radio label="Morning" border>Morning</el-radio>
            <el-radio label="FullDay" border>Full Day</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label="إشتراك"
          prop="MembershipId"
          :rules="[
            {
              required: true,
              message: 'الرجاء اختيار نوع اشتراك',
              trigger: 'blur',
            },
          ]"
        >
          <Select-Memberships
            @Set="
              (v) => {
                Membership = v;
                tempForm.MembershipId = v.Id;
                calc();
              }
            "
          />
        </el-form-item>
        <el-form-item
          label="تاريخ بدء"
          prop="StartDate"
          :rules="[
            {
              required: true,
              message: 'لايمكن ترك التاريخ فارغ',
              trigger: 'blur',
            },
          ]"
        >
          <Fake-Date
            :Value="tempForm.StartDate"
            @Set="
              (v) => {
                tempForm.StartDate = v;
                calc();
              }
            "
          />
        </el-form-item>
        <el-form-item
          label="تاريخ انتهاء"
          prop="EndDate"
          :rules="[
            {
              required: true,
              message: 'لايمكن ترك التاريخ فارغ',
              trigger: 'blur',
            },
          ]"
        >
          <Fake-Date
            :Value="tempForm.EndDate"
            @Set="
              (v) => {
                tempForm.EndDate = v;
              }
            "
          />
        </el-form-item>
        <el-form-item label="خصم" prop="Discount">
          <Select-Discount
            :Price="Price"
            @Set="
              (v) => {
                tempForm.Discount = v;
                calc();
              }
            "
          />
        </el-form-item>
        <el-form-item
          label="سبب الخصم"
          prop="DiscountDescription"
          :rules="[
            {
              required: true,
              message: 'لايمكن ترك الخصم فارغ',
              trigger: 'blur',
            },
          ]"
        >
          <el-input
            style="width: 220px"
            v-model="tempForm.DiscountDescription"
          ></el-input>
        </el-form-item>

        <el-form-item
          :rules="[
            { required: true, message: 'لايمكن تركه فارغ', trigger: 'blur' },
          ]"
          v-bind:label="$t('AddVendors.Description')"
          prop="Description"
        >
          <el-radio-group v-model="tempForm.Description">
            <el-radio label="تجديد اشتراك" border>تجديد اشتراك</el-radio>
            <el-radio label="مشترك جديد" border>مشترك جديد</el-radio>
            <el-radio label border></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-row type="flex">
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
              <Editors-User
                :Value="tempForm.EditorName"
                @Set="(v) => (tempForm.EditorName = v)"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item
          prop="Type"
          label="
            "
        ></el-form-item>
        <el-form-item v-bind:label="$t('NewPurchaseInvoice.TotalJD')">
          <span
            >JOD
            {{
              tempForm.TotalAmmount.toFixed($store.getters.settings.ToFixed)
            }}</span
          >
        </el-form-item>
      </el-form>
      <el-form :model="Payment" ref="Form">
        <el-form-item prop="TotalAmmount" label="القيمة المقبوضة">
          <currency-input
            style="width: 220px"
            :rules="[
              {
                required: true,
                message: 'لايمكن ترك القيمة فارغ',
                trigger: 'blur',
              },
            ]"
            class="currency-input"
            v-model="Payment.TotalAmmount"
            :value-range="{ min: 0.01, max: 1000000 }"
            @focus="$event.target.select()"
          />
        </el-form-item>

        <el-form-item prop="PaymentMethod" label="طريقة الدفع">
          <radio-payment-method
            Type="Payment"
            :Value="tempForm.PaymentMethod"
            :VendorId="tempForm.MemberId"
            @Set="(v) => (Payment.PaymentMethod = v)"
          />
        </el-form-item>
        <el-form-item
          v-bind:label="$t('AddVendors.Description')"
          prop="Description"
        >
          <el-input
            style="width: 220px"
            v-model="Payment.Description"
          ></el-input>
        </el-form-item>
        <el-row type="flex">
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
              <Editors-User
                :Value="Payment.EditorName"
                @Set="(v) => (Payment.EditorName = v)"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="Visibles = false">{{
          $t("AddVendors.Cancel")
        }}</el-button>
        <el-button
          :disabled="EnableSave"
          type="primary"
          @click="createData()"
          >{{ $t("AddVendors.Save") }}</el-button
        >
      </div>
      <el-col :span="12">
        <span>{{ $t("Account.InCome") }}</span>
        <Select-In-Come-Accounts
          Value="اشتراكات"
          @Set="(v) => (InComeAccountId = v.value)"
        />
      </el-col>
    </el-dialog>
  </div>
</template>

<script>
import { Create as CreatePayment } from "@/api/Payment";
import DrawerPrint from "@/components/PrintRepot/DrawerPrint.vue";
import { SendSMS } from "@/api/SMS";
import { Create } from "@/api/MembershipMovement";
import EditorsUser from "@/components/Gym/EditorsUser.vue";
import SelectMemberships from "@/components/Gym/SelectMemberships.vue";
import FakeDate from "@/components/Date/FakeDate.vue";
import SelectDiscount from "@/components/Discount/SelectDiscount.vue";
import { Create as CreateSaleInvoice } from "@/api/SaleInvoice";
import { GetActiveService } from "@/api/Service";
import { LocalDateTime, Instant } from "@js-joda/core";
import SelectInComeAccounts from "@/components/TreeAccount/SelectInComeAccounts.vue";
import { CreateEntry } from "@/api/EntryAccounting";
import RadioPaymentMethod from "@/components/PaymentMethod/RadioPaymentMethod.vue";

export default {
  components: {
    FakeDate,
    EditorsUser,
    SelectMemberships,
    SelectDiscount,
    DrawerPrint,
    SelectInComeAccounts,
    RadioPaymentMethod,
  },
  props: {
    AccountId: {
      type: Number,
      default: () => {
        return undefined;
      },
    },
    MemberId: {
      type: Number,
      default: () => {
        return undefined;
      },
    },
    NumberPhone1: {
      type: String,
      default: () => {
        return undefined;
      },
    },
    Name: {
      type: String,
      default: () => {
        return undefined;
      },
    },
    Enable: {
      type: Boolean,
      default: () => {
        return true;
      },
    },
  },
  data() {
    return {
      InComeAccountId: 2,
      tempForm: {
        Id: undefined,
        TotalAmmount: 0,
        Tax: 0.0,
        StartDate: "",
        EndDate: "",
        Type: "FullDay",
        VisitsUsed: 0,
        DiscountDescription: "",
        Description: "",
        Status: 1,
        EditorName: "",
        MemberId: undefined,
        MembershipId: undefined,
      },
      OldPayment: null,
      Payment: {
        Id: undefined,
        Name: "",
        FakeDate: new Date(),
        PaymentMethod: "Cash",
        TotalAmmount: 0,
        Description: "",
        Status: 0,
        VendorId: undefined,
        IsPrime: true,
        EditorName: "",
        MemberId: undefined,
        Type: "",
      },
      EnableSave: false,
      Visibles: false,
      Discount: 0,
      Price: 0,
      Membership: {
        Description: "",
        FullDayPrice: 45,
        Id: 2,
        MaxFreezeLimitDays: 6,
        MinFreezeLimitDays: 3,
        MorningPrice: 30,
        Name: "شهر",
        NumberDays: 30,
        Rate: 0,
        Status: 0,
        Tax: 0.01,
      },
      pickerOptions: {
        disabledDate(time) {
          console.log(time);
          return time.getTime() < Date.now() - 8.64e7;
        },
      },
    };
  },
  methods: {
    createData() {
      this.$refs["dataForm"].validate((valid) => {
        this.calc();
        if (valid) {
          this.$refs["Form"].validate((valid) => {
            if (valid) {
              this.EnableSave = true;
              Create(this.tempForm)
                .then((response) => {
                  if (response) {
                    CreateEntry({
                      Id: undefined,
                      FakeDate: new Date(),
                      Description: "",
                      Type: "MembershipMovement",
                      EntryMovements: [
                        {
                          Id: undefined,
                          AccountId: this.AccountId,
                          Debit: 0.0,
                          Credit: this.tempForm.TotalAmmount,
                          Description: "اشتراك رقم " + response + " ",
                          EntryId: undefined,
                          TableName: "MembershipMovement",
                          Fktable: response,
                        },
                        {
                          Id: undefined,
                          AccountId: this.InComeAccountId,
                          Debit: this.tempForm.TotalAmmount,
                          Credit: 0.0,
                          Description: "اشتراك رقم " + response + " ",
                          EntryId: undefined,
                          TableName: "MembershipMovement",
                          Fktable: response,
                        },
                      ],
                    }).then((res) => {
                      if (res) {
                        //  if(this.Discount.ValueOfDays >0)
                        // this.AddExtraToMembership((this.Discount.ValueOfDays ), response)
                        if (
                          this.$store.getters.settings.MembershipMovement
                            .OneInBodyFreeForeach30Days == true
                        )
                          this.OneInBodyFreeForeach30Days(
                            this.Membership.NumberDays
                          );
                        this.Payment.MemberId = this.MemberId;
                        this.Payment.Description +=
                          this.tempForm.Description +
                          "  -  وذالك عن اشتراك رقم " +
                          response +
                          "وينتهي في " +
                          this.formatDate(this.tempForm.EndDate, "no") +
                          "لفترة " +
                          this.tempForm.Type +
                          " .";
                        CreatePayment(this.Payment)
                          .then((response) => {
                            this.Payment.Name = this.Name;
                            this.Visibles = false;
                            this.$notify({
                              title: "تم ",
                              message: "تم الإضافة بنجاح",
                              type: "success",
                              duration: 2000,
                              onClose: () => {
                                this.Payment.Id = response;
                                this.OldPayment = this.Payment;
                                this.OldPayment.ObjectId = this.MemberId;
                                SendSMS(
                                  this.NumberPhone1,
                                  "تم دفع مبلغ " +
                                    this.OldPayment.TotalAmmount.toFixed(
                                      this.$store.getters.settings.ToFixed
                                    ) +
                                    " دينار" +
                                    " لاشتراك " +
                                    this.Membership.Name +
                                    " " +
                                    this.tempForm.Type +
                                    " للمشترك رقم " +
                                    this.MemberId
                                );
                                this.EnableSave = false;
                              },
                            });
                            this.$emit("Done");
                          })
                          .catch((error) => {
                            console.log(error);
                          });
                      }
                    });
                  }
                })
                .catch((error) => {
                  console.log(error);
                });
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    calc() {
      let Membership = this.Membership;
      this.Price =
        this.tempForm.Type == "Morning"
          ? Membership.MorningPrice
          : Membership.FullDayPrice;

      this.tempForm.TotalAmmount = this.Price - this.tempForm.Discount;
      this.Payment.TotalAmmount = this.tempForm.TotalAmmount;
      this.tempForm.MemberId = this.MemberId;

      this.tempForm.EndDate = LocalDateTime.ofInstant(
        Instant.ofEpochMilli(new Date(this.tempForm.StartDate))
      )
        .plusDays(Membership.NumberDays)
        .toString();
    },
    OneInBodyFreeForeach30Days(NumberDays) {
      if (NumberDays < 30) return false;
      GetActiveService()
        .then((response) => {
          //   console.log(response);
          let Service = response.find(
            (obj) => obj.Name == "One InBody Free Foreach 30 Days"
          );
          let SaleInvoice = {
            Id: undefined,
            Name: Service.Name,
            Tax: 0.0,
            FakeDate: new Date(),
            PaymentMethod: "Service",
            Discount: 0,
            Status: 3,
            Description: "فاتورة خدمية ",
            MemberId: this.MemberId,
            IsPrime: true,
            InventoryMovements: [],
          };
          for (var i = 0; i < NumberDays / 30; i++) {
            SaleInvoice.InventoryMovements.push({
              Id: undefined,
              ItemsId: Service.ItemId,
              TypeMove: "Out",
              Status: 1,
              Qty: 1.0,
              SellingPrice: 0,
              Tax: 0.0,
              Description: "",
              InventoryItemId: 1,
              SalesInvoiceId: undefined,
            });
          }
          console.log(SaleInvoice);
          if (SaleInvoice.InventoryMovements.length > 0) {
            CreateSaleInvoice(SaleInvoice)
              .then((response) => {
                if (response) {
                  this.$notify({
                    title: "تم ",
                    message: "تم الإضافة One InBody Free Foreach 30 Days بنجاح",
                    type: "success",
                    duration: 2000,
                  });
                }
              })
              .catch((error) => {
                console.log(error);
              });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    AddExtraToMembership(Days, MemberShipMovementId) {
      let MembershipMovementOrder = {
        Id: undefined,
        Type: "Extra",
        StartDate: new Date(this.tempForm.EndDate),
        EndDate: new Date(),
        Status: 0,
        Description: this.Description,
        MemberShipMovementId: MemberShipMovementId,
      };
      MembershipMovementOrder.EndDate = new Date(
        MembershipMovementOrder.EndDate.setTime(
          MembershipMovementOrder.StartDate.getTime() + 3600 * 1000 * 24 * Days
        )
      );
      Create(MembershipMovementOrder).then((response) => {
        if (response) {
        }
      });
    },
    formatDate(date) {
      let d = new Date(date),
        day = "" + d.getDate(),
        month = "" + (d.getMonth() + 1),
        year = d.getFullYear();
      if (month.length < 2) month = "0" + month;
      if (day.length < 2) day = "0" + day;

      return [day, month, year].join("/");
    },
  },
};
</script>
<style scoped>
.el-date-editor.el-input,
.el-date-editor.el-input__inner {
  width: 220px;
}
</style>
