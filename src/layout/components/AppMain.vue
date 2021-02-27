<template>
  <section
    v-bind:style="
      this.$i18n.locale == 'ar'
        ? 'direction: rtl   text-align: right;'
        : 'direction: ltr   text-align: left;'
    "
    class="app-main"
  >
    <transition name="fade-transform" mode="out-in">
      <keep-alive :include="cachedViews">
        <router-view
          :key="key"
          @contextmenu.prevent.native="openMenu(key, $event)"
          id="thisview"
        ></router-view>
      </keep-alive>
    </transition>
    <ul
      v-show="visible"
      :style="{ left: left + 'px', top: top + 'px' }"
      class="contextmenu"
    >
      <li @click="refreshSelectedTag()">{{ $t("tagsView.refresh") }}</li>
      <li @click="Forward()">{{ $t("tagsView.Forward") }}</li>
      <li @click="Back()">{{ $t("tagsView.Back") }}</li>
    </ul>
  </section>
</template>
<script>
import { METHODS } from "http";
import path from "path";
import Clock from "@/components/Clock";

export default {
  name: "AppMain",
  components: { Clock },
  computed: {
    visitedViews() {
      return this.$store.state.tagsView.visitedViews;
    },
    cachedViews() {
      return this.$store.state.tagsView.cachedViews;
    },
    key() {
      return this.$route.path;
    },
  },
  watch: {
    visible(value) {
      if (value) {
        document.body.addEventListener("click", this.closeMenu);
      } else {
        document.body.removeEventListener("click", this.closeMenu);
      }
    },
  },
  data() {
    return {
      visible: false,
      top: 0,
      left: 0,
      FullPath: "",
      affixTags: [],
    };
  },
  methods: {
    refreshSelectedTag() {
      const fullPath = this.FullPath;

      this.$router.replace({
        path: "/redirect" + fullPath,
      });
    },
    Back() {
      if (this.$route.query.noGoBack) {
        this.$router.push({ path: this.$store.getters.defulate_redirect });
      } else {
        this.$router.go(-1);
      }
    },
    Forward() {
      this.$router.go(1);
    },
    openMenu(key, e) {
      //console.log(key);
      const menuMinWidth = 105;
      const offsetLeft = this.$el.getBoundingClientRect().left; // container margin left
      const offsetWidth = this.$el.offsetWidth; // container width
      const maxLeft = offsetWidth - menuMinWidth; // left boundary
      const left = e.clientX - offsetLeft + 15; // 15: margin right

      if (left > maxLeft) {
        this.left = maxLeft;
      } else {
        this.left = left;
      }

      this.top = e.clientY;
      this.visible = true;
      this.FullPath = key;
    },
    closeMenu() {
      this.visible = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.app-main {
  /* 50= navbar  50  */
  min-height: calc(100vh - 50px);
  width: 100%;
  overflow: hidden;
}

.fixed-header + .app-main {
  padding-top: 50px;
}

.hasTagsView {
  .app-main {
    /* 84 = navbar + tags-view = 50 + 34 */
    min-height: calc(100vh - 84px);
  }

  .fixed-header + .app-main {
    padding-top: 84px;
  }
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}
.contextmenu {
  margin: 0;
  background: #fff;
  z-index: 3000;
  position: fixed;
  list-style-type: none;
  padding: 5px 0;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 400;
  color: #333;
  box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.3);
  li {
    margin: 0;
    padding: 7px 16px;
    cursor: pointer;
    &:hover {
      background: #eee;
    }
  }
}
</style>
