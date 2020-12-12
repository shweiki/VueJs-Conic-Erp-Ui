<template>
  <div>
      <el-menu
        :default-active="activeMenu"
        :text-color="variables.menuText"
        :unique-opened="false"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="horizontal"
        style="display: flex;"
      >
      
        <sidebar-item
          v-for="route in permission_routes"
          :key="route.name"
          :item="route"
          :base-path="route.path"
        />
      </el-menu>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import SidebarItem from "./SidebarItem";
import variables from "@/styles/variables.scss";

export default {
  components: { SidebarItem },
  computed: {
    ...mapGetters(["permission_routes", "sidebar"]),
    activeMenu() {
      const route = this.$route;
      const { meta, path } = route;
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu;
      }
      return path;
    },

    variables() {
      return variables;
    },

  }
};
</script>
<style>
.el-menu-item.is-active {
  background: rgba(1, 1, 1, 0.2);
}
</style>