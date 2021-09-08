<template>
  <section class="overview-block-ptb">
    <div class="container">
      <div class="row">
<el-row :gutter="24" class="panel-group" style="  margin: 20px 2px;">
  <div v-for="(option,index) in DeliveryData" :key="index">
<el-col :span="24" class="card-panel-col">
  <div class="card-panel">
<el-col>
  <el-row>
   <div class="card-panel-description">
           
          <div class="card-panel-time">{{ option.FakeDate | parseTime("{m}-{d} {h}:{i}") }}</div>
        </div>
        </el-row>
        <el-row>
        <div class="card-panel-description">
           <div class="card-panel-name"> {{option.Name}} </div> </div>
           </el-row>
           <el-row>
            <div class="card-panel-description">
           <div class="card-panel-name"> {{option.Region}} </div> </div>
           </el-row><el-row>
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
                 </el-row>
</el-col>
<el-col></el-col>
<el-col></el-col>
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
import { GetOrderDelivery } from "@/api/OrderDelivery";
export default {
  name: 'DeliveryCards',
components: {
    OrderDetails, DriverToOrder },
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
    margin-bottom: 10px;
  }

  .card-panel {
    height: 270px;
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

// @media (max-width: 200px) {
//   .card-panel-description {
//     display: none;
//   }

//   .card-panel-icon-wrapper {
//     float: none !important;
//     width: 100%;
//     height: 100%;
//     margin: 0 !important;

//     .svg-icon {
//       display: block;
//       margin: 14px auto !important;
//       float: none !important;
//     }
//   }
// }
</style>
