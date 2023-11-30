<template>
  <div>
    <el-col
      :span="2"
    ><Add-Unit-Item
      @Success="(v) => options.push({ value: v.Name, label: v.Name })"
    /></el-col>
    <el-col :span="20" />
    <el-drag-select v-model="value" multiple placeholder="وحدات قياس" @change="SetVal">
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-drag-select>
    <el-tag v-for="item of value" :key="item">
      {{ item }}
    </el-tag>
  </div>
</template>

<script>
import ElDragSelect from '@/components/DragSelect' // base on element-ui
import { GetActiveUnitItem } from '@/api/UnitItem'
import AddUnitItem from '@/components/Add/AddUnitItem.vue' // base on element-ui

export default {
  components: { ElDragSelect, AddUnitItem },
  props: ['Value'],
  data() {
    return {
      value: [],
      options: []
    }
  },
  mounted() {
    if (this.Value) this.value = Array.from(this.Value.split(','))
    GetActiveUnitItem()
      .then((response) => {
        // handle success
        console.log(response)
        this.options = response
        this.loading = false
      })
      .catch((error) => {
        // handle error
        console.log(error)
      })
  },
  methods: {
    SetVal(val) {
      this.$emit('Set', val.toString())
    }
  }
}
</script>
