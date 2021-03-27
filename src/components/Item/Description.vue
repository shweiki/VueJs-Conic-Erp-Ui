<template>
  <div>
    <el-popover
      popper-class="popover"
      width="100%"
      trigger="click"
    >
      <el-checkbox-group @change="SetVal" v-model="value" size="small">
        <el-checkbox-button
          v-for="item in $store.getters.settings.ItemMoveDec"
          :key="item.value"
          :label="item.label"
        ></el-checkbox-button>
      </el-checkbox-group>

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
      <el-button size="mini" type="success" icon="el-icon-s-order" slot="reference" />
    </el-popover>
  </div>
</template>

<script>
import ElDragSelect from "@/components/DragSelect"; // base on element-ui

export default {
  components: { ElDragSelect },
  data() {
    return {
      value: []
    };
  },
  watch: {
    Value(val) {
      if (val) this.SetVal(val);
      else this.SetVal("");
    }
  },
  methods: {
    SetVal(val) {
      this.$emit("Set", val.toString());
    }
  }
};
</script>

<style  >
.el-popper[x-placement^="bottom"] {
    margin-top: 30px;
}
.popover {
  background: #3f7faf;
}
</style>
