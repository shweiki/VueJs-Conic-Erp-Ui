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
            icon="el-icon-finished"
            style="float: left"
            type="primary"
            @click="createData()"
          />
        </el-col>
        <el-col :span="20">
          <el-divider> إضافة إشتراك </el-divider>
        </el-col>
      </div>
      <el-form
        ref="dataForm"
        :rules="rulesForm"
        :model="tempForm"
        label-position="top"
        label-width="70px"
      >
        <el-row>
          <el-col :span="24">
            <el-form-item v-bind:label="$t('Members.Name')" prop="Name">
              <el-input type="text" v-model="tempForm.Name" autofocus></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="8">
            <el-form-item v-bind:label="$t('Members.NumberDays')" prop="NumberDays">
              <el-input-number
                v-model="tempForm.NumberDays"
                :step="1"
                :min="1"
                :max="1000"
                @focus="$event.target.select()"
              ></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item v-bind:label="$t('Members.MorningPrice')" prop="MorningPrice">
              <el-input-number
                v-model="tempForm.MorningPrice"
                :precision="2"
                :step="0.1"
                :min="0.0"
                :max="1500"
                @focus="$event.target.select()"
              ></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item v-bind:label="$t('Members.FullDayPrice')" prop="FullDayPrice">
              <el-input-number
                v-model="tempForm.FullDayPrice"
                :precision="2"
                :step="0.1"
                :min="0.0"
                :max="1500"
                @focus="$event.target.select()"
              ></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="8">
            <el-form-item v-bind:label="$t('Members.Tax')" prop="Tax">
              <el-input-number
                v-model="tempForm.Tax"
                :precision="2"
                :step="0.01"
                :min="0.01"
                :max="1"
                @focus="$event.target.select()"
              ></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="الحد الادنى للتجميد" prop="MinFreezeLimitDays">
              <el-input-number
                v-model="tempForm.MinFreezeLimitDays"
                :precision="2"
                :step="1"
                :min="1"
                :max="365"
                @focus="$event.target.select()"
              ></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="الحد الاعلى للتجميد" prop="MaxFreezeLimitDays">
              <el-input-number
                v-model="tempForm.MaxFreezeLimitDays"
                :precision="2"
                :step="1"
                :min="1"
                :max="365"
                @focus="$event.target.select()"
              ></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item v-bind:label="$t('Members.Notes')" prop="Description">
              <el-input type="textarea" v-model="tempForm.Description"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <!-- <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{
          $t("permission.cancel")
        }}</el-button>
        <el-button
          type="primary"
          @click="createData()"
          >حفظ</el-button
        >
      </div> -->
    </el-dialog>
  </div>
</template>

<script>
import { Create } from "@/api/Membership";
export default {
  name: "Membership",
  data() {
    return {
      dialogFormVisible: false,
      tempForm: {
        Id: undefined,
        Name: "",
        NumberDays: 30,
        MorningPrice: 0.0,
        FullDayPrice: 0.0,
        Tax: 0.0,
        Rate: 0,
        Description: "",
        MinFreezeLimitDays: 3,
        MaxFreezeLimitDays: 0,
      },
      rulesForm: {
        Name: [
          {
            required: true,
            message: "يجب إدخال إسم ",
            trigger: "blur",
          },
          {
            minlength: 3,
            maxlength: 50,
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
        NumberDays: 30,
        MorningPrice: 0.0,
        FullDayPrice: 0.0,
        Tax: 0.0,
        Rate: 0,
        Description: "",
        MinFreezeLimitDays: 3,
        MaxFreezeLimitDays: 0,
      };
    },
    createData() {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          Create(this.tempForm)
            .then((response) => {
              this.dialogFormVisible = false;
              this.getdata();
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
