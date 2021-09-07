<template>
  <div>
    <el-row>
      <el-col :span="12">
        <Drawer-Print :Data="OldPayment" Type="Payment" />
      </el-col>
      <el-col :span="12">
        <el-button type="primary" icon="el-icon-plus" @click="Visibles = true"
          >قبض</el-button
        ></el-col
      ></el-row
    >
    <el-dialog style="margin-top: -13vh" title="تسجيل قبض" :visible.sync="Visibles">
      <el-form :model="tempForm" ref="Form" label-position="top" class="demo-form-inline">
        <el-row>
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
            <el-form-item
              label="تاريخ "
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
                :Value="tempForm.FakeDate"
                @Set="(v) => (tempForm.FakeDate = v)"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item prop="PaymentMethod" label="طريقة الدفع">
              <radio-payment-method
                Type="Payment"
                :Value="tempForm.PaymentMethod"
                :VendorId="tempForm.MemberId"
                @Set="(v) => (tempForm.PaymentMethod = v)"
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
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="Visibles = false">{{ $t("AddVendors.Cancel") }}</el-button>
        <el-button type="primary" @click="create()">{{
          $t("AddVendors.Save")
        }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { Create as CreatePayment } from "@/api/Payment";
// report
import DrawerPrint from "@/components/PrintRepot/DrawerPrint.vue";
import FakeDate from "@/components/Date/FakeDate";
import RadioPaymentMethod from "@/components/PaymentMethod/RadioPaymentMethod.vue";
import EditorsUser from "@/components/Gym/EditorsUser";
import { SendSMS } from "@/api/SMS";

export default {
  components: { EditorsUser, DrawerPrint, FakeDate, RadioPaymentMethod },
  props: {
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
  },
  data() {
    return {
      OldPayment: null,
      tempForm: {
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
      },
      Visibles: false,
    };
  },
  methods: {
    create() {
      this.$refs["Form"].validate((valid) => {
        if (valid) {
          this.tempForm.MemberId = this.MemberId;
          CreatePayment(this.tempForm)
            .then((response) => {
              this.tempForm.Name = this.Name;
              this.Visibles = false;
              this.tempForm.Id = response;
              this.OldPayment = this.tempForm;
              this.OldPayment.ObjectId = this.MemberId;
              SendSMS(
                this.NumberPhone1,
                "تم دفع مبلغ " +
                  this.OldPayment.TotalAmmount.toFixed(
                    this.$store.getters.settings.ToFixed
                  ) +
                  " بسند قبض رقم " +
                  this.OldPayment.Id +
                  " للمشترك رقم " +
                  this.MemberId
              );
              this.$notify({
                title: "تم ",
                message: "تم الإضافة بنجاح",
                type: "success",
                duration: 2000,
              });
            })
            .catch((error) => {
              console.log(error);
            });
        }
      });
    },
  },
};
</script>
