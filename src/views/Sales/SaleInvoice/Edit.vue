<template>
  <div>
    <layout1
      v-if="$store.getters.settings.PointOfSaleLayout == 'Layout1'"
      :is-edit="true"
    />
    <layout2
      v-if="$store.getters.settings.PointOfSaleLayout == 'Layout2'"
      :is-edit="true"
    />
    <Restaurant
      v-if="$store.getters.settings.PointOfSaleLayout == 'Restaurant'"
      :is-edit="true"
    />
    <Pharmacy
      v-if="$store.getters.settings.PointOfSaleLayout == 'Pharmacy'"
      :is-edit="true"
    />
    <Gym
      v-if="$store.getters.settings.PointOfSaleLayout == 'Gym'"
      :is-edit="true"
    />
    <Public
      v-if="$store.getters.settings.PointOfSaleLayout == 'Public'"
      :is-edit="true"
    />
  </div>
</template>

<script>
import Layout1 from "./components/Layout1";
import Layout2 from "./components/Layout2";
import Restaurant from "./components/Restaurant";
import Pharmacy from "./components/Pharmacy.vue";
import Gym from "./components/Gym.vue";
import Public from "./components/Public.vue";

export default {
  name: "EditInvoice",
  components: { Layout1, Layout2, Restaurant, Pharmacy, Gym, Public }
};
</script>



