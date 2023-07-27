<template>
  <div class="app-container">
    <div v-if="user">
      <el-row :gutter="20">
        <el-col :span="6" :xs="24">
          <user-card :user="user" />
        </el-col>

        <el-col :span="18" :xs="24">
          <el-card>
            <el-tabs v-model="activeTab">
              <!--   <el-tab-pane
                v-if="
                  this.DriverForm.DriverUserId == this.user.Id ||
                  this.user.name == 'SystemAdmin'
                "
                :label="$t('Delivery.DriverAccount')"
                name="DriverAccount"
              >
                <Driver :DriverForm="DriverForm" />
              </el-tab-pane>-->
              <el-tab-pane :label="$t('Delivery.Account')" name="account">
                <account :user="user" />
              </el-tab-pane>
            </el-tabs>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import UserCard from "./components/UserCard";
import Account from "./components/Account";
import Driver from "./components/Driver";
import { GetDriverInfo } from "@/api/Driver";
export default {
  name: "Profile",
  components: { UserCard, Account, Driver },
  data() {
    return {
      user: {},
      activeTab: "account",
      DriverForm: {},
    };
  },
  computed: {
    ...mapGetters(["Id", "name", "phone", "avatar", "roles"]),
  },
  created() {
    this.getUser();
    // this.GetDriverData();
  },
  methods: {
    getUser() {
      this.user = {
        Id: this.Id,
        name: this.name,
        phone: this.phone,
        role: this.roles.join(" | "),
        email: "admin@test.com",
        avatar: this.avatar,
      };
    },
    GetDriverData() {
      GetDriverInfo({ UserId: this.user.Id, name: this.user.name }).then((response) => {
        this.DriverForm = response;
      });
    },
  },
};
</script>
<style>
.el-tabs__nav-scroll {
  float: right;
  direction: ltr;
}
</style>
