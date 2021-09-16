<template>
  <div class="app-container">
    <el-form
      ref="tempForm"
      :model="tempForm"
      label-position="top"
      label-width="70px"
      class="demo-ruleForm"
    >
      <el-row type="flex">
        <el-col :span="6">
          <el-button
            :disabled="DisabledSave"
            style="float: left"
            type="success"
            icon="fa fa-save"
            @click="isEdit != true ? createData() : updateData()"
            >{{ isEdit != true ? "حفظ" : "تعديل" }}</el-button
          >
        </el-col>
        <el-col :span="6">
          <Drawer-Print
            v-bind:disabled="OldVisit == null ? false : true"
            Type="Visit"
            :Data="OldVisit"
          />
        </el-col>
        <el-col :span="3">
          <el-switch
            v-model="AutoPrint"
            active-color="#13ce66"
            inactive-color="#ff4949"
          ></el-switch>
        </el-col>
      </el-row>
      <el-row type="flex">
        <el-col :span="12">
          <el-form-item
            prop="FakeDate"
            v-bind:label="$t('Visit.ReleaseDate')"
            :rules="[
              {
                required: true,
                message: 'لايمكن ترك التاريخ فارغ',
                trigger: 'blur',
              },
            ]"
          >
            <Fake-Date :Value="tempForm.FakeDate" @Set="(v) => (tempForm.FakeDate = v)" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item v-bind:label="$t('Visit.PaymentMethod')" prop="PaymentMethod">
            <el-radio-group v-model="tempForm.PaymentMethod" text-color="#f78123">
              <el-radio label="Cash" border>{{ $t("Visit.Cash") }}</el-radio>
              <el-radio label="Visa" border>{{ $t("Visit.Visa") }}</el-radio>
              <el-radio label="Coupon" border>{{ $t("Visit.Coupon") }}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex">
        <el-col :span="12">
          <el-form-item v-bind:label="$t('Visit.Name')" prop="Name">
            <el-input
              required
              v-model="tempForm.Name"
              :size="$store.getters.size"
              suffix-icon="fa fa-child"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item v-bind:label="$t('Visit.PhoneNumber')">
            <el-input
              required
              v-model="tempForm.PhoneNumber"
              :size="$store.getters.size"
              suffix-icon="fa fa-mobile-alt"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="tempForm.PaymentMethod != 'Coupon'" type="flex">
        <el-col :span="8">
          <el-form-item v-bind:label="$t('Visit.PersonCount')" prop="PersonCount">
            <el-input-number
              :size="$store.getters.size"
              v-model="tempForm.PersonCount"
              :precision="0"
              :step="1"
              :min="1"
              :max="1000000"
              @focus="$event.target.select()"
            >
            </el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item v-bind:label="$t('Visit.HourCount')" prop="HourCount">
            <el-input-number
              :size="$store.getters.size"
              v-model="tempForm.HourCount"
              :precision="2"
              :step="0.5"
              :min="0.5"
              :max="18"
              @focus="$event.target.select()"
            ></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item v-bind:label="$t('Visit.HourPrice')" prop="HourPrice">
            <el-input-number
              v-bind:disabled="!checkPermission(['Admin'])"
              :size="$store.getters.size"
              v-model="tempForm.HourPrice"
              :precision="0"
              :step="1"
              :min="1"
              :max="1000000"
              @focus="$event.target.select()"
            ></el-input-number>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="tempForm.PaymentMethod == 'Coupon'" type="flex">
        <el-col :span="12">
          <el-form-item v-bind:label="$t('Visit.CouponId')" prop="CouponId">
            <el-input
              :size="$store.getters.size"
              v-model="tempForm.CouponId"
              @focus="$event.target.select()"
              suffix-icon="fa fa-ticket-alt"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item v-bind:label="$t('Visit.CouponNoteId')" prop="CouponNoteId">
            <el-input
              :size="$store.getters.size"
              v-model="tempForm.CouponNoteId"
              @focus="$event.target.select()"
              suffix-icon="fa fa-book"
            ></el-input>
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
      <el-row type="flex">
        <el-col :span="8">
          <span style="font-size: 18px">{{ $t("Visit.statement") }}</span>
          <el-form-item prop="Description">
            <el-input type="textarea" v-model="tempForm.Description"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <span style="font-size: 18px">خصم</span>
          <el-form-item prop="Discount">
            <el-input-number
              v-model="tempForm.Discount"
              :precision="2"
              :step="1"
              :min="0.0"
              :max="100"
              @focus="$event.target.select()"
            ></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="8" class="TotalAmmount card">
          <span>{{ $t("Visit.TotalJD") }}</span>
          <span
            >{{
              (
                tempForm.PersonCount * (tempForm.HourCount * 2) * tempForm.HourPrice -
                tempForm.Discount
              ).toFixed($store.getters.settings.ToFixed)
            }}
            JOD</span
          >
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script>
import { Create, Edit, GetById } from "@/api/Visit";
import FakeDate from "@/components/Date/FakeDate";
import checkPermission from "@/utils/permission";
import { PrintReport } from "@/Report/FunctionalityReport";
import DrawerPrint from "@/components/PrintRepot/DrawerPrint.vue";

export default {
  name: "Visit",
  components: {
    FakeDate,
    DrawerPrint,
  },
  props: {
    isEdit: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      OldVisit: {},
      AutoPrint: true,
      ValidateNote: "",
      DisabledSave: false,
      tempForm: {
        Id: undefined,
        Name: "",
        Tax: 0.0,
        FakeDate: "",
        PaymentMethod: "Cash",
        Discount: 0,
        Status: 0,
        PersonCount: 1,
        HourCount: 0.5,
        HourPrice: 1,
        PhoneNumber: "",
        Type: "",
        Description: "",
      },
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
    checkPermission,
    getdata(val) {
      GetById({ Id: val })
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
    restTempForm() {
      this.tempForm = {
        Id: undefined,
        Name: "",
        Tax: 0.0,
        FakeDate: "",
        PaymentMethod: "Cash",
        Discount: 0,
        Status: 0,
        PersonCount: 1,
        HourCount: 0.5,
        HourPrice: 1,
        PhoneNumber: "",
        Type: "",
        Description: "",
      };
    },
    updateData() {
      this.$refs["tempForm"].validate((valid) => {
        if (valid) {
          if (this.tempForm.PaymentMethod == "Coupon") {
            this.tempForm.PersonCount = 1;
            this.tempForm.HourCount = 0.5;
            this.tempForm.HourPrice = 0;
            this.tempForm.Description =
              "كوبون رقم " +
              this.tempForm.CouponId +
              " من دفتر رقم " +
              this.tempForm.CouponNoteId +
              " ";
          }
          this.tempForm.Tax = parseInt(this.tempForm.Tax);
          let Total = (
            this.tempForm.PersonCount *
              (this.tempForm.HourCount * 2) *
              this.tempForm.HourPrice -
            this.tempForm.Discount
          ).toFixed(this.$store.getters.settings.ToFixed);
          if (Total > 0) {
            this.DisabledSave = true;
            Edit(this.tempForm)
              .then((res) => {
                if (res) this.DisabledSave = false;
                this.$notify({
                  title: "تم تعديل  بنجاح",
                  message: "تم تعديل بنجاح",
                  type: "success",
                  position: "top-left",
                  duration: 1000,
                  showClose: false,
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
          if (this.tempForm.PaymentMethod == "Coupon") {
            this.tempForm.PersonCount = 1;
            this.tempForm.HourCount = 0.5;
            this.tempForm.HourPrice = 1;
            this.tempForm.Description =
              "كوبون رقم " +
              this.tempForm.CouponId +
              " من دفتر رقم " +
              this.tempForm.CouponNoteId +
              " ";
          }
          this.tempForm.Tax = parseInt(this.tempForm.Tax);
          let Total = (
            this.tempForm.PersonCount *
              (this.tempForm.HourCount * 2) *
              this.tempForm.HourPrice -
            this.tempForm.Discount
          ).toFixed(this.$store.getters.settings.ToFixed);
          if (Total > 0) {
            this.DisabledSave = true;
            Create(this.tempForm)
              .then((res) => {
                if (res) {
                  this.tempForm.Id = res;
                  this.OldVisit = this.tempForm;
                  if (this.AutoPrint == true) {
                    PrintReport("Visit", this.OldVisit);
                  }
                  this.DisabledSave = false;
                  this.restTempForm();
                  this.$notify({
                    title: "تم الإضافة بنجاح",
                    message: "تم الإضافة بنجاح",
                    type: "success",
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
<style scoped>
.card {
  background: #3f7faf;
  color: white;
}
.TotalAmmount {
  padding: 25px;
  font-size: 22px;
  border: dotted;
  font-weight: 700;
}
</style>
