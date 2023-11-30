<template>
<el-tooltip effect="dark" content="اضافات" placement="left">
  <div>
    <el-popover popper-class="popover" trigger="click">
      <el-checkbox-group @change="SetVal" v-model="value" size="small">
        <el-checkbox-button
          v-for="item in $store.getters.settings.ItemMoveDec"
          :key="item.value"
          :label="item.label"
        ></el-checkbox-button>
      </el-checkbox-group>
      <el-input v-model="text">
        <el-button
          @click="SetText(text)"
          slot="append"
          icon="el-icon-plus"
          type="primary"
        ></el-button>
      </el-input>
      <!--
      <el-drag-select
        @change="SetVal"
        v-model="value"
        multiple
        placeholder="ملاحظات"
      >
        <el-option
          v-for="item in $store.getters.settings.ItemMoveDec"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-drag-select>
-->
      <el-button
        style="float:left"
        :size="$store.getters.size"
        type="success"
        icon="el-icon-s-order"
        slot="reference"
      >
      </el-button>
    </el-popover>

  </div>
</el-tooltip>
</template>
<script>
import ElDragSelect from "@/components/DragSelect"; // base on element-ui

export default {
  components: { ElDragSelect },
  data() {
    return {
      value: [],
      text: ""
    };
  },
  watch: {
    value(val) {
      if (val) this.SetVal(val);
      else this.SetVal("");
    }
  },
  methods: {
    SetVal(val) {
      this.$emit("Set", val.toString());
    },
    SetText(v) {
      this.value.push(v);

      this.SetVal(this.value);
    }
  }
};
</script>

<style  >

.popover[x-placement^="bottom"] {
  background: #3f7faf;
    margin-top: 30px;
  width: 50%;
}
 .el-tooltip__popper {
      margin-top: 20px;
    }
</style>
