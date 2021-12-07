<template>
  <div>
    <Profile :is-edit="true" />
  </div>
</template>

<script>
import Profile from "../BillOfEntery/components/Profile.vue";

export default {
  name: "EditInvoice",
  components: { Profile },
};
</script>
