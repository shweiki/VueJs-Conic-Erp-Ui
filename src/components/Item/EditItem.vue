<template>
  <div>
    <el-button icon="el-icon-edit" circle @click="getdata()"></el-button>

    <el-dialog
      style="margin-top: -13vh"
      :show-close="false"
      title="تعديل صنف"
      :visible.sync="Visibles"
    >
      <el-form
        ref="dataForm"
        :rules="rulesForm"
        :model="tempForm"
        label-position="top"
        label-width="70px"
      >
        <el-form-item v-bind:label="$t('Items.ItemName')" prop="Name">
          <el-input type="text" v-model="tempForm.Name"></el-input>
        </el-form-item>
        <el-checkbox v-model="tempForm.IsPrime"
          >اظهار على شاشة المبيعات</el-checkbox
        >

        <el-row >
          <el-col :span="8">
            <el-form-item v-bind:label="$t('Items.Cost')" prop="CostPrice">
              <el-input-number
                v-model="tempForm.CostPrice"
                :precision="2"
                :step="0.1"
                :min="0.0"
                :max="1500"
              ></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              v-bind:label="$t('Items.PurchaseCost')"
              prop="OtherPrice"
            >
              <el-input-number
                v-model="tempForm.OtherPrice"
                :precision="2"
                :step="0.1"
                :min="0.0"
                :max="1500"
              ></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              v-bind:label="$t('Items.SellingPrice')"
              prop="SellingPrice"
            >
              <el-input-number
                v-model="tempForm.SellingPrice"
                :precision="2"
                :step="0.1"
                :min="0.0"
                :max="1500"
              ></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row >
          <el-col :span="12">
            <el-form-item v-bind:label="$t('Items.LowerOrder')" prop="LowOrder">
              <el-input-number
                v-model="tempForm.LowOrder"
                :min="1"
                :max="100000000"
              ></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-bind:label="$t('Items.Tax')" prop="Tax">
              <el-input-number
                v-model="tempForm.Tax"
                :precision="2"
                :step="0.01"
                :min="0.01"
                :max="1"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row >
          <el-col :span="12">
            <el-form-item v-bind:label="$t('Items.Barcode')" prop="Barcode">
              <el-input
                v-model="tempForm.Barcode"
                suffix-icon="fa fa-barcode"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-bind:label="$t('Items.Notes')" prop="Description">
              <el-input
                type="textarea"
                v-model="tempForm.Description"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="Visibles = false">{{
          $t("permission.cancel")
        }}</el-button>
        <el-button type="primary" @click="updateData()">حفظ</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { Edit, GetItemByID } from "@/api/Item";

export default {
  props: {
    ItemID: {
      type: Number,
      default: undefined
    }
  },

  data() {
    return {
      Visibles: false,
      tempForm: {
        Id: undefined,
        Name: '',
        CostPrice: 0.0,
        SellingPrice: 0.0,
        OtherPrice: 0.0,
        LowOrder: 0,
        Tax: 0.0,
        Rate: 0,
        IsPrime: false,
        Barcode: '',
        Description: ''
      },
      rulesForm: {
        Name: [
          {
            required: true,
            message: 'يجب إدخال إسم ',
            trigger: 'blur'
          },
          {
            minlength: 3,
            maxlength: 50,
            message: 'الرجاء إدخال إسم لا يقل عن 3 أحرف و لا يزيد عن 50 حرف',
            trigger: 'blur'
          }
        ]
      }
    };
  },
  methods: {
    getdata() {
      console.log(this.ItemID);

      GetItemByID({ ID: this.ItemID }).then(response => {
        // handle success
        this.tempForm = response;
        this.Visibles = true;
      });
    },
    updateData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          Edit(this.tempForm)
            .then(response => {
              this.Visibles = false
              this.$notify({
                title: "تم",
                message: 'تم التعديل بنجاح',
                type: 'success',
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
    }
  }
};
</script>

