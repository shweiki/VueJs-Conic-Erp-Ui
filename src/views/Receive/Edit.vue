<template>
  <div>
    <Public v-if="$store.getters.settings.Receive.Layout == 'Public'" :is-edit="true" />
  </div>
</template>

<script>
import Public from "./components/Public.vue";

export default {
  name: "CreateReceive",
  components: { Public },
};
</script>
