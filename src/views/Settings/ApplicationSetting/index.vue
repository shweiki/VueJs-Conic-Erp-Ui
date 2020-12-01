<template>
  <div class="drawer-container" >
  
    <div>
      <h3 class="drawer-title">{{ $t('Settings.title') }}</h3>

      <div class="drawer-item">
        <span>{{ $t('Settings.theme') }}</span>
        <theme-picker style="float: right;height: 26px;margin: -3px 8px 0 0;" @change="themeChange" />
      </div>

      <div class="drawer-item">
        <span>{{ $t('Settings.tagsView') }}</span>
        <el-switch v-model="tagsView" class="drawer-switch" />
      </div>

      <div class="drawer-item">
        <span>{{ $t('Settings.fixedHeader') }}</span>
        <el-switch v-model="fixedHeader" class="drawer-switch" />
      </div>

      <div class="drawer-item">
        <span>{{ $t('Settings.sidebarLogo') }}</span>
        <el-switch v-model="sidebarLogo" class="drawer-switch" />
      </div>
    </div>
        <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-button
          style="float: left"
          type='success'
          icon="el-icon-plus"
          @click="handleCreate()"
        >{{ $t('Classification.Add') }}</el-button>
        <el-button
          style="float: left; "
          icon="el-icon-printer"
          type="primary"
          @click="print(tableData)"
        ></el-button>
        <span>جميع الخدمات</span>
      </div>
      <el-table
        v-loading="loading"
        :data="tableData.filter(data => !search || data.Name.toLowerCase().includes(search.toLowerCase()))"
        fit
        border
        max-height="900"
        highlight-current-row
        style="width: 100%"
      >
        <el-table-column prop="Id" width="80" align="center">
          <template slot="header" slot-scope="{}">
            <el-button type="primary" icon="el-icon-refresh" @click="getdata()"></el-button>
          </template>
        </el-table-column>
        <el-table-column prop="Name" align="center">
          <template slot="header" slot-scope="{}">
            <el-input v-model="search" v-bind:placeholder="$t('Classification.Name')" />
          </template>
        </el-table-column>
        <el-table-column prop="ItemName" label="الصنف" align="center"></el-table-column>
        <el-table-column prop="Qty" label="العدد" align="center"></el-table-column>
        <el-table-column prop="SellingPrice" label="سعر البيع" align="center"></el-table-column>

        <el-table-column prop="Type" label="نوع" align="center"></el-table-column>
        <el-table-column
          v-bind:label="$t('Classification.Date')"
          prop="ActionLogs[0].PostingDateTime"
          width="200"
          align="center"
        ></el-table-column>
        <el-table-column
          v-bind:label="$t('Classification.Notes')"
          prop="Description"
          width="220"
          align="center"
        ></el-table-column>
        <el-table-column v-bind:label="$t('Classification.Status')" width="120" align="center">
          <template slot-scope="scope">
            <el-tag
              :type="scope.row.Opration.ClassName"
            >{{ scope.row.Opration.ArabicOprationDescription }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="right" width="200">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.Opration.Status!=-1"
              icon="el-icon-edit"
              circle
              @click="handleUpdate(scope.row)"
            ></el-button>
            <el-button
              v-for="(NOprations, index) in scope.row.NextOprations"
              :key="index"
              :type="NOprations.ClassName"
              round
              @click="handleOprationsys(scope.row.Id , NOprations)"
            >{{NOprations.OprationDescription}}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import ThemePicker from '@/components/ThemePicker'
import { GetSetting, GetActiveSetting , Create ,Edit } from "@/api/Setting";

export default {
  components: { ThemePicker },
  data() {
    return {}
  },
  computed: {
    isShowJob() {
      return this.$store.getters.language === 'zh'
    },
    fixedHeader: {
      get() {
        return this.$store.state.Settings.fixedHeader
      },
      set(val) {
        this.$store.dispatch('Settings/changeSetting', {
          key: 'fixedHeader',
          value: val
        })
      }
    },
    tagsView: {
      get() {
        return this.$store.state.Settings.tagsView
      },
      set(val) {
        this.$store.dispatch('Settings/changeSetting', {
          key: 'tagsView',
          value: val
        })
      }
    },
    sidebarLogo: {
      get() {
        return this.$store.state.Settings.sidebarLogo
      },
      set(val) {
        this.$store.dispatch('Settings/changeSetting', {
          key: 'sidebarLogo',
          value: val
        })
      }
    }
  },
  methods: {
    themeChange(val) {
      this.$store.dispatch('Settings/changeSetting', {
        key: 'theme',
        value: val
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.drawer-container {
  padding: 24px;
  font-size: 14px;
  line-height: 1.5;
  word-wrap: break-word;

  .drawer-title {
    margin-bottom: 12px;
    color: rgba(0, 0, 0, .85);
    font-size: 14px;
    line-height: 22px;
  }

  .drawer-item {
    color: rgba(0, 0, 0, .65);
    font-size: 14px;
    padding: 12px 0;
  }

  .drawer-switch {
    float: right
  }

  .job-link{
    display: block;
    position: absolute;
    width: 100%;
    left: 0;
    bottom: 0;
  }
}
</style>
