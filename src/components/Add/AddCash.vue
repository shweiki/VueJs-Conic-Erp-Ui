<template>
  <div>
      <el-button
      type="warning"
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
          <el-divider> إضافة كاش </el-divider>
        </el-col>
      </div>
      <el-form
        ref="dataForm"
        :rules="rulesForm"
        :model="tempForm"
        label-position="top"
        label-width="70px"
      >
        <el-form-item v-bind:label="$t('CashDrawer.CashNumber')" prop="Name">
          <el-input type="text" v-model="tempForm.Name"></el-input>
        </el-form-item>
        <el-form-item v-bind:label="$t('CashDrawer.PCIP')" prop="PCIP">
          <el-input type="text" v-model="tempForm.PCIP"></el-input>
        </el-form-item>
        <el-form-item v-bind:label="$t('CashDrawer.BTCash')" prop="BTCash">
          <el-input type="text" v-model="tempForm.BTCash"></el-input>
        </el-form-item>

        <el-form-item v-bind:label="$t('Items.Notes')" prop="Description">
          <el-input type="textarea" v-model="tempForm.Description"></el-input>
        </el-form-item>
      </el-form>
    
    </el-dialog>
  </div>
</template>

<script>
import { Create } from "@/api/Cash";
export default {
  name: "Cash",
  data() {
    return {
      dialogFormVisible: false,
   tempForm: {
        Id: undefined,
        Name: "",
        PCIP: "",
        Description: "",
        BTCash: "",
        IsPrime: false
      },
       rulesForm: {},
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
        PCIP: "",
        Description: "",
        BTCash: "",
        IsPrime: false
      };
    },
     createData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          Create(this.tempForm)
            .then(response => {
              this.dialogFormVisible = false;
              this.$notify({
                title: "تم ",
                message: "تم الإضافة بنجاح",
                type: "success",
                duration: 2000
              });
            })
            .catch(error => {
              console.log(error);
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },


  }
};
</script>
