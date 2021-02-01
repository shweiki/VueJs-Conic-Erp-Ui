<template>
  <div class="Clock">
    <VueClock  />
  </div>
</template>

<script>
import VueClock from "@dangvanthanh/vue-clock";

export default {
  components: { VueClock }
};
</script>
<style  scoped>
.Clock {
  display: inline-block;
  cursor: pointer;
  fill: #5a5e66;
  width: 20px;
  height: 20px;
  vertical-align: 10px;
}
</style>
