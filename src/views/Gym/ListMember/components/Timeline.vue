<template>
  <el-row>
    <el-col :span="24">
      <div class="radio">
        ترتيب:
        <el-radio-group v-model="reverse">
          <el-radio :label="false">أحدث</el-radio>
          <el-radio :label="true">ألاقدم</el-radio>
        </el-radio-group>
      </div>
      <el-card shadow="hover">
        <el-timeline :reverse="reverse" style="height: 550px; overflow: scroll;">
          <el-timeline-item
            v-for="(item,index) of timeline"
            :key="index"
            icon="el-icon-more"
            type="primary"
            color="#00000"
            size="large"
            :timestamp="item.DateTime"
          >{{item.Name}}</el-timeline-item>
        </el-timeline>
      </el-card>
    </el-col>
  </el-row>
</template>

<script>
export default {
  props: {
    timeline: {
      type: Array,
      default: () => {
        return [];
      }
    },
    MemberId: {
      type: Number,
      default: () => {
        return undefined;
      }
    }
  },
  data() {
    return {
      reverse: false
    };
  }
};
</script>
