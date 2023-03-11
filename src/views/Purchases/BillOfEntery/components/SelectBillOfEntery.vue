<template>
  <el-select @change="SetVal" v-model="model" filterable placeholder="حدد البيان">
    <el-option v-for="item in list" :key="item.Id" :label="item.BonId" :value="item.Id">
      <span style="float: left">{{ item.BonId }}</span>
      <span style="float: right; color: #8492a6; font-size: 13px">{{
        item.Description
      }}</span>
    </el-option>
  </el-select>
</template>
<script>
import { GetActiveBillOfEnteryForItemId } from "@/api/BillOfEntery";
export default {
  props: {
    Id: {
      type: Number,
      default: undefined,
    },
    ItemId: {
      type: Number,
      require: true,
    }
  },
  watch: {
    Id(val) {
      console.log("select", val);
      if (val != null && val != undefined) {
        this.Id = val;
      }
    },
    ItemId(val) {
      console.log("ItemId", val);
      if (val != null && val != undefined) {
        this.ItemId = val;
        this.getdata(val);
      }
    },
  },
  data() {
    return {
      model: this.Id,
      list: [],
    };
  },
  created() {
    if (this.ItemId) {
      this.getdata(this.ItemId)
    }
  },
  methods: {
    getdata(itemId) {
      this.loading = true;
      GetActiveBillOfEnteryForItemId({ ItemId: itemId })
        .then((response) => {
          // handle success
          console.log(response);
          this.list = response;
          this.model = this.Id;
          this.SetVal(this.model);

          this.loading = false;
        })
        .catch((error) => {
          // handle error
          console.log(error);
        });
    },
    SetVal(val) {
      if (val) {
        this.$emit(
          "Set",
          val
        );

      }
    },
  },
};
</script>
