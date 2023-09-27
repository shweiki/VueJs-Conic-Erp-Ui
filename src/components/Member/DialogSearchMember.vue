<template>
  <div>
    <el-button type="primary" icon="el-icon-search" @click="Open = true"></el-button>

    <el-dialog
      width="80%"
      style="margin-top: -13vh"
      :show-close="false"
      v-bind:title="$t('Vendors.Search') + '/ هاتف / الرقم الوطني /  رقم العضوية'"
      :visible.sync="Open"
      @closed="focus"
    >
      <list
        DblClickRow="AddAsRow"
        @dblclick="
          (v) => {
            Add(v);
          }
        "
      />
    </el-dialog>
  </div>
</template>

<script>
import List from "@/views/Gym/Members/components/List.vue";
export default {
  components: { List },
  data() {
    return {
      Open: false,
      search: "",
    };
  },
  methods: {
    Add(row) {
      this.$emit("add", row, 1);
      this.Open = false;
    },
    focus() {
      this.$emit("focus");
    },
  },
};
</script>
