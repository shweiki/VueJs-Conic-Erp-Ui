<template>
  <div>
    <Public v-if="$store.getters.settings.Purchase.Layout == 'Public'" :is-edit="true" />
    <Pharmacy
      v-if="$store.getters.settings.Purchase.Layout == 'Pharmacy'"
      :is-edit="true"
    />
  </div>
</template>

<script>
import Public from "./components/Public.vue";
import Pharmacy from "./components/Pharmacy.vue";

export default {
  name: "EditInvoice",
  components: { Public, Pharmacy },
};
</script>
