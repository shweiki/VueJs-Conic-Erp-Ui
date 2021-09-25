<template>
  <div class="app-container">
    <el-row>
      <el-col :span="24" :xs="24" v-loading="loading">
        <employee-search />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import permission from "@/directive/permission/index.js";
import EmployeeSearch from "./components/EmployeeSearch.vue";
import PanThumb from "@/components/PanThumb";
import WebCam from "@/components/WebCam";

export default {
  name: "EmployeeList",
  directives: { permission },
  components: { EmployeeSearch, PanThumb, WebCam },
  data() {
    return {
      loading: true,
    };
  },
  created() {
    this.getdata();
  },
  methods: {
    getdata() {
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
