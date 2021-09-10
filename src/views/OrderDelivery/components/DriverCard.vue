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
      <el-col :span="10">
        <Radio-Oprations
          TableName="OrderDelivery"
          @Set="
            (v) => {
              listQuery.Status = v;
              handleFilter();
            }
          "
        />
      </el-col>
      <el-col :span="6">
        <el-button
          v-waves
          class="filter-item"
          type="primary"
          icon="el-icon-search"
          @click="handleFilter"
        >
          Search
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
                        :Status="option.Status"
                        TableName="OrderDelivery"
                      />
                    </div>
                  </el-col>
                  <el-col :span="4">
                    <div class="card-panel-description">
                      <div class="card-panel-id">{{ option.Id }}</div>
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
                      <div class="card-panel-phone">
                         <el-tag size="small" type="success">
                            <a :href="`tel:+${ option.PhoneNumber }`"> {{ option.PhoneNumber }} </a>
                         </el-tag> 
                       </div>
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
                      <div class="card-panel-region">{{ option.Region }}</div>
                    </div>
                  </el-col>
                </el-row>
                <el-row :gutter="24">
                    <order-details-mobile :Temp="option" caller="Driver" />

                </el-row>
                <!-- <el-row v-if="$store.getters.device === 'mobile'" :gutter="24">
                    <driver-to-order-mobile :Temp="option" @Done="handleFilter()" />
                    <order-details-mobile :Temp="option" />
                </el-row> -->
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
      @pagination="getdata"
    />
  </section>
</template>
<script>
import OrderDetailsMobile from "./OrderDetailsMobile.vue";
import { GetDriverOrder } from "@/api/OrderDelivery";
import { mapGetters } from "vuex";
import RadioOprations from "@/components/Oprationsys/RadioOprations.vue";
import StatusIcon from "@/components/Oprationsys/StatusIcon.vue";
import waves from "@/directive/waves";
import Pagination from "@/components/Pagination";
import SortOptions from "@/components/SortOptions";
export default {
  name: "DeliveryCards",
  components: {
    OrderDetailsMobile,
    RadioOprations,
    StatusIcon,
    Pagination,
    SortOptions

  },
  directives: { waves },
  data() {
    return {
      list: [],
      Totals: { Rows: 0 },
      user: {},
      listLoading: false,
        listQuery: {
        Page: 1,
        Any: "",
        limit: this.$store.getters.settings.LimitQurey,
        Sort: "+id",
        Status: undefined,
      },
    };
  },
  computed: {
    ...mapGetters(["Id", "name"]),
  },
  created() {
    this.handleFilter();
  },
  methods: {
    getdata() {
      this.user = {
        Id: this.Id,
        name: this.name,
      };
      this.listLoading = true;
      GetDriverOrder({ id: this.user.Id, name: this.user.name, Page: this.listQuery.Page ,Any:this.listQuery.Any, limit:this.listQuery.limit, Sort:this.listQuery.Sort, Status:this.listQuery.Status})
        .then((response) => {
          // handle success
          this.list = response.items;
          this.Totals = response.Totals;
          //this.DeliveryData = response;
          this.listLoading = false;
        })
        .catch((error) => {
          // handle error
          console.log(error);
        });
    },
    handleFilter() {
      this.listQuery.Page = 1;
      this.getdata();
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
        line-height: 32px;
        color: rgba(0, 0, 0, 0.8);
        font-size: 12px;
        text-align: right;
      }
        .card-panel-region {
        line-height: 32px;
        color: rgba(0, 0, 0, 0.8);
        font-size: 12px;
        text-align: right;
        margin-bottom: 4px;
      }
      .card-panel-time {
        line-height: 32px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 12px;
        margin-bottom: 4px;
        text-align: right;
      }
      .card-panel-phone {
        line-height: 32px;
        color: rgba(0, 0, 0, 0.8);
        font-size: 12px;
      }
      .card-panel-id {
        line-height: 32px;
        color: rgb(0, 0, 0);
        font-size: 14px;
      }
    }
  }
}

</style>
