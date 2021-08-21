<template>
  <div>
    <Restaurant
      v-if="$store.getters.settings.CashPoolLayout == 'Restaurant'"
      :is-edit="true"
    />
  </div>
</template>

<script>
import Restaurant from "./components/Restaurant";

export default {
  name: "CreateCashPool",
  components: { Restaurant }
};
</script>



