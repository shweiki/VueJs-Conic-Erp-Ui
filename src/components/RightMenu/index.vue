<template>
  <div
    v-bind:style="
      this.$i18n.locale == 'ar'
        ? 'float: left; direction: rtl; height: 50px;'
        : 'float: right; height: 50px;'
    "
    class="Right-Menu"
  >
    <template v-if="$store.getters.device !== 'mobile'">
      <!--  <clock style="width : 270px" class="Right-Menu-item hover-effect" />-->

      <search id="header-search" class="Right-Menu-item" />

      <error-log class="errLog-container Right-Menu-item hover-effect" />

      <screenfull id="screenfull" class="Right-Menu-item hover-effect" />

      <el-tooltip :content="$t('navbar.size')" effect="dark" placement="bottom">
        <size-select id="size-select" class="Right-Menu-item hover-effect" />
      </el-tooltip>

      <lang-select class="Right-Menu-item hover-effect" />
      <Shortcut-Add class="Right-Menu-item hover-effect" />
    </template>

    <el-dropdown class="avatar-container Right-Menu-item hover-effect" trigger="click">
      <!-- $store.getters.avatar -->
      <div class="avatar-wrapper">
        <img :src="$store.getters.avatar" class="user-avatar" />
        <i class="el-icon-caret-bottom" />
      </div>
      <el-dropdown-menu slot="dropdown">
        <router-link :to="$store.getters.defulate_redirect">
          <el-dropdown-item>
            {{ $t("navbar.Profile") }}
          </el-dropdown-item>
        </router-link>
        <router-link to="/dashboard">
          <el-dropdown-item>
            {{ $t("navbar.dashboard") }}
          </el-dropdown-item>
        </router-link>
        <router-link v-permission="['Developer']" to="/Settings/ApplicationSetting">
          <el-dropdown-item>
            {{ $t("route.ApplicationSetting") }}
          </el-dropdown-item>
        </router-link>
        <router-link v-permission="['Developer']" to="/Settings/Permission">
          <el-dropdown-item>
            {{ $t("route.Permissions") }}
          </el-dropdown-item>
        </router-link>
        <el-dropdown-item divided>
          <span style="display: block" @click="logout">{{ $t("navbar.logOut") }}</span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>
<script>
import permission from "@/directive/permission/index.js";
import ErrorLog from "@/components/ErrorLog";
import Screenfull from "@/components/Screenfull";
import SizeSelect from "@/components/SizeSelect";
import LangSelect from "@/components/LangSelect";
import ShortcutAdd from "@/components/ShortcutAdd";
import Search from "@/components/HeaderSearch";
import Clock from "@/components/Clock";
export default {
  directives: { permission },
  components: {
    ErrorLog,
    Screenfull,
    SizeSelect,
    LangSelect,
    Search,
    Clock,
    ShortcutAdd,
  },
  methods: {
    async logout() {
      await this.$store.dispatch("user/logout");
      //  this.$router.push(`/login?redirect=${this.$route.fullPath}`);
      this.$router.push(`/login`);
    },
  },
};
</script>
<style lang="scss" scoped>
.Right-Menu {
  height: 100%;
  line-height: 50px;
  &:focus {
    outline: none;
  }

  .Right-Menu-item {
    display: inline-block;
    padding: 0 8px;
    height: 100%;
    font-size: 18px;
    color: #ffffff;
    vertical-align: text-bottom;

    &.hover-effect {
      cursor: pointer;
      transition: background 0.3s;

      &:hover {
        background: rgba(0, 0, 0, 0.025);
      }
    }
  }

  .avatar-container {
    .avatar-wrapper {
      margin-top: 5px;
      position: relative;

      .user-avatar {
        cursor: pointer;
        width: 40px;
        height: 40px;
        border-radius: 10px;
      }

      .el-icon-caret-bottom {
        cursor: pointer;
        position: absolute;
        right: -10px;
        top: 25px;
        font-size: 12px;
      }
    }
  }
}
.errLog-container {
  display: inline-block;
  vertical-align: top;
}
</style>
