<template>
  <div
    v-bind:style="
      this.$i18n.locale == 'ar'
        ? 'float: left; direction: rtl; height: 50px;'
        : 'float: right; height: 50px;'
    "
    class="right-menu"
  >
    <template v-if="$store.getters.device !== 'mobile'">
      <!--  <clock style="width : 270px" class="right-menu-item hover-effect" />-->

      <search id="header-search" class="right-menu-item" />

      <error-log class="errLog-container right-menu-item hover-effect" />

      <screenfull id="screenfull" class="right-menu-item hover-effect" />

      <el-tooltip :content="$t('navbar.size')" effect="dark" placement="bottom">
        <size-select id="size-select" class="right-menu-item hover-effect" />
      </el-tooltip>

      <lang-select class="right-menu-item hover-effect" />
    </template>

    <el-dropdown
      class="avatar-container right-menu-item hover-effect"
      trigger="click"
    >
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
          <span style="display: block" @click="logout">{{
            $t("navbar.logOut")
          }}</span>
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
import Search from "@/components/HeaderSearch";
import Clock from "@/components/Clock";
export default {
  directives: { permission },
  components: { ErrorLog, Screenfull, SizeSelect, LangSelect, Search, Clock },
  methods: {
    async logout() {
      await this.$store.dispatch("user/logout");
      //  this.$router.push(`/login?redirect=${this.$route.fullPath}`);
      this.$router.push(`/login`);
    }
  }
};
</script>
<style  lang="scss" scoped>
.right-menu {
  height: 100%;
  line-height: 50px;
  &:focus {
    outline: none;
  }

  .right-menu-item {
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
    margin-right: 30px;

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