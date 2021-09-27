<template>
  <div>
    <el-button
      type="warning"
      icon="el-icon-search"
      @click="dialogFormVisible = true"
      :size="$store.getters.size"
    ></el-button>

    <el-dialog
      style="margin-top: -13vh"
      :show-close="false"
      :visible.sync="dialogFormVisible"
    >
      <div slot="title" class="dialog-footer">
        <el-col :span="4">
          <Add-Device-Log />
        </el-col>
        <el-col :span="20">
          <el-divider> سيجلات الدوام </el-divider>
        </el-col>
      </div>
      <el-table :data="Log" border fit highlight-current-row style="width: 100%">
        <el-table-column label="رقم" prop="Id" align="center"> </el-table-column>
        <el-table-column label="الاسم الجهاز" prop="Name" align="center">
        </el-table-column>
        <el-table-column label="التاريخ" width="150px" align="center">
          <template slot-scope="{ row }">
            <span>{{ row.DateTime | parseTime("{y}-{m}-{d}") }}</span>
          </template>
        </el-table-column>
        <el-table-column label="الوقت" width="80px" align="center">
          <template slot-scope="{ row }">
            <span>{{ row.DateTime | parseTime("{h}:{i}") }}</span>
          </template>
        </el-table-column>
        <el-table-column label="الوصف" prop="Description" align="center">
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import AddDeviceLog from "./AddDeviceLog.vue";

export default {
  name: "DialogLogDevice",
  props: ["Log"],
  components: { AddDeviceLog },
  data() {
    return {
      dialogFormVisible: false,
    };
  },
};
</script>
