<template>
  <div>
    <el-button
      type="primary"
      icon="el-icon-search"
      @click="Open = true"
    ></el-button>

    <el-dialog
      width="80%"
      style="margin-top: -13vh"
      :show-close="false"
      title="بحث عن صنف"
      :visible.sync="Open"
      @closed="focus"
    >
      <item-list
        DblClickRow="AddAsRow"
        @dblclick="
          (v) => {
            AddItem(v);
          }
        "
      />
    </el-dialog>
  </div>
</template>

<script>
import ItemList from "@/views/Inventory/Item/List.vue";
export default {
  components: { ItemList },
  data() {
    return {
      Open: false,
      search: "",
    };
  },
  methods: {
    AddItem(row) {
      this.$emit("add", row, 1);
      this.Open = false;
    },
    focus() {
      this.$emit("focus");
    },
  },
};
</script>
