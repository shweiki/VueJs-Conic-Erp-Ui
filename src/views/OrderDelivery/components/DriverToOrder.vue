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
      {{ $t("Delivery.AssignDriver") }}</el-button>
    </el-col>
    <el-col :span="12" v-if="Temp.Status == 1" style="padding-top: 10px;">
     <el-button
    v-if="Temp.Status == 1"
      style="float: left"
      type="success"
      :size="$store.getters.size"
      icon="el-icon-plus"
      @click="dialogFormVisible = true"
    >
      Delivery</el-button></el-col>
    <el-dialog
      ref="dataForm"
      style="margin-top: -13vh"
      :title="$t('Delivery.SetDriver')"
      :show-close="false"
      :visible.sync="dialogFormVisible"
    >
      <el-row>
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
            <el-tag size="small">{{ Temp.Id }}</el-tag>
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
              {{ $t("AddVendors.Region") }}
            </template>
            <el-tag size="small">{{ Temp.Region }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item
            :label-style="{ 'text-align': 'right' }"
            :content-style="{ 'text-align': 'right' }"
          >
            <template slot="label">
              <i class="el-icon-money"></i>
              {{ $t("Delivery.DeliveryPrice") }}
            </template>
            <el-tag size="small">{{ Temp.DeliveryPrice }}</el-tag>
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
      <el-row>
        <driver-select
          @Set="
            (v) => {
              SetDriver(v.value, Temp.Id);
            }
          "
        />
      </el-row>
    </el-dialog>
  </div>
</template>
<script>
import { SetDriver } from "@/api/OrderDelivery";

import DriverSelect from "./DriverSelect.vue";
export default {
  name: "DriverToOrder",
  components: { DriverSelect },
  props: ["Temp"],
  data() {
    return {
      dialogFormVisible: false,
    };
  },
  methods: {
    SetDriver(driverid, orderid) {
      SetDriver({ DriverId: driverid, OrderId: orderid }).then((res) => {
        if (res) {
          this.dialogFormVisible = false;
          this.$emit("Done");
        }
      });
    },
  },
};
</script>
