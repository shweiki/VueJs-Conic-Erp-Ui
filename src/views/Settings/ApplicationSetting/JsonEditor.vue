<template>
  <div>
    <el-card
      ><el-col :span="24">
        <el-button :loading="LoadingSave" type="success" @click="SaveJson"
          >Save</el-button
        >
        <el-button type="success" @click="RestSetting"
          >Rest Defualt Setting</el-button
        >
        <json-editor ref="jsonEditor" v-model="JsonSettings" /> </el-col
    ></el-card>
  </div>
</template>

<script>
import JsonEditor from "@/components/JsonEditor";
import { RestDefualtSetting } from "@/api/Setting";

export default {
  components: { JsonEditor },
  data() {
    return {
      LoadingSave: false,
      JsonSettings: this.$store.getters.settings,
    };
  },
  methods: {
    SaveJson() {
      this.LoadingSave = true;
      var JsonSettings = JSON.parse(this.JsonSettings);
      Object.keys(JsonSettings).forEach((key) => {
        this.$store.dispatch("settings/changeSetting", {
          key: key,
          value: JsonSettings["" + key + ""],
        });
      });
      this.LoadingSave = false;
      this.$notify({
        title: "تم ",
        message: "تم حفظ بنجاح",
        type: "success",
        duration: 2000,
      });
    },
    RestSetting() {
      RestDefualtSetting().then((res) => {
        if (res) location.reload();
      });
    },
  },
};
</script>
