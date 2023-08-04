<template>
  <div>
    <el-button type="success" icon="el-icon-data-line" @click="getdata()"></el-button>

    <el-dialog style="margin-top: -13vh" :visible.sync="Visible">
      <el-timeline>
        <el-timeline-item
          v-for="(log, index) in actionlogs"
          :key="index"
          v-bind:timestamp="
            formatDate(new Date(log.PostingDateTime), 'no') +
            ' - ' +
            tConvert(new Date(log.PostingDateTime))
          "
          placement="top"
          v-bind:color="
            $store.getters.Oprations.find((obj) => {
              return obj.Id == log.OprationId;
            }).Color
          "
          v-bind:icon="
            $store.getters.Oprations.find((obj) => {
              return obj.Id == log.OprationId;
            }).IconClass
          "
          v-bind:type="
            $store.getters.Oprations.find((obj) => {
              return obj.Id == log.OprationId;
            }).ClassName
          "
        >
          {{
            $store.getters.Oprations.find((obj) => {
              return obj.Id == log.OprationId;
            }).OprationDescription
          }}
          {{ log.Description }}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
import { GetLogByObjTable } from "@/api/ActionLog";

export default {
  props: {
    TableName: {
      type: String,
      required: true,
    },
    ObjId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      Visible: false,
      actionlogs: [],
    };
  },
  methods: {
    getdata() {
      GetLogByObjTable({ TableName: this.TableName, Id: this.ObjId }).then((response) => {
        // handle success
        this.actionlogs = response;

        this.Visible = true;
      });
    },
    tConvert(date) {
      let hours = date.getHours();
      let minutes = date.getMinutes();
      let ampm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
      minutes = minutes < 10 ? "0" + minutes : minutes;
      let strTime = " " + hours + ":" + minutes + "  " + ampm;
      return strTime;
    },
    formatDate(date) {
      let d = new Date(date),
        day = "" + d.getDate(),
        month = "" + (d.getMonth() + 1),
        year = d.getFullYear();
      if (month.length < 2) month = "0" + month;
      if (day.length < 2) day = "0" + day;

      return [day, month, year].join("/");
    },
  },
};
</script>
