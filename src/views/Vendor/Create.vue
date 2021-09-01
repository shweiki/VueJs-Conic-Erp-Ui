<template>
  <Profile :is-edit="false" />
</template>

<script>
import Profile from "./components/Profile.vue";

export default {
  name: "CreateVendor",
  components: { Profile },
};
</script>
