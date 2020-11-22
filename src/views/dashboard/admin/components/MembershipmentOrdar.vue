<template>
  <div>
    <el-button style="float: left" type="success" icon="fa fa-save" @click="approval()">موافقة</el-button>
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
      <el-table-column type="selection" width="55" align="center"></el-table-column>
      <el-table-column label="#" prop="id" width="120" align="center">
        <template slot="header" slot-scope="{}">
          <el-button type="primary" icon="el-icon-refresh" @click="getdata()"></el-button>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="الاشتراك" align="center">
        <template slot-scope="scope">
          <router-link :to="'/Gym/Edit/'+scope.row.memberID">
            <strong style="font-size: 10px; cursor: pointer;">{{scope.row.name}}</strong>
          </router-link>
        </template>
      </el-table-column>
      <el-table-column prop="membershipMovementType" label="الفترة" align="center"></el-table-column>
      <el-table-column prop="type" label="طلب" align="center"></el-table-column>

      <el-table-column label="تاريخ البدء" align="center">
        <template slot-scope="scope">
          <el-date-picker format="dd/MM/yyyy" disabled v-model="scope.row.startDate"></el-date-picker>
        </template>
      </el-table-column>
      <el-table-column label="تاريخ الانتهاء" align="center">
        <template slot-scope="scope">
          <el-date-picker format="dd/MM/yyyy" disabled v-model="scope.row.endDate"></el-date-picker>
        </template>
      </el-table-column>
      <el-table-column label="مجموع الايام" align="center">
        <template slot-scope="scope">
          {{Math.round(
          Math.abs(
          (new Date(scope.row.startDate) - new Date(scope.row.endDate)) /
          (24 * 60 * 60 * 1000)
          )
          ) }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="ملاحظات" prop="description"></el-table-column>
      <el-table-column label="محرر" align="center" prop="editorName"></el-table-column>

      <el-table-column width="120" align="center">
        <template slot-scope="scope">
          <el-button
            v-for="(NOprations, index) in scope.row.nextOprations"
            :key="index"
            :type="NOprations.ClassName"
            round
            @click="handleOprationsys(scope.row.id , NOprations)"
          >{{NOprations.OprationDescription}}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      style="margin-top: -13vh"
      :show-close="false"
      :title="textOpration.OprationDescription"
      :visible.sync="dialogOprationVisible"
    >
      <el-form
        ref="dataOpration"
        :rules="rulesOpration"
        :model="tempOpration"
        label-position="top"
        label-width="70px"
        style="width: 400px margin-left:50px"
      >
        <el-form-item label="ملاحظات للعملية " prop="description">
          <el-input type="textarea" v-model="tempOpration.description"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button
          :type="textOpration.ClassName"
          @click="createOprationData()"
        >{{textOpration.OprationDescription}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { GetMembershipMovementOrderByStatus } from "@/api/MembershipMovementOrder";
import { ChangeObjStatusByTableName, ChangeObjStatus } from "@/api/Oprationsys";

export default {
  data() {
    return {
      loading: true,
      tableData: [],
      Selection: [],
      dialogOprationVisible: false,
      textOpration: {
        OprationDescription: "",
        ArabicOprationDescription: "",
        IconClass: "",
        ClassName: ""
      },
      tempOpration: {
        ObjID: undefined,
        OprationID: undefined,
        Description: ""
      },
      rulesOpration: {
        Description: [
          {
            required: true,
            message: "يجب إدخال ملاحظة للعملية",
            trigger: "blur"
          },
          {
            minlength: 5,
            maxlength: 150,
            message: "الرجاء إدخال اسم لا يقل عن 5 حروف و لا يزيد عن 150 حرف",
            trigger: "blur"
          }
        ]
      }
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
        this.Selection.map(a => {
          ChangeObjStatusByTableName({
            ObjID: a.id,
            TableName: "MembershipMovementOrder",
            Status: 1,
            Description: "طلب تجميد او زيادة موافق عليه"
          }).then(response => {
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
        });
    },
    handleOprationsys(ObjID, Opration) {
      this.dialogOprationVisible = true;
      // text
      this.textOpration.OprationDescription = Opration.OprationDescription;
      this.textOpration.ArabicOprationDescription =
        Opration.ArabicOprationDescription;
      this.textOpration.IconClass = Opration.IconClass;
      this.textOpration.ClassName = Opration.ClassName;
      /// temp
      this.tempOpration.ObjID = ObjID;
      this.tempOpration.OprationID = Opration.id;
      this.tempOpration.Description = "";
    },
    createOprationData() {
      this.$refs["dataOpration"].validate(valid => {
        if (valid) {
          ChangeObjStatus({
            ObjID: this.tempOpration.ObjID,
            OprationID: this.tempOpration.OprationID,
            Description: this.tempOpration.Description
          })
            .then(response => {
              this.dialogOprationVisible = false;
              this.getdata();
              this.$notify({
                title: "تم  ",
                message: "تمت العملية بنجاح",
                type: "success",
                duration: 2000
              });
            })
            .catch(error => {
              console.log(error);
            });
        } else {
          console.log("error submit!!");
        }
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