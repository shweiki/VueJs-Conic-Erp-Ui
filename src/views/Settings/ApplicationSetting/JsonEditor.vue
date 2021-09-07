<template>
  <div>
    <el-row
      ><el-col :span="24">
        <el-button :loading="LoadingSave" type="success" @click="SaveJson"
          >Save</el-button
        >
        <json-editor ref="jsonEditor" v-model="JsonSettings" /> </el-col
    ></el-row>
  </div>
</template>

<script>
import JsonEditor from "@/components/JsonEditor";

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
  },
};
</script>
