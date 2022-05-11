<template>
  <div>
    <el-button
      type="primary"
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
            icon="fa fa-save"
            style="float: left"
            type="primary"
            @click="createData()"
          />
        </el-col>
        <el-col :span="20">
          <el-divider> إضافة قائمة </el-divider>
        </el-col>
      </div>
      <el-form
        ref="dataForm"
        :rules="rulesForm"
        :model="tempForm"
        label-position="top"
        label-width="70px"
      >
        <el-form-item v-bind:label="$t('Classification.Name')" prop="Name">
          <el-input type="text" v-model="tempForm.Name"></el-input>
        </el-form-item>
        <el-form-item v-bind:label="$t('Classification.Notes')" prop="Description">
          <el-input type="textarea" v-model="tempForm.Description"></el-input>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { Create } from "@/api/MenuItem";
export default {
  name: "AddMenuItem",
  data() {
    return {
      dialogFormVisible: false,
      tempForm: {
        Id: undefined,
        Name: "",
        Status: 0,

        Description: "",
      },
      rulesForm: {
        Name: [
          {
            required: true,
            message: "يجب إدخال إسم ",
            trigger: "blur",
          },
          {
            min: 3,
            max: 50,
            message: "الرجاء إدخال إسم لا يقل عن 3 أحرف و لا يزيد عن 50 حرف",
            trigger: "blur",
          },
        ],
      },
    };
  },
  created() {
    this.resetTempForm();
  },
  methods: {
    resetTempForm() {
      this.tempForm = {
        Id: undefined,
        Name: "",
        Description: "",
      };
    },
    createData() {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          console.log(this.tempForm);
          Create(this.tempForm)
            .then((response) => {
              this.dialogFormVisible = false;
              this.$emit("Success", response);
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
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
  },
};
</script>
