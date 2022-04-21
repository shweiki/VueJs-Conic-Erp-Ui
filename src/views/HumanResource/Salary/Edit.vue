<template>
  <Salary-Details :is-edit="true" />
</template>

<script>
import SalaryDetails from './Components/SalaryDetails.vue'

export default {
  name: 'Salary',
  components: { SalaryDetails }
}
</script>