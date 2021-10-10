<template>
  <div class="app-container" style="direction: rtl">
    <el-row :gutter="20">
      <el-col :span="8">
        <add-entry
          v-if="checkPermission(['admin'])"
          :AccountId1="3"
          :AccountId2="AccountId"
        />
      </el-col>
    </el-row>
    <el-table
      @row-dblclick="
        (row) => {
          $router.push({ path: `/EntryAccounting/Edit/${row.EntryId}` });
        }
      "
      :data="EntryMovements"
      fit
      border
      highlight-current-row
      height="500"
    >
      <el-table-column prop="Id" label="Id" width="80" align="center"></el-table-column>
      <el-table-column label="التاريخ" align="center" width="140">
        <template slot-scope="scope">
          <el-date-picker
            format="dd/MM/yyyy"
            disabled
            v-model="scope.row.FakeDate"
          ></el-date-picker>
        </template>
      </el-table-column>
      <el-table-column label="البيان" align="center">
        <template slot-scope="scope">{{ scope.row.Description }}</template>
      </el-table-column>
      <el-table-column v-bind:label="$t('Account.Credit')" width="100" align="center">
        <template slot-scope="scope">{{
          scope.row.Credit.toFixed($store.getters.settings.ToFixed)
        }}</template>
      </el-table-column>
      <el-table-column
        v-bind:label="$t('Account.Debit')"
        prop="totalDebit"
        width="100"
        align="center"
      >
        <template slot-scope="scope">{{
          scope.row.Debit.toFixed($store.getters.settings.ToFixed)
        }}</template>
      </el-table-column>
      <el-table-column label="الرصيد" prop="TotalRow" width="100" align="center">
        <template slot-scope="scope">{{
          scope.row.TotalRow.toFixed($store.getters.settings.ToFixed)
        }}</template>
      </el-table-column>
      <!--<el-table-column v-bind:label="$t('Account.funds')" width="120" align="center">
        <template slot-scope="scope">{{ (scope.row.Credit - scope.row.Debit).toFixed(this.$store.getters.settings.ToFixed) }}</template>
      </el-table-column>-->
    </el-table>
  </div>
</template>

<script>
import AddEntry from "@/views/Accounting/EntryAccounting/components/AddEntry.vue";
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
    EmployeeId: {
      type: Number,
      default: undefined,
    },
    EmployeeName: {
      type: String,
    },
  },
  methods: { checkPermission },
};
</script>
