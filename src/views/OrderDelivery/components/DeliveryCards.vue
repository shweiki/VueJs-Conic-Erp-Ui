<template>
  <section class="overview-block-ptb">
    <div class="container">
      <div class="row">
<el-row :gutter="20" class="panel-group" style="  margin: 20px 2px;">
  <div v-for="(option,index) in DeliveryData" :key="index">


    
 <el-col :xs="24" :sm="12" :lg="12" class="card-panel-col">
      <div class="card-panel">
        <el-row :gutter="20">
             <el-col :xs="0" :sm="6" :lg="6">
        <div class="card-panel-icon-wrapper icon-people">
          <svg-icon icon-class="neworder" class-name="card-panel-icon" />
        </div>
          </el-col> 
          
            <el-col :xs="24" :sm="8" :lg="8">
               <br>
            <div class="card-panel-description">
           <div class="card-panel-id"> {{option.Id}} </div> </div>
          </el-col> 
          
           <el-col :xs="24" :sm="10" :lg="10">
        <div class="card-panel-description">
           <br> 
          <div class="card-panel-time">{{ option.FakeDate | parseTime("{m}-{d} {h}:{i}")}}</div>
        </div>
          </el-col>
        </el-row>

        <el-row :gutter="24">
           <el-col :xs="0" :sm="8" :lg="8">
            <div class="card-panel-description">
           <div class="card-panel-phone"> {{option.PhoneNumber}} </div> </div>
          </el-col>  
          <el-col :xs="24" :sm="16" :lg="16">
            <div class="card-panel-description">
           <div class="card-panel-name"> {{option.Name}} </div> </div>
          </el-col>  
                
          </el-row>

           <el-row :gutter="24">
            <el-col :xs="24" :sm="8" :lg="8">
            <div class="card-panel-description">
           <div class="card-panel-id"> {{option.TotalPrice}} JOD </div> </div>
          </el-col> 
          <el-col :xs="24" :sm="16" :lg="16">
            <div class="card-panel-description">
           <div class="card-panel-name"> {{option.Region}} </div> </div>
          </el-col>          
          </el-row>
          <br>
           <el-row :gutter="24">
             <el-col :xs="0" :sm="24" :md="24" :lg="24" :xl="24" >
             <driver-to-order 
                :Id="option.Id"
                :Status="option.Status"
                :TotalPill="option.TotalPill"
                :TotalPrice="option.TotalPrice"
                :FakeDate="option.FakeDate"
                :Region="option.Region"
                :DeliveryPrice="option.DeliveryPrice"
                 />
                <order-details
                :Id="option.Id"
                :Status="option.Status"
                :Name="option.Name"
                :PhoneNumber="option.PhoneNumber"
                :TotalPill="option.TotalPill"
                :TotalPrice="option.TotalPrice"
                :Description="option.Description"
                :FakeDate="option.FakeDate"
                :Region="option.Region"
                :DeliveryPrice="option.DeliveryPrice"
                :Driver="option.Driver"
                :Content="option.Content"
                 />
             </el-col>
                 <el-col :xs="24" :sm="0" :md="0" :lg="0" :xl="0">
             <driver-to-order-mobile 
                :Id="option.Id"
                :Status="option.Status"
                :TotalPill="option.TotalPill"
                :TotalPrice="option.TotalPrice"
                :FakeDate="option.FakeDate"
                :Region="option.Region"
                :DeliveryPrice="option.DeliveryPrice"
                 />
                <order-details-mobile
                :Id="option.Id"
                :Status="option.Status"
                :Name="option.Name"
                :PhoneNumber="option.PhoneNumber"
                :TotalPill="option.TotalPill"
                :TotalPrice="option.TotalPrice"
                :Description="option.Description"
                :FakeDate="option.FakeDate"
                :Region="option.Region"
                :DeliveryPrice="option.DeliveryPrice"
                :Driver="option.Driver"
                :Content="option.Content"
                 />
             </el-col>
          </el-row>
      </div>
    </el-col>
  </div>
</el-row> 

      </div>
    </div>
  </section>
</template>
<script>
import OrderDetails from "./OrderDetails.vue";
import DriverToOrder from "./DriverToOrder.vue";
import DriverToOrderMobile from "./DriverToOrderMobile.vue";
import OrderDetailsMobile from "./OrderDetailsMobile.vue";
import { GetOrderDelivery } from "@/api/OrderDelivery";
export default {
  name: 'DeliveryCards',
components: {
    OrderDetails, DriverToOrder, OrderDetailsMobile, DriverToOrderMobile },
  data () {
    return {
      DeliveryData: [],
    }
  },
  created() {
     this.getdata();
  },
  methods: {
     getdata() {
      this.loading = true;
      GetOrderDelivery()
        .then((response) => {
          // handle success
          console.log("order data",response);
          this.DeliveryData = response;
          this.loading = false;
        })
        .catch((error) => {
          // handle error
          console.log(error);
        });
    },
  }
  
}

</script>

<style lang="scss" scoped>
.panel-group {

  .card-panel-col {
    margin-bottom: 5px;
    
  }

  .card-panel {
    height: 280px;
    cursor: pointer;
    font-size: 14px;
    position: relative;
    overflow: hidden;
    color: #009432;
    background: #fff;
    border-color: rgba(0, 0, 0, 0.05);
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.3);
    padding-left: 15px;
    padding-right: 10px;

    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
        background: #1b3459;
      }

    }


    .card-panel-icon-wrapper {
      color: #36a3f7;
      float: left;
      margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }

    .card-panel-icon {
      float: left;
      font-size: 50px;
    }

    .card-panel-description {
      float: right;
      font-weight: bold;
      margin: 10px;
      margin-left: 0px;

       .card-panel-name {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.80);
        font-size: 16px;
        margin-bottom: 12px;
        text-align: right;
      }
      .card-panel-time {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
        text-align: right;
      }
      .card-panel-phone {
      text-align: left;
      line-height: 18px;
        color: rgba(0, 0, 0, 0.80);
        font-size: 20px;
        }
        .card-panel-id {
      text-align: left;
      line-height: 18px;
        color: rgb(0, 0, 0);
        font-size: 24px;
        }
    }
  }
 
}

@media only screen and (max-width: 767px)
{
.el-col-xs-24 {
  .card-panel{
    height: 300px;
   .card-panel-description{
     float: none;
        .card-panel-id {
          text-align: center;
          line-height: 10px;
        }
        .card-panel-name{
          text-align: center;
          line-height: 10px;
        }
        .card-panel-time {
          text-align: center;
          line-height: 10px;
        }
  }
  }
}

}
</style>
