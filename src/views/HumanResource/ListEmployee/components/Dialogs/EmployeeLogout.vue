<template>
  <div>
    <el-button
      v-permission="['Admin']"
      type="primary"
      icon="el-icon-top"
      @click="Visibles = true"
    >
      Logout
    </el-button>
    <el-dialog style="margin-top: -13vh" title="تسجيل خروج" :visible.sync="Visibles">
      <el-form
        :model="Temp"
        ref="EmployeeLogForm"
        label-position="top"
        class="demo-form-inline"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item prop="EmployeeName" label="اسم الموظف">
              <!-- <Employee-Search-Any
                @Set="
                  (v) => {
                    Temp.EmployeeId = v.Id;
                  }
                "
              /> -->
              <el-input disabled v-model="Name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="EmployeeId" label="الرقم الوظيفي">
              <el-input disabled v-model="Id"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="وقت الخروج" prop="EndDateTime">
              <Fake-Date
                :Value="Temp.EndDateTime"
                @Set="
                  (v) => {
                    Temp.EndDateTime = v;
                  }
                "
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-bind:label="$t('AddVendors.Description')" prop="Description">
              <el-input v-model="Temp.Description"></el-input>
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
import EmployeeSearchAny from "@/components/HumanResource/EmployeeSearchAny";
import permission from "@/directive/permission/index.js";
import FakeDate from "@/components/Date/FakeDate.vue";
export default {
  components: { EmployeeSearchAny, FakeDate },
  directives: { permission },
  props: ["Name", "Id"],
  data() {
    return {
      Temp: {
        Id: undefined,
        EmployeeId: undefined,
        StartDateTime: "",
        EndDateTime: "",
        DeviceId: 1,
        Status: 0,
        Description: "Manual User Register Employee Logout",
      },
      Visibles: false,
    };
  },
  methods: {
    create() {
      this.$refs["EmployeeLogForm"].validate((valid) => {
        if (valid) {
          this.Temp.EmployeeId = this.Id;
          Logout(this.Temp)
            .then((response) => {
              this.Visibles = false;
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
