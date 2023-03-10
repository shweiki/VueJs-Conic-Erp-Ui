<template>
  <div>
    <el-button v-permission="['admin']" type="primary" icon="fa fa-object-group" @click="Visibles = true">
      دمج
    </el-button>
    <el-dialog style="margin-top: -13vh" title="دمج مشتركين" :visible.sync="Visibles">
      <el-form :model="tempForm" :rules="rulesForm" ref="MergeTwoMembersForm" label-position="top"
        class="demo-form-inline">
        <el-row type="flex">
          <el-col :span="24">
            <el-form-item prop="CurrentId"
              label="دمج من المشترك (ملاحظة : سيتم حذف بيانات المشترك بعد الانتهاء من عملية نقل بيانات)">
              <el-input :disabled="true" v-model="tempForm.CurrentName" class="input-with-select">
                <svg-icon slot="append" class-name="search-icon" icon-class="search" @click.stop="click" />
              </el-input>
              <Member-Search-Any @Set="
                (v) => {
                  tempForm.CurrentId = v.Id;
                  tempForm.CurrentName = `(${v.Id}) ${v.Name}`;
                }
              " />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex">
          <el-col :span="24">
            <el-form-item prop="IntoId" label="الى مشترك">
              <el-input :disabled="true" v-model="tempForm.IntoName" class="input-with-select">
                <svg-icon slot="append" class-name="search-icon" icon-class="search" @click.stop="click" />
              </el-input>
              <Member-Search-Any @Set="
                (v) => {
                  tempForm.IntoId = v.Id;
                  tempForm.IntoName = `(${v.Id}) ${v.Name}`;
                }
              " />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="Visibles = false">{{
          $t("AddVendors.Cancel")
        }}</el-button>
        <el-button type="primary" @click="merge()">{{
          $t("AddVendors.Save")
        }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { MergeTwoMembers } from "@/api/Member";
import permission from "@/directive/permission/index.js";
import MemberSearchAny from "@/components/Member/MemberSearchAny.vue";

export default {
  components: { MemberSearchAny },
  directives: { permission },
  data() {
    return {
      Visibles: false,
      tempForm: {
        IntoId: undefined,
        IntoName: "",
        CurrentId: undefined,
        CurrentName: "",
      },
      rulesForm: {
        IntoId: [
          {
            required: true,
            message: "يرجى اختيار المشترك",
            trigger: "blur",
          }
        ],
        CurrentId: [
          {
            required: true,
            message: "يرجى اختيار المشترك",
            trigger: "blur",
          }
        ]
      },
    };
  },
  methods: {
    merge() {
      this.$refs["MergeTwoMembersForm"].validate((valid) => {
        if (valid) {
          MergeTwoMembers({ IntoId: this.tempForm.IntoId, CurrentId: this.tempForm.CurrentId })
            .then((response) => {
              this.Visibles = false;
              this.$notify({
                title: "تم ",
                message: "تم دمج بنجاح",
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
