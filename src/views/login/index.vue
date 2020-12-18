<template>
  <div
    class="login-container"
    :style="{ backgroundImage: `url(${$store.state.Settings.loginBackground})` }"
  >
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      autocomplete="on"
      label-position="left"
    >
      <div class="title-container">
        <h1 class="title">Login</h1>
      </div>
      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="username"
          v-model="loginForm.username"
          placeholder="Username"
          name="username"
          type="text"
          tabindex="1"
          autocomplete="on"
        />
      </el-form-item>

      <el-tooltip
        v-model="capsTooltip"
        content="Caps lock is On"
        placement="right"
        manual
      >
        <el-form-item prop="password">
          <span class="svg-container">
            <svg-icon icon-class="password" />
          </span>
          <el-input
            :key="passwordType"
            ref="password"
            v-model="loginForm.password"
            :type="passwordType"
            placeholder="Password"
            name="password"
            tabindex="2"
            autocomplete="on"
            @keyup.native="checkCapslock"
            @blur="capsTooltip = false"
            @keyup.enter.native="handleLogin"
          />
        </el-form-item>
      </el-tooltip>

      <el-button :loading="loading" @click.native.prevent="handleLogin">Login</el-button>
    </el-form>
  </div>
</template>

<script>
import { validUsername } from "@/utils/validate";

export default {
  name: "Login",
  data() {
    const validateUsername = (rule, value, callback) => {
      callback();
    };
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error("The password can not be less than 6 digits"));
      } else {
        callback();
      }
    };
    return {
      loginForm: {
        username: "",
        password: "",
      },
      loginRules: {
        username: [{ required: true, trigger: "blur", validator: validateUsername }],
        password: [{ required: true, trigger: "blur", validator: validatePassword }],
      },
      passwordType: "password",
      capsTooltip: false,
      loading: false,
      showDialog: false,
      redirect: undefined,
      otherQuery: {},
    };
  },
  watch: {
    $route: {
      handler: function (route) {
        const query = route.query;
        if (query) {
          this.redirect = query.redirect;
          this.otherQuery = this.getOtherQuery(query);
        }
      },
      immediate: true,
    },
  },
  created() {
    if (this.loginForm.username === "") {
      this.$refs.username;
    } else if (this.loginForm.password === "") {
      this.$refs.password;
    }
  },
  destroyed() {
    // window.removeEventListener('storage', this.afterQRScan)
  },
  methods: {
    checkCapslock({ shiftKey, key } = {}) {
      if (key && key.length === 1) {
        if (
          (shiftKey && key >= "a" && key <= "z") ||
          (!shiftKey && key >= "A" && key <= "Z")
        ) {
          this.capsTooltip = true;
        } else {
          this.capsTooltip = false;
        }
      }
      if (key === "CapsLock" && this.capsTooltip === true) {
        this.capsTooltip = false;
      }
    },
    showPwd() {
      if (this.passwordType === "password") {
        this.passwordType = "";
      } else {
        this.passwordType = "password";
      }
      this.$nextTick(() => {
        this.$refs.password;
      });
    },
    handleLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          this.$store
            .dispatch("user/login", this.loginForm)
            .then(() => {
              this.$router.push({
                path: this.redirect || "/",
                query: this.otherQuery,
              });
              this.loading = false;
            })
            .catch(() => {
              this.loading = false;
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== "redirect") {
          acc[cur] = query[cur];
        }
        return acc;
      }, {});
    },
    // afterQRScan() {
    //   if (e.key === 'x-admin-oauth-code') {
    //     const code = getQueryObject(e.newValue)
    //     const codeMap = {
    //       wechat: 'code',
    //       tencent: 'code'
    //     }
    //     const type = codeMap[this.auth_type]
    //     const codeName = code[type]
    //     if (codeName) {
    //       this.$store.dispatch('LoginByThirdparty', codeName).then(() => {
    //         this.$router.push({ path: this.redirect || '/' })
    //       })
    //     } else {
    //       alert('第三方登录失败')
    //     }
    //   }
    // }
  },
};
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */
$cursor: #000;
$bg: #00000049;

/* reset element-ui css */ //http://cdn.magdeleine.co/wp-content/uploads/2014/05/3jPYgeVCTWCMqjtb7Dqi_IMG_8251-1400x933.jpg

.login-container {
  //background: url(https://i.ibb.co/dPSp7dp/ezgif-3-fa3e3985da64-min.jpg) no-repeat center center fixed;

  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;
    input {
      font-family: "Open Sans Condensed", sans-serif;
      background: rgba(3, 3, 3, 0.1);
      text-decoration: none;
      position: relative;
      width: 80%;
      display: block;
      margin: 9px auto;
      font-size: 17px;
      color: #fff;
      padding: 8px;
      border-radius: 6px;
      border: none;
      -webkit-transition: all 2s ease-in-out;
      -moz-transition: all 2s ease-in-out;
      -o-transition: all 2s ease-in-out;
      transition: all 0.2s ease-in-out;
      -webkit-background-color: rgba(3, 3, 3, 0.1);
      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        // -webkit-text-fill-color: $bg !important;
      }
    }
    input:focus {
      outline: none;
      box-shadow: 3px 3px 20px #333;
      background: rgba(3, 3, 3, 0.18);
    }

    ::-webkit-input-placeholder {
      color: #ddd;
    }
    :-moz-placeholder {
      /* Firefox 18- */
      color: red;
    }
    ::-moz-placeholder {
      /* Firefox 19+ */
      color: red;
    }
    :-ms-input-placeholder {
      color: #333;
    }
  }
}
.el-form-item {
  text-decoration: none;
  //border: 1px solid rgba(255, 255, 255, 0.1);
  // background: rgba(0, 0, 0, 0.1);
  border-radius: 5px;
}
</style>

<style lang="scss" scoped>
.login-container {
  min-height: 100%;
  width: 100%;
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: cover;
  overflow: hidden;
  .login-form {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    width: 500px;
    height: 400px;
    overflow: hidden;
    border-radius: 5px;
    background: rgba(3, 3, 3, 0.25);
    box-shadow: 1px 1px 50px #000;
  }
  .svg-container {
    padding: 6px 5px 6px 15px;
    color: #889aa4;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }
  .title-container {
    position: relative;
    font-family: "Open Sans Condensed", sans-serif;
    margin-top: 0px;
    text-align: center;
    font-size: 40px;
    color: #ddd;
    text-shadow: 3px 3px 10px #000;
    .title {
      font-size: 40px;
    }
  }
  .el-button {
    font-family: "Open Sans Condensed", sans-serif;
    text-decoration: none;
    position: relative;
    width: 69%;
    display: block;
    margin: 9px auto;
    font-size: 17px;
    color: #fff;
    padding: 10px;
    border-radius: 6px;
    border: none;
    -webkit-transition: all 2s ease-in-out;
    -moz-transition: all 2s ease-in-out;
    -o-transition: all 2s ease-in-out;
    transition: all 0.2s ease-in-out;
    text-align: center;
    background: rgba(107, 255, 3, 0.3);
  }
  .el-button:hover {
    opacity: 0.7;
  }
}
</style>
