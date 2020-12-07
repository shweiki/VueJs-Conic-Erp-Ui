<template>
  <el-row style="background : #2f3542; color: white;">
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
        style="width : 90%"
        ref="headerSearchSelect"
        v-model="search"
        :remote-method="querySearch"
        filterable
        default-first-option
        remote
        v-bind:placeholder="
          $t('Vendors.Search') + '/ هاتف / الرقم الوطني /  رقم العضوية'
        "
        @change="change"
      >
        <el-option
          v-for="item in options"
          :key="item.Id"
          :value="item"
          :label="item.Name"
        >
          <span style=" color: #8492a6; font-size: 12px"
            >( {{ item.Id }} )</span
          >
          <span style="float: left">{{ item.Name }}</span>
          <span style=" float: right; color: #8492a6; font-size: 13px">{{
            item.Ssn
          }}</span>
          <span style=" color: #8492a6; font-size: 13px"
            >( 0{{ item.PhoneNumber1 }} )</span
          >
          <span style=" color: #8492a6; font-size: 13px"
            >( {{ item.Tag }} )</span
          >
        </el-option>
      </el-select>
    </el-col>
  </el-row>
</template>
<script>
import Fuse from "fuse.js";
import AddMember from "@/components/Member/AddMember";

export default {
  components: { AddMember },
  name: "MemberSearch",
  data() {
    return {
      search: "",
      options: [],
      searchPool: [],
      fuse: undefined
    };
  },
  computed: {
    routes() {
      return this.$store.getters.AllMembers;
    }
  },
  watch: {
    routes() {
      this.searchPool = this.routes;
    },
    searchPool(list) {
      this.initFuse(list);
    }
  },
  mounted() {
    this.searchPool = this.routes;
  },
  methods: {
    change(val) {
      this.$router.push("/Gym/Edit/" + val.Id + "");
      this.search = "";
      this.options = [];
      this.$nextTick(() => {});
    },
    initFuse(list) {
      this.fuse = new Fuse(list, {
        shouldSort: true,
        threshold: 0.4,
        location: 0,
        distance: 100,
        maxPatternLength: 32,
        minMatchCharLength: 1,
        keys: [
          {
            name: "Id",
            weight: 0.7
          },
          {
            name: "Name",
            weight: 0.3
          },
          {
            name: "Ssn",
            weight: 1
          },
          {
            name: "PhoneNumber1",
            weight: 0.3
          },
          {
            name: "Tag",
            weight: 0.2
          }
        ]
      });
    },

    querySearch(query) {
      if (query !== "") {
        this.options = this.fuse.search(query);
      } else {
        this.options = [];
      }
    }
  }
};
</script>