<template>
  <div class="app-container">
    <delivery-cards />
  </div>
</template>

<script>
import DeliveryCards from "./components/DeliveryCards.vue";
export default {
  name: "DeliveryManager",
  components: {
    DeliveryCards,
  },
  data() {
    return {
      list: [],
    };
  },
  created() {
    //this.getdata();
  },
  methods: {},
};
</script>
