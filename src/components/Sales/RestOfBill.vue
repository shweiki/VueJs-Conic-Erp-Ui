<template>
  <div>
    <el-dialog title="تأكيد" :visible.sync="Show" width="40%" center>
      <div style="text-align: center">
        <span style="font-size: large"
          >إجمالي مبلغ الفاتورة :
          {{ Total.toFixed(2) }}
          JOD</span
        >
        <el-divider></el-divider>

        <currency-input
          class="currency-input"
          v-model="RestOfBill"
          @focus="$event.target.select()"
        />
        <el-divider></el-divider>

        <span style="color: #ff5722; font-size: x-large"
          >الباقي :
          {{ (Total - RestOfBill).toFixed(2) }}
          JOD</span
        >
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="Show = false">الغاء</el-button>
        <el-button type="primary" @click="isEdit != true ? createData() : updateData()"
          >حفظ</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  props: {
    Total: Number,
    Open : Boolean
  },
  watch(){Open(val){
if (val) {

}
  }},
  data() {
    return { Show: false,
    RestOfBill : 0 };
  },
};
</script>
