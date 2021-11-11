<template>
  <el-row type="flex">
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
            :timestamp="item.StartDateTime"
            hide-timestamp
          > 
          <el-card>
            
              <div v-if="item.StartDateTime ==null">
        <h4  style="color:#ff6a6a">لا يوجد تسجيل دخول هذا اليوم</h4>
        </div>
        <div v-else>
          <h4>تسجيل دخول</h4>
        <p>{{ item.StartDateTime | parseTime("{m}-{d}-{y} {h}:{i}:{s}")  }}</p>
          </div>
           <div v-if="item.EndDateTime ==null">
             <h4 style="color:#ff6a6a">لا يوجد تسجيل خروج هذا اليوم</h4>
          </div>
            <div v-else>
        <h4> تسجيل خروج</h4>
        <p>{{item.EndDateTime}}</p>
        </div>
        
      </el-card>
         <br>
          
          <!-- <div v-if="item.StartDateTime == null">
           لا يوجد تسجيل دخول في هذا اليوم
          </div>
          <div v-else>
          تسجيل دخول
          </div> -->
          </el-timeline-item>
          <!-- <el-timeline-item
            v-for="(item,index) of timeline"
            :key="index"
            icon="el-icon-more"
            type="primary"
            color="#00000"
            size="large"
            :timestamp="item.EndDateTime"
          ><div>
          تسجيل خروج
          </div>
          </el-timeline-item> -->
        </el-timeline>
      </el-card>
    </el-col>
  </el-row>
</template>

<script>
import { parseTime } from "@/utils";
export default {
  props: {
    timeline: {
      type: Array,
      default: () => {
        return [];
      }
    },
    EmployeeId: {
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
  },
  methods: {
    todays (date){
     date | parseTime("{m}-{d}-{y} {h}:{i}:{s}")
     newdate = date | getDay();
      return newdate;
    }
  },
};
</script>
