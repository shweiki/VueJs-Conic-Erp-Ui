<template>
<div>
           <el-col :span="12" v-if="Status == 0">
             <el-button 
          style="float: right"
          icon="el-icon-info"
          type="primary"
          size="medium"
          @click="dialogFormVisible = true"
          >{{$t("Delivery.Details")}} </el-button>
          </el-col> 
          <el-col :span="24" v-else>
             <el-button 
          style="float: right"
          icon="el-icon-info"
          type="primary"
          size="medium"
          @click="dialogFormVisible = true"
          >{{$t("Delivery.Details")}} </el-button>
          </el-col> 
          <el-dialog
          style="margin-top: -13vh"
          :show-close="false"
          :title="$t('Delivery.DOrderInfo')"
          width="100%"
          :visible.sync="dialogFormVisible"> 
   
       <el-descriptions class="margin-top" :title="$t('Delivery.CustomerInfo')" :column="1" border>
    <el-descriptions-item :label-style="{'text-align': 'right'}" :content-style="{'text-align': 'right'}">
      <template slot="label">
        <i class="el-icon-user"></i>
        {{$t("Delivery.CustomerName")}}
      </template>
      <el-tag size="small">{{Name}}</el-tag>
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
        <i class="el-icon-mobile-phone"></i>
         {{$t("Delivery.Phone")}}
      </template>
      <el-tag size="small">{{PhoneNumber}}</el-tag>
    </el-descriptions-item>
    <el-descriptions-item :label-style="{'text-align': 'right'}" :content-style="{'text-align': 'right'}">
      <template slot="label">
        <i class="el-icon-tickets"></i>
        {{$t("Items.Notes")}}
      </template>
      <el-tag size="small">{{Description}}</el-tag>
    </el-descriptions-item>
  
  </el-descriptions>
  <br>
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
      <el-tag size="small">{{ FakeDate | parseTime("{m}-{d} {h}:{i}") }}</el-tag>
    </el-descriptions-item>
    <el-descriptions-item :label-style="{'text-align': 'right'}" :content-style="{'text-align': 'right'}">
      <template slot="label">
        <i class="el-icon-s-flag"></i>
        {{$t("OrderInventories.Status")}}
      </template>
      <el-tag size="small">{{Status}}</el-tag>
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
     <el-descriptions-item v-if="Status != 0" :label-style="{'text-align': 'right'}" :content-style="{'text-align': 'right'}">
      <template slot="label">
        <i class="el-icon-user-solid"></i>
         {{$t("Delivery.DriverName")}}
      </template>
      <el-tag size="small">{{Driver.Name}}</el-tag>
    </el-descriptions-item>
     <!-- <el-descriptions-item>
      <template slot="label">
        <i class="el-icon-office-building"></i>
        الاصناف
      </template>
      <el-tag size="small">{{Content}}</el-tag>
    </el-descriptions-item> -->
  </el-descriptions>
    
      </el-dialog>
</div>
</template>
<script>
export default {
  name: 'OrderDetails',
 props: ["Id", "Name", "PhoneNumber","TotalPill","TotalPrice","FakeDate","Region", "Status", "Description", "DeliveryPrice", "Driver", "Content" ],
  data () {
    
    return {
      dialogFormVisible: false
    }
 
  },
     methods: {
     
    },
}

</script>
