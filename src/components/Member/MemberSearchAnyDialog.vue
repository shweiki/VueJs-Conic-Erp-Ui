<template>
  <div>
    <el-col :span="4">
      <Dialog-Search-Member @add="Add" />
    </el-col>
    <el-col :span="20">
      <el-input :disabled="true" v-model="Member.Name"> </el-input>
    </el-col>
  </div>
</template>
<script>
import { GetMemberById as GetById } from "@/api/Member";

import DialogSearchMember from "@/components/Member/DialogSearchMember.vue";
export default {
  props: {
    MemberId: {
      type: Number,
      default: undefined,
    },
  },
  components: { DialogSearchMember },
  data() {
    return {
      Member: { Id: this.MemberId, Name: "", AccountId: 0 },
    };
  },
  created() {
    if (this.MemberId != undefined) {
      GetById({ Id: this.MemberId }).then((res) => {
        this.Member = res;
      });
    }
  },
  watch: {
    MemberId(value) {
      if (value != undefined) {
        GetById({ Id: value }).then((res) => {
          this.change(res);
        });
      }
    },
  },
  methods: {
    change(val) {
      this.Member = val;
      this.$emit("Set", val);
    },

    Add(v) {
      console.log("Add", v);

      this.change(v);
    },
  },
};
</script>
<style lang="scss" scoped>
.Member-search {
  font-size: 0 !important;

  .search-icon {
    cursor: pointer;
    font-size: 18px;
    vertical-align: middle;
  }

  .Member-search-select {
    font-size: 18px;
    transition: width 0.2s;
    width: 0;
    overflow: hidden;
    background: transparent;
    border-radius: 0;
    display: inline-block;
    vertical-align: middle;

    .el-input__inner {
      border-radius: 0;
      border: 0;
      padding-left: 0;
      padding-right: 0;
      box-shadow: none !important;
      border-bottom: 1px solid #d9d9d9;
      vertical-align: middle;
    }
  }

  &.show {
    .Member-search-select {
      width: 210px;
      margin-left: 10px;
    }
  }
}
</style>
