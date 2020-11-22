<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: "App"
};
</script>
<style>
.el-row--flex {
  padding: 3.5px;
}
.el-input-number {
  width: fit-content;
}
.el-table {
  text-align: right;
}
.el-table thead {
  color: #2c3a47;
}
.el-date-range-picker__content {
  float: right;
}
.el-card__body {
  font-weight: 700;
}
.el-scrollbar {
  font: menu;
  font-weight: 700;
}

.el-form-item__label {
  margin-left: 20px;
  float: right;
}

.el-table--border {
  border: 1.5px solid #2f3542;
}
.el-form-item__error {
  left: unset;
}
.currency-input {
  position: relative;
  width: 100%;
  height: 32px;
  line-height: 32px;
  -webkit-appearance: none;
  background-color: #ffffff;
  background-image: none;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  color: #606266;
  font-size: inherit;
  outline: none;
  padding: 0 15px;
  -webkit-transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
  transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
}
</style>