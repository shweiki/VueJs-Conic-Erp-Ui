<template>
  <div>
    <el-row type="flex">
      <el-col :span="6">
        <settings />
      </el-col>
      <el-col :span="18">
        <el-card class="box-card">
          <div slot="header">
            <span>جميع اعدادات</span>
            <el-button type="success" @click="CheckUpdate">Check UpDate</el-button>
            <el-button type="success" @click="RestSetting"
              >Rest Defualt Setting</el-button
            >
            <el-button type="success" @click="getPrinterDevice"
              >get Printer Device</el-button
            >
          </div>
          <el-row type="flex">
            <el-col :span="8">
              <span>{{ $t("Settings.DateTimeFormat") }}</span>
              <el-input v-model="DateTimeFormat" />
            </el-col>
             <el-col :span="8">
              <span>{{ $t("Settings.title") }}</span>
              <el-input v-model="title" />
            </el-col>
          </el-row>
         
            <el-row type="flex">
            <el-col :span="8">
              <span>{{ $t("Settings.PointOfSaleLayout") }}</span>
              <el-select v-model="PointOfSaleLayout" placeholder="PointOfSaleLayout">
                <el-option label="SuperMarket" value="SuperMarket"> </el-option>
                <el-option label="CarsSpare" value="CarsSpare"> </el-option>
                <el-option label="Restaurant" value="Restaurant"> </el-option>
                <el-option label="Pharmacy" value="Pharmacy"> </el-option>
                <el-option label="Gym" value="Gym"> </el-option>
                <el-option label="Public" value="Public"> </el-option>
                <el-option label="KidsPlayArea" value="KidsPlayArea"> </el-option>
              </el-select>
            </el-col>
             <el-col :span="8">
              <span>{{ $t("Settings.CashPoolLayout") }}</span>
              <el-select v-model="CashPoolLayout" placeholder="CashPoolLayout">
                <el-option label="Restaurant" value="Restaurant"> </el-option>
              </el-select>
            </el-col>
              <el-col :span="8">
              <span>{{ $t("Settings.CashDrawerCOM") }}</span>
              <el-input v-model="CashDrawerCOM" />
            </el-col>
          </el-row>
          <el-row type="flex">
            <el-col :span="8">
              <span>{{ $t("Settings.PurchaseLayout") }}</span>
              <el-select v-model="PurchaseLayout" placeholder="PurchaseLayout">
                <el-option label="SuperMarket" value="SuperMarket"> </el-option>
                <el-option label="Pharmacy" value="Pharmacy"> </el-option>
              </el-select>
            </el-col>
            <el-col :span="8">
              <span>{{ $t("Settings.WorkShopLayout") }}</span>
              <el-select v-model="WorkShopLayout" placeholder="WorkShopLayout">
                <el-option label="Pubilc" value="Pubilc"> </el-option>
              </el-select>
            </el-col>
            <el-col :span="8">
              <span>{{ $t("Settings.BusinessType") }}</span>
              <el-select v-model="BusinessType" placeholder="Select">
                <el-option label="SuperMarkit" value="SuperMarkit"> </el-option>
                <el-option label="CarsSpare" value="CarsSpare"> </el-option>
                <el-option label="GymManagment" value="GymManagment"> </el-option>
                <el-option label="Restaurant" value="Restaurant"> </el-option>
              </el-select>
            </el-col>
            </el-row>
          
          <el-row type="flex">
            <el-col :span="8">
              <span>{{ $t("Settings.tagsView") }}</span>
              <el-switch v-model="tagsView" class="drawer-switch" />
            </el-col>
            <el-col :span="8">
              <span>{{ $t("Settings.showSettings") }}</span>
              <el-switch v-model="showSettings" class="drawer-switch" />
            </el-col>
            <el-col :span="8">
              <span>{{ $t("Settings.showRestOfBill") }}</span>
              <el-switch v-model="showRestOfBill" class="drawer-switch" />
            </el-col>
          </el-row>
          <el-row type="flex">
            <el-col :span="8">
              <span>{{ $t("Settings.fixedHeader") }}</span>
              <el-switch v-model="fixedHeader" class="drawer-switch" />
            </el-col>
            <el-col :span="8">
              <span>{{ $t("Settings.WithOutCheckItemIsExist") }}</span>
              <el-switch v-model="WithOutCheckItemIsExist" class="drawer-switch" />
            </el-col>
            <el-col :span="8">
              <span>{{ $t("Settings.sidebarLogo") }}</span>
              <el-switch v-model="sidebarLogo" class="drawer-switch" /> </el-col
            >
          </el-row>
           <el-row type="flex">
            <el-col :span="8">
              <span>{{ $t("Settings.BarcodeIsId") }}</span>
              <el-switch v-model="BarcodeIsId" class="drawer-switch" />
            </el-col>
            <el-col :span="8">
              <span>{{ $t("Settings.sidebarOpen") }}</span>
              <el-switch v-model="sidebarOpen" class="drawer-switch" />
            </el-col>
              </el-row>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { CheckUpdate, RestDefualtSetting } from "@/api/Setting";
import Settings from "@/layout/components/Settings/index";
import getPrinterDevice from "@/utils/get-printers";

export default {
  components: { Settings },

  computed: {
    isShowJob() {
      return this.$store.getters.settings.language;
    },

    title: {
      get() {
        return this.$store.state.settings.title;
      },
      set(val) {
        this.$store.dispatch("settings/changeSetting", {
          key: "title",
          value: val,
        });
      },
    },
    DateTimeFormat: {
      get() {
        return this.$store.state.settings.DateTimeFormat;
      },
      set(val) {
        this.$store.dispatch("settings/changeSetting", {
          key: "DateTimeFormat",
          value: val,
        });
      },
    },
    CashDrawerCOM: {
      get() {
        return JSON.stringify(this.$store.state.settings.CashDrawerCOM);
      },
      set(val) {
        this.$store.dispatch("settings/changeSetting", {
          key: "CashDrawerCOM",
          value: JSON.parse(val),
        });
      },
    },
    fixedHeader: {
      get() {
        return this.$store.state.settings.fixedHeader;
      },
      set(val) {
        this.$store.dispatch("settings/changeSetting", {
          key: "fixedHeader",
          value: val,
        });
      },
    },
    tagsView: {
      get() {
        return this.$store.state.settings.tagsView;
      },
      set(val) {
        this.$store.dispatch("settings/changeSetting", {
          key: "tagsView",
          value: val,
        });
      },
    },
    sidebarLogo: {
      get() {
        return this.$store.state.settings.sidebarLogo;
      },
      set(val) {
        this.$store.dispatch("settings/changeSetting", {
          key: "sidebarLogo",
          value: val,
        });
      },
    },
    BarcodeIsId: {
      get() {
        return this.$store.state.settings.BarcodeIsId;
      },
      set(val) {
        this.$store.dispatch("settings/changeSetting", {
          key: "BarcodeIsId",
          value: val,
        });
      },
    },
    WithOutCheckItemIsExist: {
      get() {
        return this.$store.state.settings.WithOutCheckItemIsExist;
      },
      set(val) {
        this.$store.dispatch("settings/changeSetting", {
          key: "WithOutCheckItemIsExist",
          value: val,
        });
      },
    },
    sidebarOpen: {
      get() {
        return this.$store.state.settings.sidebarOpen;
      },
      set(val) {
        this.$store.dispatch("app/toggleSideBar");

        this.$store.dispatch("settings/changeSetting", {
          key: "sidebarOpen",
          value: val,
        });
      },
    },
    showSettings: {
      get() {
        return this.$store.state.settings.showSettings;
      },
      set(val) {
        this.$store.dispatch("settings/changeSetting", {
          key: "showSettings",
          value: val,
        });
      },
    },
    showRestOfBill: {
      get() {
        return this.$store.state.settings.showRestOfBill;
      },
      set(val) {
        this.$store.dispatch("settings/changeSetting", {
          key: "showRestOfBill",
          value: val,
        });
      },
    },
    BusinessType: {
      get() {
        return this.$store.state.settings.BusinessType;
      },
      set(val) {
        this.$store.dispatch("settings/changeSetting", {
          key: "BusinessType",
          value: val,
        });
      },
    },
    PointOfSaleLayout: {
      get() {
        return this.$store.state.settings.PointOfSale.Layout;
      },
      set(val) {
        this.$store.state.settings.PointOfSale.Layout = val;

        this.$store.dispatch("settings/changeSetting", {
          key: "PointOfSale",
          value: this.$store.state.settings.PointOfSale,
        });
      },
    },
    CashPoolLayout: {
      get() {
        return this.$store.state.settings.CashPoolLayout;
      },
      set(val) {
        this.$store.dispatch("settings/changeSetting", {
          key: "CashPoolLayout",
          value: val,
        });
      },
    },
    PurchaseLayout: {
      get() {
        return this.$store.state.settings.PurchaseLayout;
      },
      set(val) {
        this.$store.dispatch("settings/changeSetting", {
          key: "PurchaseLayout",
          value: val,
        });
      },
    },
    WorkShopLayout: {
      get() {
        return this.$store.state.settings.WorkShopLayout;
      },
      set(val) {
        this.$store.dispatch("settings/changeSetting", {
          key: "WorkShopLayout",
          value: val,
        });
      },
    },
  },
  methods: {
    getPrinterDevice,
    RestSetting() {
      RestDefualtSetting().then((res) => {
        if (res) location.reload();
      });
    },
    CheckUpdate() {
      this.loading = true;
      var wshShell = new ActiveXObject("WScript.Shell");
      wshShell.Run("C:\\ConicErpDeploy-main\\Update.bat");
      this.loading = false;
      /*
      CheckUpdate()
        .then((response) => {
          // handle success
          console.log(response);
          this.loading = false;
        })
        .catch((error) => {
          // handle error
          console.log(error);
        });*/
    },
  },
};
</script>

<style lang="scss" scoped>
.drawer-switch {
  float: right;
}
.el-row--flex {
    padding-bottom: 12px;
}
.el-row {
    padding-bottom: 12px;
}
.el-input--mini{
  padding-top: 5px;
}
.el-select {
  padding-top: 5px;
}
</style>
