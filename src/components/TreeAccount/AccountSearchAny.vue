<template>
  <div>
    <el-row style="background: #2f3542; color: white">
      <el-col :span="4">
        <Add-Account-Dialog @Done="getdata()" />
      </el-col>
      <el-col :span="16">
        <el-select
          wi
          v-model="search"
          :remote-method="querySearch"
          filterable
          default-first-option
          remote
          placeholder="البحث بحسب الاسم / الكود "
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
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { GetAccountByAny } from "@/api/Account";
import AddAccountDialog from "@/components/TreeAccount/AddAccountDialog.vue";

export default {
  components: { AddAccountDialog },
  props: ["AccountId"],
  data() {
    return {
      value: {},
      search: "",
      options: [],
    };
  },
  watch: {
    AccountId(val) {
      if (val) {
        console.log(val);
        this.search = val;
        //  this.querySearch(val);
      }
    },
  },
  methods: {
    change(val) {
      this.search = "";
      this.options = [];
      this.value = val;
      this.$emit("Set", val);
    },
    querySearch(query) {
      if (query !== "" && query.length > 1) {
        GetAccountByAny({ Any: query }).then((res) => {
          this.options = res;
        });
      } else {
        this.options = [];
      }
    },
  },
};
</script>
