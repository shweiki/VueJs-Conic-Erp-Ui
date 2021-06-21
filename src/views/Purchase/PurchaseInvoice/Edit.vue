<template>
  <div>
    <SuperMarket
      v-if="$store.getters.settings.PurchaseLayout == 'SuperMarket'"
      :is-edit="true"
    />
    <Pharmacy
      v-if="$store.getters.settings.PurchaseLayout == 'Pharmacy'"
      :is-edit="true"
    />
  </div>
</template>

<script>
import SuperMarket from "./components/SuperMarket.vue";
import Pharmacy from "./components/Pharmacy.vue";

export default {
  name: "EditInvoice",
  components: { SuperMarket, Pharmacy }
};
</script>



