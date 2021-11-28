<template>
  <div>
    <Public v-if="$store.getters.settings.Purchase.Layout == 'Public'" :is-edit="false" />
    <Pharmacy
      v-if="$store.getters.settings.Purchase.Layout == 'Pharmacy'"
      :is-edit="false"
    />
  </div>
</template>

<script>
import Public from "./components/Public.vue";
import Pharmacy from "./components/Pharmacy.vue";

export default {
  name: "CreateInvoice",
  components: { Public, Pharmacy },
};
</script>
