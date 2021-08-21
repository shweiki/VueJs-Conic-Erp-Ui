<template>
  <div>
    <el-dialog
      style="margin-top: -14vh"
      title="تأكيد"
      :visible.sync="Show"
      width="40%"
      center
      :show-close="false"
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
          <el-divider> إغلاق صندوق </el-divider>
        </el-col>
      </div>
      <div style="text-align: center">
        <span style="color: #ff5722; font-size: x-large"
          >النتيجة :
          {{
            tempForm.TotalCash +
              tempForm.TotalVisa +
              tempForm.TotalReject +
              tempForm.TotalRestitution +
              tempForm.TotalOutlay -
              Total
          }}
          ({{
            tempForm.TotalCash +
              tempForm.TotalVisa +
              tempForm.TotalReject +
              tempForm.TotalRestitution +
              tempForm.TotalOutlay -
              Total >=
            0
              ? tempForm.TotalCash +
                  tempForm.TotalVisa +
                  tempForm.TotalReject +
                  tempForm.TotalRestitution +
                  tempForm.TotalOutlay -
                  Total ==
                0
                ? "مطابق"
                : "زيادة"
              : "نقص"
          }})</span
        >
        <el-divider></el-divider>
        <el-form ref="F-CashPool" :model="tempForm">
          <el-row type="flex">
            <el-col :span="12">
              <span style="font-size: large">إجمالي مبلغ النقدي :</span>
            </el-col>
            <el-col :span="12">
              <currency-input
                class="currency-input"
                v-model="tempForm.TotalCash"
                @focus="$event.target.select()"
            /></el-col>
          </el-row>
          <el-row type="flex">
            <el-col :span="12">
              <span style="font-size: large">إجمالي مبلغ فيزا :</span>
            </el-col>
            <el-col :span="12">
              <currency-input
                class="currency-input"
                v-model="tempForm.TotalVisa"
                @focus="$event.target.select()"
            /></el-col>
          </el-row>
          <el-row type="flex">
            <el-col :span="12">
              <span style="font-size: large">إجمالي مبلغ الملغي :</span>
            </el-col>
            <el-col :span="12">
              <currency-input
                class="currency-input"
                v-model="tempForm.TotalReject"
                @focus="$event.target.select()"
            /></el-col>
          </el-row>
          <el-row type="flex">
            <el-col :span="12">
              <span style="font-size: large">إجمالي سحوبات :</span>
            </el-col>
            <el-col :span="12">
              <currency-input
                class="currency-input"
                v-model="tempForm.TotalOutlay"
                @focus="$event.target.select()"
            /></el-col>
          </el-row>
          <el-row type="flex">
            <el-col :span="12">
              <span style="font-size: large">إجمالي التعويضات :</span>
            </el-col>
            <el-col :span="12">
              <currency-input
                class="currency-input"
                v-model="tempForm.TotalRestitution"
                @focus="$event.target.select()"
            /></el-col>
          </el-row>
          <el-row type="flex">
            <el-col :span="24">
              <el-form-item
                prop="Description"
                :rules="[
                  {
                    required: true,
                    message: 'لايمكن ترك محرر السند فارغ',
                    trigger: 'blur'
                  }
                ]"
                v-bind:label="$t('AddVendors.EditorName')"
              >
                <Editors-User @Set="v => (tempForm.Description = v)" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import EditorsUser from "@/components/Gym/EditorsUser.vue";
import { Create } from "@/api/CashPool";

export default {
  components: { EditorsUser },
  props: ["Data", "Open", "Total"],
  watch: {
    Open(val) {
      this.Show = val;
    }
  },
  data() {
    return {
      Show: false,

      tempForm: {
        Id: undefined,
        Type: this.Type,
        TotalCash: 0,
        TotalVisa: 0,
        TotalReject: 0,
        TotalOutlay: 0,
        TotalRestitution: 0,
        Status: 0,
        Description: "",
        TableName: this.Type,
        Fktable: this.Data.map(x => x.Id)
      }
    };
  },
  methods: {
    createData() {
      this.$refs["F-CashPool"].validate(valid => {
        if (valid) {
          Create(this.tempForm).then(res => {
            if (res) {
              this.$emit("Done");
            } else {
            }
          });
        } else {
          console.log(valid);
          return false;
        }
      });
    },
    onChange(input) {
      this.RestOfBill = input;
    },
    onKeyPress(button) {
      if (button == "{enter}") {
        this.RestOfBill = 0;
        this.$emit("Done");
      }
    },
    onInputChange(input) {
      //  console.log(input);
      this.RestOfBill = input;
    }
  }
};
</script>
