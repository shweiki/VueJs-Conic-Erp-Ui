<template>
  <div class="app-container">
    <el-row type="flex">
      <!--    <el-col :span="6" :xs="24">
        <member-log />
      </el-col>-->
      <el-col v-loading="loading" :span="24" :xs="24">
        <member-search />

        <el-col
          v-for="(member, index) in ActiveMembers"
          :key="index"
          style="padding: 1.5px"
          :xs="8"
          :sm="8"
          :md="8"
        >
          <el-card
            :body-style="{ padding: '0px' }"
            class="box-card"
            shadow="always"
          >
            <div slot="header">
              <router-link :to="'/Gym/Edit/' + member.MemberId">
                <strong style="font-size: 10px; cursor: pointer">{{
                  member.Name.split(" ").slice(0, 4).join(" ")
                }}</strong>
              </router-link>
            </div>
            <el-row type="flex">
              <el-col
                :span="12"
              >{{ $t("MemberList.MembershipType")
              }}{{ member.MembershipName }}</el-col>
              <el-col :span="12">
                <span>اخر زيارة</span>
                <last-log :user-id="member.MemberId" table-name="Member" />
              </el-col>
            </el-row>
            <el-col :span="24">
              <el-input v-model="member.PhoneNumber1" disabled />
            </el-col>
          </el-card>
        </el-col>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import permission from '@/directive/permission/index.js'
import MemberSearch from '@/components/Member/MemberSearch.vue'
import LastLog from '@/views/Gym/components/LastLog.vue'
import { GetActiveMember } from '@/api/Member'


export default {
  name: 'MemberList',
  directives: { permission },
  components: { MemberSearch, LastLog },
  data() {
    return {
      loading: true,
      Totals: {},
      ActiveMembers: []
    }
  },

  created() {
    // this.getdata();
    this.getdata()
  },
  methods: {
    getdata() {
      this.loading = true
      GetActiveMember()
        .then((response) => {
          this.ActiveMembers = response.items
          this.Totals = response.Totals
          this.loading = false
        })
        .catch((error) => {
          this.loading = false

          console.log(error)
        })
    }
  }
}
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
.Right-Menu-item {
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
