<template>
  <div>
    <layout1
      v-if="$store.getters.settings.PointOfSaleLayout == 'Layout1'"
      :is-edit="false"
    />
    <layout2
      v-if="$store.getters.settings.PointOfSaleLayout == 'Layout2'"
      :is-edit="false"
    />
    <layout3
      v-if="$store.getters.settings.PointOfSaleLayout == 'Layout3'"
      :is-edit="false"
    />
    <Pharmacy
      v-if="$store.getters.settings.PointOfSaleLayout == 'Pharmacy'"
      :is-edit="false"
    />
    <Gym
      v-if="$store.getters.settings.PointOfSaleLayout == 'Gym'"
      :is-edit="false"
    />
        <Public
      v-if="$store.getters.settings.PointOfSaleLayout == 'Public'"
      :is-edit="false"
    />
    
  </div>
</template>

<script>
import Layout1 from "./components/Layout1";
import Layout2 from "./components/Layout2";
import Layout3 from "./components/Layout3";
import Pharmacy from "./components/Pharmacy.vue";
import Gym from "./components/Gym.vue";
import Public from "./components/Public.vue";


export default {
  name: "CreateInvoice",
  components: { Layout1, Layout2, Layout3, Pharmacy, Gym ,Public}
};
</script>

