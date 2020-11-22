<template>
  <el-select
    style="width : 90%"
    ref="headerSearchSelect"
    v-model="search"
    :remote-method="querySearch"
    filterable
    default-first-option
    remote
    v-bind:placeholder="$t('Vendors.Search')+'/ هاتف / الرقم الوطني /  رقم العضوية'"
    @change="change"
  >
    <el-option v-for="item in options" :key="item.id" :value="item" :label="item.name">
      <span style=" color: #8492a6; font-size: 12px">( {{ item.id }} )</span>
      <span style="float: left">{{ item.name }}</span>
      <span style=" float: right; color: #8492a6; font-size: 13px">{{ item.ssn }}</span>
      <span style=" color: #8492a6; font-size: 13px">( 0{{ item.phoneNumber1 }} )</span>
      <span style=" color: #8492a6; font-size: 13px">( {{ item.tag }} )</span>
    </el-option>
  </el-select>
</template>
<script>
import Fuse from "fuse.js";

export default {
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
      this.$router.push("/Gym/Edit/" + val.id + "");
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
            name: "id",
            weight: 0.7
          },
          {
            name: "name",
            weight: 0.3
          },
          {
            name: "ssn",
            weight: 1
          },
          {
            name: "phoneNumber1",
            weight: 0.3
          },
          {
            name: "tag",
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