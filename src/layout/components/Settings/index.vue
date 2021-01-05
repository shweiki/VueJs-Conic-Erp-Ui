<template>
  <div>
    <el-col :span="6">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>{{ $t("Settings.Images") }}</span>
        </div>
        <span>{{ $t("Settings.sidebarImages") }}</span>

        <div class="demo-image" style="display: flex;">
          <el-image
            style="padding: 18px 2px; width: 75px;"
            v-for="item in sidebarImages"
            :key="item"
            @click="changeSidebarImage(item)"
            class="img-holder"
            :src="item"
            fit="fill"
          ></el-image>
        </div>
        <span>{{ $t("Settings.loginBackground") }}</span>

        <div class="demo-image" style="display: flex;">
          <el-image
            style="padding: 18px 2px; width: 75px;"
            v-for="item in loginImages"
            :key="item"
            @click="changeloginImage(item)"
            class="img-holder"
            :src="item"
            fit="fill"
          ></el-image>
        </div> </el-card
    ></el-col>
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

export default {
  components: { ThemePicker },
  data() {
    return {
      sidebarImages: [
        require("@/assets/Sidebar_images/sidebar-0.jpg"),
        require("@/assets/Sidebar_images/sidebar-1.jpg"),
        require("@/assets/Sidebar_images/sidebar-2.jpg"),
        require("@/assets/Sidebar_images/sidebar-3.jpg"),
        require("@/assets/Sidebar_images/sidebar-4.jpg"),
        require("@/assets/Sidebar_images/sidebar-5.jpg"),
        require("@/assets/Sidebar_images/sidebar-6.jpg"),
        require("@/assets/Sidebar_images/sidebar-7.jpg"),
        require("@/assets/Sidebar_images/sidebar-8.jpg"),
        require("@/assets/Sidebar_images/sidebar-9.jpg"),
        require("@/assets/Sidebar_images/sidebar-10.jpg")
      ],
      loginImages: [
        require("@/assets/Login_images/Login-0.jpg"),
        require("@/assets/Login_images/Login-1.jpg"),
        require("@/assets/Login_images/Login-2.jpg"),
        require("@/assets/Login_images/Login-3.jpg"),
        require("@/assets/Login_images/Login-4.jpg"),
        require("@/assets/Login_images/Login-5.jpg"),
        require("@/assets/Login_images/Login-6.jpg")
      ]
    };
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
    },
    changeSidebarImage(val) {
      this.$store.dispatch("settings/changeSetting", {
        key: "SidebarImage",
        value: val
      });
    },
    changeloginImage(val) {
      this.$store.dispatch("settings/changeSetting", {
        key: "loginBackground",
        value: val
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.img-holder {
  font-size: 16px;
  text-align: center;
  border-radius: 10px;
  background-color: #fff;
  border: 3px solid #fff;
  padding-left: 0;
  padding-right: 0;
  opacity: 1;
  cursor: pointer;
  display: block;
  max-height: 100px;
  overflow: hidden;
  padding: 0;
  width: 100%;
  margin: 0 auto;
  img {
    margin-top: auto;
  }
}
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
