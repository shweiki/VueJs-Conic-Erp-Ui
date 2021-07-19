<template>
  <Profile :is-edit="true" />
</template>

<script>
import Profile from './components/Profile.vue'

export default {
  name: 'EditMember',
  components: { Profile }
}
</script>