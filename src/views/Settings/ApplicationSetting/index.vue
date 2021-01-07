
<template>
  <div>
    <el-col :span="6">
      <settings />
    </el-col>
    <el-col :span="18">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>جميع اعدادات</span>
        </div>
        <el-col :span="3">
          <el-button type="primary" @click="CheckUpdate"
            >Check UpDate</el-button
          >
        </el-col>
        <el-col :span="5">
          <span>{{ $t("Settings.title") }}</span>
          <el-input v-model="title" />
        </el-col>
        <el-col :span="5">
          <span>{{ $t("Settings.CashDrawerCOM") }}</span>
          <el-input v-model="CashDrawerCOM" />
        </el-col>
        <el-col :span="4">
          <span>{{ $t("Settings.theme") }}</span>
          <theme-picker
            style="float: right;height: 26px;margin: -3px 8px 0 0;"
            @change="themeChange"
          />
        </el-col>
        <el-col :span="4">
          <span>{{ $t("Settings.theme") }}</span>
          <el-switch class="drawer-switch" />
        </el-col>
        <el-col :span="4">
          <span>{{ $t("Settings.tagsView") }}</span>
          <el-switch v-model="tagsView" class="drawer-switch" />
        </el-col>
        <el-col :span="4">
          <span>{{ $t("Settings.showSettings") }}</span>
          <el-switch v-model="showSettings" class="drawer-switch" />
        </el-col>
        <el-col :span="4">
          <span>{{ $t("Settings.BusinessType") }}</span>
          <el-input v-model="BusinessType" class="drawer-switch" />
        </el-col>
        <el-col :span="4">
          <span>{{ $t("Settings.fixedHeader") }}</span>
          <el-switch v-model="fixedHeader" class="drawer-switch" />
        </el-col>

        <el-col :span="4">
          <span>{{ $t("Settings.sidebarLogo") }}</span>
          <el-switch v-model="sidebarLogo" class="drawer-switch" />
        </el-col>
      </el-card>
    </el-col>
  </div>
</template>

<script>
import ThemePicker from "@/components/ThemePicker";
import { CheckUpdate } from "@/api/Setting";
import { toggleClass } from "@/utils";
import "@/assets/custom-theme/index.css"; // the theme changed version element-ui css
import Settings from "@/layout/components/Settings/index";

export default {
  components: { ThemePicker, Settings },
  data() {
    return {};
  },
  computed: {
    isShowJob() {
      return this.$store.getters.settings.language;
    },
    title: {
      get() {
        return this.$store.state.settings.title;
      },
      set(val) {
        this.$store.dispatch("settings/changeSetting", {
          key: "title",
          value: val
        });
      }
    },
    CashDrawerCOM: {
      get() {
        return this.$store.state.settings.CashDrawerCOM;
      },
      set(val) {
        this.$store.dispatch("settings/changeSetting", {
          key: "fixedHeader",
          value: val
        });
      }
    },
    fixedHeader: {
      get() {
        return this.$store.state.settings.fixedHeader;
      },
      set(val) {
        this.$store.dispatch("settings/changeSetting", {
          key: "fixedHeader",
          value: val
        });
      }
    },
    tagsView: {
      get() {
        return this.$store.state.settings.tagsView;
      },
      set(val) {
        this.$store.dispatch("settings/changeSetting", {
          key: "tagsView",
          value: val
        });
      }
    },
    sidebarLogo: {
      get() {
        return this.$store.state.settings.sidebarLogo;
      },
      set(val) {
        this.$store.dispatch("settings/changeSetting", {
          key: "sidebarLogo",
          value: val
        });
      }
    },
    showSettings: {
      get() {
        return this.$store.state.settings.showSettings;
      },
      set(val) {
        this.$store.dispatch("settings/changeSetting", {
          key: "showSettings",
          value: val
        });
      }
    },
    BusinessType: {
      get() {
        return this.$store.state.settings.BusinessType;
      },
      set(val) {
        this.$store.dispatch("settings/changeSetting", {
          key: "BusinessType",
          value: val
        });
      }
    }
  },
  methods: {
    CheckUpdate() {
      this.loading = true;
      CheckUpdate()
        .then(response => {
          // handle success
          console.log(response);
          this.loading = false;
        })
        .catch(error => {
          // handle error
          console.log(error);
        });
    },
    themeChange(val) {
      this.$store.dispatch("settings/changeSetting", {
        key: "theme",
        value: val
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.drawer-switch {
  float: right;
}
</style>

