<template>
  <div>
    <el-button
      style="width: 100px;"
      type='success'
      icon="el-icon-plus"
      @click="Visibles = true"
    >إضافة قيد</el-button>
    <el-dialog style="margin-top: -13vh" title="تسجيل قيد محاسبي" :visible.sync="Visibles">
      <el-form label-position="top" :model="tempForm" ref="dataForm" class="demo-form-inline">
        <el-row >
          <el-col :span="12">
            <el-form-item
              prop="Type"
              v-bind:label="$t('OrderInventories.OrderType')"
              :rules="[{ required: true, message: 'يجب تحديد نوع سند', trigger: 'blur' }]"
            >
              <el-radio-group v-model="Type">
                <el-radio-button label="Credit">مدين</el-radio-button>
                <el-radio-button label="Debit">دائن</el-radio-button>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="Value" label="القيمة">
              <el-input-number v-model="Value" :min="0.01" :max="100000"></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row >
          <el-col :span="24">
            <el-form-item
              prop="Description"
              :rules="[{ required: true, message: 'لايمكن ترك ملاحظات فارغ', trigger: 'blur' } ]"
              v-bind:label="$t('AddVendors.Description')"
            >
              <el-input v-model="tempForm.Description"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="Visibles = false">{{$t('AddVendors.Cancel')}}</el-button>
        <el-button :disabled="EnableSave" type="primary" @click="create()">{{$t('AddVendors.Save')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { CreateEntry } from "@/api/EntryAccounting";

export default {
  props: {
    AccountId1: {
      type: Number,
      default: 0,
    },
    AccountId2: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      EnableSave: false,
      Value: 1,
      Type:"Credit",
      tempForm: {
        Id: undefined,
        FakeDate: new Date(),
        Description: '',
        Type: "Manual",
        EntryMovements: [
          {
            Id: undefined,
            AccountId: undefined,
            Debit: 0.0,
            Credit: 0.0,
            Description: '',
            EntryId: undefined,
          },
          {
            Id: undefined,
            AccountId: undefined,
            Debit: 0.0,
            Credit: 0.0,
            Description: '',
            EntryId: undefined,
          },
        ],
      },
      Visibles: false,
    };
  },
  methods: {
    create() {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          this.EnableSave = true;
          this.tempForm.EntryMovements[0].AccountId = this.AccountId1;
          this.tempForm.EntryMovements[0].Description = this.tempForm.Description;
        this.Type =="Credit" ?  this.tempForm.EntryMovements[0].Debit = this.Value : this.tempForm.EntryMovements[0].Credit = this.Value
        this.Type =="Credit" ?  this.tempForm.EntryMovements[1].Credit = this.Value : this.tempForm.EntryMovements[1].Debit = this.Value

          this.tempForm.EntryMovements[1].AccountId = this.AccountId2;
          this.tempForm.EntryMovements[1].Description = this.tempForm.Description;

          CreateEntry(this.tempForm).then((response) => {
            if (response) {
              this.Visibles = false
              this.EnableSave = false;

              this.$notify({
                title: "تم ",
                message: "تم الإضافة بنجاح",
                type: 'success',
                duration: 2000,
              })
              this.$nextTick(() => {
                this.$router.replace({
                  path: "/redirect" + this.$route.fullPath,
                })
              })
            }
          })
        }
      })
    },
  },
};
</script>
