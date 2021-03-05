<template>
  <el-select 
              v-model="search"
              :remote-method="querySearch"
              filterable
              default-first-option
              remote
              placeholder="البحث بحسب الاسم"
              @change="change"
              >
              <el-option
                    v-for="item in options"
                    :key="item.Id"
                    :label="item.Name"
                    :value="item"
                  >
                    <span style="float: right">{{ item.Id }}</span>
                    <span style="float: left color: #8492a6 font-size: 13px">{{
                      item.Name
                    }}</span>
                  </el-option>
                   </el-select>
</template>
<script>
import { GetAccountByAny } from "@/api/Account";

export default {
  data() {
    return {
      search: "",
      options: [],
    };
  },
  methods: {
    change(val) {
      this.search = "";
      this.options = [];
      this.$emit("Set", val);
    },

     querySearch(query) {
      if (query !== "" && query.length > 1) {
        GetAccountByAny({ Any: query }).then(res => {
          this.options = res;
        });
      } else {
        this.options = [];
      }
    },
  },
};
</script>
