<template>
  <div class="app-container">
    <el-row v-if="tempForm">
      <el-col :span="24" :xs="24" v-loading="loading">
        <el-card class="box-card" >
            <el-descriptions
        class="margin-top"
        title="احتساب الراتب"
        :column="2"
        border
      >
        <el-descriptions-item
          :label-style="{ 'text-align': 'right' }"
          :content-style="{ 'text-align': 'right' }"
        >
          <template slot="label">
            <i class="el-icon-user"></i>
            الراتب
          </template>
          <el-tag size="small">{{ tempForm.GrossSalary }}</el-tag>
        </el-descriptions-item>
         <el-descriptions-item
          :label-style="{ 'text-align': 'right' }"
          :content-style="{ 'text-align': 'right' }"
        >
          <template slot="label">
            <i class="el-icon-user"></i>
            الاسم
          </template>
          <el-tag size="small">{{ tempForm.Name }}</el-tag>
        </el-descriptions-item>
          <el-descriptions-item
          :label-style="{ 'text-align': 'right' }"
          :content-style="{ 'text-align': 'right' }"
        >
          <template slot="label">
            <i class="el-icon-user"></i>
            الرقم
          </template>
          <el-tag size="small">{{ tempForm.EmpId }}</el-tag>
        </el-descriptions-item>
            </el-descriptions>
        </el-card >
        <el-card class="box-card">
          <el-col :span="15" >
            <el-table
            height="500"
      :data="tableData"
      border
      highlight-current-row
    >
      <el-table-column
        prop="Id"
        label="Id"
        width="80"
        align="center"
      ></el-table-column>
       <el-table-column
        prop="StartDateTime"
        label="StartDateTime"
        width="200"
        align="center"
      ></el-table-column>
        <el-table-column
        prop="EndDateTime"
        label="EndDateTime"
        width="200"
        align="center"
      >
      </el-table-column>
        <el-table-column
        prop="WorkTime"
        label="WorkTime"
        width="140"
        align="center"
      >
      </el-table-column> 
            </el-table>
          </el-col>
           <el-col :span="8" >
                     <el-table
            height="500"
      :data="WorkingAdjustment"
      
      border
      highlight-current-row
    >
      <el-table-column
        prop="Id"
        label="Id"
        width="80"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="AdjustmentName"
        label="AdjustmentName"
        width="80"
        align="center"
      ></el-table-column>
       <el-table-column
        prop="Description"
        label="Description"
        width="80"
        align="center"
      ></el-table-column>
       <el-table-column
        prop="AdjustmentAmmount"
        label="AdjustmentAmmount"
        width="80"
        align="center"
      ></el-table-column>
            </el-table>
           </el-col>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>

import {GetLastSalaryById } from "@/api/Salary";
import {GetEmployeeMounthLog } from "@/api/WorkingHoursLog";
import { GetWorkingAdjustmentBySalaryId } from "@/api/WorkingAdjustment";
export default {
  name: "Profile",
  components: {
  },
 
  data() {
    return {
      activeTab: "Details",
      loading: true,
      tableData:[],
      WorkingAdjustment:[],
      tempForm: {
        Id: undefined,
        EmpId:undefined,
        GrossSalary:0,
        NetSalary:0,
        SalaryPeriod:"",
        status:0,
        Name:"",
      },
      WorkingForm:{
        Id: undefined,
        StartDateTime: "",
        EndDateTime: "",
        DeviceName: "",
        Description: ""
      },
    };
  },
  created() {
      this.getdata(this.$route.params && this.$route.params.id);
  },
  methods: {
    getdata(val) {
      GetLastSalaryById({ Id: val })
        .then((response) => {
          this.tempForm = response;
          this.GetWork(response.Id)
        })
        GetEmployeeMounthLog({
          EmpId: val
        }).then((response) => {
          this.tableData = response;
        })
        
      .catch((err) => {
          console.log(err);
        })
        this.loading = false;
    },
    GetWork(Id){
    GetWorkingAdjustmentBySalaryId({
          SalId: Id
        }).then((response) => {
          this.WorkingAdjustment = response;
        })}
   
  }
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
