<template>
  <el-row style="background: #2f3542; color: white">
    <el-col :span="24">
      <Vendor-Search-Any
        :Id="VendorId"
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
import VendorSearchAny from "@/components/Vendor/VendorSearchAny.vue";

export default {
  props: ["VendorId"],
  name: "VendorSearch",
  components: { VendorSearchAny },
};
</script>
