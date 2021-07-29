<template>
  <el-popover placement="left" width="400" v-model="visible">
    <p>ارسال عبر</p>
    <div style="text-align: right; margin: 0">
      <el-input
        type="textarea"
        v-model="Description"
        :rules="[
          { required: true, message: 'لايمكن ترك الخصم فارغ', trigger: 'blur' }
        ]"
      ></el-input>
      <el-button
        icon="el-icon-chat-line-round"
        type="primary"
        :size="$store.getters.size"
      >
        <a
          v-bind:href="
            'https://wa.me/962' + NumberPhone1 + '?text=' + Description
          "
          target="_blank"
        >
          WhatsApp</a
        ></el-button
      >

      <el-button
        icon="el-icon-chat-square"
        type="primary"
        :size="$store.getters.size"
        @click="SendSms()"
        >SMS</el-button
      >
      <el-button
        icon="el-icon-message"
        type="primary"
        :size="$store.getters.size"
        @click="SendEmail()"
        >Email</el-button
      >
    </div>
    <el-button icon="el-icon-circle-plus" slot="reference"
      >ارسال رسالة</el-button
    >
  </el-popover>
</template>

<script>
import { SendSMS } from "@/api/SMS";
import { string } from "clipboard";
import axios from "axios";

export default {
  props: {
    NumberPhone1: {
      type: string,
      default: () => {
        return undefined;
      }
    },

    NumberPhone2: {
      type: string,
      default: () => {
        return undefined;
      }
    },
    Email: {
      type: string,
      default: () => {
        return undefined;
      }
    }
  },
  data() {
    return {
      visible: false,
      Description: ""
    };
  },
  methods: {
    SendSms() {
      if (this.NumberPhone1 != "" && this.Description != "") {
        if (this.NumberPhone1.length == 10) this.NumberPhone1.slice(1);

        axios({
          method: "get",
          url: "http://josmsservice.com/smsonline/msgservicejo.cfm",
          params: {
            numbers: "962" + this.NumberPhone1,
            senderid: "High Fit",
            AccName: "highfit",
            AccPass: "D7!cT5!SgU0",
            msg: this.Description,
            requesttimeout: 5000000
          }
        }).then(response => {});
        this.visible = false;
        this.$notify({
          title: "تم ",
          message: "تم ارسال بنجاح",
          type: "success",
          duration: 2000
        });
      }
    },
    SendWhatsApp() {
      if (this.NumberPhone1 != "" && this.Description != "") {
        if (this.NumberPhone1.length == 10) this.NumberPhone1.slice(1);
        axios({
          method: "get",
          url: "https://wa.me/962" + this.NumberPhone1 + "",
          params: {
            text: this.Description
          }
        }).then(response => {});
        this.visible = false;
        this.$notify({
          title: "تم ",
          message: "تم ارسال بنجاح",
          type: "success",
          duration: 2000
        });
      }
    },
    SendEmail() {}
  }
};
</script>