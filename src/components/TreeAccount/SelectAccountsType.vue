<template>
  <el-select v-model="value" placeholder="نوع الحساب" @change="SetVal">
    <el-option
      v-for="item in List"
      :key="item.value"
      :label="item.label"
      :value="item.value"
    ></el-option>
  </el-select>
</template>
<script>
export default {
  props: {
    Value: String,
  },
  data: () => {
    return {
      List: [
        {
          label: "رئيسي",
          value: "Main",
        },
        {
          label: "عميل | مورد",
          value: "Vendor",
        },
        {
          label: "مشترك",
          value: "Member",
        },
        {
          label: "ايراد",
          value: "InCome",
        },
        {
          label: "خزينة كاش",
          value: "Cash",
        },
        {
          label: "بنك",
          value: "Bank",
        },
      ],
      value: "Main",
    };
  },

  created() {
    this.value = this.Value;
  },
  watch: {
    Value(v) {
      console.log(v);
      this.SetVal(v);
    },
  },
  methods: {
    SetVal(value) {
      this.value = value;
      this.$emit("Set", value);
    },
  },
};
</script>
