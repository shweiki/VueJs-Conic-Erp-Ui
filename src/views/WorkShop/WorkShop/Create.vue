<template>
  <div>
    <Pubilc v-if="$store.getters.settings.WorkShopLayout == 'Pubilc'" :is-edit="false" />
  </div>
</template>

<script>
import Pubilc from "./components/Pubilc.vue";

export default {
  name: "CreateInvoice",
  components: { Pubilc },
};
</script>
