<template>
  <el-select v-model="value" @change="SetVal" placeholder="محرر السند">
    <el-option
      v-for="item in options"
      :key="item.Id"
      :label="item.Name"
      :value="item.Name"
    ></el-option>
  </el-select>
</template>
<script>
import { GetEditorsUser } from "@/api/EditorsUser";
import { mapGetters } from "vuex";

export default {
  props: ["Value"],
  computed: {
    ...mapGetters(["Id", "name", "phone", "avatar", "roles"]),
  },
  data() {
    return {
      options: [],
      value: "",
    };
  },
  created() {
    GetEditorsUser()
      .then((response) => {
        this.options = response;
        this.options.push({ Id: this.Id, Name: this.name });
      })
      .catch((error) => {
        reject(error);
      });
  },
  watch: {
    Value(val) {
      this.SetVal(val);
    },
  },
  methods: {
    SetVal(val) {
      this.$emit("Set", val);
      this.value = val;
    },
  },
};
</script>
