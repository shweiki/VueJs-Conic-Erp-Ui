<template>
  <div>
    <el-row style="background: #2f3542; color: white">
      <el-col :span="4">
        <Add-Account-Dialog @Done="getdata()" />
      </el-col>
      <el-col :span="16">
        <div :class="{ show: show }" class="account-search">
          <el-input :disabled="true" v-model="Account.Name" class="input-with-select">
            <svg-icon
              slot="append"
              class-name="search-icon"
              icon-class="search"
              @click.stop="click"
            />
          </el-input>
          <el-select
            ref="AccountSearchSelect"
            v-model="search"
            :remote-method="querySearch"
            filterable
            default-first-option
            remote
            placeholder="البحث بحسب الاسم / الكود "
            @change="change"
            class="account-search-select"
          >
            <el-option
              v-for="item in options"
              :key="item.Id"
              :value="item"
              :label="item.Name"
            >
              <span style="">{{ item.Code }}</span>

              <span style="float: right">{{ item.Id }}</span>
              <span style="float: left color: #8492a6 font-size: 13px">{{
                item.Name
              }}</span>
            </el-option>
          </el-select>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { GetAccountByAny, GetById } from "@/api/Account";
import AddAccountDialog from "@/components/TreeAccount/AddAccountDialog.vue";

export default {
  props: ["AccountId"],
  components: { AddAccountDialog },
  data() {
    return {
      search: "",
      options: [],
      show: false,
      Account: { Id: 6, Name: "زبون نقدي" },
    };
  },
  watch: {
    AccountId(value) {
      if (value != null && value != undefined && value != "" && value > 0) {
        GetById({ Id: value }).then((res) => {
          this.change(res);
        });
      }
    },
    show(value) {
      if (value) {
        document.body.addEventListener("click", this.close);
      } else {
        document.body.removeEventListener("click", this.close);
      }
    },
  },
  methods: {
    change(val) {
      this.search = "";
      this.options = [];
      this.Account = val;
      this.show = false;
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
    click() {
      this.show = !this.show;
      if (this.show) {
        this.$refs.AccountSearchSelect && this.$refs.AccountSearchSelect.focus();
      }
    },
    close() {
      this.$refs.AccountSearchSelect && this.$refs.AccountSearchSelect.blur();
      this.options = [];
      this.show = false;
    },
  },
};
</script>
<style lang="scss" scoped>
.account-search {
  font-size: 0 !important;

  .search-icon {
    cursor: pointer;
    font-size: 18px;
    vertical-align: middle;
  }

  .account-search-select {
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
    .account-search-select {
      width: 210px;
      margin-left: 10px;
    }
  }
}
</style>
