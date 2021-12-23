
<template>
  <div class="app-container">
   <driver-card/>
  </div>
</template>

<script>
import DriverCard from "./components/CustomerCard.vue";
export default {
  name: "DeliveryPage",
  components: {
    DriverCard
  },
  data() {
    return {
      list: [],
      Driver:{
        Id:1,
        Name:"driver name",
      },
    };
  },
  created() {
     //this.getdata();
  },
  methods: {

  },
};
</script>
