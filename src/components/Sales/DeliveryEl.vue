<template>
  <el-row type="flex">
    <el-col :span="10">
      <el-input v-model="vName" placeholder="الاسم" @change="SetVal" />
    </el-col>
    <el-col :span="8">
      <Select-Region
        :value="region"
        @SetRegion="
          (v) => {
            vRegion = v;
            SetVal();
          }
        "
        @SetDeliveryPrice="
          (v) => {
            vDelievryPrice = v;
            SetVal();
          }
        "
      />
    </el-col>
    <el-col :span="6">
      <el-input v-model="vPhone" placeholder="رقم الهاتف" @change="SetVal" />
    </el-col>
  </el-row>
</template>

<script>
import SelectRegion from '@/components/Regions/SelectRegion.vue'
export default {
  components: { SelectRegion },
  props: ['region', 'DelievryPrice', 'name', 'phone'],
  data() {
    return {
      vName: '',
      vPhone: '',
      vRegion: '',
      vDelievryPrice: 0
    }
  },
  watch: {
    name(val) {
      this.vName = val
    },
    phone(val) {
      this.vPhone = val
    },
    region(val) {
      console.log('el-', val)

      if (val != null && val != undefined) {
        this.vRegion = val
      }
    },
    DelievryPrice(val) {
      this.vDelievryPrice = val
    }
  },
  methods: {
    SetVal() {
      this.$emit('SetRegion', this.vRegion)
      this.$emit('SetDeliveryPrice', this.vDelievryPrice)
      this.$emit('SetPhoneNumber', this.vPhone)
      this.$emit('SetName', this.vName)
    }
  }
}
</script>
