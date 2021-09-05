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
            style="float: left; margin-left: 20px; padding: 10px 15px; border-radius: 6px"
            icon="el-icon-plus"
            to="/Visit/List"
            >{{ $t("route.ListVisit") }}</router-link
          >
        </div>
        <el-row type="flex">
          <el-col :span="4">
            <el-form-item
              prop="FakeDate"
              v-bind:label="$t('NewVisit.ReleaseDate')"
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
          <el-col :span="6">
            <el-input prop="Name" placeholder="اسم " v-model="tempForm.Name"></el-input>
          </el-col>
          <el-col :span="6">
            <el-form-item label="طريقة الدفع" prop="PaymentMethod">
              <el-radio-group v-model="tempForm.PaymentMethod" text-color="#f78123">
                <el-radio label="Cash" border>{{ $t("NewVisit.Cash") }}</el-radio>
              </el-radio-group>
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
        <el-col :span="24">
          <el-card shadow="hover">
            <el-divider direction="vertical"></el-divider>
            <span>{{ $t("NewVisit.Items") }}</span>
            <el-divider direction="vertical"></el-divider>
            <span>{{ TotalItems.toFixed($store.getters.settings.ToFixed) }}</span>
            <el-divider direction="vertical"></el-divider>

            <span>{{ $t("NewVisit.QuantityAmount") }}</span>
            <el-divider direction="vertical"></el-divider>
            <span>{{ TotalQty.toFixed($store.getters.settings.ToFixed) }}</span>
            <el-divider direction="vertical"></el-divider>

            <span>{{ $t("NewVisit.TotalDiscount") }}</span>
            <el-divider direction="vertical"></el-divider>
            <span>
              <el-input-number
                @change="SumTotalAmmount"
                v-model="tempForm.Discount"
                :precision="2"
                :step="1"
                :min="0.0"
                :max="100"
                @focus="$event.target.select()"
              ></el-input-number>
            </span>
            <el-divider direction="vertical"></el-divider>

            <span>{{ $t("NewVisit.TotalJD") }}</span>
            <el-divider direction="vertical"></el-divider>
            <span>{{ TotalAmmount.toFixed($store.getters.settings.ToFixed) }} JOD</span>
            <el-divider direction="vertical"></el-divider>
          </el-card>
        </el-col>
      </el-row>
      <el-col :span="10">
        <el-form-item>
          <el-input
            v-bind:placeholder="$t('NewVisit.statement')"
            type="textarea"
            v-model="tempForm.Description"
          ></el-input>
        </el-form-item>
      </el-col>
    </el-form>
  </div>
</template>
<script>
import { Create, Edit, GetVisitById } from "@/api/Visit";
import FakeDate from "@/components/Date/FakeDate";

export default {
  name: "NewVisit",
  components: {
    FakeDate,
  },
  props: {
    isEdit: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      TotalQty: 0,
      TotalItems: 0,
      TotalAmmount: 0,
      ValidateNote: "",
      DisabledSave: false,
      tempForm: {
        Id: undefined,
        Name: "",
        Tax: 0.0,
        AccountInvoiceNumber: "",
        FakeDate: "",
        InvoiceVisitDate: "",
        PaymentMethod: "Cash",
        Discount: 0,
        VendorId: 2,
        Status: 0,
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
    console.log("herer");
    if (this.isEdit) {
      this.getdata(this.$route.params && this.$route.params.id);
    }
    this.tempRoute = Object.assign({}, this.$route);
    // Why need to make a copy of this.$route here?
    // Because if you enter this page and quickly switch tag, may be in the execution of the setTagsViewTitle function, this.$route is no longer pointing to the current page
    // https://github.com/PanJiaChen/vue-element-admin/issues/1221
  },
  methods: {
    getdata(val) {
      GetVisitById({ Id: val })
        .then((response) => {
          console.log(response);
          this.tempForm = response;
          this.SumTotalAmmount();
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
        if (valid) {
          this.tempForm.Tax = parseInt(this.tempForm.Tax);
          if (this.TotalAmmount > 0 && this.TotalItems > 0 && this.TotalQty > 0) {
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
                      this.$router.push({ path: `/Visit/List` });
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

          if (this.TotalAmmount > 0 && this.TotalItems > 0 && this.TotalQty > 0) {
            this.DisabledSave = true;

            Create(this.tempForm)
              .then((response) => {
                this.$router.push({ path: `/Visit/List` });

                this.$notify({
                  title: "تم الإضافة بنجاح",
                  message: "تم الإضافة بنجاح",
                  type: "success",
                  position: "top-left",
                  duration: 1000,
                  showClose: false,
                });
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
    setTagsViewTitle() {
      const title = "Edit Visit";
      const route = Object.assign({}, this.tempRoute, {
        title: `${title}-${this.tempForm.Id}`,
      });
      this.$store.dispatch("tagsView/updateVisitdView", route);
    },
    setPageTitle() {
      const title = "Edit Visit";
      document.title = `${title} - ${this.tempForm.Id}`;
    },
  },
};
</script>
