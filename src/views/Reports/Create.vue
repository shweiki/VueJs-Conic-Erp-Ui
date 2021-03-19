<template>
  <div>
    <profile :is-edit="false" />
  </div>
</template>

<script>
import Profile from "./components/Profile";

export default {
  name: "CreateInvoice",
  components: { Profile }
};
</script>

