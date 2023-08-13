<template>
  <el-popover placement="left" width="400" v-model="visible">
    <p>ارسال عبر</p>
    <div style="text-align: right; margin: 0">
      <el-input
        type="textarea"
        v-model="Description"
        :rules="[{ required: true, message: 'لايمكن ترك الخصم فارغ', trigger: 'blur' }]"
      ></el-input>
      <el-button
        icon="el-icon-chat-round"
        type="primary"
        :size="$store.getters.size"
        @click="window.open('https://wa.me/962' + NumberPhone1 + '?text=' + Description)"
      >
        WhatsApp
      </el-button>

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
    <el-button icon="el-icon-circle-plus" slot="reference">ارسال رسالة</el-button>
  </el-popover>
</template>

<script>
import { SendSMS } from "@/api/Sms";
import axios from "axios";

export default {
  props: {
    NumberPhone1: {
      type: String,
      default: () => {
        return undefined;
      },
    },

    NumberPhone2: {
      type: String,
      default: () => {
        return undefined;
      },
    },
    Email: {
      type: String,
      default: () => {
        return undefined;
      },
    },
  },
  data() {
    return {
      visible: false,
      Description: "",
    };
  },
  methods: {
    SendSms() {
      SendSMS({
        tonumber: this.NumberPhone1,
        message: this.Description,
      });
      this.visible = false;
      this.$notify({
        title: "تم ",
        message: "تم ارسال بنجاح",
        type: "success",
        duration: 2000,
      });
    },

    SendWhatsApp() {
      if (this.NumberPhone1 != "" && this.Description != "") {
        if (this.NumberPhone1.length == 10) this.NumberPhone1.slice(1);
        axios({
          method: "get",
          url: "https://wa.me/962" + this.NumberPhone1 + "",
          params: {
            text: this.Description,
          },
        }).then((response) => {});
        this.visible = false;
        this.$notify({
          title: "تم ",
          message: "تم ارسال بنجاح",
          type: "success",
          duration: 2000,
        });
      }
    },
    SendEmail() {},
  },
};
</script>
