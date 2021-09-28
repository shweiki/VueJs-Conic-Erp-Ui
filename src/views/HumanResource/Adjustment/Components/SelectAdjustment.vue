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
  props: ["Value", "GrossSalary", "ExtraHours", "DelayHours"],
  data() {
    return {
      value: 1,
      options: [],
    };
  },
  watch: {
    Value(val) {
      if (val != null && val != undefined) {
        this.SetVal(val);
      }
    },
    GrossSalary(val) {
      if (val > 0) {
        this.GrossSalary = val;
      }
    },
    ExtraHours(val) {
      if (val > 0) {
        this.ExtraHours = val;
      }
    },
    DelayHours(val) {
      if (val < 0) {
        this.DelayHours = val;
      }
    },
  },
  mounted() {
    this.getdata();
  },
  methods: {
    getdata() {
      GetAdjustmentLabel()
        .then((res) => {
          this.options = res;
          this.SetVal(this.value);
        })
        .catch((error) => {
          // handle error
          console.log(error);
        });
    },
    SetVal(val) {
      if (val) {
        let dis = this.options.find((obj) => obj.value == val);
        console.log("dis", dis, this.GrossSalary, this.ExtraHours, this.DelayHours);
        this.$emit("SetAdjustment", val);
        if (dis != undefined && dis != null) {
          if (dis.type == "Percentage")
            this.$emit("SetAdjustmentAmount", dis.amount * (this.GrossSalary || 1));
          if (dis.type == "Hours" && dis.amount > 0)
            this.$emit("SetAdjustmentAmount", dis.amount * (this.ExtraHours || 1));
          if (dis.type == "Hours" && dis.amount < 0)
            this.$emit("SetAdjustmentAmount", dis.amount * (-this.DelayHours || 1));
        }
      }
    },
  },
};
</script>
