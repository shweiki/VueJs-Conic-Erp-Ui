<template>
<div>
           <el-col :span="12" v-if="Status == 0">
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
          title="معلومات طلب التوصيل"
          width="100%"
          :visible.sync="dialogFormVisible"> 
   
       <el-descriptions class="margin-top" title="معلومات الزبون" :column="1" border>
    <el-descriptions-item :label-style="{'text-align': 'right'}" :content-style="{'text-align': 'right'}">
      <template slot="label">
        <i class="el-icon-user"></i>
        إسم الزبون
      </template>
      <el-tag size="small">{{Name}}</el-tag>
    </el-descriptions-item>
    <el-descriptions-item :label-style="{'text-align': 'right'}" :content-style="{'text-align': 'right'}">
      <template slot="label">
        <i class="el-icon-location-outline"></i>
        المنطقة
      </template>
      <el-tag size="small">{{Region}}</el-tag>
    </el-descriptions-item>
    <el-descriptions-item :label-style="{'text-align': 'right'}" :content-style="{'text-align': 'right'}">
      <template slot="label">
        <i class="el-icon-mobile-phone"></i>
        رقم الهاتف
      </template>
      <el-tag size="small">{{PhoneNumber}}</el-tag>
    </el-descriptions-item>
    <el-descriptions-item :label-style="{'text-align': 'right'}" :content-style="{'text-align': 'right'}">
      <template slot="label">
        <i class="el-icon-tickets"></i>
        ملاحظات
      </template>
      <el-tag size="small">{{Description}}</el-tag>
    </el-descriptions-item>
  
  </el-descriptions>
  <br>
  <el-descriptions class="margin-top" title="معلومات الطلب" :column="1" border>
    <el-descriptions-item :label-style="{'text-align': 'right'}" :content-style="{'text-align': 'right'}">
      <template slot="label">
        <i class="el-icon-star-off"></i>
        رقم الطلب
      </template>
      <el-tag size="small">{{Id}}</el-tag>
    </el-descriptions-item>
    <el-descriptions-item :label-style="{'text-align': 'right'}" :content-style="{'text-align': 'right'}">
      <template slot="label">
        <i class="el-icon-date"></i>
        التاريخ
      </template>
      <el-tag size="small">{{ FakeDate | parseTime("{m}-{d} {h}:{i}") }}</el-tag>
    </el-descriptions-item>
    <el-descriptions-item :label-style="{'text-align': 'right'}" :content-style="{'text-align': 'right'}">
      <template slot="label">
        <i class="el-icon-s-flag"></i>
        الحالة
      </template>
      <el-tag size="small">{{Status}}</el-tag>
    </el-descriptions-item>
    <el-descriptions-item :label-style="{'text-align': 'right'}" :content-style="{'text-align': 'right'}">
      <template slot="label">
        <i class="el-icon-money"></i>
        سعر التوصيل
      </template>
      <el-tag size="small">{{DeliveryPrice}}</el-tag>
    </el-descriptions-item>
    <el-descriptions-item :label-style="{'text-align': 'right'}" :content-style="{'text-align': 'right'}">
      <template slot="label">
        <i class="el-icon-money"></i>
        قيمة الفاتورة
      </template>
      <el-tag size="small">{{TotalPill}}</el-tag>
    </el-descriptions-item>
    <el-descriptions-item :label-style="{'text-align': 'right'}" :content-style="{'text-align': 'right'}">
      <template slot="label">
        <i class="el-icon-money"></i>
        المبلغ الاجمالي
      </template>
      <el-tag size="small">{{TotalPrice}}</el-tag>
    </el-descriptions-item>
     <el-descriptions-item v-if="Status != 0" :label-style="{'text-align': 'right'}" :content-style="{'text-align': 'right'}">
      <template slot="label">
        <i class="el-icon-user-solid"></i>
        اسم السائق
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
