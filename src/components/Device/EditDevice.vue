<template>
  <div>
    <el-button icon="el-icon-edit" circle @click="getdata()"></el-button>

    <el-dialog style="margin-top: -13vh" :show-close="false" :visible.sync="Visibles">
      <div slot="title" class="dialog-footer">
        <el-col :span="4">
          <el-button
            icon="fa fa-save"
            style="float: left"
            type="primary"
            @click="updateData()"
          />
        </el-col>
        <el-col :span="20">
          <el-divider> تعديل جهاز {{ tempForm.Id }}</el-divider>
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
        <el-form-item v-bind:label="$t('Ip')" prop="Ip">
          <el-input type="text" v-model="tempForm.Ip"></el-input>
        </el-form-item>
        <el-form-item v-bind:label="$t('Classification.Port')" prop="Port">
          <el-input type="text" v-model="tempForm.Port"></el-input>
        </el-form-item>
        <el-form-item prop="Feel" label="تحسس من الجهاز دائما">
          <el-switch v-model="tempForm.Feel"></el-switch>
        </el-form-item>
        <el-form-item
          v-bind:label="$t('Classification.LastSetDateTime')"
          prop="LastSetDateTime"
        >
          <el-input type="text" v-model="tempForm.LastSetDateTime"></el-input>
        </el-form-item>
        <el-form-item v-bind:label="$t('Classification.Notes')" prop="Description">
          <el-input type="textarea" v-model="tempForm.Description"></el-input>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { Edit, GetById } from "@/api/Device";

export default {
  props: {
    DeviceId: {
      type: Number,
      default: undefined,
    },
  },
  data() {
    return {
      Visibles: false,
      tempForm: {},
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
  methods: {
    getdata() {
      GetById({ Id: this.DeviceId }).then((response) => {
        // handle success
        this.tempForm = response;

        this.Visibles = true;
      });
    },
    updateData() {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          Edit(this.tempForm)
            .then((response) => {
              this.Visibles = false;
              this.$notify({
                title: "تم ",
                message: "تم تعديل بنجاح",
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
