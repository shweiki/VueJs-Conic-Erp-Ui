<template>
  <div class="app-container" style="direction: ltr; ">
    <el-row type="flex">
      <el-col :span="6" :xs="24">
        <member-log />
      </el-col>
      <el-col :span="18" :xs="24" v-loading="loading">
        <el-row type="flex" style="background : #2f3542; color: white;">
          <el-col :span="6">
            <el-button
              type='success'
              icon="el-icon-s-shop"
              @click="$router.replace({ path: '/redirect' + '/SalesInvoice' })"
            ></el-button>
          </el-col>
          <el-col :span="2">
            <el-button type="primary" icon="el-icon-unlock" :disabled="$store.getters.ZtkDoor"></el-button>
          </el-col>
          <el-col :span="2">
            <add-member />
          </el-col>
          <el-col :span="16">
            <member-search />
          </el-col>
        </el-row>
        <el-col
          style="padding: 1.5px;"
          :xs="8"
          :sm="8"
          :md="8"
          v-for="(member, index) in ActiveMembers"
          :key="index"
        >
          <el-card :body-style="{ padding: '0px' }" class="box-card" shadow="always">
            <div slot="header" class="clearfix">
              <router-link :to="'/Gym/Edit/'+member.Id">
                <strong
                  style="font-size: 10px; cursor: pointer;"
                >{{member.Name.split(' ').slice(0, 4).join(' ')}}</strong>
              </router-link>
            </div>
            <el-row type="flex">
              <el-col
                :span="12"
              >{{ $t('MemberList.MembershipType') }}{{ member.ActiveMemberShip.Name}}</el-col>
              <!-- <el-col :span="12">
                <span>اخر زيارة</span>
                {{member.lastLog }}
              </el-col>-->
            </el-row>
            <el-col :span="24">
              <el-input disabled v-model="member.PhoneNumber1"></el-input>
            </el-col>
          </el-card>
        </el-col>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import permission from "@/directive/permission/index.js";
import AddMember from "./components/Dialogs/AddMember";
import MemberLog from "./components/MemberLog";
import MemberSearch from "./components/MemberSearch";
import PanThumb from "@/components/PanThumb";
import WebCam from "@/components/WebCam";

import { GetMember } from "@/api/Member";

//import { GetActiveMember } from "@/api/Member";

export default {
  name: "MemberList",
  directives: { permission },
  components: { AddMember, MemberSearch, MemberLog, PanThumb, WebCam },
  data() {
    return {
      loading: true,
      ActiveMembers: []
    };
  },
  computed: {
    Members() {
      return this.$store.getters.ActiveMembers;
    }
  },
  watch: {
    Members() {
      this.ActiveMembers = this.Members;
    }
  },
  mounted() {
    this.ActiveMembers = this.Members;
  },
  created() {
    // this.getdata();
    this.getdata();
  },
  methods: {
    getdata() {
      this.loading = false;
    }
  }
};
</script>
    <style scoped>
.ItemName {
  color: #009688;
  font-weight: 600;
  font-size: x-large;
}
.el-card__body {
  padding: 3px;
}
.components-container {
  position: relative;
  height: 100vh;
  margin: 0px 0px;
}
.time {
  font-size: 16px;
  color: #2f3542;
}

.bottom {
  margin-top: 13px;
  line-height: 12px;
}

.button {
  padding: 0;
  float: right;
}

.image {
  width: 100%;
  display: block;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both;
}

.container {
  border-style: double;
  text-align: center;
  font-size: x-large;
  font-weight: 500;
  color: mediumseagreen;
}
.right-menu-item {
  color: #ffffff;
  display: inline-block;
  padding: 0 8px;
  font-size: 18px;
  vertical-align: text-bottom;
}
.TotalAmmount {
  font-size: x-large;
  font-weight: 600;
  color: white;
  margin-bottom: 10px;
}
.el-form-item__label {
  color: white;
}
</style>
