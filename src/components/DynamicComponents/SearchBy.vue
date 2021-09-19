
<template>
  
  <!-- <component v-bind="linkProps(to)">
    <slot />
  </component> -->


  <component :is="Type" 
  @Set="
          (v) => {
           linkProps(v)
          }
        ">
    <slot />
  </component>
</template>

<script>
  // import { isExternal } from "@/utils/validate";
  import AccountSearchAny from "@/components/TreeAccount/AccountSearchAny.vue";
  import MemberSearchAny from "@/components/Member/MemberSearchAny.vue";
  import EmployeeSearchAny from "@/components/HumanResource/EmployeeSearchAny.vue";
  import VendorSearchAny from "@/components/Vendor/VendorSearchAny.vue";
export default {
  components: {AccountSearchAny, MemberSearchAny, EmployeeSearchAny, VendorSearchAny},
  data() {
    return {
     Emp:"/HumanResource/Edit",
     Member: "/Gym/Edit",
     Path:"",
    };
    },
  
  props: {
    Type: {
      type: String,
      required: true
    },
    AccountId: {
      Type: Number,
    },

  },


   methods: {
    linkProps(val) {
       if (this.Type == "EmployeeSearchAny"){
       this.$router.push({ path: `${this.Emp}/${val.Id}` });
       };

        if (this.Type == "MemberSearchAny"){
       this.$router.push({ path: `${this.Emp}/${val.Id}` });
       };

        if (this.Type == "AccountSearchAny"){
       this.$emit("Set", val);
       };

       if (this.Type == "VendorSearchAny"){
       this.$emit("Set", val);
       };
 
    }
  }
  
};
</script>
