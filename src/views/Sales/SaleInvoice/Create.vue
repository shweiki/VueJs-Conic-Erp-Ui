﻿<template>
  <div>
    <SuperMarket
      v-if="$store.getters.settings.PointOfSale.Layout == 'SuperMarket'"
      :is-edit="false"
    />
    <CarsSpare
      v-if="$store.getters.settings.PointOfSale.Layout == 'CarsSpare'"
      :is-edit="false"
    />
    <Restaurant
      v-if="$store.getters.settings.PointOfSale.Layout == 'Restaurant'"
      :is-edit="false"
    />
    <Pharmacy
      v-if="$store.getters.settings.PointOfSale.Layout == 'Pharmacy'"
      :is-edit="false"
    />
    <Gym v-if="$store.getters.settings.PointOfSale.Layout == 'Gym'" :is-edit="false" />

    <KidsPlayArea
      v-if="$store.getters.settings.PointOfSale.Layout == 'KidsPlayArea'"
      :is-edit="false"
    />
    <Public
      v-if="$store.getters.settings.PointOfSale.Layout == 'Public'"
      :is-edit="false"
    />
    <BillOfEntery
      v-if="$store.getters.settings.PointOfSale.Layout == 'BillOfEntery'"
      :is-edit="false"
    />
  </div>
</template>

<script>
import SuperMarket from './components/SuperMarket'
import CarsSpare from './components/CarsSpare'
import Restaurant from './components/Restaurant'
import Pharmacy from './components/Pharmacy.vue'
import Gym from './components/Gym.vue'
import KidsPlayArea from './components/KidsPlayArea.vue'
import Public from './components/Public.vue'
import BillOfEntery from './components/BillOfEntery.vue'

export default {
  name: 'CreateInvoice',
  components: { SuperMarket, CarsSpare, Restaurant, Pharmacy, Gym, Public, KidsPlayArea, BillOfEntery }
}
</script>
