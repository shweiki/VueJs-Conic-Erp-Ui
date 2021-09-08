<template>
<div>
 
         <el-row> 
           <el-col :span="14"> 
             <el-tooltip :content="'إضافة سائق'" placement="top">
    <add-driver />
    </el-tooltip>
    </el-col> 
           <el-col :span="10">
      <el-select
        @change="SetVal"
        v-model="Driver"
        filterable
        placeholder="السائق"
      >
        <el-option
          v-for="item in Drivers"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
          <span style="float: left">{{ item.label }}</span>
        </el-option>
      </el-select>
    </el-col> 
    </el-row>
    <el-row>
    <el-col :span="6">
    <el-button
      style="float: left"
      type="success"
      icon="fa fa-save"
      @click="AssignDriver()"
      >تعيين</el-button>
    </el-col>
    </el-row>
          
</div>
</template>
<script>
import { GetDriversLabel } from "@/api/Driver";
import { SetDriver } from "@/api/OrderDelivery";
import AddDriver from "@/components/Drivers/AddDriver.vue";
export default {
  components: { AddDriver },
  props: ["Id"],
  
  data() {
    return {
      Driver: "",
      Drivers: [],
      tempForm:{
        Id: 0,
        DriverId: 0
      }
    };
  },
  // watch: {
  //   Value(val) {
  //     if (val) {
  //       this.Driver = this.Drivers.find(element => element.label == val).value;
  //       this.SetVal(this.Driver);
  //     }
  //   }
  // },
  created() {
    this.getdata();
    // this.SetVal(this.Driver);
  },
  methods: {
    getdata() {
      this.loading = true;
      GetDriversLabel()
        .then(response => {
          // handle success
          console.log(response);
          this.Drivers = response;
          this.loading = false;
        })
        .catch(error => {
          // handle error
          console.log(error);
        });
    },
    SetVal(val) {
      if (val) {
        this.$emit(
          "SetDriver",
          this.tempForm.DriverId = this.Drivers.find(element => element.value == val).value,
          this.tempForm.Id = this.Id,);
      }
    },
    AssignDriver(){
        this.$emit("Set", this.tempForm);
        console.log("set val driver",this.tempForm );
          SetDriver(this.tempForm);
    }
  }
};

</script>
