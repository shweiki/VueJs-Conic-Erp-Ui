<template>
  <div>
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
    >
  </div>
</template>

<script>

export default {
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

  },
  methods: {

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
