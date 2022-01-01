<template>
  <div>
    <el-col :span="12" v-if="Temp.Status == 0" style="padding-top: 10px;">
    <el-button
      style="float: left"
      type="success"
      :size="$store.getters.size"
      icon="el-icon-plus"
      @click="dialogFormVisible = true"
    >
      انتهاء التحضير</el-button>
    </el-col>

    <el-dialog
      ref="dataForm"
      style="margin-top: -13vh"
      title="تسليم الطلب للزبون"
      :show-close="false"
      :visible.sync="dialogFormVisible"
    >
      <el-row type="flex">
        <el-descriptions
          class="margin-top"
          :title="$t('Delivery.OrderInfo')"
          :column="2"
          border
        >
          <el-descriptions-item
            :label-style="{ 'text-align': 'right' }"
            :content-style="{ 'text-align': 'right' }"
          >
            <template slot="label">
              <i class="el-icon-star-off"></i>
              {{ $t("Delivery.OrderNo") }}
            </template>
            <el-tag size="small">{{ Temp.OrderId }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item
            :label-style="{ 'text-align': 'right' }"
            :content-style="{ 'text-align': 'right' }"
          >
            <template slot="label">
              <i class="el-icon-date"></i>
              {{ $t("Sales.Date") }}
            </template>
            <el-tag size="small">{{
              Temp.FakeDate | parseTime("{m}-{d} {h}:{i}")
            }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item
            :label-style="{ 'text-align': 'right' }"
            :content-style="{ 'text-align': 'right' }"
          >
            <template slot="label">
              <i class="el-icon-location-outline"></i>
              رقم الطاولة
            </template>
            <el-tag size="small">{{ Temp.TableNo }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item
            :label-style="{ 'text-align': 'right' }"
            :content-style="{ 'text-align': 'right' }"
          >
            <template slot="label">
              <i class="el-icon-money"></i>
              الإسم
            </template>
            <el-tag size="small">{{ Temp.Name }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item
            :label-style="{ 'text-align': 'right' }"
            :content-style="{ 'text-align': 'right' }"
          >
            <template slot="label">
              <i class="el-icon-money"></i>
              {{ $t("Delivery.ReceiptTotal") }}
            </template>
            <el-tag size="small">{{ Temp.TotalPill }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item
            :label-style="{ 'text-align': 'right' }"
            :content-style="{ 'text-align': 'right' }"
          >
            <template slot="label">
              <i class="el-icon-money"></i>
              {{ $t("Delivery.TotalAmmount") }}
            </template>
            <el-tag size="small">{{ Temp.TotalPrice }}</el-tag>
          </el-descriptions-item>
        </el-descriptions>
      </el-row>
      <br />
         <el-button
      style="float: left"
      type="primary"
      :size="$store.getters.size"
      icon="el-icon-check"
      @click="OrderTable(Temp.Id)"
    >
      تسليم للزبون</el-button>
      <br />
    </el-dialog>
  </div>
</template>
<script>

import { OrderOnTable } from "@/api/OrderRestaurant";
export default {
  name: "OrderDelivered",
  props: ["Temp"],
  data() {
    return {
      dialogFormVisible: false,
    };
  },
methods: {
  OrderTable(id){
     OrderOnTable({ OrderId: id }).then((res) => {
        if (res) {
          this.$notify({
            title: "تم ارسال بنجاح",
            message: "تم ارسال بنجاح - " + +" ",
            type: "success",
            position: "top-left",
          });
        } else {
          this.$notify.error({
            title: "error",
            message: "حصلت مشكلة ما",
            position: "top-left",
          });
        }
        this.dialogFormVisible= false
      });
  }
}
};
</script>
