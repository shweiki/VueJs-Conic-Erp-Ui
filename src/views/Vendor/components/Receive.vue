<template>
  <div class="app-container" style="direction: rtl">
    <el-table height="500" :data="List" fit border highlight-current-row>
      <el-table-column label="#" prop="Id" align="center">
        <template slot="header" slot-scope="{}">
          <el-button type="primary" icon="el-icon-refresh" @click="getdata()"></el-button>
        </template>
      </el-table-column>
      <el-table-column prop="ObjectId" label="رقم " align="center"></el-table-column>
      <el-table-column label="التاريخ" align="center" width="150">
        <template slot-scope="scope">
          <el-date-picker
            :format="$store.getters.settings.DateTimeFormat"
            disabled
            v-model="scope.row.FakeDate"
          ></el-date-picker>
        </template>
      </el-table-column>
      <el-table-column
        prop="ReceiveMethod"
        label="طريقة الصرف"
        align="center"
      ></el-table-column>
      <el-table-column v-bind:label="$t('CashPool.Total')" align="center">
        <template slot-scope="scope"
          >{{
            scope.row.TotalAmmount.toFixed($store.getters.settings.ToFixed)
          }}
          JOD</template
        >
      </el-table-column>
      <el-table-column label="#" align="center">
        <template slot-scope="scope">
          <Drawer-Print Type="Receive" :Data="scope.row" />
        </template>
      </el-table-column>
      <el-table-column label="الحالة" align="center">
        <template slot-scope="scope">
          <Status-Tag :Status="scope.row.Status" TableName="Receive" />
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import checkPermission from "@/utils/permission";
import StatusTag from "@/components/Oprationsys/StatusTag";
import DrawerPrint from "@/components/PrintRepot/DrawerPrint";
import { GetReceivesByVendorId } from "@/api/Receive";

export default {
  components: { StatusTag, DrawerPrint },
  props: {
    VendorId: {
      type: Number,
      default: () => {
        return undefined;
      },
    },
  },
  data() {
    return {
      List: [],
    };
  },
  created() {
    this.getdata();
  },
  methods: {
    checkPermission,
    getdata() {
      GetReceivesByVendorId({
        VendorId: this.VendorId,
      }).then((response) => {
        //   console.log("log :", response);
        this.List = response.reverse();
      });
    },
  },
};
</script>
