<template>
  <div>
    <el-dialog
      style="margin-top: -14vh"
      title="تأكيد"
      :visible.sync="Show"
      width="40%"
      center
      @closed="$emit('Closed')"
      @opened="focus"
    >
      <div style="text-align: center">
        <span style="font-size: large"
          >إجمالي مبلغ الفاتورة :
          {{ Total.toFixed($store.getters.settings.ToFixed) }}
          JOD</span
        >
        <el-divider></el-divider>

        <span style="color: #ff5722; font-size: x-large"
          >الباقي :
          {{ (Total - RestOfBill).toFixed($store.getters.settings.ToFixed) }}
          JOD</span
        >
        <el-divider></el-divider>

        <currency-input
          class="currency-input"
          id="RestOfBill"
          v-model="RestOfBill"
          @focus="$event.target.select()"
          @input="onInputChange"
        />
      </div>
      <touch-keyboard
        @onChange="onChange"
        @onKeyPress="onKeyPress"
        :input="RestOfBill"
      />
    </el-dialog>
  </div>
</template>
<script>
import TouchKeyboard from "@/components/TouchKeyboard";

export default {
  components: { TouchKeyboard },
  props: {
    Total: Number,
    Open: Boolean
  },
  watch: {
    Open(val) {
      this.Show = val;
    }
  },
  data() {
    return { Show: false, RestOfBill: 0 };
  },
  methods: {
    focus() {
      document.getElementById("RestOfBill").focus();
    },
    onChange(input) {
      this.RestOfBill = input;
    },
    onKeyPress(button) {
      if (button == "{enter}") this.$emit("Done");
    },
    onInputChange(input) {
    //  console.log(input);
      this.RestOfBill = input;
    }
  }
};
</script>
