<template>
  <div>
    <Layout1
      v-if="$store.getters.settings.WorkShopLayout == 'Layout1'"
      :is-edit="false"
    />
  </div>
</template>

<script>
import Layout1 from "./components/Layout1.vue";

export default {
  name: "CreateInvoice",
  components: { Layout1 },
};
</script>
