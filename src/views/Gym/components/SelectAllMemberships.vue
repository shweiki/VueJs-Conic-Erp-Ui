<template>
  <div>
    <div class="block">
      <el-select v-model="value" placeholder="اشتراكات" :clearable="clearable" @change="SetVal">
        <el-option
          v-for="item in options"
          :key="item.Id"
          :label="item.Name"
          :value="item.Id"
        >
          <span style="float: left">{{ item.Name }}</span>
          <span
            style="float: right; color: #8492a6; font-size: 13px"
          >يوم {{ item.NumberDays }}</span>
        </el-option>
      </el-select>
    </div>
    <div v-if="withDescription" class="block">
      <el-tag>{{ temp.Name }}</el-tag>
      <el-tag>يوم {{ temp.NumberDays }}</el-tag>

      <el-tag>{{ $t("Members.TotalMembers") + " : " + temp.TotalMembers }}</el-tag>
    </div>
  </div>
</template>
<script>
import { GetMembership } from '@/api/Membership'

export default {
  props: {
    membershipId: {
      type: Number,
      default: 0,
      required: false
    },
    withDescription: {
      type: Boolean,
      default: true
    },
    clearable: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      options: [
        {
          Id: 0,
          Name: 'لا يوجد بيانات',
          Description: null,
          FullDayPrice: 0,
          MinFreezeLimitDays: 0,
          MaxFreezeLimitDays: 0,
          MorningPrice: 0,
          NumberDays: 0,
          Status: 0,
          Tax: 0,
          Rate: 0,
          NumberClass: 0,
          TotalMembers: 0
        }
      ],
      value: '',
      temp: {}
    }
  },
  watch: {
    membershipId(val) {
      if (val) this.SetVal(val)
    }
  },
  created() {
    GetMembership().then((response) => {
      this.options = response
    })
  },
  methods: {
    SetVal(val) {
      if (val && val != null) {
        this.temp = this.options.find((obj) => obj.Id === val)
        this.value = val
        this.$emit('Set', this.temp)
      } else {
        this.$emit('Set', { Id: undefined })
      }
    }
  }
}
</script>
