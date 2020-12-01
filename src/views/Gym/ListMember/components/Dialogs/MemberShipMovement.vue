<template>
  <div>

    <el-button :disabled="Enable" type="primary" icon="el-icon-plus" @click="Visibles = true">اشتراك</el-button>

    <el-dialog style="margin-top: -13vh" title="تسجيل اشتراك" :visible.sync="Visibles">
      <el-form :model="MembershipMovement" ref="dataForm">
        <el-form-item
          label="الفترة"
          prop="Type"
          :rules="[{ required: true, message: 'الرجاء اختيار الفترة', trigger: 'blur' } ]"
        >
          <el-radio-group v-model="MembershipMovement.Type" @change="calc">
            <el-radio label="Morning" border>Morning</el-radio>
            <el-radio label="FullDay" border>Full Day</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label="إشتراك"
          prop="MembershipID"
          :rules="[{ required: true, message: 'الرجاء اختيار نوع اشتراك', trigger: 'blur' } ]"
        >
          <el-select
            v-model="MembershipMovement.MembershipID"
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
          :rules="[{ required: true, message: 'لايمكن ترك التاريخ فارغ', trigger: 'blur' } ]"
        >
          <el-date-picker
            @change="calc"
            v-model="MembershipMovement.StartDate"
            type="date"
            format="dd/MM/yyyy"
          ></el-date-picker>
        </el-form-item>
        <el-form-item
          label="تاريخ انتهاء"
          prop="EndDate"
          :rules="[{ required: true, message: 'لايمكن ترك التاريخ فارغ', trigger: 'blur' } ]"
        >
          <el-date-picker
            format="dd/MM/yyyy"
            disabled
            v-model="MembershipMovement.EndDate"
            type="date"
          ></el-date-picker>
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
              <span
                style="float: right; color: #8492a6; font-size: 13px"
              >{{Discount.value}}{{ (Discount.type == "Percentage") ? '%': '-' }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="سبب الخصم"
          prop="DiscountDescription"
          :rules="[{ required: true, message: 'لايمكن ترك الخصم فارغ', trigger: 'blur' } ]"
        >
          <el-input style="width:220px" v-model="MembershipMovement.DiscountDescription"></el-input>
        </el-form-item>

        <el-form-item
          :rules="[{ required: true, message: 'لايمكن تركه فارغ', trigger: 'blur' } ]"
          v-bind:label="$t('AddVendors.Description')"
          prop="Description"
        >
          <el-radio-group v-model="MembershipMovement.Description">
            <el-radio label="تجديد اشتراك" border>تجديد اشتراك</el-radio>
            <el-radio label="مشترك جديد" border>مشترك جديد</el-radio>
            <el-radio label border></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item prop="Type" label=""></el-form-item>
        <el-form-item v-bind:label="$t('NewPurchaseInvoice.TotalJD')">
          <span>JOD {{(MembershipMovement.TotalAmmount).toFixed(2)}}</span>
        </el-form-item>
          <el-row type="flex">
          <el-col :span="24">
            <el-form-item
              prop="EditorName"
              :rules="[{ required: true, message: 'لايمكن ترك محرر السند فارغ', trigger: 'blur' } ]"
              v-bind:label="$t('AddVendors.EditorName')"
            >
              <el-select v-model="MembershipMovement.EditorName" placeholder="محرر السند">
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
        <el-button @click="Visibles = false">{{$t('AddVendors.Cancel')}}</el-button>
        <el-button
          :disabled="EnableSave"
          type="primary"
          @click="createData()"
        >{{$t('AddVendors.Save')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { Create } from "@/api/MembershipMovement";

import { GetActiveMembership } from "@/api/Membership";
import { GetActiveDiscount } from "@/api/Discount";
import { string } from "clipboard";

export default {
  props: {
    AccountID: {
      type: Number,
      default: () => {
        return undefined;
      }
    },
    MemberID: {
      type: Number,
      default: () => {
        return undefined;
      }
    },

    Enable: {
      type: Boolean,
      default: () => {
        return true;
      }
    }
  },
  created() {
    this.getdata();
  },
  data() {
    return {
      Memberships: [],
      MembershipMovement: {
        ID: undefined,
        TotalAmmount: 0,
        Tax: 0.0,
        StartDate: new Date(),
        EndDate: new Date(),
        Type: "FullDay",
        VisitsUsed: 0,
        Discount: 0,
        DiscountDescription: '',
        Description: '',
        Status: 0,
        EditorName:'',
        MemberID: undefined,
        MembershipID: undefined
      },

      EnableSave: false,
      Visibles: false,
      DiscountOptions: [],
      Discount: {},
      pickerOptions: {
        disabledDate(time) {
          console.log(time);
          return time.getTime() < Date.now() - 8.64e7;
        }
      }
    };
  },
  methods: {
    getdata() {
      GetActiveMembership()
        .then(response => {
          console.log(response)
          this.Memberships = response;
          this.MembershipMovement.MembershipID = response[0].Id;
          GetActiveDiscount()
            .then(response => {
              console.log(response)
              this.DiscountOptions = response;
              this.Discount = this.DiscountOptions[0];
              this.calc();
            })
            .catch(err => {
              console.log(err);
            })
        })
        .catch(err => {
          console.log(err);
        })
    },
    createData() {
      this.$refs["dataForm"].validate(valid => {
        this.calc();
        if (valid) {
              this.EnableSave = true;
              Create(this.MembershipMovement)
                .then(response => {
                  if (response) {
                    //  if(this.Discount.ValueOfDays >0)
                    // this.AddExtraToMembership((this.Discount.ValueOfDays ), response)
                        this.Visibles = false
                        this.$notify({
                          title: "تم ",
                          message: "تم الإضافة بنجاح",
                          type: 'success',
                          duration: 2000,
                          onClose: () => {
                            this.EnableSave = false;
                          }
                      })
                      .catch(error => {
                        console.log(error);
                      })
                  }
                })
                .catch(error => {
                  console.log(error);
                })
        } else {
          console.log("error submit!!");
          return false;
        }
      })
    },
    calc() {
      let Membership = this.Memberships.find(
        obj => obj.Id == this.MembershipMovement.MembershipID
      );
      // console.log(Membership);

      let Price =
        this.MembershipMovement.Type == "Morning"
          ? Membership.MorningPrice
          : Membership.FullDayPrice;
      this.MembershipMovement.Discount =
        this.Discount.type == "Percentage"
          ? (this.Discount.value / 100) * Price
          : this.Discount.value;

      this.MembershipMovement.TotalAmmount =
        Price - this.MembershipMovement.Discount;
      this.MembershipMovement.MemberID = this.MemberID;

      this.MembershipMovement.EndDate = new Date(
        this.MembershipMovement.EndDate.setTime(
          this.MembershipMovement.StartDate.getTime() +
            3600 * 1000 * 24 * Membership.NumberDays
        )
      );
    },
    AddExtraToMembership(Days, MemberShipMovementID) {
      let MembershipMovementOrder = {
        ID: undefined,
        Type: "Extra",
        StartDate: new Date(this.MembershipMovement.EndDate),
        EndDate: new Date(),
        Status: 0,
        Description: this.Description,
        MemberShipMovementID: MemberShipMovementID
      };
      MembershipMovementOrder.EndDate = new Date(
        MembershipMovementOrder.EndDate.setTime(
          MembershipMovementOrder.StartDate.getTime() + 3600 * 1000 * 24 * Days
        )
      );
      Create(MembershipMovementOrder).then(response => {
        if (response) {
        }
      })
    }
  }
};
</script>
<style scoped>
.el-date-editor.el-input,
.el-date-editor.el-input__inner {
  width: 220px;
}
</style>
