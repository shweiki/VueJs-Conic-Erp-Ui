<template>
  <div>
    <el-col :span="24" v-if="Temp.Status == 2 && caller != 'Driver'">
      <el-button
        style="float: right"
        icon="el-icon-info"
        type="primary"
        :size="$store.getters.size"
        @click="dialogFormVisible = true"
        >{{ $t("Delivery.Details") }}
      </el-button>
    </el-col>
    <el-col :span="12" v-else style="padding-top: 10px">
      <el-button
        style="float: right"
        icon="el-icon-info"
        type="primary"
        :size="$store.getters.size"
        @click="dialogFormVisible = true"
        >{{ $t("Delivery.Details") }}
      </el-button>
    </el-col>

    <el-dialog
      style="margin-top: -13vh"
      :show-close="false"
      :title="$t('Delivery.DOrderInfo')"
      width="100%"
      center
      :visible.sync="dialogFormVisible"
    >
      <el-descriptions
        class="margin-top"
        :title="$t('Delivery.CustomerInfo')"
        :column="1"
        border
      >
        <el-descriptions-item
          :label-style="{ 'text-align': 'right' }"
          :content-style="{ 'text-align': 'right' }"
        >
          <template slot="label">
            <i class="el-icon-user"></i>
            {{ $t("Delivery.CustomerName") }}
          </template>
          <el-tag size="small">{{ Temp.Name }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item
          :label-style="{ 'text-align': 'right' }"
          :content-style="{ 'text-align': 'right' }"
        >
          <template slot="label">
            <i class="el-icon-location-outline"></i>
            Table No
          </template>
          <el-tag size="small">{{ Temp.TableNo }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item
          :label-style="{ 'text-align': 'right' }"
          :content-style="{ 'text-align': 'right' }"
        >
          <template slot="label">
            <i class="el-icon-mobile-phone"></i>
            {{ $t("Delivery.Phone") }}
          </template>
          <el-tag size="small" type="success">
            <a :href="`tel:${Temp.PhoneNumber}`"> {{ Temp.PhoneNumber }} </a>
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item
          :label-style="{ 'text-align': 'right' }"
          :content-style="{ 'text-align': 'right' }"
        >
          <template slot="label">
            <i class="el-icon-tickets"></i>
            {{ $t("Items.Notes") }}
          </template>
          <el-tag size="small">{{ Temp.Description }}</el-tag>
        </el-descriptions-item>
      </el-descriptions>
      <br />
      <el-descriptions
        class="margin-top"
        :title="$t('Delivery.OrderInfo')"
        :column="1"
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
          <el-tag size="small">{{ Temp.FakeDate | parseTime("{m}-{d} {h}:{i}") }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item
          :label-style="{ 'text-align': 'right' }"
          :content-style="{ 'text-align': 'right' }"
        >
          <template slot="label">
            <i class="el-icon-s-flag"></i>
            {{ $t("OrderInventories.Status") }}
          </template>
          <Status-Tag :Status="Temp.Status" TableName="OrderRestaurant" />
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
     
        <el-descriptions-item
          :label-style="{ 'text-align': 'right' }"
          :content-style="{ 'text-align': 'right' }"
        >
          <template slot="label">
            <i class="el-icon-office-building"></i>
            الاصناف
          </template>
          <el-tag size="small">{{ Temp.Content }}</el-tag>
        </el-descriptions-item>
      </el-descriptions>
      <span slot="footer" class="dialog-footer">
        <el-button size="medium" @click="dialogFormVisible = false" type="danger"
          >إغلاق</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>
<script>
import StatusTag from "@/components/Oprationsys/StatusTag";
export default {
  components: {
    StatusTag,
  },
  name: "OrderDetailsMobile",
  props: ["Temp", "caller"],
  data() {
    return {
      dialogFormVisible: false,
    };
  },
};
</script>
