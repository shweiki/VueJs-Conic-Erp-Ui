<template>
  <div class="app-container" style="direction: rtl">
    <add-entry
      v-if="checkPermission(['admin'])"
      :AccountId1="3"
      :AccountId2="AccountId"
    />
    <el-table :data="EntryMovements" fit border highlight-current-row height="500">
      <el-table-column
        prop="Id"
        v-bind:label="$t('Vendors.ID')"
        width="80"
        align="center"
      >
        <template slot-scope="{ row }">
          <el-tag type="primary" disable-transitions>
            <strong
              style="font-size: 10px; cursor: pointer"
              @click="
                () => {
                  let r = $router.resolve({
                    path: '/EntryAccounting/Edit/' + row.EntryId,
                  });
                  window.open(r.href, r.route.name, $store.getters.settings.windowStyle);
                }
              "
              >{{ row.Id }}</strong
            ></el-tag
          >
        </template>
      </el-table-column>
      <el-table-column label="التاريخ" align="center" width="140">
        <template slot-scope="scope">
          <el-date-picker
            :format="$store.getters.settings.DateTimeFormat"
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
  },
  methods: { checkPermission },
};
</script>
