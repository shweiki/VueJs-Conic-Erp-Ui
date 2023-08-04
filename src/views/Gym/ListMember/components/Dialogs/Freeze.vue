<template>
  <div>
    <el-button
      style="width: 100px"
      type="primary"
      icon="el-icon-plus"
      @click="Visibles = true"
      >تجميد</el-button
    >
    <el-dialog style="margin-top: -13vh" title="تسجيل تجميد" :visible.sync="Visibles">
      <el-form
        :model="tempForm"
        ref="dataForm"
        label-position="top"
        class="demo-form-inline"
      >
        عدد الايام المسموحة لتجميد : من {{ MinFreezeLimit }} الى {{ MaxFreezeLimit }} ايام
        <el-row type="flex">
          <el-col :span="24">
            <el-form-item prop="FreezeBetween" label="الفترة">
              <el-date-picker
                v-model="FreezeBetween"
                :format="$store.getters.settings.DateTimeFormat"
                type="daterange"
                align="left"
                unlink-panels
                v-bind:range-separator="$t('Sales.until')"
                v-bind:start-placeholder="$t('Sales.From')"
                v-bind:end-placeholder="$t('Sales.To')"
                :default-time="['00:00:00', '23:59:59']"
                style="width: 80%"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex">
          <el-col :span="24">
            <el-form-item
              prop="Description"
              :rules="[
                {
                  required: true,
                  message: 'لايمكن ترك ملاحظات فارغ',
                  trigger: 'blur',
                },
              ]"
              v-bind:label="$t('AddVendors.Description')"
            >
              <el-input v-model="tempForm.Description"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
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
        <el-row type="flex">
          <el-col :span="24">
            مجموع الايام حسب الفترة المطلوبة
            {{
              Math.round(
                Math.abs(
                  (new Date(FreezeBetween[0]) - new Date(FreezeBetween[1])) /
                    (24 * 60 * 60 * 1000)
                )
              )
            }}
            ايام
          </el-col>
        </el-row>
        <el-col>
          <span style="color: #f56c6c; font-size: 16px; text-align: center">{{
            ValidateNote
          }}</span>
        </el-col>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="Visibles = false">{{ $t("AddVendors.Cancel") }}</el-button>
        <el-button :disabled="EnableSave" type="primary" @click="create()">{{
          $t("AddVendors.Save")
        }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { Create } from "@/api/MembershipMovementOrder";
import EditorsUser from "@/components/Gym/EditorsUser";

export default {
  components: { EditorsUser },

  props: {
    MemberShipMovementId: {
      type: Number,
      required: true,
    },
    MinFreezeLimit: {
      type: Number,
      default: () => {
        return undefined;
      },
    },
    MaxFreezeLimit: {
      type: Number,
      default: () => {
        return undefined;
      },
    },
  },
  data() {
    return {
      EnableSave: false,
      tempForm: {
        Id: undefined,
        Type: "Freeze",
        StartDate: "",
        EndDate: "",
        Status: 0,
        EditorName: "",
        Description: "",
        MemberShipMovementId: this.MemberShipMovementId,
      },
      FreezeBetween: "",
      Visibles: false,
      Days: 0,
      ValidateNote: "",
      pickerOptions: {
        disabledDate(time) {
          console.log(time);
          return time.getTime() < Date.now() - 8.64e7;
        },
      },
    };
  },
  methods: {
    create() {
      this.Days = Math.round(
        Math.abs(
          (new Date(this.FreezeBetween[0]) - new Date(this.FreezeBetween[1])) /
            (24 * 60 * 60 * 1000)
        )
      );
      console.log(this.Days);
      if (this.Days >= this.MinFreezeLimit && this.Days <= this.MaxFreezeLimit) {
        this.$refs["dataForm"].validate((valid) => {
          if (valid) {
            this.EnableSave = true;
            this.tempForm.StartDate = this.FreezeBetween[0];
            this.tempForm.EndDate = this.FreezeBetween[1];
            Create(this.tempForm)
              .then((response) => {
                if (response) {
                  this.Visibles = false;
                  this.EnableSave = false;
                  this.$notify({
                    title: "تم ",
                    message: "تم الإضافة بنجاح",
                    type: "success",
                    duration: 2000,
                  });
                  this.$nextTick(() => {
                    this.$router.replace({
                      path: "/redirect" + this.$route.fullPath,
                    });
                  });
                }
              })
              .catch((error) => {
                console.log(error);
              });
          }
        });
      } else {
        this.ValidateNote = "عدد الايام المطلوب تجميدها غير المسموح بها";
      }
    },
  },
};
</script>
