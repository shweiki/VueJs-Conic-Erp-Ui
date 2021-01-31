<template>
  <div class="app-container" style="direction : rtl ">
    <el-table
      height="500"
      :data="ServiceInvoices"
      fit
      border
      highlight-current-row
    >
      <el-table-column
        prop="FakeDate"
        label="التاريخ"
        align="center"
      ></el-table-column>

      <el-table-column
        prop="Name"
        label="الخدمة"
        align="center"
      ></el-table-column>
      <el-table-column label="الكلي" align="center">
        <template slot-scope="scope">
          {{ scope.row.InventoryMovements.length }}
        </template>
      </el-table-column>
      <el-table-column label="المسحوب" align="center">
        <template slot-scope="scope">
          {{
            scope.row.InventoryMovements.filter(obj => obj.Status == 0).length
          }}
        </template>
      </el-table-column>
      <el-table-column label="المتبقي" align="center">
        <template slot-scope="scope">
          {{
            scope.row.InventoryMovements.filter(obj => obj.Status == 1).length
          }}
        </template>
      </el-table-column>

      <el-table-column label="#" align="center">
        <template slot-scope="scope">
          <el-button
            type="danger"
            icon="el-icon-minus"
            @click="MinusOne(scope.row.Id)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="هل انتا متأكد ؟" :visible.sync="Visible" width="30%">
      <span slot="footer" class="dialog-footer">
        <el-button @click="Visible = false">لا</el-button>
        <el-button type="primary" @click="createOprationData()">نعم</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { ChangeObjStatusByTableName } from "@/api/Oprationsys";

export default {
  props: {
    ServiceInvoices: {
      type: Array,
      default: () => {
        return null;
      }
    }
  },
  data() {
    return {
      Visible: false,
      InventoryMovementID: undefined
    };
  },
  methods: {
    MinusOne(SID) {
      this.Visible = true;
      let InventoryMovement = this.ServiceInvoices.find(
        ({ ID }) => ID == SID
      ).InventoryMovements.filter(obj => obj.Status == 1);
      this.InventoryMovementID = InventoryMovement[0].Id;
    },
    createOprationData() {
      ChangeObjStatusByTableName({
        ObjID: this.InventoryMovementID,
        TableName: "InventoryMovement",
        Status: 0,
        Description: "تم استلام حركة من المستودع"
      })
        .then(response => {
          this.InventoryMovementID = undefined;
          this.Visible = false;
          this.$notify({
            title: "تم  ",
            message: "تمت العملية بنجاح",
            type: "success",
            duration: 2000
          });
          this.$nextTick(() => {
            this.$router.replace({
              path: "/redirect" + this.$route.fullPath
            });
          });
        })
        .catch(error => {
          console.log(error);
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.user-activity {
  .user-block {
    .username,
    .description {
      display: block;
      margin-left: 50px;
      padding: 2px 0;
    }

    .username {
      font-size: 16px;
      color: #000;
    }

    :after {
      clear: both;
    }

    .img-circle {
      border-radius: 50%;
      width: 40px;
      height: 40px;
      float: left;
    }

    span {
      font-weight: 500;
      font-size: 12px;
    }
  }

  .post {
    font-size: 14px;
    border-bottom: 1px solid #d2d6de;
    margin-bottom: 15px;
    padding-bottom: 15px;
    color: #666;

    .image {
      width: 100%;
      height: 100%;
    }

    .user-images {
      padding-top: 20px;
    }
  }

  .list-inline {
    padding-left: 0;
    margin-left: -5px;
    list-style: none;

    li {
      display: inline-block;
      padding-right: 5px;
      padding-left: 5px;
      font-size: 13px;
    }

    .link-black {
      &:hover,
      &:focus {
        color: #999;
      }
    }
  }
}

.box-center {
  margin: 0 auto;
  display: table;
}

.text-muted {
  color: #777;
}
</style>
