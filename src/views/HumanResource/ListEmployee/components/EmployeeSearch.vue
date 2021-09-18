<template>
  <el-row style="background: #2f3542; color: white">
    <el-col :span="6">
      <add-employee />
    </el-col>
    <el-col :span="14">
      <Search-By Type="EmployeeSearchAny"  />
      
      
    </el-col>
  </el-row>
</template>
<script>
import AddEmployee from "@/components/HumanResource/Employee/AddEmployee.vue";
import SearchBy from "@/components/DynamicComponents/SearchBy";

export default {
  name: "EmployeeSearch",
  components: { AddEmployee, SearchBy },
};
</script>
