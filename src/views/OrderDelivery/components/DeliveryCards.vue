<template>
  <section class="overview-block-ptb">
    <el-row type="flex">
      <el-col :span="4">
        <el-input
          v-model="listQuery.Any"
          placeholder="Search By Any  Name Or Id"
          class="filter-item"
          @keyup.enter.native="handleFilter"
        />
      </el-col>

      <el-col :span="3">
        <Sort-Options
          :Value="listQuery.Sort"
          @Set="
            (v) => {
              listQuery.Sort = v;
              handleFilter();
            }
          "
        />
      </el-col>
      <el-col :span="14">
        <Radio-Oprations             :value="listQuery.Status"

          tableName="OrderDelivery"
          @Set="
            (v) => {
              listQuery.Status = v;
              handleFilter();
            }
          "
        />
      </el-col>
      <el-col :span="2">
        <el-button
          v-waves
          class="filter-item"
          type="primary"
          icon="el-icon-search"
          @click="handleFilter"
        >
          {{ $t("table.search") }}
        </el-button>
      </el-col>
    </el-row>
    <div v-loading="listLoading" class="container">
      <div class="row">
        <el-row :gutter="20" class="panel-group" style="margin: 20px 2px">
          <div v-for="(option, index) in list" :key="index">
            <el-col :xs="24" :sm="12" :md="8" :lg="6" class="card-panel-col">
              <div class="card-panel">
                <el-row :gutter="20">
                  <el-col :span="8">
                    <div class="card-panel-icon-wrapper icon-people">
                      <Status-Icon
                        class="card-panel-icon"
                        :status="option.Status"
                        tableName="OrderDelivery"
                      />
                    </div>
                  </el-col>
                  <el-col :span="4">
                    <div class="card-panel-description">
                      <div class="card-panel-id">
                        {{ option.Id + "\\" + option.OrderId }}
                      </div>
                    </div>
                  </el-col>
                  <el-col :span="12">
                    <div class="card-panel-description">
                      <div class="card-panel-time">
                        {{ option.FakeDate | parseTime("{m}-{d} {h}:{i}") }}
                      </div>
                    </div>
                  </el-col>
                </el-row>

                <el-row :gutter="24">
                  <el-col :span="12">
                    <div class="card-panel-description">
                      <div class="card-panel-phone">{{ option.PhoneNumber }}</div>
                    </div>
                  </el-col>
                  <el-col :span="12">
                    <div class="card-panel-description">
                      <div class="card-panel-name">{{ option.Name }}</div>
                    </div>
                  </el-col>
                </el-row>
                <el-row :gutter="24">
                  <el-col :span="12">
                    <div class="card-panel-description">
                      <div class="card-panel-id">
                        {{ option.TotalPrice.toFixed($store.getters.settings.ToFixed) }}
                        JOD
                      </div>
                    </div>
                  </el-col>
                  <el-col :span="12">
                    <div class="card-panel-description">
                      <div class="card-panel-name">{{ option.Region }}</div>
                    </div>
                  </el-col>
                </el-row>
                <el-row :gutter="24">
                  <el-col :span="12">
                    <div class="card-panel-description">
                      <div class="card-panel-id" v-if="option.Driver != null">
                        {{ option.Driver.Name }}
                      </div>
                      <div class="card-panel-id" v-else>لا يوجد سائق</div>
                    </div>
                  </el-col>
                  <el-col :span="12">
                    <div class="card-panel-description">
                      <div class="card-panel-name">اسم السائق</div>
                    </div>
                  </el-col>
                </el-row>
                <el-row v-if="$store.getters.device != 'mobile'" :gutter="24">
                  <driver-to-order :Temp="option" @Done="handleFilter()" />
                  <order-details :Temp="option" />
                  <el-col :span="12" style="padding-top: 10px">
                    <div v-if="option.Status == 3">
                      <el-popconfirm
                        confirm-button-text="ترحيل"
                        cancel-button-text="لا, شكرا"
                        confirm-button-type="warning"
                        icon="el-icon-info"
                        :title="`تأكيد الطلب رقم  ${option.Id} وترحيله`"
                        @confirm="HasDone(option.Id)"
                      >
                        <el-button
                          slot="reference"
                          style="float: right"
                          type="warning"
                          :size="$store.getters.size"
                          >ترحيل الطلب
                        </el-button>
                      </el-popconfirm>
                    </div>
                  </el-col>
                </el-row>
                <el-row v-if="$store.getters.device === 'mobile'" :gutter="24">
                  <el-col :span="12" v-if="option.Status == 3" style="padding-top: 18px">
                    <el-popconfirm
                      confirm-button-text="ترحيل"
                      cancel-button-text="لا, شكرا"
                      confirm-button-type="warning"
                      icon="el-icon-info"
                      :title="`تأكيد الطلب رقم  ${option.Id} وترحيله`"
                      @confirm="HasDone(option.Id)"
                    >
                      <el-button
                        slot="reference"
                        style="float: right"
                        type="warning"
                        :size="$store.getters.size"
                        >ترحيل الطلب
                      </el-button>
                    </el-popconfirm>
                  </el-col>
                  <driver-to-order-mobile :Temp="option" @Done="handleFilter()" />
                  <order-details-mobile :Temp="option" caller="Manager" />
                </el-row>
              </div>
            </el-col>
          </div>
        </el-row>
      </div>
    </div>
    <pagination
      v-show="Totals.Rows > 0"
      :total="Totals.Rows"
      :page.sync="listQuery.Page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />
  </section>
</template>
<script>
import OrderDetails from "./OrderDetails.vue";
import DriverToOrder from "./DriverToOrder.vue";
import { GetOrderDelivery, OrderDone } from "@/api/OrderDelivery";
import waves from "@/directive/waves"; // waves directive
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
import SortOptions from "@/components/SortOptions"; // secondary package based on el-pagination
import RadioOprations from "@/components/Oprationsys/RadioOprations.vue";
import StatusIcon from "@/components/Oprationsys/StatusIcon.vue";
import DriverToOrderMobile from "./DriverToOrderMobile.vue";
import OrderDetailsMobile from "./OrderDetailsMobile.vue";

export default {
  name: "DeliveryCards",
  components: {
    OrderDetails,
    DriverToOrder,
    Pagination,
    SortOptions,
    RadioOprations,
    StatusIcon,
    DriverToOrderMobile,
    OrderDetailsMobile,
  },
  directives: { waves },
  data() {
    return {
      list: [],
      Totals: { Rows: 0 },
      listLoading: false,
      listQuery: {
        Page: 1,
        Any: "",
        limit: this.$store.getters.settings.LimitQurey,
        Sort: "-id",
        Status: undefined,
      },
    };
  },
  created() {
    this.handleFilter();
  },
  methods: {
    getList() {
      this.listLoading = true;
      GetOrderDelivery(this.listQuery)
        .then((res) => {
          // handle success
          this.list = res.items;
          this.Totals = res.Totals;
          this.listLoading = false;
        })
        .catch((error) => {
          // handle error
          console.log(error);
        });
    },
    handleFilter() {
      this.listQuery.Page = 1;
      this.getList();
    },
    HasDone(id) {
      OrderDone({ id: id }).then((res) => {
        if (res) {
          this.$notify({
            title: "تم ارسال بنجاح",
            message: "تم ارسال بنجاح - " + +" ",
            type: "success",
            position: "top-left",
          });
          this.getList();
        } else {
          this.$notify.error({
            title: "error",
            message: "حصلت مشكلة ما",
            position: "top-left",
          });
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.panel-group {
  .card-panel-col {
    margin-bottom: 5px;
  }

  .card-panel {
    height: 170px;
    cursor: pointer;
    font-size: 14px;
    position: relative;
    overflow: hidden;
    background: #fff;
    border-color: rgba(0, 0, 0, 0.05);
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.3);
    padding-left: 15px;
    padding-right: 10px;
    padding-top: 5px;

    &:hover {
      .card-panel-icon-wrapper {
        background: #1b3459;
      }
    }

    .card-panel-icon-wrapper {
      color: #36a3f7;
      float: left;
      padding: 5px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }

    .card-panel-icon {
      float: left;
      font-size: 30px;
    }

    .card-panel-description {
      float: right;
      font-weight: bold;
      margin: 3px;
      margin-left: 0px;

      .card-panel-name {
        line-height: 20px;
        color: rgba(0, 0, 0, 0.8);
        font-size: 12px;
        text-align: right;
      }
      .card-panel-time {
        line-height: 20px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 14px;
        margin-bottom: 4px;
        text-align: right;
      }
      .card-panel-phone {
        text-align: left;
        line-height: 20px;
        color: rgba(0, 0, 0, 0.8);
        font-size: 12px;
      }
      .card-panel-id {
        text-align: left;
        line-height: 20px;
        color: rgb(0, 0, 0);
        font-size: 14px;
      }
    }
  }
}

@media only screen and (max-width: 767px) {
  .el-col-xs-24 {
    .card-panel {
      height: 190px;
      padding-top: 5px;
      .card-panel-description {
        float: none;
        .card-panel-id {
          text-align: center;
          line-height: 25px;
        }
        .card-panel-name {
          text-align: center;
          line-height: 25px;
        }
        .card-panel-time {
          text-align: center;
          line-height: 25px;
        }
      }
    }
  }
}
</style>
