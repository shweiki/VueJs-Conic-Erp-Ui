<template>
  <el-row>
    <el-col :span="4">
      <AddAccountDialog
        @Set="
          (v) => {
            change(v);
          }
        "
      />
    </el-col>
    <el-col :span="4">
      <AccountSearchDialog @add="Add" />
    </el-col>
    <el-col :span="12">
      <el-input :disabled="true" v-model="Account.Name"> </el-input>
    </el-col>
    <el-col :span="4"> <EditAccount :AccountId="Account.Id" /> </el-col>
  </el-row>
</template>
<script>
import { GetById } from "@/api/Account";

import AddAccountDialog from "@/components/TreeAccount/AddAccountDialog.vue";
import EditAccount from "@/components/TreeAccount/EditAccount.vue";
import AccountSearchDialog from "@/components/TreeAccount/AccountSearchDialog.vue";
export default {
  components: { AddAccountDialog, EditAccount, AccountSearchDialog },
  props: {
    Id: {
      type: Number,
      default: undefined,
    },
  },
  watch: {
    Id(value) {
      if (value != undefined) {
        GetById({ Id: value }).then((res) => {
          this.change(res);
        });
      }
    },
  },
  data() {
    return {
      Account: { Id: undefined, Name: "", AccountId: 0 },
    };
  },

  methods: {
    change(val) {
      this.Account = val;
      this.$emit("Set", val);
    },

    Add(val) {
      this.change(val);
    },
  },
};
</script>

