<template>
  <div>
    <el-row type="flex">
      <el-col :span="10">
        <Search-By-Date
          :value="[listQuery.DateFrom, listQuery.DateTo]"
          @Set="
            (v) => {
              listQuery.DateFrom = v[0];
              listQuery.DateTo = v[1];
              getdata();
            }
          "
        />
      </el-col>
      <el-col :span="5">
        <el-select v-model="operation" filterable placeholder="العملية" @change="setOperations">
          <el-option :style="'background-color:'+item.color + (item.Id == '0'?';': '20;') +'margin: 4px; border-radius: 8px;'" v-for="item in operations" :key="item.Id" :label="item.Name" :value="item.Id" class="options">
            <span style="display: flex; color: #8492a6; font-size: 16px; width:100%; justify-content: space-between; align-items: center;">
              <i :style="'color:' + (item.Id == 0?'#656b74;': item.color +';')" :class="item.icon"></i> {{ item.Name }}</span>
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="3">
        <el-button title="Reverse | عكس النتائج" icon="el-icon-sort" @click="reverse = !reverse" />
      </el-col>
      <el-col :span="3">
        <Add-Device-Log table-name="Member" />
      </el-col>
      <el-col :span="3">
        <el-button
          class="filter-item"
          type="primary"
          icon="el-icon-search"
          @click="getdata"
        />
      </el-col>
    </el-row>

    <el-row type="flex">
      <el-col :span="24">
        <el-divider direction="vertical" />
        <span>العدد</span>
        <el-divider direction="vertical" />
        <span>{{ timeline.length }}</span>
        <el-divider direction="vertical" />
      </el-col>
    </el-row>
    <el-row :gutter="30">
      <el-col :span="24">
        <el-card shadow="always">
          <el-timeline
            :reverse="reverse"
            style="height: 350px; overflow: scroll; width: 90%"
          >
          <!-- :type="item.Type == 'In'? 'primary' : 'secondary'" -->
            <el-timeline-item
              v-for="(item, index) of timeline"
              :key="index"
              :icon="item.Type == 'In'? 'el-icon-download' : 'el-icon-upload2'"
              :type="item.Type == 'In'? 'primary' : 'success'"
              :color="item.Type == 'In'? '#66BB6A' : '#7986cb'"
              size="large"
              :timestamp="item.DateTime"
              :hide-timestamp="true"
            ><span :style="item.Type == 'In'? 'color: #66BB6A' : 'color:#7986cb'">تسجيل {{item.Type == 'In'? 'دخول' : 'خروج'}}</span>

              <el-time-picker
                v-model="item.DateTime"
                :size="$store.getters.size"
                :format="$store.getters.settings.DateTimeFormat"
                :class="item.Type == 'In'? 'login' : 'logout'"
                disabled
              />
            </el-timeline-item>
          </el-timeline>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { GetLogByUserId } from '@/api/DeviceLog'
import SearchByDate from '@/components/Date/SearchByDate.vue'
import AddDeviceLog from '@/components/Device/AddDeviceLog.vue'

export default {
  components: { SearchByDate, AddDeviceLog },
  props: {
    UserId: {
      type: String,
      required: true
    },
    TableName: {
      type: String,
      required: true
    },
    DateFrom: {
      type: String,
      required: false
    },
    DateTo: {
      type: String,
      required: false
    }
  },
  data() {
    return {
      loading: false,
      reverse: true,
      timeline: [],
      timelineFullArray: [],
      operation: 0,
      operations: [
        {Id:0, Name:'الكل', icon:'el-icon-d-caret', color:'#F5F7FA'},
        {Id:1, Name:'دخول', icon:'el-icon-download', color:'#66BB6A'},
        {Id:2, Name:'خروج', icon:'el-icon-upload2', color:'#7986cb'}],
      listQuery: JSON.parse(
        localStorage.getItem('TimeLineDeviceLog_ListQuery') || null
      ) || {
        DateFrom: '',
        DateTo: '',
        TableName: this.TableName,
        UserId: this.UserId
      }
    }
  },
  watch: {
    UserId(val) {
      // if (val) this.getdata();
    },
    DateFrom(val) {
      if (val != '' || val != undefined) this.listQuery.DateFrom = val
    },
    DateTo(val) {
      if (val != '' || val != undefined) this.listQuery.DateTo = val
    }
  },

  methods: {
    getdata() {
      if (this.UserId) {
        this.loading = true
        this.listQuery.UserId = this.UserId
        GetLogByUserId(this.listQuery)
          .then((response) => {
            this.timeline = response
            this.timelineFullArray = response
            // .sort((a, b) => new Date(b.DateTime) - new Date(a.DateTime) );
            localStorage.setItem(
              'TimeLineDeviceLog_ListQuery',
              JSON.stringify(this.listQuery)
            )
            this.loading = false
          })
          .catch((error) => {
            reject(error)
            this.loading = false
          })
      }
    },
    setOperations(val) {
      console.log('this.timeline',this.timelineFullArray)
      switch(val) {
        case 1: this.timeline = this.timelineFullArray.filter(item => item.Type == "In"); break;
        case 2: this.timeline = this.timelineFullArray.filter(item => item.Type == "Out"); break;
        case 0: this.timeline = this.timelineFullArray; break;
        default: this.timeline = this.timelineFullArray; break;
      }
    }
  }
}
</script>
<style>
.login input:disabled {
  background-color: #66bb6a40 !important;
  margin-top: 6px;
  }
.logout input:disabled {
  background-color: #7986cb40 !important;
  margin-top: 6px;
  }
.options:hover {
  background-color: rgba(0, 0, 0, 0.099) !important;
}
</style>
