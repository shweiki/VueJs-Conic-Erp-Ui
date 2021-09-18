
<template>
  
  <!-- <component v-bind="linkProps(to)">
    <slot />
  </component> -->


  <component :is="Type" 
  @Set="
          (v) => {
           linkProps(v.Id)
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
     Vendor: "",
     Member: "/Gym/Edit",
     Account: "",
     Path:"",
    };
    },
  
  props: {
    Type: {
      type: String,
      required: true
    }
  },


   methods: {
    linkProps(Id) {
       if (this.Type == "EmployeeSearchAny"){
       this.$router.push({ path: `${this.Emp}/${Id}` });
       };

        if (this.Type == "VendorSearchAny"){
       this.$router.push({ path: `${this.Emp}/${Id}` });
       };

        if (this.Type == "MemberSearchAny"){
       this.$router.push({ path: `${this.Emp}/${Id}` });
       };

        if (this.Type == "AccountSearchAny"){
       this.$router.push({ path: `${this.Emp}/${Id}` });
       }
 
    }
  }
  
};
</script>
