<template>
  <div>
    <el-row type="flex">
      <el-col :span="14">
        <Search-By-Date
          :Value="[listQuery.DateFrom, listQuery.DateTo]"
          @Set="
            (v) => {
              listQuery.DateFrom = v[0];
              listQuery.DateTo = v[1];
              getdata();
            }
          "
        />
      </el-col>
      <el-col :span="3">
        <el-button @click="reverse = !reverse" icon="el-icon-sort"></el-button>
      </el-col>
      <el-col :span="3">
        <Add-Device-Log TableName="Member" />
      </el-col>
      <el-col :span="4">
        <el-button
          class="filter-item"
          type="primary"
          icon="el-icon-search"
          @click="getdata"
        >
        </el-button>
      </el-col>
    </el-row>

    <el-row type="flex">
      <el-col :span="24">
        <el-divider direction="vertical"></el-divider>
        <span>العدد</span>
        <el-divider direction="vertical"></el-divider>
        <span>{{ timeline.length }}</span>
        <el-divider direction="vertical"></el-divider>
      </el-col>
    </el-row>
    <el-row :gutter="30">
      <el-col :span="24">
        <el-card shadow="always">
          <el-timeline
            :reverse="reverse"
            style="height: 350px; overflow: scroll; width: 90%"
          >
            <el-timeline-item
              v-for="(item, index) of timeline"
              :key="index"
              icon="el-icon-more"
              type="primary"
              color="#00000"
              size="large"
              :timestamp="item.DateTime"
              :hide-timestamp="true"
              ><span style="color: green">{{ item.Name }}</span>

              <el-time-picker
                :size="$store.getters.size"
                v-model="item.DateTime"
                :format="$store.getters.settings.DateTimeFormat"
                disabled
              />
            </el-timeline-item>
          </el-timeline>
        </el-card> </el-col
    ></el-row>
  </div>
</template>

<script>
import Cookies from "js-cookie";
import { GetLogByUserId } from "@/api/DeviceLog";
import SearchByDate from "@/components/Date/SearchByDate.vue";
import AddDeviceLog from "@/components/Device/AddDeviceLog.vue";

export default {
  components: { SearchByDate, AddDeviceLog },
  props: {
    UserId: {
      type: Number,
      required: false,
    },
    TableName: {
      type: String,
      required: true,
    },
    DateFrom: {
      type: String,
      required: false,
    },
    DateTo: {
      type: String,
      required: false,
    },
  },
  watch: {
    UserId(val) {
      // if (val) this.getdata();
    },
    DateFrom(val) {
      if (val != "" || val != undefined) this.listQuery.DateFrom = val;
    },
    DateTo(val) {
      if (val != "" || val != undefined) this.listQuery.DateTo = val;
    },
  },
  data() {
    return {
      loading: false,
      reverse: true,
      timeline: [],
      listQuery: JSON.parse(localStorage.getItem("TimeLineDeviceLog_ListQuery") || null) || {
        DateFrom: "",
        DateTo: "",
        TableName: this.TableName,
        UserId: this.UserId,
      },
    };
  },

  methods: {
    getdata() {
      if (this.UserId) {
        this.loading = true;
        this.listQuery.UserId = this.UserId;
        GetLogByUserId(this.listQuery)
          .then((response) => {
            this.timeline = response;
            //.sort((a, b) => new Date(b.DateTime) - new Date(a.DateTime) );
            localStorage.setItem("TimeLineDeviceLog_ListQuery", JSON.stringify(this.listQuery));
            this.loading = false;
          })
          .catch((error) => {
            reject(error);
            this.loading = false;
          });
      }
    },
  },
};
</script>
