<template>
  <div>
    <el-col :span="6">
      <add-adjustment/>
    </el-col>
    <el-col :span="18">
      <el-select @change="SetVal" v-model="AdTemp" filterable placeholder="التسوية">
        <el-option
          v-for="item in AdTemps"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
          <span style="float: left">{{ item.label }}</span>
          <span style="float: right; color: #8492a6; font-size: 13px">{{
            item.value
          }}</span>
        </el-option>
      </el-select>
    </el-col>
  </div>
</template>
<script>
import AddAdjustment from "./AddAdjustment.vue";
import { GetAdjustmentLabel } from "@/api/Adjustment";
export default {
  components: { AddAdjustment },
  props: ["Value"],
  data() {
    return {
      
      AdTemp: 1,
      AdTemps: [],
      Price: 0.0,
    };
  },
  watch: {
    Value(val) {
      console.log("select", val);

      if (val != null && val != undefined) {
        this.AdTemp = this.AdTemps.find((element) => element.label == val).value;
        this.SetVal(this.AdTemp);
      }
    },
  },
  mounted() {
    this.getdata();
  },
  methods: {
    getdata() {
      this.loading = true;
       GetAdjustmentLabel().then(res => {
        this.AdTemps = res;
        this.SetVal(this.AdTemp);
        this.loading = false;
        })
        .catch((error) => {
          // handle error
          console.log(error);
        });
    },
    SetVal(val) {
      if (val) {
        this.$emit(
          "SetAdjustment",
          this.AdTemps.find((element) => element.value == val).label
        );
        // this.$emit(
        //   "SetAdjustmentAmount",
        //   this.AdTemps.find((element) => element.value == val).amount
        // );
      }
    },
  },
};
</script>
