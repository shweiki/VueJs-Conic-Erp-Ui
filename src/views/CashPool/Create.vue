<template>
  <div>
    <Restaurant
      v-if="$store.getters.settings.CashPoolLayout == 'Restaurant'"
      :is-edit="false"
    />
  </div>
</template>

<script>
import Restaurant from "./components/Restaurant";

export default {
  name: "EditCashPool",
  components: { Restaurant }
};
</script>



