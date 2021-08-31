<template>
  <div>
    <Public v-if="$store.getters.settings.Payment.Layout == 'Public'" :is-edit="false" />
  </div>
</template>

<script>
import Public from "./components/Public.vue";

export default {
  name: "CreatePayment",
  components: { Public },
};
</script>
