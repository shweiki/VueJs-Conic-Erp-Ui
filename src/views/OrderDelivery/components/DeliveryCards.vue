<template>
  <section class="overview-block-ptb">
    <div class="container">
      <div class="row">
<el-row :gutter="20" class="panel-group" style="  margin: 20px 2px;">
  <div v-for="(option,index) in DeliveryData" :key="index">


    
 <el-col :xs="12" :sm="12" :lg="12" class="card-panel-col">
      <div class="card-panel">
        <el-row :gutter="20">
             <el-col :span="6">
        <div class="card-panel-icon-wrapper icon-people">
          <svg-icon icon-class="neworder" class-name="card-panel-icon" />
        </div>
          </el-col> 
            <el-col :span="8">
               <br>
            <div class="card-panel-description">
           <div class="card-panel-id"> {{option.Id}} </div> </div>
          </el-col> 
           <el-col :span="10">
        <div class="card-panel-description">
           <br> 
          <div class="card-panel-time">{{ option.FakeDate }}</div>
        </div>
          </el-col>
        </el-row>

        <el-row :gutter="24">
           <el-col :span="8">
            <div class="card-panel-description">
           <div class="card-panel-phone"> {{option.PhoneNumber}} </div> </div>
          </el-col>  
          <el-col :span="16">
            <div class="card-panel-description">
           <div class="card-panel-name"> {{option.Name}} </div> </div>
          </el-col>  
                
          </el-row>

           <el-row :gutter="24">
            <el-col :span="8">
            <div class="card-panel-description">
           <div class="card-panel-id"> {{option.TotalPrice}} JOD </div> </div>
          </el-col> 
          <el-col :span="16">
            <div class="card-panel-description">
           <div class="card-panel-name"> {{option.Region}} </div> </div>
          </el-col>          
          </el-row>
          <br>
           <el-row :gutter="24">
             <driver-to-order 
             :oid="option.id"
             :IsPrime="option.IsPrime" />
                <order-details
                :oid="option.id"
                :status="option.status"
                :IsPrime="option.IsPrime" />
          </el-row>
      </div>
    </el-col>
<!-- <delivery-card
                :icon="option.icon"
                :name="option.name"
                :time="option.time"
                :totalPrice="option.totalPrice"
                :address="option.address"
                :phone="option.phone"
                :id="option.id"></delivery-card> -->
  </div>
</el-row> 

      </div>
    </div>
  </section>
</template>
<script>
import OrderDetails from "./OrderDetails.vue";
import DriverToOrder from "./DriverToOrder.vue";
import { GetOrderDelivery } from "@/api/OrderDelivery";
export default {
  name: 'DeliveryCards',
components: {
    OrderDetails, DriverToOrder },
  data () {
    return {
      DeliveryData: [],
      OrderData: [
        {
          icon: 'neworder',
          time: "02/08/2021 05:22",
          name: "اسم الزبون",
          address:"عنوان الزبون",
          phone:"0781234567",
          id: "102",
          totalPrice: "05.75",
          status: "New Order",
          IsPrime:1
        },
        {
          icon: 'deliverytruck',
          time: "02/08/2021 05:22",
          name: "اسم الزبون",
          address:"عنوان الزبون",
          phone:"0781234567",
          id: "103",
          totalPrice: "12.00",
          status: "With Driver",
          IsPrime:0
        },
         {
          icon: 'checked',
          time: "02/08/2021 05:22",
          name: "اسم الزبون",
          address:"عنوان الزبون",
          phone:"0781234567",
          id: "1024",
          totalPrice: "02.50",
          status: "Done",
          IsPrime:0
        },
        {
          icon: 'cancel',
          time: "02/08/2021 05:22",
          name: "اسم الزبون",
          address:"عنوان الزبون",
          phone:"0781234567",
          id: "1025",
          totalPrice: "12.00",
          status: "Canceled",
          IsPrime:0
        },

      ],

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

      .card-panel-num {
        font-size: 20px;
      }
    }
  }
}

@media (max-width: 550px) {
  .card-panel-description {
    display: none;
  }

  .card-panel-icon-wrapper {
    float: none !important;
    width: 100%;
    height: 100%;
    margin: 0 !important;

    .svg-icon {
      display: block;
      margin: 14px auto !important;
      float: none !important;
    }
  }
}
</style>
