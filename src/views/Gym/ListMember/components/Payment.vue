<template>
  <div class="app-container" style="direction: rtl">
    <el-table height="500" :data="Payments" fit border highlight-current-row>
      <el-table-column label="#" prop="Id" align="center">
        <template slot="header" slot-scope="{}">
          <el-button
            type="primary"
            icon="el-icon-refresh"
            @click="getdata()"
          />
        </template>
      </el-table-column>
      <el-table-column
        prop="ObjectId"
        label="رقم المشترك"
        align="center"
      />
      <el-table-column label="التاريخ" align="center" width="150">
        <template slot-scope="scope">
          <el-date-picker
            v-model="scope.row.FakeDate"
            :format="$store.getters.settings.DateTimeFormat"
            disabled
          />
        </template>
      </el-table-column>
      <el-table-column
        prop="PaymentMethod"
        :label="$t('CashPool.Pay')"
        align="center"
      />
      <el-table-column :label="$t('CashPool.Total')" align="center">
        <template
          slot-scope="scope"
        >{{
          scope.row.TotalAmmount.toFixed($store.getters.settings.ToFixed)
        }}
          JOD</template>
      </el-table-column>
      <el-table-column label="#" align="center">
        <template slot-scope="scope">
          <Drawer-Print type="Payment" :data="scope.row" />
        </template>
      </el-table-column>
      <el-table-column label="الحالة" align="center">
        <template slot-scope="scope">
          <Status-Tag :status="scope.row.Status" table-name="Payment" />
        </template>
      </el-table-column>
      <el-table-column
        label="محرر"
        align="center"
        prop="CreatedBy"
      />
    </el-table>
  </div>
</template>

<script>
import checkPermission from '@/utils/permission'
import StatusTag from '@/components/Oprationsys/StatusTag'

import DrawerPrint from '@/components/PrintRepot/DrawerPrint.vue'

export default {
  components: { StatusTag, DrawerPrint },
  props: {
    Payments: {
      type: Array,
      default: () => {
        return null
      }
    }
  },
  methods: {
    checkPermission
  }
}
</script>
