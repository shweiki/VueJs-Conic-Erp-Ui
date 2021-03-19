<template>
  <div>
    <profile :is-edit="true" />
  </div>
</template>

<script>
import Profile from "./components/Profile";

export default {
  name: "EditInvoice",
  components: { Profile }
};
</script>



