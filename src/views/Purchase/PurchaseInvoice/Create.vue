<template>
  <div>
    <SuperMarket
      v-if="$store.getters.settings.PurchaseLayout == 'SuperMarket'"
      :is-edit="false"
    />
    <Pharmacy
      v-if="$store.getters.settings.PurchaseLayout == 'Pharmacy'"
      :is-edit="false"
    />
  
  </div>
</template>

<script>
import SuperMarket from "./components/SuperMarket.vue";
import Pharmacy from "./components/Pharmacy.vue";


export default {
  name: "CreateInvoice",
  components: { SuperMarket, Pharmacy }
};
</script>

