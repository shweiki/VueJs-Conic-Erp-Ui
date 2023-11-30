<template>
  <el-select v-model="value" placeholder="Users" clearable class="filter-item" style="width: 130px" @change="SetVal">
    <el-option v-for="item in options" :key="item.key" :label="item.User.UserName" :value="item.User.UserName" />
  </el-select>
</template>
<script>
import { GetUsersNames } from '@/api/User'

export default {
  props: {
    all: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      value: '',
      options: []
    }
  },
  watch: {
    value(val) {
      if (val) this.SetVal(val)
    }
  },
  created() {
    GetUsersNames().then((res) => {
      if (this.all) {
        this.options.push({ User: { Id: 0, UserName: 'all' }})
        this.options.push(...res)
      } else {
        this.options = res
      }
    })
  },
  methods: {
    SetVal(val) {
      if (val && val !== '' && val != null) {
        this.$emit('Set', this.options.find((obj) => obj.User.UserName === val).User.UserName)
      } else {
        this.$emit('Set', null)
      }
      this.value = val
    }
  }
}
</script>
