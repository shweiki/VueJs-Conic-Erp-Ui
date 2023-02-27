<template>
  <div>
    <el-radio-group style="direction: ltr" v-model="Status" @change="SetVal">
      <el-radio-button v-for="op in $store.getters.Oprations.filter((Item) => {
        return Item.TableName == TableName;
      })" :key="op.Id" v-bind:label="op.Status" :fill="op.Color">{{ op.OprationDescription }}
        <i v-if="op.IconClass != null" :class="op.IconClass"></i>
      </el-radio-button>
      <el-radio-button label="null">{{
        $t("OperationSys.All")
      }}</el-radio-button>
    </el-radio-group>
  </div>
</template>
<script>

export default {
  props: {
    TableName: String,
    default: Number,
  },

  data() {
    return {
      Oprations: [],
      Status: undefined,
    };
  },
  created() {
    this.SetVal(this.Status);
  },
  methods: {
    SetVal(val) {
      this.Status = val;
      this.$emit("Set", this.Status);
    },
  },
};
</script>
