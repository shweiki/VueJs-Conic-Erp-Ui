<template>
  <div>
    <div class="block">
      <el-select v-model="value" @change="SetVal" placeholder="اشتراكات">
        <el-option
          v-for="item in options"
          :key="item.Id"
          :label="item.Name"
          :value="item.Id"
        >
          <span style="float: left">{{ item.Name }}</span>
          <span style="float: right; color: #8492a6; font-size: 13px"
            >يوم {{ item.NumberDays }}</span
          >
        </el-option>
      </el-select>
    </div>
    <div class="block">
      <el-tag>{{ temp.Name }}</el-tag>
      <el-tag>يوم {{ temp.NumberDays }}</el-tag>

      <el-tag>{{ $t("Members.TotalMembers") + " : " + temp.TotalMembers }}</el-tag>
    </div>
  </div>
</template>
<script>
import { GetActiveMembership } from "@/api/Membership";

export default {
  props: ["MembershipId"],
  data() {
    return {
      options: [
        {
          Id: 0,
          Name: "لا يوجد بيانات",
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
          TotalMembers: 0,
        },
      ],
      value: 2,
      temp: {},
    };
  },
  watch: {
    MembershipId(val) {
      if (val) this.SetVal(val);
    },
  },
  created() {
    GetActiveMembership()
      .then((response) => {
        this.options = response;
        this.SetVal(response[0].Id);
      })
      .catch((error) => {
        reject(error);
      });
  },
  methods: {
    SetVal(val = 0) {
      this.temp = this.options.find((obj) => obj.Id == val);
      this.value = val;
      this.$emit("Set", this.temp);
    },
  },
};
</script>
