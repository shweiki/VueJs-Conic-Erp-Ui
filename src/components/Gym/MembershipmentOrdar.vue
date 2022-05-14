<template>
  <div>
    <el-button
      style="float: left"
      type="success"
      icon="fa fa-save"
      @click="approval()"
      >موافقة</el-button
    >
    <el-table
      v-loading="loading"
      :data="tableData"
      fit
      border
      height="500"
      highlight-current-row
      ref="multipleTable"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        width="50"
        align="center"
      ></el-table-column>
      <el-table-column label="#" prop="Id" width="120" align="center">
        <template slot="header" slot-scope="{}">
          <el-button
            type="primary"
            icon="el-icon-refresh"
            @click="getdata()"
          ></el-button>
        </template>
      </el-table-column>
      <el-table-column prop="Name" label="الاشتراك" align="center">
        <template slot-scope="scope">
          <router-link :to="'/Gym/Edit/' + scope.row.MemberId">
            <strong style="font-size: 10px; cursor: pointer;">{{
              scope.row.Name
            }}</strong>
          </router-link>
        </template>
      </el-table-column>
      <el-table-column
        prop="MembershipMovementType"
        label="الفترة"
        align="center"
      ></el-table-column>
      <el-table-column prop="Type" label="طلب" align="center"></el-table-column>

      <el-table-column label="تاريخ البدء" align="center">
        <template slot-scope="scope">
          <el-date-picker
            :format="$store.getters.settings.DateTimeFormat"
            disabled
            v-model="scope.row.StartDate"
          ></el-date-picker>
        </template>
      </el-table-column>
      <el-table-column label="تاريخ الانتهاء" align="center">
        <template slot-scope="scope">
          <el-date-picker
            :format="$store.getters.settings.DateTimeFormat"
            disabled
            v-model="scope.row.EndDate"
          ></el-date-picker>
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
        align="center"
        label="ملاحظات"
        prop="Description"
      ></el-table-column>
      <el-table-column
        label="محرر"
        align="center"
        prop="EditorName"
      ></el-table-column>

      <el-table-column width="120" align="center">
        <template slot-scope="scope">
          <Next-Oprations
            :ObjId="scope.row.Id"
            :Status="scope.row.Status"
            TableName="MembershipMovementOrder"
            @Done="getdata"
          />
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { GetMembershipMovementOrderByStatus } from "@/api/MembershipMovementOrder";
import { ChangeArrObjStatus } from "@/api/Oprationsys";
import NextOprations from "@/components/Oprationsys/NextOprations";

export default {
  components: { NextOprations },
  data() {
    return {
      loading: true,
      tableData: [],
      Selection: []
    };
  },
  created() {
    this.getdata();
  },
  methods: {
    getdata() {
      this.loading = true;
      GetMembershipMovementOrderByStatus({ Status: 0 })
        .then(response => {
          // handle success
          console.log(response);
          this.tableData = response;
          this.loading = false;
        })
        .catch(error => {
          // handle error
          console.log(error);
        });
    },

    handleSelectionChange(val) {
      this.Selection = val;
    },
    approval() {
      if (this.Selection.length > 0)
        ChangeArrObjStatus({
          ObjsId: this.Selection.map(x => x.Id),
          TableName: "MembershipMovementOrder",
          Status: 1,
          Description: "طلب تجميد او زيادة موافق عليه"
        }).then(response => {
          console.log(response);
          this.$notify({
            title: "تم ",
            message: "تم الإضافة بنجاح",
            type: "success",
            duration: 2000
          });
          this.$nextTick(() => {
            this.$router.replace({
              path: "/redirect" + this.$route.fullPath
            });
          });
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.panel-group {
  margin-top: 18px;

  .card-panel-col {
    margin-bottom: 32px;
  }

  .card-panel {
    height: 108px;
    cursor: pointer;
    font-size: 14px;
    position: relative;
    overflow: hidden;
    color: #009432;
    background: #fff;
    border-color: rgba(0, 0, 0, 0.05);
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.3);

    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }

      .icon-people {
        background: #40c9c6;
      }

      .icon-message {
        background: #36a3f7;
      }

      .icon-money {
        background: #f4516c;
      }

      .icon-shopping {
        background: #34bfa3;
      }
    }

    .icon-people {
      color: #40c9c6;
    }

    .icon-message {
      color: #36a3f7;
    }

    .icon-money {
      color: #f4516c;
    }

    .icon-shopping {
      color: #34bfa3;
    }

    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }

    .card-panel-icon {
      float: left;
      font-size: 48px;
    }

    .card-panel-description {
      float: right;
      font-weight: bold;
      margin: 26px;
      margin-left: 0px;

      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }

      .card-panel-num {
        font-size: 20px;
      }
    }
  }
}

@media (max-width: 550px) {
  .card-panel-description {
    display: none;
  }

  .card-panel-icon-wrapper {
    float: none !important;
    width: 100%;
    height: 100%;
    margin: 0 !important;

    .svg-icon {
      display: block;
      margin: 14px auto !important;
      float: none !important;
    }
  }
}
</style>