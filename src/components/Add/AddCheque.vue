<template>
  <div>
      <el-button
      type="warning"
      icon="el-icon-circle-plus"
      @click="dialogFormVisible = true"
      :size="$store.getters.size"
    ></el-button>

  <el-dialog
      style="margin-top: -13vh"
      :show-close="false"
      :visible.sync="dialogFormVisible"
    >
      <div slot="title" class="dialog-footer">
        <el-col :span="4">
          <el-button
            icon="el-icon-finished"
            style="float: left"
            type="primary"
            @click="createData()"
          />
        </el-col>
        <el-col :span="20">
          <el-divider> إضافة شيك </el-divider>
        </el-col>
      </div>
  
  <el-form
        ref="dataForm"
        :rules="rulesForm"
        :model="tempForm"
        label-position="top"
        label-width="70px"
      >
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item v-bind:label="$t('Cheque.From')" prop="VendorId">
              <el-select
                v-model="tempForm.VendorId"
                filterable
                placeholder="$t('Cheque.From')"
              >
                <el-option
                  v-for="item in Vendors"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-bind:label="$t('Cheque.BankName')" prop="BankName">
              <el-select v-model="tempForm.BankName" filterable placeholder="BankName">
                <el-option
                  v-for="item in BanksNames"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item v-bind:label="$t('Cheque.ChequeAmount')" prop="ChequeAmount">
              <el-input-number
                v-model="tempForm.ChequeAmount"
                :precision="2"
                :step="0.1"
                :min="0.0"
                :max="1500"                            @focus="$event.target.select()"

              ></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              prop="FakeDate"
              v-bind:label="$t('Cheque.FakeDate')"
              :rules="[
                { required: true, message: 'لايمكن ترك التاريخ فارغ', trigger: 'blur' },
              ]"
            >
              <el-date-picker
                v-model="tempForm.FakeDate"
                type="date"
                v-bind:placeholder="$t('NewPurchaseInvoice.Date')"
                format="dd/MM/yyyy"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item v-bind:label="$t('Cheque.ChequeNumber')" prop="ChequeNumber">
          <el-input type="text" v-model="tempForm.ChequeNumber"></el-input>
        </el-form-item>
        <el-form-item v-bind:label="$t('Cheque.Payee')" prop="Payee">
          <el-input type="text" v-model="tempForm.Payee"></el-input>
        </el-form-item>
        <el-form-item v-bind:label="$t('Cheque.Currency')" prop="Currency">
          <el-input type="text" v-model="tempForm.Currency"></el-input>
        </el-form-item>
        <el-form-item v-bind:label="$t('Cheque.PaymentType')" prop="PaymentType">
          <el-input type="text" v-model="tempForm.PaymentType"></el-input>
        </el-form-item>

        <el-form-item v-bind:label="$t('Cheque.BankAddress')" prop="BankAddress">
          <el-input type="textarea" v-model="tempForm.BankAddress"></el-input>
        </el-form-item>
        <el-form-item v-bind:label="$t('Items.Notes')" prop="Description">
          <el-input type="textarea" v-model="tempForm.Description"></el-input>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { Create } from "@/api/Cheque";
import { GetVendor, GetVendorCheque } from "@/api/Vendor";
export default {
  name: "Cheque",
  data() {
    return {
      dialogFormVisible: false,
      BanksNames: [
        {
          value: " العربي",
          label: " العربي",
        },
        {
          value: "المؤسسة العربية المصرفية",
          label: "المؤسسة العربية المصرفية ",
        },
        {
          value: " الاردن",
          label: " الاردن",
        },
        {
          value: " القاهرة عمان",
          label: " القاهرة عمان",
        },
        {
          value: " المال الأردني",
          label: " المال الأردني",
        },
        {
          value: " التجاري الأردني",
          label: " التجاري الأردني",
        },
        {
          value: " الاردني الكويتي",
          label: " الاردني الكويتي",
        },
        {
          value: " الاهلي الاردني",
          label: " الاهلي الاردني",
        },
        {
          value: " الاسكان للتجارة والتمويل",
          label: " الاسكان للتجارة والتمويل",
        },
        {
          value: " الاستثمار العربي الاردني",
          label: " الاستثمار العربي الاردني",
        },
        {
          value: "الاستثماري",
          label: "الاستثماري",
        },
        {
          value: "سوسيته جنرال",
          label: "سوسيته جنرال",
        },
        {
          value: "الاتحاد",
          label: "الاتحاد",
        },
        {
          value: "ستاندرد تشارترد",
          label: "ستاندرد تشارترد",
        },
        {
          value: " العقاري المصري العربي",
          label: " العقاري المصري العربي",
        },
        {
          value: "سيتي بنك إن . إيه",
          label: "سيتي بنك إن . إيه",
        },
        {
          value: "الرافدين",
          label: "الرافدين",
        },
        {
          value: " الكويت الوطني",
          label: " الكويت الوطني",
        },
        {
          value: " لبنان والمهجر",
          label: " لبنان والمهجر",
        },
        {
          value: "عوده ش.م.ل",
          label: "عوده ش.م.ل",
        },
        {
          value: " العربي الاسلامي الدولي",
          label: " العربي الاسلامي الدولي",
        },
        {
          value: " الاسلامي الاردني",
          label: " الاسلامي الاردني",
        },
        {
          value: " صفوة الإسلامي",
          label: " صفوة الإسلامي",
        },
        {
          value: "مصرف الراجحي",
          label: "مصرف الراجحي",
        },
      ],
 tempForm: {
        Id: undefined,
        BankAddress: "",
        BankName: "",
        ChequeAmount: "",
        FakeDate: new Date(),
        Payee: "",
        PaymentType: "",
        ChequeNumber: "",
        Currency: "",
        Description: "",
        IsPrime: false,
        VendorId: undefined,
      },
       rulesForm: {
        Name: [
          {
            required: true,
            message: "يجب إدخال إسم ",
            trigger: "blur"
          },
          {
            minlength: 3,
            maxlength: 50,
            message: "الرجاء إدخال إسم لا يقل عن 3 أحرف و لا يزيد عن 50 حرف",
            trigger: "blur"
          }
        ]
      },
    };
  },
  created() {
    this.getdata();
    this.resetTempForm();
  },
  methods: {
        getdata() { GetVendorCheque().then((response) => {
        // handle success
        console.log(response);
        this.Vendors = response;
      });},
     resetTempForm() {
      this.tempForm = {
        Id: undefined,
        BankAddress: "",
        BankName: "",
        ChequeAmount: "",
        FakeDate: new Date(),
        Payee: "",
        PaymentType: "",
        ChequeNumber: "",
        Currency: "",
        Description: "",
        IsPrime: false,
        VendorId: undefined,
      };
    },
     createData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          console.log(this.tempForm);
          Create(this.tempForm)
            .then(response => {
              this.dialogFormVisible = false;
              this.$notify({
                title: "تم ",
                message: "تم الإضافة بنجاح",
                type: "success",
                duration: 2000
              });
            })
            .catch(error => {
              console.log(error);
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },


  }
};
</script>
