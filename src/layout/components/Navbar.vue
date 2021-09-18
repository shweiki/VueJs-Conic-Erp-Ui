<template>
  <div class="navbar">
    <Right-Menu />

    <hamburger
      id="hamburger-container"
      :is-active="$store.state.settings.sidebarOpen"
      v-bind:style="this.$i18n.locale == 'ar' ? 'float: right;' : 'float: left;'"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
    />

    <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Breadcrumb from "@/components/Breadcrumb";
import Hamburger from "@/components/Hamburger";
import RightMenu from "@/components/RightMenu";

export default {
  components: {
    Breadcrumb,
    Hamburger,
    RightMenu,
  },
  computed: {
    ...mapGetters(["sidebar"]),
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch("app/toggleSideBar");
    },
  },
};
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #1b3459;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .hamburger-container {
    background: #e1e8f8;
    line-height: 46px;
    height: 100%;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: #cdd4e4;
    }
  }
}
</style>
