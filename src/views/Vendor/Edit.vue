<template>
  <Profile :is-edit="true" />
</template>

<script>
import Profile from './components/Profile.vue'

export default {
  name: 'EditVendor',
  components: { Profile }
}
</script>