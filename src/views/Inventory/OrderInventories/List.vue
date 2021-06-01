<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <search-by-date
          :Value="[]"
          @Set="
            (v) => {
              date = v;
            }
          "
        />
        <router-link
          class="pan-btn tiffany-btn"
          style="float: left; padding: 10px 15px; border-radius: 6px"
          icon="el-icon-plus"
          to="/OrderInventories/Create"
          >{{ $t("route.NewOrderInventory") }}</router-link
        >
      </div>
      <el-table
        v-loading="loading"
        :data="
          tableData.filter(
            (data) =>
              !search || data.FakeDate.toLowerCase().includes(search.toLowerCase())
          )
        "
        fit
        border
        max-height="900"
        highlight-current-row
        style="width: 100%"
        @row-dblclick="
          (row) => {
            $router.replace({
              path: '/OrderInventories/Edit/' + row.Id,
            });
          }
        "
      >
        <el-table-column align="center" prop="Id" width="120">
          <template slot="header" slot-scope="{}">
            <el-button type="primary" icon="el-icon-refresh" @click="getdata"></el-button>
          </template>
        </el-table-column>
        <el-table-column
          prop="FakeDate"
          v-bind:label="$t('Sales.Date')"
          width="100"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="OrderType"
          v-bind:label="$t('OrderInventories.OrderType')"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="Description"
          label="ملاحظات"
          align="center"
        ></el-table-column>
        <el-table-column
          align="center"
          v-bind:label="$t('OrderInventories.Status')"
          width="100"
        >
          <template slot-scope="scope">
            <status-tag :Status="scope.row.Status" TableName="OrderInventory" />
          </template>
        </el-table-column>
        <el-table-column width="100" align="center">
          <template slot-scope="scope">
            <el-button
              v-for="(NOprations, index) in scope.row.NextOprations"
              :key="index"
              :type="NOprations.ClassName"
              round
              @click="handleOprationsys(scope.row.Id, NOprations)"
              >{{ NOprations.OprationDescription }}</el-button
            >
          </template>
        </el-table-column>
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-table :data="props.row.InventoryMovements">
              <el-table-column
                prop="Name"
                v-bind:label="$t('OrderInventories.Items')"
                width="130"
              ></el-table-column>
              <el-table-column
                prop="Qty"
                v-bind:label="$t('OrderInventories.Quantity')"
              ></el-table-column>
              <el-table-column
                prop="InventoryName"
                v-bind:label="$t('OrderInventories.Inventory')"
              ></el-table-column>
              <el-table-column
                property="Description"
                v-bind:label="$t('OrderInventories.Notes')"
              ></el-table-column>
            </el-table>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
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
        <el-form-item label="ملاحظات للعملية " prop="Description">
          <el-input type="textarea" v-model="tempOpration.Description"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button :type="textOpration.ClassName" @click="createOprationData()">{{
          textOpration.OprationDescription
        }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { GetOrderInventory } from "@/api/OrderInventory";
import { ChangeObjStatus } from "@/api/Oprationsys";
import StatusTag from "@/components/Oprationsys/StatusTag";
import SearchByDate from "@/components/Date/SearchByDate";

export default {
  name: "OrderInventory",
  components: { StatusTag, SearchByDate },
  data() {
    return {
      tableData: [],
      loading: true,
      search: "",
      dialogOprationVisible: false,
      date: [],
      textOpration: {
        OprationDescription: "",
        ArabicOprationDescription: "",
        IconClass: "",
        ClassName: "",
      },
      tempOpration: {
        ObjId: undefined,
        OprationId: undefined,
        Description: "",
      },
      rulesOpration: {
        Description: [
          {
            required: true,
            message: "يجب إدخال ملاحظة للعملية",
            trigger: "blur",
          },
          {
            minlength: 5,
            maxlength: 150,
            message: "الرجاء إدخال اسم لا يقل عن 5 حروف و لا يزيد عن 150 حرف",
            trigger: "blur",
          },
        ],
      },
    };
  },
  created() {
    this.getdata();
  },
  methods: {
    getdata() {
      this.loading = true;

      GetOrderInventory({
        DateFrom: this.date[0],
        DateTo: this.date[1],
      }).then((response) => {
        console.log(response);
        this.tableData = response;
        this.loading = false;
      });
    },

    handleOprationsys(ObjID, Opration) {
      this.dialogOprationVisible = true;
      // text
      this.textOpration.OprationDescription = Opration.OprationDescription;
      this.textOpration.ArabicOprationDescription = Opration.ArabicOprationDescription;
      this.textOpration.IconClass = Opration.IconClass;
      this.textOpration.ClassName = Opration.ClassName;
      /// temp
      this.tempOpration.ObjID = ObjID;
      this.tempOpration.OprationID = Opration.Id;
      this.tempOpration.Description = "";
    },
    createOprationData() {
      this.$refs["dataOpration"].validate((valid) => {
        if (valid) {
          ChangeObjStatus({
            ObjId: this.tempOpration.ObjID,
            OprationId: this.tempOpration.OprationID,
            Description: this.tempOpration.Description,
          })
            .then((response) => {
              this.getdata();
              this.dialogOprationVisible = false;
              this.$notify({
                title: "تم  ",
                message: "تمت العملية بنجاح",
                type: "success",
                duration: 2000,
              });
            })
            .catch((error) => {
              console.log(error);
            });
        } else {
          console.log("error submit!!");
        }
      });
    },
  },
};
</script>
