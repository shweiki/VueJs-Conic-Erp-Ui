<template>
  <div>
    <el-col :span="6">
      <add-dialog @Done="getdata" />
    </el-col>
    <el-col :span="18">
      <el-select v-model="Region" filterable placeholder="المنطقة" @change="SetVal">
        <el-option
          v-for="item in Regions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
          <span style="float: left">{{ item.label }}</span>
          <span style="float: right; color: #8492a6; font-size: 13px">{{
            item.price
          }}</span>
        </el-option>
      </el-select>
    </el-col>
  </div>
</template>
<script>
import AddDialog from '@/views/Settings/Areas/AddDialog.vue'
import { GetAreasLabel } from '@/api/Area'
export default {
  components: { AddDialog },
  props: ['Value'],
  data() {
    return {
      Region: 1,
      Regions: [],
      Price: 0.0
    }
  },
  watch: {
    value(val) {
      console.log('select', val)

      if (val != null && val != undefined) {
        this.Region = this.Regions.find((element) => element.label == val).value
        this.SetVal(this.Region)
      }
    }
  },
  mounted() {
    this.getdata()
  },
  methods: {
    getdata() {
      this.loading = true
      GetAreasLabel()
        .then((response) => {
          // handle success
          console.log(response)
          this.Regions = response
          this.SetVal(this.Region)

          this.loading = false
        })
        .catch((error) => {
          // handle error
          console.log(error)
        })
    },
    SetVal(val) {
      if (val) {
        this.$emit(
          'SetRegion',
          this.Regions.find((element) => element.value == val).label
        )
        this.$emit(
          'SetDeliveryPrice',
          this.Regions.find((element) => element.value == val).price
        )
      }
    }
  }
}
</script>
