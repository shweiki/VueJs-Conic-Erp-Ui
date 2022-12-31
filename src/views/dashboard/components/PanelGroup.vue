<template>
  <el-row :gutter="20" class="panel-group" style="margin: 20px 2px">
    <el-col
      v-if="Shows.MembersActive"
      :xs="6"
      :sm="6"
      :lg="6"
      class="card-panel-col"
    >
      <div class="card-panel" @click="handleSetLineChartData('MembersActive')">
        <div
          @dblclick="$router.push({ path: `/Gym/MembersLogs` })"
          class="card-panel-icon-wrapper icon-people"
        >
          <svg-icon icon-class="peoples" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            {{ $t("PanelGroup.ActiveMembers") }}
          </div>
          <count-to
            :start-val="0"
            :end-val="Totals.MembersActive"
            :duration="2600"
            class="card-panel-num"
          />
        </div>
      </div>
    </el-col>

    <el-col
      v-if="Shows.MsgCredit"
      :xs="6"
      :sm="6"
      :lg="6"
      class="card-panel-col"
    >
      <div class="card-panel" @click="handleSetLineChartData('MsgCredit')">
        <div class="card-panel-icon-wrapper icon-message">
          <svg-icon icon-class="message" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">{{ $t("PanelGroup.Messages") }}</div>
          <count-to
            :start-val="0"
            :end-val="parseInt(Totals.MsgCredit)"
            :duration="3000"
            class="card-panel-num"
          />
        </div>
      </div>
    </el-col>
    <el-col v-if="Shows.Members" :xs="6" :sm="6" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('Members')">
        <div
          @dblclick="$router.push({ path: `/Gym/MembersLogs` })"
          class="card-panel-icon-wrapper icon-people"
        >
          <svg-icon icon-class="peoples" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">{{ $t("PanelGroup.Members") }}</div>
          <count-to
            :start-val="0"
            :end-val="Totals.Members"
            :duration="2600"
            class="card-panel-num"
          />
        </div>
      </div>
    </el-col>
    <el-col v-if="Shows.Items" :xs="6" :sm="6" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('Items')">
        <div
          @dblclick="$router.push({ path: `/Item` })"
          class="card-panel-icon-wrapper icon-people"
        >
          <svg-icon icon-class="peoples" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">{{ $t("PanelGroup.Items") }}</div>
          <count-to
            :start-val="0"
            :end-val="Totals.Items"
            :duration="2600"
            class="card-panel-num"
          />
        </div>
      </div>
    </el-col>
    <el-col v-if="Shows.Clients" :xs="6" :sm="6" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('Clients')">
        <div
          @dblclick="$router.push({ path: `/Vendor/ListVendor` })"
          class="card-panel-icon-wrapper icon-people"
        >
          <svg-icon icon-class="peoples" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">{{ $t("PanelGroup.Customers") }}</div>
          <count-to
            :start-val="0"
            :end-val="Totals.Clients"
            :duration="2600"
            class="card-panel-num"
          />
        </div>
      </div>
    </el-col>

    <el-col
      v-if="Shows.Suppliers"
      :xs="6"
      :sm="6"
      :lg="6"
      class="card-panel-col"
    >
      <div class="card-panel" @click="handleSetLineChartData('Suppliers')">
        <div
          @dblclick="$router.push({ path: `/Vendor/ListVendor` })"
          class="card-panel-icon-wrapper icon-people"
        >
          <svg-icon icon-class="peoples" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">{{ $t("PanelGroup.Provider") }}</div>
          <count-to
            :start-val="0"
            :end-val="Totals.Suppliers"
            :duration="3000"
            class="card-panel-num"
          />
        </div>
      </div>
    </el-col>
    <el-col
      v-if="Shows.Purchases"
      :xs="6"
      :sm="6"
      :lg="6"
      class="card-panel-col"
    >
      <div class="card-panel" @click="handleSetLineChartData('Purchases')">
        <div
          @dblclick="$router.push({ path: `/Purchases` })"
          class="card-panel-icon-wrapper icon-money"
        >
          <svg-icon icon-class="money" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">{{ $t("PanelGroup.Purchases") }}</div>
          <count-to
            :start-val="0"
            :end-val="Totals.Purchases"
            :duration="3200"
            class="card-panel-num"
          />
        </div>
      </div>
    </el-col>
    <el-col v-if="Shows.Sales" :xs="6" :sm="6" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('Sales')">
        <div
          @dblclick="$router.push({ path: `/Sales` })"
          class="card-panel-icon-wrapper icon-shopping"
        >
          <svg-icon icon-class="shopping" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">{{ $t("PanelGroup.Sales") }}</div>
          <count-to
            :start-val="0"
            :end-val="Totals.Sales.Count"
            :duration="3600"
            class="card-panel-num"
          />
        </div>
      </div>
      <button type="button" @click="notify">Show notification</button>
    </el-col>
  </el-row>
</template>

<script>
import CountTo from "vue-count-to";

export default {
  props: {
    Totals: {
      type: Object,
      require: true,
    },
  },
  components: {
    CountTo,
  },
  data() {
    return {
      Shows: this.$store.getters.settings.Dashboard.ShowPanelGroup,
    };
  },

  methods: {
    notify() {
      // https://developer.mozilla.org/en-US/docs/Web/API/Notification/Notification#Parameters
      this.$notification.show(
        "Hello World",
        {
          body: "This is an example!",
        },
        {}
      );
    },
    handleSetLineChartData(type) {
      console.log(type);
      this.$emit("handleSetLineChartData", type);
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
    height: 80px;
    cursor: pointer;
    font-size: 14px;
    position: relative;
    overflow: hidden;
    color: #009432;
    background: #fff;
    border-color: rgba(0, 0, 0, 0.05);
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.3);

    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }

      .icon-people {
        background: #40c9c6;
      }

      .icon-message {
        background: #36a3f7;
      }

      .icon-money {
        background: #f4516c;
      }

      .icon-shopping {
        background: #34bfa3;
      }
    }

    .icon-people {
      color: #40c9c6;
    }

    .icon-message {
      color: #36a3f7;
    }

    .icon-money {
      color: #f4516c;
    }

    .icon-shopping {
      color: #34bfa3;
    }

    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }

    .card-panel-icon {
      float: left;
      font-size: 32px;
    }

    .card-panel-description {
      float: right;
      font-weight: bold;
      margin: 10px;
      margin-left: 0px;

      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
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
