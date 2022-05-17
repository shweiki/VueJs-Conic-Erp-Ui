<template>
  <el-row style="background: #2f3542; color: white">
    <el-col :span="6">
      <add-employee />
    </el-col>
    <el-col :span="14">
      <EmployeeSearchAny
        @Set="(v) => $router.push({ path: `/HumanResource/Edit/` + v.Id })"
      />
    </el-col>
  </el-row>
</template>
<script>
import AddEmployee from "@/components/HumanResource/Employee/AddEmployee.vue";
import EmployeeSearchAny from "@/components/HumanResource/EmployeeSearchAny.vue";

export default {
  name: "EmployeeSearch",
  components: { AddEmployee, EmployeeSearchAny },
};
</script>
