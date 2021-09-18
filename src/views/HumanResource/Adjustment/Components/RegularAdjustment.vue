<template>
  <div class="app-container" style="direction: rtl">
    
 <el-table
       :data="RAdjustments"
      fit
      border
      highlight-current-row
      height="500"
      >
         <el-table-column
        prop="Id"
        label="Id"
        width="80"
        align="center"
      ></el-table-column>

        <el-table-column v-bind:label="$t('Classification.Name')" align="center">
        <template slot-scope="scope">{{ scope.row.Name }}</template>
      </el-table-column>

  <el-table-column
        label="القيمة النقدية"
        width="200"
        align="center"
      >
        <template slot-scope="scope" >
          <div v-if="scope.row.Type == 'CashValue' ">
            {{ scope.row.AdjustmentAmount.toFixed($store.getters.settings.ToFixed) }}
            </div>
      </template>
      </el-table-column>
<el-table-column label="القيمة بالساعات" align="center" width="200">
        <template slot-scope="scope" ><div v-if="scope.row.Type == 'Hours' ">{{ scope.row.AdjustmentAmount }}</div></template>
      </el-table-column>

      </el-table>

  </div>
</template>

<script>

export default {
  props: {
    RAdjustments: {
      type: Array,
      default: () => {
        return null;
      }
    },
  },
  
};
</script>
