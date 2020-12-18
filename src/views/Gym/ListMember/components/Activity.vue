<template>
  <div class="app-container" style="direction : rtl ">
    <el-table height="500" :data="MembershipMovements" fit border highlight-current-row>
      >
      <el-table-column prop="Id" label="رقم" align="center"></el-table-column>

      <el-table-column prop="Name" label="الاشتراك" align="center"></el-table-column>
      <el-table-column prop="Type" label="الفترة" align="center"></el-table-column>

      <el-table-column label="تاريخ البدء" align="center" width="150">
        <template slot-scope="scope">
          <el-date-picker format="dd/MM/yyyy" disabled v-model="scope.row.StartDate"></el-date-picker>
        </template>
      </el-table-column>
      <el-table-column label="تاريخ الانتهاء" align="center" width="150">
        <template slot-scope="scope">
          <el-date-picker format="dd/MM/yyyy" disabled v-model="scope.row.EndDate"></el-date-picker>
        </template>
      </el-table-column>
      <el-table-column label="الحالة" align="center">
        <template slot-scope="scope">
       <!--   <el-tag :type="scope.row.Status.ClassName">{{ scope.row.Status.ArabicOprationDescription}}</el-tag>-->
          <el-tag type="warning" v-if="scope.row.Status > 0">
            رصيد التجميد : {{ scope.row.MaxFreezeLimitDays - scope.row.MembershipMovementOrders.reduce(
            (a, b) => a + ((b.Status != 0 && b.Status != -1 &&b.Status !=-2 && b.Type !='Extra') ? Math.round(
            Math.abs(
            (new Date(b.StartDate) - new Date(b.EndDate)) /
            (24 * 60 * 60 * 1000)
            )
            ) : 0),
            0
            ) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="#" align="center">
        <template slot-scope="scope">
          <div v-if="scope.row.Status >= 0">
            <freeze
              v-if="scope.row.MaxFreezeLimitDays - scope.row.MembershipMovementOrders.reduce(
            (a, b) => a + ((b.Status != 0 && b.Status != -1 &&  b.Status !=-2 && b.Type !='Extra')? Math.round(
            Math.abs(
            (new Date(b.StartDate) - new Date(b.EndDate)) /
            (24 * 60 * 60 * 1000)
            )
            ) : 0),
            0
            ) >= scope.row.MinFreezeLimitDays"
              :MemberShipMovementId="scope.row.Id"
              :MaxFreezeLimit="scope.row.MaxFreezeLimitDays"
              :MinFreezeLimit="scope.row.MinFreezeLimitDays"
            />
            <extra :MemberShipMovementId="scope.row.Id" :EndDate="scope.row.EndDate" />
          </div>
        </template>
      </el-table-column>
      <el-table-column label="محرر" align="center" prop="EditorName"></el-table-column>

      <el-table-column width="40" v-if="checkPermission(['Admin'])">
        <template slot-scope="scope">
          <member-ship-movement-edit :MembershipMovementID="scope.row.Id" />
        </template>
      </el-table-column>
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-table :data="props.row.MembershipMovementOrders">
            <el-table-column label="النوع" prop="Type" align="center"></el-table-column>

            <el-table-column label="تاريخ البدء" align="center">
              <template slot-scope="scope">
                <el-date-picker format="dd/MM/yyyy" disabled v-model="scope.row.StartDate"></el-date-picker>
              </template>
            </el-table-column>
            <el-table-column label="تاريخ الانتهاء" align="center">
              <template slot-scope="scope">
                <el-date-picker format="dd/MM/yyyy" disabled v-model="scope.row.EndDate"></el-date-picker>
              </template>
            </el-table-column>
            <el-table-column label="مجموع الايام" align="center">
              <template slot-scope="scope">
                {{Math.round(
                Math.abs(
                (new Date(scope.row.StartDate) - new Date(scope.row.EndDate)) /
                (24 * 60 * 60 * 1000)
                )
                ) }}
              </template>
            </el-table-column>
            <el-table-column label="ملاحظات" align="center" prop="Description"></el-table-column>
            <el-table-column label="الحالة" align="center">
              <template slot-scope="scope">
                <el-tag
                  :type="scope.row.Status.ClassName"
                >{{ scope.row.Status.ArabicOprationDescription}}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="محرر" align="center" prop="EditorName"></el-table-column>
          </el-table>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import checkPermission from "@/utils/permission";

import Freeze from "./Dialogs/Freeze";
import Extra from "./Dialogs/Extra";
import MemberShipMovementEdit from "./Dialogs/MemberShipMovementEdit";

export default {
  components: {
    Freeze,
    Extra,
    MemberShipMovementEdit
  },
  props: {
    MembershipMovements: {
      type: Array,
      default: () => {
        return null;
      }
    }
  },
  methods: { checkPermission }
};
</script>

