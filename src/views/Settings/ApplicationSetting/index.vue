<template>
  <div class="drawer-container">
    <div>
      <el-button @click="CheckUpdate" circle>Check UpDate</el-button>
      <h3 class="drawer-title">{{ $t("Settings.title") }}</h3>

      <div class="drawer-item">
        <span>{{ $t("Settings.theme") }}</span>
        <theme-picker
          style="float: right; height: 26px; margin: -3px 8px 0 0"
          @change="themeChange"
        />
      </div>
      <div class="drawer-item">
        <span>{{ $t("Settings.theme") }}</span>
        <el-switch v-model="theme" class="drawer-switch" />
      </div>

      <div class="drawer-item">
        <span>{{ $t("Settings.tagsView") }}</span>
        <el-switch v-model="tagsView" class="drawer-switch" />
      </div>

      <div class="drawer-item">
        <span>{{ $t("Settings.fixedHeader") }}</span>
        <el-switch v-model="fixedHeader" class="drawer-switch" />
      </div>

      <div class="drawer-item">
        <span>{{ $t("Settings.sidebarLogo") }}</span>
        <el-switch v-model="sidebarLogo" class="drawer-switch" />
      </div>
    </div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>جميع اعدادات</span>
      </div>
      <el-table
        v-loading="loading"
        :data="
          tableData.filter(
            (data) => !search || data.Name.toLowerCase().includes(search.toLowerCase())
          )
        "
        fit
        border
        max-height="900"
        highlight-current-row
        style="width: 100%"
      >
        <el-table-column prop="Id" width="80" align="center">
          <template slot="header" slot-scope="{}">
            <el-button
              type="primary"
              icon="el-icon-refresh"
              @click="getdata()"
            ></el-button>
          </template>
        </el-table-column>
        <el-table-column prop="Name" align="center">
          <template slot="header" slot-scope="{}">
            <el-input v-model="search" v-bind:placeholder="$t('Classification.Name')" />
          </template>
        </el-table-column>

        <el-table-column prop="Value" label="القيمة" align="center"></el-table-column>
        <el-table-column prop="Type" label="نوع" align="center"></el-table-column>
        <el-table-column
          v-bind:label="$t('Classification.Notes')"
          prop="Description"
          width="220"
          align="center"
        ></el-table-column>
        <el-table-column
          v-bind:label="$t('Classification.Status')"
          width="120"
          align="center"
        >
          <template slot-scope="scope">
            <status-tag :Status="scope.row.Status" TableName="Setting" />
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import ThemePicker from "@/components/ThemePicker";
import { GetSetting, GetActiveSetting, Create, Edit, CheckUpdate } from "@/api/Setting";
import StatusTag from "@/components/Oprationsys/StatusTag";
import { toggleClass } from "@/utils";
import "@/assets/custom-theme/index.css"; // the theme changed version element-ui css

export default {
  components: { ThemePicker, StatusTag },
  watch: {
    theme() {
      toggleClass(document.body, "custom-theme");
    },
  },
  computed: {
    isShowJob() {
      return this.$store.getters.language === "zh";
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
  },
  data() {
    return {
      tableData: [],
      loading: true,
      search: "",
      theme: false,
    };
  },
  created() {
    this.getdata();
  },
  methods: {
    getdata() {
      this.loading = true;
      GetSetting()
        .then((response) => {
          // handle success
          console.log(response);
          this.tableData = response;
          this.loading = false;
        })
        .catch((error) => {
          // handle error
          console.log(error);
        });
    },
    CheckUpdate() {
      this.loading = true;
      CheckUpdate()
        .then((response) => {
          // handle success
          console.log(response);
          this.loading = false;
        })
        .catch((error) => {
          // handle error
          console.log(error);
        });
    },
    themeChange(val) {
      this.$store.dispatch("settings/changeSetting", {
        key: "theme",
        value: val,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.drawer-container {
  padding: 24px;
  font-size: 14px;
  line-height: 1.5;
  word-wrap: break-word;

  .drawer-title {
    margin-bottom: 12px;
    color: rgba(0, 0, 0, 0.85);
    font-size: 14px;
    line-height: 22px;
  }

  .drawer-item {
    color: rgba(0, 0, 0, 0.65);
    font-size: 14px;
    padding: 12px 0;
    display: inline-flex;
  }

  .drawer-switch {
    float: right;
  }

  .job-link {
    display: block;
    position: absolute;
    width: 100%;
    left: 0;
    bottom: 0;
  }
}
</style>
