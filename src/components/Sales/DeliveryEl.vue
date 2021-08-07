<template>
  <el-row type="flex">
    <el-col :span="10">
      <el-input v-model="vName" @change="SetVal" placeholder="الاسم" />
    </el-col>
    <el-col :span="8">
      <Select-Region
        :Value="region"
        @SetRegion="
          v => {
            vRegion = v;
            SetVal();
          }
        "
        @SetDeliveryPrice="
          v => {
            vDelievryPrice = v;
            SetVal();
          }
        "
      />
    </el-col>
    <el-col :span="6">
      <el-input v-model="vPhone" @change="SetVal" placeholder="رقم الهاتف" />
    </el-col>
  </el-row>
</template>

<script>
import SelectRegion from "@/components/Regions/SelectRegion.vue";
export default {
  components: { SelectRegion },
  props: {
    region: String,
    DelievryPrice: Number,
    name: String,
    phone: String
  },
  data() {
    return {
      vName: "",
      vPhone: "",
      vRegion: "",
      vDelievryPrice: 0
    };
  },
  watch: {
    name(val) {
      this.vName = val;
    },
    phone(val) {
      this.vPhone = val;
    },
    region(val) {
      this.vRegion = val;
    },
    DelievryPrice(val) {
      this.vDelievryPrice = val;
    }
  },
  methods: {
    SetVal() {
      this.$emit("SetRegion", this.vRegion);
      this.$emit("SetDeliveryPrice", this.vDelievryPrice);
      this.$emit("SetPhoneNumber", this.vPhone);
      this.$emit("SetName", this.vName);
    }
  }
};
</script>
