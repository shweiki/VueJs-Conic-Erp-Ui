<template>
  <div>
    <el-button
      v-permission="['admin']"
      type="primary"
      icon="el-icon-edit"
      @click="Visibles = true"
    />

    <el-dialog style="margin-top: -13vh" title="تعديل " :visible.sync="Visibles">
      <el-form
        :model="Temp"
        ref="DeviceLogForm"
        label-position="top"
        class="demo-form-inline"
      >
        <el-row type="flex">
          <el-col :span="12">
            <el-form-item prop="Fk" label="الموظف">
              <employee-search-any
                :EmployeeId="Temp.Fk"
                @Set="
                  (v) => {
                    Temp.TableName = 'Employee';
                    Temp.Fk = v.Id;
                  }
                "
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <select-device :Value="Temp.DeviceId" @Set="(v) => (Temp.DeviceId = v.Id)" />
          </el-col>
        </el-row>
        <el-row type="flex">
          <el-col :span="12">
            <el-form-item v-bind:label="$t('AddVendors.Description')" prop="DateTime">
              <Fake-Date
                :Value="Temp.DateTime"
                @Set="
                  (v) => {
                    Temp.DateTime = v;
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
        <el-button type="primary" @click="Edit()">{{ $t("AddVendors.Save") }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { GetById, Edit } from "@/api/DeviceLog";
import permission from "@/directive/permission/index.js";
import FakeDate from "@/components/Date/FakeDate.vue";
import SelectDevice from "./SelectDevice.vue";
import EmployeeSearchAny from "../HumanResource/EmployeeSearchAny.vue";
export default {
  name: "EditDeviceLog",
  props: ["Id"],
  components: { FakeDate, SelectDevice, EmployeeSearchAny },
  directives: { permission },
  data() {
    return {
      Temp: {},
      Visibles: false,
    };
  },
  created() {
    GetById({ Id: this.Id }).then((res) => {
      this.Temp = res;
    });
  },
  methods: {
    Edit() {
      this.$refs["DeviceLogForm"].validate((valid) => {
        if (valid) {
          Edit(this.Temp)
            .then((response) => {
              this.Visibles = false;
              this.$notify({
                title: "تم ",
                message: "تم تعديل بنجاح",
                type: "success",
                duration: 2000,
              });
              this.$emit("Done");
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
