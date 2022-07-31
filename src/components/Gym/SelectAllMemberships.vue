<template>
  <el-select v-model="value" @change="SetVal" placeholder="اشتراكات" clearable>
    <el-option
      v-for="item in options"
      :key="item.Id"
      :label="item.Name"
      :value="item.Id"
    ></el-option>
  </el-select>
</template>
<script>
import { GetMembership } from "@/api/Membership";

export default {
  props: ["MembershipId"],
  data() {
    return {
      options: [],
      value: 2,
    };
  },
  watch: {
    MembershipId(val) {
      if (val) this.SetVal(val);
    },
  },
  created() {
    GetMembership()
      .then((response) => {
        this.options = response;
        this.SetVal(response[0].Id);
      })
      .catch((error) => {
        reject(error);
      });
  },
  methods: {
    SetVal(val) {
      this.$emit(
        "Set",
        this.options.find((obj) => obj.Id == val)
      );
      this.value = val;
    },
  },
};
</script>
