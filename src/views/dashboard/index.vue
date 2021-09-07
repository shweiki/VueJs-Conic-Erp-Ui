<template>
  <div>
    <Public v-if="$store.getters.settings.Dashboard.Layout == 'Public'" />

    <Gym v-if="$store.getters.settings.Dashboard.Layout == 'Gym'" />
  </div>
</template>

<script>
import Gym from "./components/Gym.vue";
import Public from "./components/Public.vue";

export default {
  name: "Dashboard",
  components: { Public, Gym },
};
</script>
