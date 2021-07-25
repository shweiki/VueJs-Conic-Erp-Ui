<template>
  <el-row type="flex">
    <el-col :span="10">
      <el-input v-model="name" @change="SetVal" placeholder="الاسم" />
    </el-col>
    <el-col :span="8">
      <select-region
        :Value="region"
        @SetRegion="
          v => {
            region = v;
            SetVal();
          }
        "
        @SetDeliveryPrice="
          v => {
            DelievryPrice = v;
            SetVal();
          }
        "
      />
    </el-col>
    <el-col :span="6">
      <el-input v-model="phone" @change="SetVal" placeholder="رقم الهاتف" />
    </el-col>
  </el-row>
</template>

<script>
import SelectRegion from "@/components/Regions/SelectRegion";
export default {
  components: { SelectRegion },
  props: {
    region: String,
    DelievryPrice: Number,
    name: String,
    phone: String
  },
  watch: {
    name(val) {
      this.name = val;
    },
    phone(val) {
      this.phone = val;
    },
    region(val) {
      this.region = val;
    },
    DelievryPrice(val) {
      this.DelievryPrice = val;
    }
  },
  methods: {
    SetVal() {
      this.$emit("SetRegion", this.region);
      this.$emit("SetDeliveryPrice", this.DelievryPrice);
      this.$emit("SetPhoneNumber", this.phone);
      this.$emit("SetName", this.name);
    }
  }
};
</script>
