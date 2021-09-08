<template>
<div>
    <el-col :span="12">
      <el-button v-if="Status == 0"
          style="float: left"
          type="success"
          size="medium"
          icon="el-icon-plus"
          @click="dialogFormVisible = true"
          >تعيين سائق</el-button>
            
          </el-col>  
   <el-dialog
          ref="dataForm"
          style="margin-top: -13vh"
          title="Set Driver"
          :show-close="false"
          :visible.sync="dialogFormVisible"> 
           <el-select
        v-model="drivers"
        filterable
        placeholder="السائق"
      >
        <el-option
          v-for="item in drivers"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
          <span style="float: left">{{ item.label }}</span>
          <span style="float: right; color: #8492a6; font-size: 13px">{{
            item.value
          }}</span>
        </el-option>
      </el-select>
          </el-dialog>
</div>
</template>
<script>
import { GetDriversLabel, SetDriver } from "@/api/Driver";
export default {
  name: 'DriverToOrder',
  props: ["Id", "Status", "drivers"],
   data () {
    
    return {
      dialogFormVisible: false,
      driverslist: [],
      driver: 0,
    }
  },
   created() {
    this.getdata();
  },
  methods: {
    getdata() {
      this.loading = true;
      GetDriversLabel()
        .then(response => {
          // handle success
          console.log("drivers", response)
          this.drivers = response;
          this.loading = false;
        })
        .catch(error => {
          // handle error
          console.log(error);
        });
    },
    
            SetDriverf() {
          SetDriver(this.drivers)
            .then((response) => {
              this.dialogFormVisible = false;
              this.$notify({
                title: "تم ",
                message: "تم الإضافة بنجاح",
                type: "success",
                duration: 2000,
              });
            })
            .catch((error) => {
              console.log(error);
            });
        
    },
       
      
    }
  
}
</script>
