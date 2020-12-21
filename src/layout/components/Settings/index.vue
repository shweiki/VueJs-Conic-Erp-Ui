<template>
  <div class="drawer-container">
    <div>
      <h3 class="drawer-title">{{ $t("Settings.title") }}</h3>

      <div class="drawer-item">
        <span>{{ $t("Settings.theme") }}</span>
        <theme-picker
          style="float: right;height: 26px;margin: -3px 8px 0 0;"
          @change="themeChange"
        />
      </div>

      <div class="drawer-item">
        <span>{{ $t("Settings.tagsView") }}</span>
        <el-switch v-model="tagsView" class="drawer-switch" />
      </div>
      <div class="drawer-item">
        <span>{{ $t("Settings.showSettings") }}</span>
        <el-switch v-model="showSettings" class="drawer-switch" />
      </div>
            <div class="drawer-item">
        <span>{{ $t("Settings.BusinessType") }}</span>
        <el-input v-model="BusinessType" class="drawer-switch" />
      </div>
      <div class="drawer-item">
        <span>{{ $t("Settings.fixedHeader") }}</span>
        <el-switch v-model="fixedHeader" class="drawer-switch" />
      </div>

      <div class="drawer-item">
        <span>{{ $t("Settings.sidebarLogo") }}</span>
        <el-switch v-model="sidebarLogo" class="drawer-switch" />
      </div>
    </div>
  </div>
</template>

<script>
import ThemePicker from "@/components/ThemePicker";

export default {
  components: { ThemePicker },
  data() {
    return {};
  },
  computed: {
    isShowJob() {
      return this.$store.getters.Settings.language;
    },
    fixedHeader: {
      get() {
        return this.$store.state.Settings.fixedHeader;
      },
      set(val) {
        this.$store.dispatch("Settings/changeSetting", {
          key: "fixedHeader",
          value: val
        });
      }
    },
    tagsView: {
      get() {
        return this.$store.state.Settings.tagsView;
      },
      set(val) {
        this.$store.dispatch("Settings/changeSetting", {
          key: "tagsView",
          value: val
        });
      }
    },
    sidebarLogo: {
      get() {
        return this.$store.state.Settings.sidebarLogo;
      },
      set(val) {
        this.$store.dispatch("Settings/changeSetting", {
          key: "sidebarLogo",
          value: val
        });
      }
    },
    showSettings: {
      get() {
        return this.$store.state.Settings.showSettings;
      },
      set(val) {
        this.$store.dispatch("Settings/changeSetting", {
          key: "showSettings",
          value: val
        });
      }
    },
        BusinessType: {
      get() {
        return this.$store.state.Settings.BusinessType;
      },
      set(val) {
        this.$store.dispatch("Settings/changeSetting", {
          key: "BusinessType",
          value: val
        });
      }
    }
  },
  methods: {
    themeChange(val) {
      this.$store.dispatch("Settings/changeSetting", {
        key: "theme",
        value: val
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.drawer-container {
  padding: 24px;
  font-size: 14px;
  line-height: 1.5;
  word-wrap: break-word;

  .drawer-title {
    margin-bottom: 12px;
    color: rgba(0, 0, 0, 0.85);
    font-size: 14px;
    line-height: 22px;
  }

  .drawer-item {
    color: rgba(0, 0, 0, 0.65);
    font-size: 14px;
    padding: 12px 0;
  }

  .drawer-switch {
    float: right;
  }

  .job-link {
    display: block;
    position: absolute;
    width: 100%;
    left: 0;
    bottom: 0;
  }
}
</style>
