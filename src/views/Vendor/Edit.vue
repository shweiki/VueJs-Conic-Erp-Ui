<template>
  <Profile :is-edit="true" />
</template>

<script>
import Profile from "./components/Profile.vue";

export default {
  name: "Edit",
  components: { Profile },
};
</script>
