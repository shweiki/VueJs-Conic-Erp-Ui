<template>
  <div class="tab-container">
    <el-tabs v-model="activeName" style="margin-top: 0px" type="border-card">
      <el-tab-pane
        v-for="item in tabMapOptions"
        :key="item.key"
        :label="$t('PanelGroup.' + item.label)"
        :name="item.key"
      >
        <keep-alive>
          <tab-pane
            v-if="activeName == item.key"
            :type="item.key"
            @create="showCreatedTimes"
          />
        </keep-alive>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import TabPane from './components/TabPane'

export default {
  name: 'Tab',
  components: { TabPane },
  data() {
    return {
      tabMapOptions: [
        { label: 'MemberList', key: 'ML' },
        { label: 'Receivables', key: 'RM' },
        { label: 'Payable', key: 'PM' },
        { label: 'MembershipmentOrdar', key: 'MO' }
      ],
      activeName: 'ML',
      createdTimes: 0
    }
  },
  watch: {
    activeName(val) {
      this.$router.push(`${this.$route.path}?tab=${val}`)
    }
  },
  created() {
    // init the default selected tab
    const tab = this.$route.query.tab
    if (tab) {
      this.activeName = tab
    }
  },
  methods: {
    showCreatedTimes() {
      this.createdTimes = this.createdTimes + 1
    }
  }
}
</script>

<style scoped>
.tab-container {
  margin: 15px;
}
</style>
