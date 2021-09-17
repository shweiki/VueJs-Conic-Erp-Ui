<template>
  <Salary-Details :is-edit="true" />
</template>

<script>
import SalaryDetails from '../Components/SalaryDetails.vue'

export default {
  name: 'SalaryDetails',
  components: { SalaryDetails }
}
</script>