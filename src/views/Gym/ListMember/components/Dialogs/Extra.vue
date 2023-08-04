<template>
  <div>
    <el-button
      style="width: 100px"
      type="success"
      icon="el-icon-plus"
      @click="Visibles = true"
      >ايام إضافية</el-button
    >
    <el-dialog
      style="margin-top: -13vh"
      title="تسجيل ايام اضافية"
      :visible.sync="Visibles"
    >
      <el-form
        label-position="top"
        :model="tempForm"
        ref="dataForm"
        class="demo-form-inline"
      >
        <el-row type="flex">
          <el-col :span="24">
            <el-form-item prop="Extra" label="عدد الايام">
              <el-input-number
                v-model="Extra"
                :min="1"
                :max="100"
                @focus="$event.target.select()"
              ></el-input-number>
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
    EndDate: null,
  },
  data() {
    return {
      EnableSave: false,
      tempForm: {
        Id: undefined,
        Type: "Extra",
        StartDate: new Date(this.EndDate),
        EndDate: new Date(),
        Status: 0,
        Description: "",
        EditorName: "",
        MemberShipMovementId: this.MemberShipMovementId,
      },
      Extra: 0,
      Description: "",
      Visibles: false,
    };
  },
  methods: {
    create() {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          this.EnableSave = true;
          this.tempForm.EndDate = new Date(
            this.tempForm.EndDate.setTime(
              this.tempForm.StartDate.getTime() + 3600 * 1000 * 24 * this.Extra
            )
          );
          Create(this.tempForm).then((response) => {
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
          });
        }
      });
    },
  },
};
</script>
