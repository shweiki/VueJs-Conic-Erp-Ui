<template>
  <div class="app-container">
    <el-row type="flex">
      <el-col :span="24" :xs="24" v-loading="loading">
        <employee-search />
        <el-col
          style="padding: 1.5px"
          :xs="8"
          :sm="8"
          :md="8"
          v-for="(item, index) in ActiveEmployee"
          :key="index"
        >
          <el-card :body-style="{ padding: '0px' }" class="box-card" shadow="always">
            <div slot="header">
              <router-link :to="'/HumanResource/Edit/' + item.Id">
                <strong style="font-size: 10px; cursor: pointer">{{
                  item.Name.split(" ").slice(0, 4).join(" ")
                }}</strong>
              </router-link>
            </div>
            <el-row type="flex">
              <el-col :span="12"> --- </el-col>
              <el-col :span="12">
                <span>اخر دوام</span>
                <last-log :UserId="item.Id" TableName="Employee" />
              </el-col>
            </el-row>
            <el-col :span="24">
              <el-input disabled v-model="item.PhoneNumber1"></el-input>
            </el-col>
          </el-card>
        </el-col>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import permission from "@/directive/permission/index.js";
import EmployeeSearch from "./components/EmployeeSearch.vue";
import PanThumb from "@/components/PanThumb";
import WebCam from "@/components/WebCam";
import LastLog from "@/components/Gym/LastLog.vue";
import { GetActiveEmployee } from "@/api/Employee";

export default {
  name: "EmployeeList",
  directives: { permission },
  components: { EmployeeSearch, PanThumb, WebCam, LastLog },
  data() {
    return {
      loading: true,
      ActiveEmployee: [],
    };
  },
  created() {
    this.getdata();
  },
  methods: {
    getdata() {
      GetActiveEmployee().then((res) => {
        this.ActiveEmployee = res;
      });
      this.loading = false;
    },
  },
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
