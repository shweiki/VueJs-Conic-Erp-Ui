<template>
  <div>
    <el-button
      v-permission="['Admin']"
      type="primary"
      icon="el-icon-plus"
      @click="Visibles = true"
    />

    <el-dialog style="margin-top: -13vh" title="تسجيل دخول" :visible.sync="Visibles">
      <el-form
        :model="Temp"
        ref="MemberLogForm"
        label-position="top"
        class="demo-form-inline"
      >
        <el-row>
          <el-col :span="24">
            <el-form-item prop="MemberId" label="المشترك">
              <member-search-any
                @Set="
                  (v) => {
                    Temp.MemberId = v.Id;
                  }
                "
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item v-bind:label="$t('AddVendors.Description')" prop="Description">
              <fake-date
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
        <el-button type="primary" @click="create()">{{
          $t("AddVendors.Save")
        }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { Create } from "@/api/MemberLog";
import MemberSearchAny from "@/components/Member/MemberSearchAny";
import permission from "@/directive/permission/index.js";
import FakeDate from "@/components/Date/FakeDate.vue";
export default {
  components: { MemberSearchAny, FakeDate },
  directives: { permission },

  data() {
    return {
      Temp: {
        Id: undefined,
        Type: "Manual",
        MemberId: undefined,
        DateTime: "",
        DeviceId: 3,
        Status: 0,
        Description: "Manual User Register Member  Log",
      },
      Visibles: false,
    };
  },
  methods: {
    create() {
      this.$refs["MemberLogForm"].validate((valid) => {
        if (valid) {
          Create(this.Temp)
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
