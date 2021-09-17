<template>
  <div class="app-container">
    <el-row v-if="tempForm">
     
      <el-col :span="24" :xs="24" v-loading="loading">
        <!-- <Member-Search /> -->

        <el-card
          class="box-card"
          v-bind:class="{ BlackList: tempForm.Status === -2 ? true : false }"
        >
          <el-row>
            <el-col :span="19">
              <Details :Employee="tempForm" />
            </el-col>
          </el-row>
        </el-card>

        <el-card class="box-card">
          <el-tabs v-model="activeTab" tab-position="right" @tab-click="tabClick">
         <el-tab-pane label="دوامات" name="timeline">
              <span slot="label"><i class="el-icon-refresh"></i> دوامات</span>
              <Timeline :timeline="log" :EmployeeId="tempForm.Id" />
            </el-tab-pane>

             <el-tab-pane label="رواتب" name="salary">
              <span slot="label"><i class="el-icon-refresh"></i> رواتب</span>
              <Salary :SalaryPayment="SalaryPayment" :EmployeeId="tempForm.Id" :EmployeeName="tempForm.Name"/>
            </el-tab-pane>

            <el-tab-pane label="التسويات" name="Adjustment">
              <span slot="label"><i class="el-icon-refresh"></i> التسويات</span>
              <Working-Adjustment/>
            </el-tab-pane>

          </el-tabs>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>


import Details from "./Details.vue";
import Salary from "./Salary.vue";
import WorkingAdjustment from "./WorkingAdjustment.vue";
import Timeline from "./Timeline.vue";
import { GetEmployeeById } from "@/api/Employee";
import { GetSalaryById } from "@/api/Salary";
import checkPermission from "@/utils/permission";
import { GetEmployeeLogById } from "@/api/WorkingHoursLog";

export default {
  name: "Salary Details",
  components: {
    Details,
    Salary,
    Timeline,
    WorkingAdjustment,
  },
  props: {
    isEdit: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      activeTab: "Details",
      loading: true,
      tempRoute: {},
      tempForm: null,
      SalaryPayment:[],
      log: [],
    };
  },
  created() {
    if (this.isEdit) {
      this.getdata(this.$route.params && this.$route.params.id);
    }
    this.tempRoute = Object.assign({}, this.$route);
  },
  methods: {
    checkPermission,
    getdata(val) {
      GetEmployeeById({ Id: val })
        .then((response) => {
          this.tempForm = response;
          this.getAge();
          this.loading = false;
          this.setTagsViewTitle();
          this.setPageTitle();
        })
        .catch((err) => {
          console.log(err);
        });
     
    },
    tabClick(tab, event) {
     if (tab.label == "دوامات")
        GetEmployeeLogById({
          Id: this.tempForm.Id,
        }).then((response) => {
          //  console.log("log :", response);
          this.log = response.reverse();
        });
    
         if (tab.label == "رواتب")
        GetSalaryById({
          EmployeeId: this.tempForm.Id,
        }).then((response) => {
          this.SalaryPayment = response.reverse();
          });
     
    },

    getAge() {
      var today = new Date();
      var birthDate = new Date(this.tempForm.DateofBirth);
      var age = today.getFullYear() - birthDate.getFullYear();
      var m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age = age - 1;
      }

      this.tempForm.Age = age;
    },
  
    setTagsViewTitle() {
      const title = "كشف الراتب";
      const route = Object.assign({}, this.tempRoute, {
        title: `${title}-${this.tempForm.Id}`,
      });
      this.$store.dispatch("tagsView/updateVisitedView", route);
    },
    setPageTitle() {
      const title = "كشف الراتب";
      document.title = `${title} - ${this.tempForm.Id}`;
    },
  },
};
</script>
<style>
.el-date-editor.el-input,
.el-input__inner {
  width: 100%;
}

.el-col-8 {
  margin-left: 15px;
}

/*
.el-input.is-disabled .el-input__inner {
  color: #3399a5;
  font-weight: 650;
}*/

.BlackList {
  background: #ff1100;
}

.el-tabs__content {
  max-height: 700px;
}
</style>
