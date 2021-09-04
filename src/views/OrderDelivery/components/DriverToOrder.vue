<template>
<div>
    <el-col :span="12">
      <el-button v-if ="IsPrime"
          style="float: left"
          type="success"
          size="medium"
          icon="el-icon-plus"
          @click="dialogFormVisible = true"
          >اضافة سائق</el-button>
            
          </el-col>  
   <el-dialog
          style="margin-top: -13vh"
      :show-close="false"
      :visible.sync="dialogFormVisible"> {{oid}}</el-dialog>
</div>
</template>
<script>

export default {
  name: 'DriverToOrder',
  props: ["oid", "IsPrime"],
   data () {
    
    return {
      dialogFormVisible: false
    }
  }
}
</script>
