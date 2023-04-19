<template>
  <div>
    <el-button
      type="success"
      icon="el-icon-view"
      @click="getdata()"
      v-bind:disabled="AccountId == undefined"
    ></el-button>
    <el-dialog style="margin-top: -13vh" :show-close="false" :visible.sync="Visible">
      <el-table :data="list" fit border highlight-current-row height="500">
        <el-table-column prop="Id" label="رقم قيد" width="80" align="center">
          <template slot-scope="{ row }">
            <el-tag type="primary" disable-transitions>
              <strong
                style="font-size: 10px; cursor: pointer"
                @click="
                  () => {
                    let r = $router.resolve({
                      path: '/EntryAccounting/Edit/' + row.EntryId,
                    });
                    window.open(
                      r.href,
                      r.route.name,
                      $store.getters.settings.windowStyle
                    );
                  }
                "
                >{{ row.EntryId }}</strong
              ></el-tag
            >
          </template></el-table-column
        >

        <el-table-column
          prop="Id"
          label="رقم حركة"
          width="80"
          align="center"
        ></el-table-column>
        <el-table-column label="التاريخ" align="center" width="140">
          <template slot-scope="{ row }">
            <span>{{ row.FakeDate | parseTime("{y}-{m}-{d} {h}:{i}") }}</span>
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
    </el-dialog>
  </div>
</template>

<script>
import checkPermission from "@/utils/permission";
import { GetEntryMovementsByAccountId } from "@/api/EntryMovement";
import { parseTime } from "@/utils";

export default {
  props: {
    AccountId: {
      type: Number,
      default: undefined,
    },
  },
  data() {
    return {
      list: [],
      Visible: false,
    };
  },
  methods: {
    checkPermission,
    getdata() {
      GetEntryMovementsByAccountId({
        AccountId: this.AccountId,
      }).then((response) => {
        this.list = response.map((curr, i, array) => {
          curr.TotalRow = array[i != 0 ? i - 1 : i].TotalRow - (curr.Debit - curr.Credit);
          return curr;
        });
        this.Visible = true;
      });
    },
  },
};
</script>
