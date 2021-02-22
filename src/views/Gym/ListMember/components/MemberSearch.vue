<template>
  <el-row style="background: #2f3542; color: white">
    <el-col :span="2">
      <el-button
        type="success"
        icon="el-icon-s-shop"
        @click="$router.replace({ path: '/redirect' + '/Sales/Create' })"
      ></el-button>
    </el-col>
    <el-col :span="2">
      <el-button
        type="primary"
        icon="el-icon-unlock"
        :disabled="$store.getters.ZtkDoor"
      ></el-button>
    </el-col>
    <el-col :span="2">
      <add-member />
    </el-col>
    <el-col :span="14">
      <el-select
        style="width: 90%"
        v-model="search"
        :remote-method="querySearch"
        filterable
        default-first-option
        remote
        v-bind:placeholder="$t('Vendors.Search') + '/ هاتف / الرقم الوطني /  رقم العضوية'"
        @change="change"
      >
        <el-option
          v-for="item in options"
          :key="item.Id"
          :value="item"
          :label="item.Name"
        >
          <span style="color: #8492a6; font-size: 12px">( {{ item.Id }} )</span>
          <span style="float: left">{{ item.Name }}</span>
          <span style="float: right; color: #8492a6; font-size: 13px">{{
            item.Ssn
          }}</span>
          <span style="color: #8492a6; font-size: 13px">( {{ item.PhoneNumber1 }} )</span>
          <span style="color: #8492a6; font-size: 13px">( {{ item.Tag }} )</span>
        </el-option>
      </el-select>
    </el-col>
  </el-row>
</template>
<script>
import AddMember from "@/components/Member/AddMember";
import { GetMemberByAny } from "@/api/Member";
export default {
  name: "MemberSearch",
  components: { AddMember },
  data() {
    return {
      search: "",
      options: [],
    };
  },
  methods: {
    change(val) {
      this.$router.push("/Gym/Edit/" + val.Id + "");
      this.search = "";
      this.options = [];
      this.$nextTick(() => {});
    },

    querySearch(query) {
      if (query !== "" && query.length > 2) {
        GetMemberByAny({ Any: query }).then((res) => {
          this.options = res.reverse();
        });
      } else {
        this.options = [];
      }
    },
  },
};
</script>
