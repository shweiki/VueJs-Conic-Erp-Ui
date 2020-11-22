<template>
  <div>
    <el-button
      v-bind:disabled="(OldPayment != null) ? false: true "
      @click="Print()"
      type="primary"
      icon="el-icon-printer"
    ></el-button>
    <el-button type="primary" icon="el-icon-plus" @click="Visibles = true">قبض</el-button>

    <el-dialog style="margin-top: -13vh" title="تسجيل قبض" :visible.sync="Visibles">
      <el-form :model="Payment" ref="Form" label-position="top" class="demo-form-inline">
        <el-row type="flex">
          <el-col :span="12">
            <el-form-item prop="TotalAmmount" label="القيمة المقبوضة">
              <currency-input
                :rules="[{ required: true, message: 'لايمكن ترك القيمة فارغ', trigger: 'blur' } ]"
                class="currency-input"
                v-model="Payment.TotalAmmount"
                :value-range="{min :1 , max :1000}"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="تاريخ "
              prop="FakeDate"
              :rules="[{ required: true, message: 'لايمكن ترك التاريخ فارغ', trigger: 'blur' } ]"
            >
              <el-date-picker v-model="Payment.FakeDate" type="date" format="dd/MM/yyyy"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row type="flex">
          <el-col :span="12">
            <el-form-item prop="PaymentMethod" label="طريقة الدفع">
              <el-radio-group v-model="Payment.PaymentMethod" text-color="#f78123">
                <el-radio label="Cash" border>{{ $t('NewPurchaseInvoice.Cash') }}</el-radio>
                <el-radio label="Visa" border>Visa</el-radio>
                <el-radio label="Cheque" border>Cheque</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-bind:label="$t('AddVendors.Description')" prop="description">
              <el-input v-model="Payment.Description"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex">
          <el-col :span="24">
            <el-form-item
              prop="EditorName"
              :rules="[{ required: true, message: 'لايمكن ترك محرر السند فارغ', trigger: 'blur' } ]"
              v-bind:label="$t('AddVendors.EditorName')"
            >
              <el-select v-model="Payment.EditorName" placeholder="محرر السند">
                <el-option
                  v-for="item in $store.getters.Editors"
                  :key="item.id"
                  :label="item.name"
                  :value="item.name"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="Visibles = false">{{$t('AddVendors.Cancel')}}</el-button>
        <el-button type="primary" @click="create()">{{$t('AddVendors.Save')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { CreatePayment } from "@/api/Payment";
// report
import printJS from "print-js";
import { PaymentMember } from "@/Report/PayPapar";
import { string } from "clipboard";

export default {
  components: { printJS },
  props: {
    MemberID: {
      type: Number,
      default: () => {
        return undefined;
      }
    },
    Name: {
      type: string,
      default: () => {
        return undefined;
      }
    }
  },
  data() {
    return {
      OldPayment: null,
      Payment: {
        ID: undefined,
        Name: "",
        FakeDate: new Date(),
        PaymentMethod: "Cash",
        TotalAmmount: 0.0,
        Description: "",
        Status: 0,
        VendorID: undefined,
        IsPrime: true,
        MemberID: undefined,
        EditorName: "",
        Type: ""
      },
      Visibles: false
    };
  },
  methods: {
    Print() {
      this.OldPayment.ObjectID = this.MemberID
      printJS({
        printable: PaymentMember(this.OldPayment),
        type: "pdf",
        base64: true,
        showModal: true
      });
    },
    create() {
      this.$refs["Form"].validate(valid => {
        if (valid) {
          this.Payment.MemberID = this.MemberID;
          CreatePayment(this.Payment)
            .then(response => {
              this.Payment.name = this.name;
              this.Visibles = false;
              this.$notify({
                title: "تم ",
                message: "تم الإضافة بنجاح",
                type: "success",
                duration: 2000,
                onClose: () => {
                  this.Payment.id = response;
                  this.OldPayment = this.Payment;
                  this.Print();
                }
              });
            })
            .catch(error => {
              console.log(error);
            });
        }
      });
    }
  }
};
</script>
