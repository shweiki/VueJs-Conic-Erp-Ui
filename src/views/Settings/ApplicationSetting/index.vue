<template>
  <div>
    <el-row>
      <el-col :span="6">
        <settings />
      </el-col>
      <el-col :span="18">
        <el-card class="box-card">
          <div slot="header" >
            <span>جميع اعدادات</span>
            <el-button type="success" @click="CheckUpdate"
              >Check UpDate</el-button
            >
            <el-button type="success" @click="RestSetting"
              >Rest Defualt Setting</el-button
            >
          </div>
          <el-row type="flex">
            <el-col :span="6">
              <span>{{ $t("Settings.DateFormat") }}</span>
              <el-input v-model="DateFormat" />
            </el-col>
            <el-col :span="6">
              <span>{{ $t("Settings.DateTimeFormat") }}</span>
              <el-input v-model="DateTimeFormat" />
            </el-col>
          </el-row>
          <el-row type="flex">
            <el-col :span="6">
              <span>{{ $t("Settings.title") }}</span>
              <el-input v-model="title" />
            </el-col>
            <el-col :span="6">
              <span>{{ $t("Settings.CashDrawerCOM") }}</span>
              <el-input v-model="CashDrawerCOM" />
            </el-col>
            <el-col :span="6">
              <span>{{ $t("Settings.PointOfSaleLayout") }}</span>
              <el-select
                v-model="PointOfSaleLayout"
                placeholder="PointOfSaleLayout"
              >
                <el-option label="Layout1" value="Layout1"> </el-option>
                <el-option label="Layout2" value="Layout2"> </el-option>
                <el-option label="Layout3" value="Layout3"> </el-option>
                <el-option label="Pharmacy" value="Pharmacy"> </el-option>
                <el-option label="Gym" value="Gym"> </el-option>
                                <el-option label="Public" value="Public"> </el-option>

              </el-select>
            </el-col>
            <el-col :span="6">
              <span>{{ $t("Settings.PurchaseLayout") }}</span>
              <el-select v-model="PurchaseLayout" placeholder="PurchaseLayout">
                <el-option label="SuperMarket" value="SuperMarket"> </el-option>
                <el-option label="Pharmacy" value="Pharmacy"> </el-option>
              </el-select>
            </el-col>
            <el-col :span="6">
              <span>{{ $t("Settings.WorkShopLayout") }}</span>
              <el-select v-model="WorkShopLayout" placeholder="WorkShopLayout">
                <el-option label="Layout1" value="Layout1"> </el-option>
              </el-select>
            </el-col>
            <el-col :span="6">
              <span>{{ $t("Settings.BusinessType") }}</span>
              <el-select v-model="BusinessType" placeholder="Select">
                <el-option label="SuperMarkit" value="SuperMarkit"> </el-option>
                <el-option label="CarsSpare" value="CarsSpare"> </el-option>
                <el-option label="GymManagment" value="GymManagment">
                </el-option>
                <el-option label="Restaurant" value="Restaurant"> </el-option>
              </el-select>
            </el-col>
          </el-row>
          <el-row type="flex"
            ><el-col :span="6">
              <span>{{ $t("Settings.tagsView") }}</span>
              <el-switch v-model="tagsView" class="drawer-switch" />
            </el-col>
            <el-col :span="6">
              <span>{{ $t("Settings.showSettings") }}</span>
              <el-switch v-model="showSettings" class="drawer-switch" />
            </el-col>
            <el-col :span="6">
              <span>{{ $t("Settings.showRestOfBill") }}</span>
              <el-switch v-model="showRestOfBill" class="drawer-switch" />
            </el-col>
            <el-col :span="6">
              <span>{{ $t("Settings.sidebarOpen") }}</span>
              <el-switch v-model="sidebarOpen" class="drawer-switch" />
            </el-col>
          </el-row>
          <el-row type="flex">
            <el-col :span="6">
              <span>{{ $t("Settings.fixedHeader") }}</span>
              <el-switch v-model="fixedHeader" class="drawer-switch" />
            </el-col>
            <el-col :span="6">
              <span>{{ $t("Settings.WithOutCheckItemIsExist") }}</span>
              <el-switch
                v-model="WithOutCheckItemIsExist"
                class="drawer-switch"
              />
            </el-col>
            <el-col :span="6">
              <span>{{ $t("Settings.sidebarLogo") }}</span>
              <el-switch v-model="sidebarLogo" class="drawer-switch" /> </el-col
            ><el-col :span="6">
              <span>{{ $t("Settings.BarcodeIsId") }}</span>
              <el-switch v-model="BarcodeIsId" class="drawer-switch" />
            </el-col>
          </el-row>
        </el-card>
      </el-col> </el-row
    ><el-row
      ><el-col :span="24">
        <el-button type="success" @click="SaveJson">Save</el-button>
        <json-editor ref="jsonEditor" v-model="JsonSettings" /> </el-col
    ></el-row>
  </div>
</template>

<script>
import { CheckUpdate, RestDefualtSetting } from "@/api/Setting";
import Settings from "@/layout/components/Settings/index";
import JsonEditor from "@/components/JsonEditor";

export default {
  components: { Settings, JsonEditor },
  data() {
    return {
      JsonSettings: this.$store.state.settings
    };
  },
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
          value: val
        });
      }
    },
    DateFormat: {
      get() {
        return this.$store.state.settings.DateFormat;
      },
      set(val) {
        this.$store.dispatch("settings/changeSetting", {
          key: "DateFormat",
          value: val
        });
      }
    },
    DateTimeFormat: {
      get() {
        return this.$store.state.settings.DateTimeFormat;
      },
      set(val) {
        this.$store.dispatch("settings/changeSetting", {
          key: "DateTimeFormat",
          value: val
        });
      }
    },

    CashDrawerCOM: {
      get() {
        return JSON.stringify(this.$store.state.settings.CashDrawerCOM);
      },
      set(val) {
        this.$store.dispatch("settings/changeSetting", {
          key: "CashDrawerCOM",
          value: JSON.parse(val)
        });
      }
    },
    fixedHeader: {
      get() {
        return this.$store.state.settings.fixedHeader;
      },
      set(val) {
        this.$store.dispatch("settings/changeSetting", {
          key: "fixedHeader",
          value: val
        });
      }
    },
    tagsView: {
      get() {
        return this.$store.state.settings.tagsView;
      },
      set(val) {
        this.$store.dispatch("settings/changeSetting", {
          key: "tagsView",
          value: val
        });
      }
    },
    sidebarLogo: {
      get() {
        return this.$store.state.settings.sidebarLogo;
      },
      set(val) {
        this.$store.dispatch("settings/changeSetting", {
          key: "sidebarLogo",
          value: val
        });
      }
    },
    BarcodeIsId: {
      get() {
        return this.$store.state.settings.BarcodeIsId;
      },
      set(val) {
        this.$store.dispatch("settings/changeSetting", {
          key: "BarcodeIsId",
          value: val
        });
      }
    },
    WithOutCheckItemIsExist: {
      get() {
        return this.$store.state.settings.WithOutCheckItemIsExist;
      },
      set(val) {
        this.$store.dispatch("settings/changeSetting", {
          key: "WithOutCheckItemIsExist",
          value: val
        });
      }
    },
    sidebarOpen: {
      get() {
        return this.$store.state.settings.sidebarOpen;
      },
      set(val) {
        this.$store.dispatch("app/toggleSideBar");

        this.$store.dispatch("settings/changeSetting", {
          key: "sidebarOpen",
          value: val
        });
      }
    },
    showSettings: {
      get() {
        return this.$store.state.settings.showSettings;
      },
      set(val) {
        this.$store.dispatch("settings/changeSetting", {
          key: "showSettings",
          value: val
        });
      }
    },
    showRestOfBill: {
      get() {
        return this.$store.state.settings.showRestOfBill;
      },
      set(val) {
        this.$store.dispatch("settings/changeSetting", {
          key: "showRestOfBill",
          value: val
        });
      }
    },
    BusinessType: {
      get() {
        return this.$store.state.settings.BusinessType;
      },
      set(val) {
        this.$store.dispatch("settings/changeSetting", {
          key: "BusinessType",
          value: val
        });
      }
    },
    PointOfSaleLayout: {
      get() {
        return this.$store.state.settings.PointOfSaleLayout;
      },
      set(val) {
        this.$store.dispatch("settings/changeSetting", {
          key: "PointOfSaleLayout",
          value: val
        });
      }
    },
    PurchaseLayout: {
      get() {
        return this.$store.state.settings.PurchaseLayout;
      },
      set(val) {
        this.$store.dispatch("settings/changeSetting", {
          key: "PurchaseLayout",
          value: val
        });
      }
    },
    WorkShopLayout: {
      get() {
        return this.$store.state.settings.WorkShopLayout;
      },
      set(val) {
        this.$store.dispatch("settings/changeSetting", {
          key: "WorkShopLayout",
          value: val
        });
      }
    }
  },
  methods: {
    SaveJson() {
      var JsonSettings = JSON.parse(this.JsonSettings);
      Object.keys(JsonSettings).forEach(key => {
        this.$store.dispatch("settings/changeSetting", {
          key: key,
          value: JsonSettings["" + key + ""]
        });
      });
    },
    RestSetting() {
      RestDefualtSetting().then(res => {
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
    }
  }
};
</script>

<style lang="scss" scoped>
.drawer-switch {
  float: right;
}
</style>
