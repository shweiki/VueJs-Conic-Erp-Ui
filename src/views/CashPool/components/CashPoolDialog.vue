<template>
  <div>
    <el-dialog
      style="margin-top: -14vh"
      title="تأكيد"
      :visible.sync="Show"
      width="40%"
      center
      :show-close="false"
      :before-close="handleClose"
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
        <span style="color: #ff5722; font-size: large"
          >مبيعات النقدية :
          {{ Totals.Cash.toFixed($store.getters.settings.ToFixed) }}
        </span>
        <el-divider></el-divider>

        <span style="color: #ff5722; font-size: large"
          >مبيعات الفيزا :
          {{ Totals.Visa.toFixed($store.getters.settings.ToFixed) }}
        </span>
        <el-divider></el-divider>

        <span style="color: #ff5722; font-size: large"
          >مجموع المبيعات :
          {{ Totals.Totals.toFixed($store.getters.settings.ToFixed) }}
        </span>
        <el-divider></el-divider>
        <el-form ref="F-CashPool" :model="tempForm">
          <el-row type="flex">
            <el-col :span="12">
              <span style="font-size: large"> إجمالي عد الورق :</span>
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
              <span style="font-size: large">إجمالي عد المعدن :</span>
            </el-col>
            <el-col :span="12">
              <currency-input
                class="currency-input"
                v-model="tempForm.TotalCoins"
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
                    trigger: 'blur',
                  },
                ]"
                label="ملاحظات"
              >
                <Description @Set="(v) => (tempForm.Description = v)" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex">
            <el-col :span="24">
              <el-form-item
                prop="EditorName"
                :rules="[
                  {
                    required: true,
                    message: 'لايمكن ترك محرر السند فارغ',
                    trigger: 'blur',
                  },
                ]"
                v-bind:label="$t('AddVendors.EditorName')"
              >
                <Editors-User @Set="(v) => (tempForm.EditorName = v)" />
              </el-form-item>
            </el-col>
          </el-row>
          <span style="color: #ff5722; font-size: x-large"
            >النتيجة :
            {{
              (
                tempForm.TotalCash +
                tempForm.TotalCoins +
                tempForm.TotalVisa +
                tempForm.TotalReject +
                tempForm.TotalRestitution +
                tempForm.TotalOutlay -
                Totals.Totals
              ).toFixed($store.getters.settings.ToFixed)
            }}
            ({{
              tempForm.TotalCash +
                tempForm.TotalCoins +
                tempForm.TotalVisa +
                tempForm.TotalReject +
                tempForm.TotalRestitution +
                tempForm.TotalOutlay -
                Totals.Totals >=
              0
                ? tempForm.TotalCash +
                    tempForm.TotalCoins +
                    tempForm.TotalVisa +
                    tempForm.TotalReject +
                    tempForm.TotalRestitution +
                    tempForm.TotalOutlay -
                    Totals.Totals ==
                  0
                  ? "مطابق"
                  : "زيادة"
                : "نقص"
            }})</span
          >
          <el-divider></el-divider>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import EditorsUser from "@/components/Gym/EditorsUser.vue";
import Description from "@/components/Description/Input.vue";

export default {
  components: { EditorsUser, Description },
  props: ["Data", "Open", "Totals", "Type"],
  watch: {
    Open(val) {
      this.Show = val;
    },
  },
  data() {
    return {
      Show: false,
      tempForm: {
        Id: undefined,
        Type: this.Type,
        TotalCash: 0,
        TotalCoins: 0,
        TotalVisa: 0,
        TotalReject: 0,
        TotalOutlay: 0,
        TotalRestitution: 0,
        Status: 0,
        Description: "",
        EditorName: "",
        TableName: this.Type,
        Fktable: this.Data.map((x) => x.Id),
      },
    };
  },
  methods: {
    restForm() {
      this.tempForm = {
        Id: undefined,
        Type: this.Type,
        TotalCash: 0,
        TotalCoins: 0,
        TotalVisa: 0,
        TotalReject: 0,
        TotalOutlay: 0,
        TotalRestitution: 0,
        Status: 0,
        Description: "",
        EditorName: "",
        TableName: this.Type,
        Fktable: this.Data.map((x) => x.Id),
      };
    },
    createData() {
      this.$refs["F-CashPool"].validate((valid) => {
        if (valid && this.Data.length > 0) {
          this.tempForm.TableName = this.Type;
          this.tempForm.Totals = this.Totals;
          this.tempForm.DateTime = new Date();
          this.tempForm.Fktable = this.Data.map((x) => x.Id).toString();
          this.$emit("Done", this.tempForm);
        } else {
          console.log(valid);
          return false;
        }
      });
    },
    handleClose(done) {
      this.$confirm("هل انت متاكد من الخروج")
        .then((_) => {
          this.Show = false;
          this.$emit("Closed");
          done();
        })
        .catch((_) => {});
    },
  },
};
</script>
