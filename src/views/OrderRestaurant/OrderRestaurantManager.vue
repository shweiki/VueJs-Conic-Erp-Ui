<template>
  <div class="app-container">
    <order-cards />
  </div>
</template>

<script>
import OrderCards from "./components/OrderCards.vue";
export default {
  name: "RestaurantManager",
  components: {
    OrderCards,
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
