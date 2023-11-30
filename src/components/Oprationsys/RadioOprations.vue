<template>
  <div>
    <el-radio-group v-model="Status" style="direction: ltr" @change="SetVal">
      <el-radio-button
        v-for="op in $store.getters.Oprations.filter((Item) => {
          return Item.TableName == tableName;
        })"
        :key="op.Id"
        :label="op.Status"
        :fill="op.Color"
      >{{ op.OprationDescription }}
        <i v-if="op.IconClass != null" :class="op.IconClass" />
      </el-radio-button>
      <el-radio-button label="null">{{ $t("OperationSys.All") }}</el-radio-button>
    </el-radio-group>
  </div>
</template>
<script>
export default {
  props: {
    value: {
      type: Number,
      required: true
    },
    tableName: {
      type: String,
      required: true
    }

  },
  data() {
    return {
      Oprations: [],
      Status: null
    }
  },
  watch: {
    value(val) {
      if (val != null && val !== '') {
        this.Status = val
      }
    }
  },
  created() {
    this.Status = this.value
  },
  methods: {
    SetVal(val) {
      this.Status = val
      this.$emit('Set', this.Status)
    }
  }
}
</script>
