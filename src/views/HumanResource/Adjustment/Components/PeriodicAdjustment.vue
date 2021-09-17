<template>
  <div class="app-container" style="direction: rtl">
    
 <el-table
       :data="PAdjustments"
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
        <template slot-scope="scope">{{
          scope.row.AdjustmentAmount.toFixed($store.getters.settings.ToFixed)
        }}</template>
      </el-table-column>
<el-table-column label="القيمة المؤوية" align="center" width="200">
        <template slot-scope="scope">{{ scope.row.AdjustmentPercentage }}</template>
      </el-table-column>

      </el-table>

  </div>
</template>

<script>

export default {
  props: {
    PAdjustments: {
      type: Array,
      default: () => {
        return null;
      }
    },
  },
  
};
</script>
