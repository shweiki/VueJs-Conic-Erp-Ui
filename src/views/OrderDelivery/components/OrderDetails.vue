<template>
<div>
           <el-col :span="12" v-if ="IsPrime">
             <el-button 
          style="float: right"
          icon="el-icon-info"
          type="primary"
          size="medium"
          @click="dialogFormVisible = true"
          >التفاصيل </el-button>
          </el-col> 
          <el-col :span="24" v-else>
             <el-button 
          style="float: right"
          icon="el-icon-info"
          type="primary"
          size="medium"
          @click="dialogFormVisible = true"
          >التفاصيل </el-button>
          </el-col> 
          <el-dialog
          style="margin-top: -13vh"
      :show-close="false"
      :visible.sync="dialogFormVisible"> <div> {{oid}} <br> Status: {{status}}</div></el-dialog>
</div>
</template>
<script>

export default {
  name: 'OrderDetails',
 props: ["oid", "IsPrime"],
  data () {
    
    return {
      dialogFormVisible: false
    }
  }
}

</script>
