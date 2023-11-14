<template>
  <div class="app-container" style="direction: rtl">
    <el-table height="500" :data="membershipMovements" fit border highlight-current-row>
      >
      <el-table-column prop="Id" label="رقم" align="center" />

      <el-table-column prop="Name" label="الاشتراك" align="center" />
      <el-table-column prop="TotalDays" label="مجموع الايام" align="center">
        <template slot-scope="scope">
          {{ scope.row.TotalDays }}
          <el-tag v-if="scope.row.Status > 0" type="warning">
            رصيد التجميد :
            {{
              scope.row.MaxFreezeLimitDays -
                scope.row.MembershipMovementOrders.reduce(
                  (a, b) =>
                    a +
                    (b.Status != 0 && b.Status != -1 && b.Status != -2 && b.Type != "Extra"
                      ? Math.round(
                        Math.abs(
                          (new Date(b.StartDate) - new Date(b.EndDate)) /
                            (24 * 60 * 60 * 1000)
                        )
                      )
                      : 0),
                  0
                )
            }}
          </el-tag></template>
      </el-table-column>
      <el-table-column label="تاريخ البدء" align="center" width="150">
        <template slot-scope="scope">
          <el-date-picker
            v-model="scope.row.StartDate"
            format="yyyy-MM-dd"
            disabled
          />
        </template>
      </el-table-column>
      <el-table-column label="تاريخ الانتهاء" align="center" width="150">
        <template slot-scope="scope">
          <el-date-picker
            v-model="scope.row.EndDate"
            format="yyyy-MM-dd"
            disabled
          />
        </template>
      </el-table-column>
      <el-table-column label="الحالة" width="100" align="center">
        <template slot-scope="scope">
          <Status-Tag :status="scope.row.Status" table-name="MembershipMovement" />
        </template>
      </el-table-column>
      <el-table-column label="#" align="center">
        <template slot-scope="scope">
          <div v-if="scope.row.Status >= 0">
            <freeze
              v-if="
                scope.row.MaxFreezeLimitDays -
                  scope.row.MembershipMovementOrders.reduce(
                    (a, b) =>
                      a +
                      (b.Status != 0 &&
                        b.Status != -1 &&
                        b.Status != -2 &&
                        b.Type != 'Extra'
                        ? Math.round(
                          Math.abs(
                            (new Date(b.StartDate) - new Date(b.EndDate)) /
                              (24 * 60 * 60 * 1000)
                          )
                        )
                        : 0),
                    0
                  ) >=
                  scope.row.MinFreezeLimitDays
              "
              :member-ship-movement-id="scope.row.Id"
              :max-freeze-limit="
                scope.row.MaxFreezeLimitDays -
                  scope.row.MembershipMovementOrders.reduce(
                    (a, b) =>
                      a +
                      (b.Status != 0 &&
                        b.Status != -1 &&
                        b.Status != -2 &&
                        b.Type != 'Extra'
                        ? Math.round(
                          Math.abs(
                            (new Date(b.StartDate) - new Date(b.EndDate)) /
                              (24 * 60 * 60 * 1000)
                          )
                        )
                        : 0),
                    0
                  )
              "
              :min-freeze-limit="scope.row.MinFreezeLimitDays"
            />
            <extra :member-ship-movement-id="scope.row.Id" :end-date="scope.row.EndDate" />
          </div>
        </template>
      </el-table-column>
      <el-table-column label="محرر" align="center" prop="EditorName" />
      <el-table-column v-if="checkPermission(['admin'])">
        <template slot-scope="scope">
          <el-row>
            <el-col :span="12">
              <Member-Ship-Movement-Edit
                :membership-movement-id="scope.row.Id"
                @Done="Done()"
              />
            </el-col>
            <el-col :span="12">
              <Member-Ship-Movement-Delete
                :membership-movement-id="scope.row.Id"
                @Done="Done()"
              />
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-table :data="props.row.MembershipMovementOrders">
            <el-table-column label="#" prop="Id" align="center" />
            <el-table-column label="النوع" prop="Type" align="center" />

            <el-table-column width="160" label="تاريخ البدء" align="center">
              <template slot-scope="scope">
                <el-date-picker
                  v-model="scope.row.StartDate"
                  format="yyyy-MM-dd"
                  disabled
                />
              </template>
            </el-table-column>
            <el-table-column width="160" label="تاريخ الانتهاء" align="center">
              <template slot-scope="scope">
                <el-date-picker
                  v-model="scope.row.EndDate"
                  format="yyyy-MM-dd"
                  disabled
                />
              </template>
            </el-table-column>
            <el-table-column label="مجموع الايام" align="center">
              <template slot-scope="scope">
                {{
                  Math.round(
                    Math.abs(
                      (new Date(scope.row.StartDate) - new Date(scope.row.EndDate)) /
                        (24 * 60 * 60 * 1000)
                    )
                  )
                }}
              </template>
            </el-table-column>
            <el-table-column
              label="ملاحظات"
              align="center"
              prop="Description"
            />
            <el-table-column label="الحالة" align="center">
              <template slot-scope="scope">
                <Status-Tag
                  :status="scope.row.Status"
                  table-name="MembershipMovementOrder"
                />
              </template>
            </el-table-column>
            <el-table-column
              label="محرر"
              align="center"
              prop="EditorName"
            />
            <el-table-column v-if="checkPermission(['admin'])" width="80">
              <template slot-scope="scope">
                <el-col :span="12">
                  <DeleteFreeze :member-ship-movement-order-id="scope.row.Id" />
                </el-col>
                <el-col v-if="scope.row.Status == 1" :span="12">
                  <EditFreeze
                    :max-freeze-limit="
                      props.row.MaxFreezeLimitDays -
                        props.row.MembershipMovementOrders.reduce(
                          (a, b) =>
                            a +
                            (b.Status != 0 &&
                              b.Status != -1 &&
                              b.Status != -2 &&
                              b.Id != scope.row.Id &&
                              b.Type != 'Extra'
                              ? Math.round(
                                Math.abs(
                                  (new Date(b.StartDate) - new Date(b.EndDate)) /
                                    (24 * 60 * 60 * 1000)
                                )
                              )
                              : 0),
                          0
                        )
                    "
                    :min-freeze-limit="props.row.MinFreezeLimitDays"
                    :member-ship-movement-order-id="scope.row.Id"
                  />
                </el-col>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import checkPermission from '@/utils/permission'
import StatusTag from '@/components/Oprationsys/StatusTag'
import Freeze from './Dialogs/Freeze'
import Extra from './Dialogs/Extra'
import MemberShipMovementEdit from './Dialogs/MemberShipMovementEdit.vue'
import MemberShipMovementDelete from './Dialogs/MemberShipMovementDelete.vue'
import EditFreeze from './Dialogs/Edit-Freeze.vue'
import DeleteFreeze from './Dialogs/Delete-Freeze.vue'

export default {
  components: {
    Freeze,
    Extra,
    MemberShipMovementEdit,
    MemberShipMovementDelete,
    EditFreeze,
    DeleteFreeze,
    StatusTag
  },
  props: {
    membershipMovements: {
      type: Array,
      default: () => {
        return null
      }
    }
  },
  methods: {
    checkPermission,
    Done() {
      this.$nextTick(() => {
        this.$emit('Done')
      })
    }
  }
}
</script>
