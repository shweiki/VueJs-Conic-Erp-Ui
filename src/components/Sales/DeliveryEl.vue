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
          }
        "
        @SetDeliveryPrice="
          v => {
            this.deliveryprice = v;
          }
        "
      />
    </el-col>
    <el-col :span="6">
      <el-input
        style="border-radius: 30px"
        v-model="phone"
        @change="SetVal"
        placeholder="رقم الهاتف"
      />
    </el-col>
  </el-row>
</template>

<script>
import SelectRegion from "@/components/Regions/SelectRegion";
export default {
  components: { SelectRegion },
  props: {
    region: String,
    deliveryprice: Number,
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
   
    deliveryprice(val) {
      this.deliveryprice = val;
      this.SetVal();
    }
  },
  methods: {
    SetVal() {
      this.$emit("SetRegion", this.region);
      this.$emit("SetDeliveryPrice", this.deliveryprice);
      this.$emit("SetPhoneNumber", this.phone);
      this.$emit("SetName", this.name);
    }
  }
};
</script>
