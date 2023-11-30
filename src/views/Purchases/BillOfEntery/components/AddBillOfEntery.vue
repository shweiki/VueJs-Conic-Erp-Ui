<template>
  <el-popover v-model="visible" placement="left" width="400">
    <el-row type="flex">
      <el-col :span="18">
        <el-button icon="fa fa-save" type="primary" :size="$store.getters.size" @click="Save()" />
      </el-col>

      <el-col :span="6">
        <h4>بيان جمركي</h4>
      </el-col>
    </el-row>

    <el-form-item
      prop="FakeDate"
      :label="$t('NewPurchaseInvoice.ReleaseDate')"
      :rules="[
        {
          required: true,
          message: 'لايمكن ترك التاريخ فارغ',
          trigger: 'blur',
        },
      ]"
    >
      <Fake-Date :value="tempForm.FakeDate" @Set="(v) => (tempForm.FakeDate = v)" />
    </el-form-item>
    <el-form-item prop="BonId" label="رقم البيان">
      <el-input v-model="tempForm.BonId" placeholder="رقم البيان" />
    </el-form-item>
    <div style="text-align: right; margin: 0">
      <el-input
        v-model="tempForm.Description"
        type="textarea"
        :rules="[{ required: true, message: 'لايمكن ترك الخصم فارغ', trigger: 'blur' }]"
      />
    </div>
    <el-button slot="reference" icon="el-icon-circle-plus">بيان جمركي</el-button>
  </el-popover>
</template>

<script>
import FakeDate from '@/components/Date/FakeDate'
import { GetBillOfEnteryByPurchaseId as GetByPurchaseId } from '@/api/BillOfEntery'
export default {
  components: { FakeDate },
  props: ['PurchaseId'],
  data() {
    return {
      visible: false,
      tempForm: {
        Id: undefined,
        BonId: '',
        ItemsIds: [],
        FakeDate: '',
        Description: '',
        Status: 0,
        PurchaseInvoiceId: undefined
      }
    }
  },
  watch: {
    PurchaseId(value) {
      if (value != null && value != undefined && value != '' && value > 0) {
        GetByPurchaseId({ Id: value }).then((res) => {
          this.tempForm = res
          this.$emit('Done', this.tempForm)
        })
      }
    }
  },
  methods: {
    Save() {
      this.visible = false
      this.$emit('Done', this.tempForm)
      this.$notify({
        title: 'تم ',
        message: 'تم الإضافة بنجاح',
        type: 'success',
        duration: 2000
      })
    }
  }
}
</script>
