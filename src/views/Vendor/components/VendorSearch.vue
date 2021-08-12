<template>
  <el-row style="background: #2f3542; color: white">

    <el-col :span="24">
      <Vendor-Search-Any
        @Set="
          (v) => {
            $router.push({ path: `/Vendor/Edit/${v.Id}` }); // -> /user/123
          }
        "
      />
    </el-col>
  </el-row>
</template>
<script>
import AddVendor from "@/components/Vendor/AddVendor.vue";
import VendorSearchAny from "@/components/Vendor/VendorSearchAny.vue";

export default {
  name: "VendorSearch",
  components: { AddVendor, VendorSearchAny },
};
</script>
