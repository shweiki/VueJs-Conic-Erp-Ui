<template>
  <div :class="{ show: show }" class="employee-search">
    <el-input :disabled="true" v-model="Employee.Name" class="input-with-select">
      <svg-icon
        slot="append"
        class-name="search-icon"
        icon-class="search"
        @click.stop="click"
      />
    </el-input>
    <el-select
      ref="EmployeeSearchSelect"
      v-model="search"
      :remote-method="querySearch"
      filterable
      default-first-option
      remote
      v-bind:placeholder="$t('Vendors.Search') + '/ هاتف / الرقم الوطني /  رقم الوظيفي'"
      @change="change"
      class="employee-search-select"
    >
      <el-option v-for="item in options" :key="item.Id" :value="item" :label="item.Name">
        <span style="">{{ item.PhoneNumber1 }}</span>

        <span style="float: right">{{ item.Id }}</span>
        <span style="float: left color: #8492a6 font-size: 13px">{{ item.Name }}</span>
      </el-option>
    </el-select>
  </div>
</template>
<script>
import { GetEmployeeByAny, GetEmployeeById } from "@/api/Employee";

export default {
  props: ["EmployeeId"],
  data() {
    return {
      search: "",
      options: [],
      show: false,
      Employee: {},
    };
  },
  watch: {
    show(value) {
      if (value) {
        document.body.addEventListener("click", this.close);
      } else {
        document.body.removeEventListener("click", this.close);
      }
    },
  },
  created() {
    if (
      this.EmployeeId != null &&
      this.EmployeeId != undefined &&
      this.EmployeeId != "" &&
      this.EmployeeId > 0
    ) {
      GetEmployeeById({ Id: this.EmployeeId }).then((res) => {
        this.change(res);
      });
    }
  },
  methods: {
    change(val) {
      this.search = "";
      this.options = [];
      this.Employee = val;
      this.show = false;
      this.$emit("Set", val);
    },
    querySearch(query) {
      if (query !== "" && query.length > 1) {
        GetEmployeeByAny({ Any: query }).then((res) => {
          this.options = res;
        });
      } else {
        this.options = [];
      }
    },
    click() {
      this.show = !this.show;
      if (this.show) {
        this.$refs.EmployeeSearchSelect && this.$refs.EmployeeSearchSelect.focus();
      }
    },
    close() {
      this.$refs.EmployeeSearchSelect && this.$refs.EmployeeSearchSelect.blur();
      this.options = [];
      this.show = false;
    },
  },
};
</script>
<style lang="scss" scoped>
.employee-search {
  font-size: 0 !important;

  .search-icon {
    cursor: pointer;
    font-size: 18px;
    vertical-align: middle;
  }

  .employee-search-select {
    font-size: 18px;
    transition: width 0.2s;
    width: 0;
    overflow: hidden;
    background: transparent;
    border-radius: 0;
    display: inline-block;
    vertical-align: middle;

    /deep/ .el-input__inner {
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
    .employee-search-select {
      width: 210px;
      margin-left: 10px;
    }
  }
}
</style>
