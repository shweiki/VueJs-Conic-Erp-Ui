<template>
  <div>
    <el-col :span="24" v-if="Temp.Status == 2" style="padding-top: 10px">
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
      width="60%"
      :visible.sync="dialogFormVisible"
    >
      <el-descriptions
        class="margin-top"
        :title="$t('Delivery.CustomerInfo')"
        :column="2"
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
            {{ $t("AddVendors.Region") }}
          </template>
          <el-tag size="small">{{ Temp.Region }}</el-tag>
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
          <el-tag size="small">{{ Temp.Id + "\\" + Temp.OrderId }}</el-tag>
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
          <el-row type="flex">
            <el-col :span="10">
              <Dialog-Action-Log tableName="OrderDelivery" :ObjId="Temp.Id" />
            </el-col>
            <el-col :span="14">
              <Status-Tag :status="Temp.Status" tableName="OrderDelivery" />
            </el-col>
          </el-row>
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
        <el-descriptions-item
          v-if="Temp.Status != 0"
          :label-style="{ 'text-align': 'right' }"
          :content-style="{ 'text-align': 'right' }"
          :span="2"
        >
          <template slot="label">
            <i class="el-icon-user-solid"></i>
            {{ $t("Delivery.DriverName") }}
          </template>
          <el-tag size="small">{{ Temp.Driver.Name }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item
          :span="2"
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
      <div>
        <el-col v-if="Temp.Status == 1">
          <driver-select
            @Set="
              (v) => {
                SetDriver(v.value, Temp.Id);
              }
            "
          />
        </el-col>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import DriverSelect from "./DriverSelect.vue";
import StatusTag from "@/components/Oprationsys/StatusTag";
import { SetDriver } from "@/api/OrderDelivery";
import DialogActionLog from "@/components/ActionLog/DialogActionLog.vue";
export default {
  components: {
    StatusTag,
    DriverSelect,
    DialogActionLog,
  },
  name: "OrderDetails",
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
