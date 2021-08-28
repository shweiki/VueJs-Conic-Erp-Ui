<template>
  <div>
    <Pubilc v-if="$store.getters.settings.WorkShopLayout == 'Pubilc'" :is-edit="true" />
  </div>
</template>

<script>
import Pubilc from "./components/Pubilc.vue";

export default {
  name: "EditInvoice",
  components: { Pubilc },
};
</script>
