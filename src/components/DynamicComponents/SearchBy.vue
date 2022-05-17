<template>
  <el-row type="flex">
    <!-- <component v-bind="linkProps(to)">
    <slot />
  </component> -->
    <el-col :span="14">
      <el-radio-group v-model="SearchType" text-color="#f78123">
        <el-radio label="MemberSearchAny" border>مشتركين</el-radio>
        <el-radio label="VendorSearchAny" border>عملاء</el-radio>
        <el-radio label="EmployeeSearchAny" border>موظفين</el-radio>
        <el-radio label="AccountSearchBar" border>حسابات</el-radio>
      </el-radio-group></el-col
    >
    <el-col :span="10">
      <component
        :is="SearchType"
        @Set="
          (v) => {
            linkProps(v);
          }
        "
        :Id="AccountId"
      >
        <slot /> </component
    ></el-col>
  </el-row>
</template>

<script>
// import { isExternal } from "@/utils/validate";
import AccountSearchBar from "@/components/TreeAccount/AccountSearchBar.vue";

//import AccountSearchAny from "@/components/TreeAccount/AccountSearchAny.vue";
import MemberSearchAny from "@/components/Member/MemberSearchAny.vue";
import EmployeeSearchAny from "@/components/HumanResource/EmployeeSearchAny.vue";
import VendorSearchAny from "@/components/Vendor/VendorSearchAny.vue";
export default {
  components: {
    AccountSearchBar,
    //AccountSearchAny,
    MemberSearchAny,
    EmployeeSearchAny,
    VendorSearchAny,
  },
  data() {
    return {
      SearchType: "AccountSearchBar",
      Emp: "/HumanResource/Edit",
      Member: "/Gym/Edit",
      Path: "",
    };
  },

  props: {
    Type: {
      type: String,
      required: true,
    },
    AccountId: {
      Type: Number,
    },
  },

  methods: {
    linkProps(val) {
      if (this.Type == "EmployeeSearchAny") {
        this.$router.push({ path: `${this.Emp}/${val.Id}` });
      }

      if (this.Type == "MemberSearchAny") {
        this.$router.push({ path: `${this.Member}/${val.Id}` });
      }

      if (this.Type == "AccountSearchBar" || this.Type == "AccountSearchAny") {
        this.$emit("Set", val);
      }

      if (this.Type == "VendorSearchAny") {
        this.$emit("Set", val);
      }
    },
  },
};
</script>
