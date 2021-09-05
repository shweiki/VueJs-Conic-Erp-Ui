<template>
  <div>
    <Public v-if="$store.getters.settings.Visit.Layout == 'Public'" :is-edit="true" />
  </div>
</template>

<script>
import Public from "./components/Public.vue";

export default {
  name: "EditVisit",
  components: { Public },
};
</script>
