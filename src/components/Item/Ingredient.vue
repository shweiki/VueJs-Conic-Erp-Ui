<template>
  <div>
    <Items-Search @add="AddItem" />
    <el-table :data="value" style="width: 100%" max-height="250">
      <el-table-column prop="ItemId" label="ItemId" width="180">
      </el-table-column>
      <el-table-column prop="Qty" label="Qty" width="180">
        <template slot-scope="scope">
          <el-input-number
            :size="$store.getters.size"
            v-model="value[scope.$index].Qty"
            :precision="2"
            :step="1"
            :min="0.0"
            :max="1000000"
            @change="SetVal"
          ></el-input-number> </template
      ></el-table-column>
      <el-table-column prop="Name" label="Name"> </el-table-column>
      <el-table-column label="Operations" width="120">
        <template slot-scope="scope">
          <el-button
            @click="deleteRow(scope.$index, value)"
            type="text"
            size="small"
          >
            Remove
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import ItemsSearch from "./ItemsSearch.vue";

export default {
  name: "Ingredient",
  props: ["Value"],
  components: { ItemsSearch },
  data() {
    return {
      value: []
    };
  },
  watch: {
    Value(v) {
      if (v) {
        this.value = JSON.parse(v);
      }
    }
  },
  methods: {
    AddItem(x) {
      this.value.push({
        ItemId: x.Id,
        Qty: 1,
        Name: x.Name
      });
      this.SetVal();
    },
    SetVal() {
      //    console.log(JSON.stringify(val).toString());
      this.$emit("Set", JSON.stringify(this.value));
    },
    deleteRow(index, rows) {
      this.value.splice(index, 1);
    }
  }
};
</script>
