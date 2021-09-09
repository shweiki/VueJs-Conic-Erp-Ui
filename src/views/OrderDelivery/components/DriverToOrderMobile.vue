<template>
<div>
    <el-col :span="12">
      <el-button v-if="Status == 0"
          style="float: left"
          type="success"
          size="medium"
          icon="el-icon-plus"
          @click="dialogFormVisible = true"
          >{{$t("Delivery.AssignDriver")}} </el-button>
            
          </el-col>  
   <el-dialog
          ref="dataForm"
          style="margin-top: -13vh"
          :title="$t('Delivery.SetDriver')"
          width="100%"
          :show-close="false"
          :visible.sync="dialogFormVisible"> 
          <el-row>
  <el-descriptions class="margin-top" :title="$t('Delivery.OrderInfo')" :column="1" border>
    <el-descriptions-item :label-style="{'text-align': 'right'}" :content-style="{'text-align': 'right'}">
      <template slot="label">
        <i class="el-icon-star-off"></i>
        {{$t("Delivery.OrderNo")}} 
      </template>
      <el-tag size="small">{{Id}}</el-tag>
    </el-descriptions-item>
    <el-descriptions-item :label-style="{'text-align': 'right'}" :content-style="{'text-align': 'right'}">
      <template slot="label">
        <i class="el-icon-date"></i>
        {{$t("Sales.Date")}}
      </template>
      <el-tag size="small">{{FakeDate | parseTime("{m}-{d} {h}:{i}")}}</el-tag>
    </el-descriptions-item>
    <el-descriptions-item :label-style="{'text-align': 'right'}" :content-style="{'text-align': 'right'}">
      <template slot="label">
        <i class="el-icon-location-outline"></i>
        {{$t("AddVendors.Region")}}
      </template>
      <el-tag size="small">{{Region}}</el-tag>
    </el-descriptions-item>
    <el-descriptions-item :label-style="{'text-align': 'right'}" :content-style="{'text-align': 'right'}">
      <template slot="label">
        <i class="el-icon-money"></i>
        {{$t("Delivery.DeliveryPrice")}}
      </template>
      <el-tag size="small">{{DeliveryPrice}}</el-tag>
    </el-descriptions-item>
    <el-descriptions-item :label-style="{'text-align': 'right'}" :content-style="{'text-align': 'right'}">
      <template slot="label">
        <i class="el-icon-money"></i>
        {{$t("Delivery.ReceiptTotal")}}
      </template>
      <el-tag size="small">{{TotalPill}}</el-tag>
    </el-descriptions-item>
    <el-descriptions-item :label-style="{'text-align': 'right'}" :content-style="{'text-align': 'right'}">
      <template slot="label">
        <i class="el-icon-money"></i>
        {{$t("Delivery.TotalAmmount")}}
      </template>
      <el-tag size="small">{{TotalPrice}}</el-tag>
    </el-descriptions-item>
    
  </el-descriptions>
  </el-row>
  <br>
  <el-row>
          <driver-select
          :Id="this.Id"
             @Set="
          (v) => {
            change(v);
          }
        ">
          </driver-select>
       </el-row>
          </el-dialog>
</div>
</template>
<script>
import DriverSelect from "./DriverSelect.vue"
export default {
  name: 'DriverToOrder',
  components: {DriverSelect},
  props: ["Id","TotalPill","TotalPrice","FakeDate","Region", "Status", "DeliveryPrice" ],
   data () {
    
    return {
      dialogFormVisible: false,
      driverslist: [],
      driver: 0,
    }
  },
   created() {
    // this.getdata();
  },
  methods: {
   change(val) {
     this.dialogFormVisible = false
     this.$emit("Set", val);
   }       
      
    }
  
}
</script>
