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
            :loading="createLoading"
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
        <div v-permission="['admin']">
          <span
            style="color: #ff5722; font-size: large"
          >مبيعات النقدية :
            {{ Totals.Cash.toFixed($store.getters.settings.ToFixed) }}
          </span>
          <el-divider />

          <span
            style="color: #ff5722; font-size: large"
          >مبيعات الفيزا :
            {{ Totals.Visa.toFixed($store.getters.settings.ToFixed) }}
          </span>
          <el-divider />

          <span
            style="color: #ff5722; font-size: large"
          >مجموع المبيعات :
            {{ Totals.Totals.toFixed($store.getters.settings.ToFixed) }}
          </span>
          <el-divider />
        </div>
        <el-form ref="F-CashPool" :model="tempForm">
          <el-row type="flex">
            <el-col :span="12">
              <span style="font-size: large"> إجمالي عد الورق :</span>
            </el-col>
            <el-col :span="12">
              <currency-input
                v-model="tempForm.TotalCash"
                class="currency-input"
                @focus="$event.target.select()"
              /></el-col>
          </el-row>
          <el-row type="flex">
            <el-col :span="12">
              <span style="font-size: large">إجمالي عد المعدن :</span>
            </el-col>
            <el-col :span="12">
              <currency-input
                v-model="tempForm.TotalCoins"
                class="currency-input"
                @focus="$event.target.select()"
              /></el-col>
          </el-row>
          <el-row type="flex">
            <el-col :span="12">
              <span style="font-size: large">إجمالي مبلغ فيزا :</span>
            </el-col>
            <el-col :span="12">
              <currency-input
                v-model="tempForm.TotalVisa"
                class="currency-input"
                @focus="$event.target.select()"
              /></el-col>
          </el-row>
          <el-row type="flex">
            <el-col :span="12">
              <span style="font-size: large">إجمالي مبلغ الملغي :</span>
            </el-col>
            <el-col :span="12">
              <currency-input
                v-model="tempForm.TotalReject"
                class="currency-input"
                @focus="$event.target.select()"
              /></el-col>
          </el-row>

          <el-row v-permission="['admin']" type="flex">
            <el-col :span="12">
              <span style="font-size: large">إجمالي سحوبات :</span>
            </el-col>
            <el-col :span="12">
              <currency-input
                v-model="tempForm.TotalOutlay"
                class="currency-input"
                @focus="$event.target.select()"
              /></el-col>
          </el-row>
          <el-row type="flex">
            <el-col :span="12">
              <span style="font-size: large">إجمالي التعويضات :</span>
            </el-col>
            <el-col :span="12">
              <currency-input
                v-model="tempForm.TotalRestitution"
                class="currency-input"
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
          <span
            v-permission="['admin']"
            style="color: #ff5722; font-size: x-large"
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
            }})</span>
          <el-divider />
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import Description from '@/components/Description/Input.vue'
import permission from '@/directive/permission/index.js'

export default {
  components: { Description },
  directives: { permission },
  props: ['Data', 'Open', 'Totals', 'Type'],
  data() {
    return {
      Show: false,
      createLoading: false,
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
        Description: '',
        TableName: this.Type,
        Fktable: this.Data.map((x) => x.Id)
      }
    }
  },
  watch: {
    Open(val) {
      this.Show = val
    }
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
        Description: '',
        TableName: this.Type,
        Fktable: this.Data.map((x) => x.Id)
      }
    },
    createData() {
      this.$refs['F-CashPool'].validate((valid) => {
        if (valid && this.Data.length > 0) {
          this.createLoading = true
          this.tempForm.TableName = this.Type
          this.tempForm.Totals = this.Totals
          this.tempForm.DateTime = new Date()
          this.tempForm.Fktable = this.Data.map((x) => x.Id).toString()
          this.$emit('Done', this.tempForm)
          this.createLoading = false
        } else {
          console.log(valid)
          return false
        }
      })
    },
    handleClose(done) {
      this.$confirm('هل انت متاكد من الخروج')
        .then((_) => {
          this.Show = false
          this.$emit('Closed')
          done()
        })
        .catch((_) => {})
    }
  }
}
</script>
