<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header">
        <el-row type="flex">
          <el-col :span="3">
            <span>{{ $t("Members.Member") }}</span>
          </el-col>
          <el-col :span="9">
            <Select-Memberships
              @Set="
                (v) => {
                  MembershipId = v.Id;
                  getdata();
                }
              "
            />
          </el-col>
          <el-col :span="1">
            <drawer-print
              Type="MemberShipList"
              :Data="{
                Items: tableData,
              }"
            />
          </el-col>
        </el-row>
      </div>

      <el-table
        v-loading="loading"
        :data="tableData"
        fit
        border
        highlight-current-row
        max-height="500"
        style="width: 100%"
        @row-dblclick="
          (row) => {
            if (DblClickRow == 'AddAsRow') {
              $emit('dblclick', row);
            } else {
              let r = $router.resolve({
                path: '/Gym/Edit/' + row.MemberId,
              });
              window.open(
                r.href,
                r.route.name,
                $store.getters.settings.windowStyle
              );
            }
          }
        "
      >
        <el-table-column label="#" prop="Id" width="120" align="center">
          <template slot="header" slot-scope="{}">
            Ids
            {{ tableData.length }}
          </template>
        </el-table-column>
        <el-table-column
          prop="MembershipName"
          label="الاشتراك"
          align="center"
        ></el-table-column>

        <el-table-column
          prop="MemberName"
          label="المشترك"
          align="center"
        ></el-table-column>
        <el-table-column
          v-bind:label="$t('Members.Phone1')"
          prop="PhoneNumber1"
          width="120"
        ></el-table-column>
        <el-table-column
          prop="StartDate"
          label="تاريخ البدء"
          align="center"
          width="150"
        >
          <template slot-scope="scope">
            <el-date-picker
              :format="$store.getters.settings.DateTimeFormat"
              disabled
              v-model="scope.row.StartDate"
            ></el-date-picker>
          </template>
        </el-table-column>
        <el-table-column
          prop="EndDate"
          label="تاريخ الانتهاء"
          align="center"
          width="150"
        >
          <template slot-scope="scope">
            <el-date-picker
              :format="$store.getters.settings.DateTimeFormat"
              disabled
              v-model="scope.row.EndDate"
            ></el-date-picker>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import { GetMembershipMovementByMembershipId } from "@/api/MembershipMovement";
import SelectMemberships from "@/components/Gym/SelectMemberships.vue";
import DrawerPrint from "@/components/PrintRepot/DrawerPrint.vue";

export default {
  components: { SelectMemberships, DrawerPrint },
  data() {
    return {
      tableData: [],
      FreezeBetween: "",
      Description: "",
      Visibles: false,
      Days: 0,
      loading: false,
      search: "",
      MembershipId: "",
    };
  },

  methods: {
    getdata(val) {
      console.log(val);
      this.loading = true;
      GetMembershipMovementByMembershipId({
        MembershipId: this.MembershipId,
      }).then((response) => {
        //console.log(response)
        this.tableData = response;
        this.loading = false;
      });
    },
  },
};
</script>
