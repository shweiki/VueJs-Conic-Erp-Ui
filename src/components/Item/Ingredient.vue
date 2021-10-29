<template>
  <div>
    <el-col :span="3">
      <el-button
        icon="fa fa-save"
        style="float: left"
        type="primary"
        @click="updateData()"
      />
    </el-col>
    <el-col :span="21">
      <Items-Search @add="AddItem" />
    </el-col>

    <el-table :data="value" style="width: 100%" max-height="250">
      <el-table-column prop="ItemId" label="رقم" width="180"> </el-table-column>
      <el-table-column prop="Qty" label="الكمية" width="180">
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
      <el-table-column prop="Name" label="الاسم"> </el-table-column>
      <el-table-column label="#" width="120">
        <template slot-scope="scope">
          <el-button
            icon="el-delete"
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
import { EditIngredient } from "@/api/Item";

export default {
  name: "Ingredient",
  components: { ItemsSearch },
  props: ["Value", "ItemId"],
  data() {
    return {
      value: JSON.parse(this.Value),
    };
  },

  methods: {
    AddItem(x) {
      this.value.push({
        ItemId: x.Id,
        Qty: 1,
        Name: x.Name,
      });
      //    this.SetVal();
    },
    SetVal() {
      //    console.log(JSON.stringify(val).toString());
      this.$emit("Set", JSON.stringify(this.value));
    },
    updateData() {
      EditIngredient({ ItemId: this.ItemId, Ingredient: JSON.stringify(this.value) })
        .then((response) => {
          this.$notify({
            title: "تم",
            message: "تم التعديل بنجاح",
            type: "success",
            duration: 2000,
          });
        })
        .catch((error) => {
          console.log(error);
        });
    },
    deleteRow(index, rows) {
      this.value.splice(index, 1);
    },
  },
};
</script>
