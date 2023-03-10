<template>
  <div>
    <SuperMarket
      v-if="$store.getters.settings.PointOfSale.Layout == 'SuperMarket'"
      :is-edit="true"
    />
    <CarsSpare
      v-if="$store.getters.settings.PointOfSale.Layout == 'CarsSpare'"
      :is-edit="true"
    />
    <Restaurant
      v-if="$store.getters.settings.PointOfSale.Layout == 'Restaurant'"
      :is-edit="true"
    />
    <Pharmacy
      v-if="$store.getters.settings.PointOfSale.Layout == 'Pharmacy'"
      :is-edit="true"
    />
    <Gym v-if="$store.getters.settings.PointOfSale.Layout == 'Gym'" :is-edit="true" />
    <KidsPlayArea
      v-if="$store.getters.settings.PointOfSale.Layout == 'KidsPlayArea'"
      :is-edit="true"
    />
    <Public
      v-if="$store.getters.settings.PointOfSale.Layout == 'Public'"
      :is-edit="true"
    />
     <BillOfEntery
      v-if="$store.getters.settings.PointOfSale.Layout == 'BillOfEntery'"
      :is-edit="true"
    />
  </div>
</template>

<script>
import SuperMarket from "./components/SuperMarket";
import CarsSpare from "./components/CarsSpare";
import Restaurant from "./components/Restaurant";
import Pharmacy from "./components/Pharmacy.vue";
import Gym from "./components/Gym.vue";
import KidsPlayArea from "./components/KidsPlayArea.vue";

import Public from "./components/Public.vue";
import BillOfEntery from "./components/Public.vue";

export default {
  name: "EditInvoice",
  components: { SuperMarket, CarsSpare, Restaurant, Pharmacy, Gym, Public, KidsPlayArea ,BillOfEntery},
};
</script>
