<template>
  <div >
    <el-drag-select @change="SetVal" v-model="value"  multiple placeholder="ملاحظات">
      <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
    </el-drag-select>

      <el-tag v-for="item of value" :key="item" >
        {{ item }}
      </el-tag>
  </div>
</template>

<script>
import ElDragSelect from '@/components/DragSelect' // base on element-ui

export default {
  components: { ElDragSelect },
  data() {
    return {
      value: [],
      options: [{
        value: 'Apple',
        label: 'مع بصل'
      }, {
        value: 'Banana',
        label: 'Banana'
      }, {
        value: 'Orange',
        label: 'Orange'
      }, {
        value: 'Pear',
        label: 'Pear'
      }, {
        value: 'Strawberry',
        label: 'Strawberry'
      }]
    }
  },
  methods: {
    SetVal(val) {
      this.$emit("Set", val.toString());
    }
  }}
</script>
