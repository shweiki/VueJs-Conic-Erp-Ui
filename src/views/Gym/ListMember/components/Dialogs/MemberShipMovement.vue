<template>
  <div>
    <el-button
      :disabled="Enable"
      type="primary"
      icon="el-icon-plus"
      @click="Visibles = true"
      >اشتراك</el-button
    >

    <el-dialog style="margin-top: -13vh" title="تسجيل اشتراك" :visible.sync="Visibles">
      <el-form :model="tempForm" ref="dataForm">
        <el-form-item
          label="الفترة"
          prop="Type"
          :rules="[{ required: true, message: 'الرجاء اختيار الفترة', trigger: 'blur' }]"
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
            { required: true, message: 'الرجاء اختيار نوع اشتراك', trigger: 'blur' },
          ]"
        >
          <el-select
            v-model="tempForm.MembershipId"
            filterable
            @change="calc"
            placeholder="إشتراك"
          >
            <el-option
              v-for="item in Memberships"
              :key="item.Id"
              :label="item.Name"
              :value="item.Id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="تاريخ بدء"
          prop="StartDate"
          :rules="[
            { required: true, message: 'لايمكن ترك التاريخ فارغ', trigger: 'blur' },
          ]"
        >
          <fake-date
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
            { required: true, message: 'لايمكن ترك التاريخ فارغ', trigger: 'blur' },
          ]"
        >
          <fake-date
            :Value="tempForm.EndDate"
            @Set="
              (v) => {
                tempForm.EndDate = v;
              }
            "
          />
        </el-form-item>
        <el-form-item label="خصم" prop="Discount">
          <el-select v-model="Discount" @change="calc">
            <el-option
              v-for="Discount in DiscountOptions"
              :key="Discount.label"
              :label="Discount.label"
              :value="Discount"
            >
              <span style="float: left">{{ Discount.label }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px"
                >{{ Discount.value }}{{ Discount.type == "Percentage" ? "%" : "-" }}</span
              >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="سبب الخصم"
          prop="DiscountDescription"
          :rules="[{ required: true, message: 'لايمكن ترك الخصم فارغ', trigger: 'blur' }]"
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
        <el-form-item prop="Type" label=""></el-form-item>
        <el-form-item v-bind:label="$t('NewPurchaseInvoice.TotalJD')">
          <span>JOD {{ tempForm.TotalAmmount }}</span>
        </el-form-item>
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
              <el-select v-model="tempForm.EditorName" placeholder="محرر السند">
                <el-option
                  v-for="item in $store.getters.Editors"
                  :key="item.Id"
                  :label="item.Name"
                  :value="item.Name"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="Visibles = false">{{ $t("AddVendors.Cancel") }}</el-button>
        <el-button :disabled="EnableSave" type="primary" @click="createData()">{{
          $t("AddVendors.Save")
        }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { Create } from "@/api/MembershipMovement";

import { GetActiveMembership } from "@/api/Membership";
import { GetActiveDiscount } from "@/api/Discount";
import FakeDate from "@/components/Date/FakeDate.vue";
import {
  LocalDateTime,
  LocalDate,
  LocalTime,
  DateTimeFormatter,
  Instant,
} from "@js-joda/core";
export default {
  components: { FakeDate },

  props: {
    AccountId: {
      type: Number,
      default: () => {
        return undefined;
      },
    },
    MemberID: {
      type: Number,
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
  created() {
    this.getdata();
  },
  data() {
    return {
      Memberships: [],
      tempForm: {
        ID: undefined,
        TotalAmmount: 0,
        Tax: 0.0,
        StartDate: "",
        EndDate: "",
        Type: "FullDay",
        VisitsUsed: 0,
        Discount: 0,
        DiscountDescription: "",
        Description: "",
        Status: 0,
        EditorName: "",
        MemberId: undefined,
        MembershipId: undefined,
      },

      EnableSave: false,
      Visibles: false,
      DiscountOptions: [],
      Discount: {},
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
      GetActiveMembership()
        .then((response) => {
          console.log(response);
          this.Memberships = response;
          this.tempForm.MembershipId = response[0].Id;
          GetActiveDiscount().then((response) => {
            console.log(response);
            this.DiscountOptions = response;
            this.Discount = this.DiscountOptions[0];
            this.calc();
          });
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
          Create(this.tempForm)
            .then((response) => {
              if (response) {
                //  if(this.Discount.ValueOfDays >0)
                // this.AddExtraToMembership((this.Discount.ValueOfDays ), response)
                this.Visibles = false;
                this.$notify({
                  title: "تم ",
                  message: "تم الإضافة بنجاح",
                  type: "success",
                  duration: 2000,
                  onClose: () => {
                    this.EnableSave = false;
                  },
                }).catch((error) => {
                  console.log(error);
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
      let Membership = this.Memberships.find(
        (obj) => obj.Id == this.tempForm.MembershipId
      );
      console.log(Membership);

      let Price =
        this.tempForm.Type == "Morning"
          ? Membership.MorningPrice
          : Membership.FullDayPrice;
      this.tempForm.Discount =
        this.Discount.type == "Percentage"
          ? (this.Discount.value / 100) * Price
          : this.Discount.value;

      this.tempForm.TotalAmmount = Price - this.tempForm.Discount;
      this.tempForm.MemberId = this.MemberID;

      this.tempForm.EndDate = LocalDateTime.ofInstant(
        Instant.ofEpochMilli(new Date(this.tempForm.StartDate))
      )
        .plusDays(Membership.NumberDays)
        .toString();
    },
    AddExtraToMembership(Days, MemberShipMovementId) {
      let MembershipMovementOrder = {
        ID: undefined,
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
  },
};
</script>
<style scoped>
.el-date-editor.el-input,
.el-date-editor.el-input__inner {
  width: 220px;
}
</style>
