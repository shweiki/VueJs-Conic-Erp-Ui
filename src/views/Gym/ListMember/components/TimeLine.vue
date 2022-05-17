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
      <el-col :span="6">
        <el-button @click="reverse = !reverse" icon="el-icon-sort"></el-button>
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
import { GetLogByUserId } from "@/api/DeviceLog";
import SearchByDate from "@/components/Date/SearchByDate.vue";

export default {
  components: { SearchByDate },
  props: {
    UserId: {
      type: Number,
      default: 0,
    },
    TableName: {
      type: String,
      default: "",
    },
  },

  data() {
    return {
      loading: false,
      reverse: false,

      timeline: [],
      listQuery: {
        DateFrom: "",
        DateTo: "",
        TableName: this.TableName,
        UserId: this.UserId,
      },
    };
  },

  methods: {
    getdata() {
      this.loading = true;
      GetLogByUserId(this.listQuery)
        .then((response) => {
          this.timeline = response;
          //.sort((a, b) => new Date(b.DateTime) - new Date(a.DateTime) );
          this.loading = false;
        })
        .catch((error) => {
          reject(error);
          this.loading = false;
        });
    },
  },
};
</script>