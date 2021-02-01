<template>
  <div class="app-container" style="direction : rtl ">
    <add-entry v-if="checkPermission(['Admin'])" :AccountId1="3" :AccountId2="AccountId" />
    <el-table :data="EntryMovements" fit border highlight-current-row>
      <el-table-column prop="Id" label="ID" width="120" align="center"></el-table-column>
      <el-table-column label="التاريخ" align="center" width="200">
        <template slot-scope="scope">
          <el-date-picker format="dd/MM/yyyy" disabled v-model="scope.row.FakeDate"></el-date-picker>
        </template>
      </el-table-column>
      <el-table-column label="البيان" align="center">
        <template slot-scope="scope">{{ scope.row.Description}}</template>
      </el-table-column>
      <el-table-column v-bind:label="$t('Account.Credit')" width="120" align="center">
        <template slot-scope="scope">{{(scope.row.Credit).toFixed(3) }}</template>
      </el-table-column>
      <el-table-column
        v-bind:label="$t('Account.Debit')"
        prop="totalDebit"
        width="120"
        align="center"
      >
        <template slot-scope="scope">{{(scope.row.Debit).toFixed(3) }}</template>
      </el-table-column>
      <!--<el-table-column v-bind:label="$t('Account.funds')" width="120" align="center">
        <template slot-scope="scope">{{ (scope.row.Credit - scope.row.Debit).toFixed(3) }}</template>
      </el-table-column>-->
    </el-table>
  </div>
</template>

<script>
import AddEntry from "@/views/Accounting/EntryAccounting/components/AddEntry";
import checkPermission from "@/utils/permission";

export default {
  components: { AddEntry },
  props: {
    EntryMovements: {
      type: Array,
      default: () => {
        return null;
      },
    },
    AccountId: {
      type: Number,
      default: undefined,
    },
  },
  methods: { checkPermission },
};
</script>
