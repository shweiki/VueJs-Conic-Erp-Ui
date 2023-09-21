<template>
  <div>
    <el-button icon="el-icon-edit" @click="Visibles = true"></el-button>

    <el-dialog
      style="margin-top: -13vh"
      title="تعديل اشتراك"
      @opened="getdata"
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
          <Select-All-Memberships
            :MembershipId="tempForm.MembershipId"
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
          <Fake-Date :Value="tempForm.EndDate" :disabled="true" type="date" />
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
          :rules="[{ required: true, message: 'لايمكن تركه فارغ', trigger: 'blur' }]"
          v-bind:label="$t('AddVendors.Description')"
          prop="Description"
        >
          <el-radio-group v-model="tempForm.Description">
            <el-radio label="تجديد اشتراك" border>تجديد اشتراك</el-radio>
            <el-radio label="مشترك جديد" border>مشترك جديد</el-radio>
            <el-radio label border></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          prop="Type"
          label="
            "
        ></el-form-item>
        <el-form-item v-bind:label="$t('NewPurchaseInvoice.TotalJD')">
          <span>JOD {{ tempForm.TotalAmmount }}</span>
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
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="Visibles = false">{{ $t("AddVendors.Cancel") }}</el-button>
        <el-button :loading="EnableSave" type="primary" @click="createData()">{{
          $t("AddVendors.Save")
        }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { Edit, GetMembershipMovementById } from "@/api/MembershipMovement";
import FakeDate from "@/components/Date/FakeDate";
import SelectAllMemberships from "@/views/Gym/components/SelectAllMemberships.vue";
import SelectDiscount from "@/components/Discount/SelectDiscount.vue";
import EditorsUser from "@/views/Gym/components/EditorsUser";
import { LocalDateTime, Instant } from "@js-joda/core";
import { GetActiveService } from "@/api/Service";
import { Create as CreateSaleInvoice } from "@/api/SaleInvoice";

export default {
  components: { FakeDate, EditorsUser, SelectAllMemberships, SelectDiscount },
  props: {
    MembershipMovementId: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      tempForm: {},
      EnableSave: false,
      Visibles: false,
      Discount: 0,
      Price: 0,
      Membership: {
        Description: "",
        FullDayPrice: 0,
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
    getdata() {
      GetMembershipMovementById({ Id: this.MembershipMovementId })
        .then((response) => {
          console.log(response);
          this.tempForm = response;
          this.tempForm.StartDate = LocalDateTime.ofInstant(
            Instant.ofEpochMilli(new Date(this.tempForm.StartDate))
          ).toString();
          this.tempForm.EndDate = LocalDateTime.ofInstant(
            Instant.ofEpochMilli(new Date(this.tempForm.EndDate))
          ).toString();
          this.Visibles = true;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    createData() {
      this.$refs["dataForm"].validate((valid) => {
        this.calc();
        if (valid) {
          this.EnableSave = true;
          Edit(this.tempForm)
            .then((response) => {
              if (response) {
                //  if(this.Discount.ValueOfDays >0)
                // this.AddExtraToMembership((this.Discount.ValueOfDays ), response)
                this.Visibles = false;
                this.EnableSave = false;
                if (
                  this.$store.getters.settings.MembershipMovement
                    .OneInBodyFreeForeach30Days == true
                )
                  this.OneInBodyFreeForeach30Days(this.Membership.NumberDays);
                this.$notify({
                  title: "تم ",
                  message: "تم تعديل بنجاح",
                  type: "success",
                  duration: 2000,
                });
                this.$nextTick(() => {
                  //  this.$emit("Done");
                  this.$router.replace({
                    path: "/redirect" + this.$route.fullPath,
                  });
                });
              }
            })
            .catch((error) => {
              console.log(error);
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
      //  this.tempForm.MemberId = this.MemberId;
      // this.tempForm.EndDate = LocalDateTime.ofInstant(
      //   Instant.ofEpochMilli(new Date(this.tempForm.StartDate))
      // )
      //   .plusDays(Membership.NumberDays)
      //   .toString();
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
            MemberId: this.tempForm.MemberId,
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
  },
};
</script>
<style scoped>
.el-date-editor.el-input,
.el-date-editor.el-input__inner {
  width: 220px;
}
</style>
