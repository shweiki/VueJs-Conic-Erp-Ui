<template>
  <div>
    <el-col :span="24">
      <el-select @change="SetVal" v-model="value" filterable placeholder="التسوية">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
          <span style="float: left">{{ item.label }}</span>
          <span style="float: right; color: #8492a6; font-size: 13px">{{
            item.amount
          }}</span>
        </el-option>
      </el-select>
    </el-col>
  </div>
</template>
<script>
import { GetAdjustmentLabel } from "@/api/Adjustment";
export default {
  props: ["Value", "GrossSalary"],
  data() {
    return {
      value: 1,
      options: [],
    };
  },
  watch: {
    Value(val) {
      if (val != null && val != undefined) {
        this.value = this.options.find((element) => element.value == val).value;
        this.SetVal(this.value);
      }
    },
    GrossSalary(val) {
      if (val > 0) {
        this.GrossSalary = val;
        this.SetVal(this.value);
      } else this.GrossSalary = 0;
    },
  },
  mounted() {
    this.getdata();
  },
  methods: {
    getdata() {
      this.loading = true;
      GetAdjustmentLabel()
        .then((res) => {
          this.options = res;
          this.SetVal(this.value);
          this.loading = false;
        })
        .catch((error) => {
          // handle error
          console.log(error);
        });
    },
    SetVal(val) {
      if (val) {
        let dis = this.options.find((obj) => obj.value == val);
        this.$emit("SetAdjustment", dis.value);
        this.$emit(
          "SetAdjustmentAmount",
          dis.type == "Percentage" ? dis.amount * this.GrossSalary : dis.amount
        );
      }
    },
  },
};
</script>
