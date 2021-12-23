
<template>
  <div class="app-container">
   <customer-card/>
  </div>
</template>

<script>
import CustomerCard from "./components/CustomerCard.vue";
export default {
  name: "DeliveryPage",
  components: {
    CustomerCard
  },
  data() {
    return {
      list: [],
    };
  },
  created() {
     //this.getdata();
  },
  methods: {

  },
};
</script>
