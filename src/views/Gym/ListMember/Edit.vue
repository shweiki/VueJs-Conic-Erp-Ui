<template>
  <Profile :is-edit="true" />
</template>

<script>
import Profile from './components/Profile'

export default {
  name: 'EditMember',
  components: { Profile }
}
</script>