<template>
  <el-radio-group v-model="value">
    <el-radio-button v-for="(item, index) in options" :key="index" :label="item.value">{{
      item.label
    }}</el-radio-button>
  </el-radio-group>
</template>
<script>
import { GetActiveInventory } from '@/api/InventoryItem'

export default {
  props: ['InventoryId'],
  data() {
    return {
      options: [],
      value: 1
    }
  },
  watch: {
    InventoryId(val) {
      if (val) this.SetVal(val)
    }
  },
  created() {
    GetActiveInventory()
      .then((response) => {
        this.options = response
        this.SetVal(response[0].value)
      })
      .catch((error) => {
        reject(error)
      })
  },
  methods: {
    SetVal(val) {
      this.$emit(
        'Set',
        this.options.find((obj) => obj.value == val)
      )
      this.value = val
    }
  }
}
</script>
