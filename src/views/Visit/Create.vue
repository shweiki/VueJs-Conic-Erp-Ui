<template>
  <div>
    <Public v-if="$store.getters.settings.Visit.Layout == 'Public'" :is-edit="false" />
  </div>
</template>

<script>
import Public from "./components/Public.vue";

export default {
  name: "CreateVisit",
  components: { Public },
  created() {
    console.log("hereee", this.$store.getters.settings.Visit.Layout);
  },
};
</script>
