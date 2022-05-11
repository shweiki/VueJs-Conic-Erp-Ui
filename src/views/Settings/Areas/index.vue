<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" >
        <Add-Dialog @Done="getdata()" />
        <span>{{ $t("Area.Areas") }}</span>
      </div>
      <el-table
        v-loading="loading"
        :data="
          tableData.filter(
            (data) => !search || data.Name.toLowerCase().includes(search.toLowerCase())
          )
        "
        fit
        border
        max-height="900"
        highlight-current-row
        style="width: 100%"
      >
        <el-table-column prop="Id" width="80" align="center">
          <template slot="header" slot-scope="{}">
            <el-button
              circle
              type="success"
              icon="el-icon-refresh"
              @click="getdata()"
              :size="$store.getters.size"
            ></el-button>
          </template>
        </el-table-column>
        <el-table-column
          v-bind:label="$t('Area.City')"
          prop="Adress1"
          width="200"
          align="center"
        >
          <template slot="header" slot-scope="{}">
            <el-input v-model="search" v-bind:placeholder="$t('Area.City')" />
          </template>
        </el-table-column>
        <el-table-column
          v-bind:label="$t('Area.Address1')"
          prop="Adress2"
          width="200"
          align="center"
        ></el-table-column>
        <el-table-column
          v-bind:label="$t('Area.Address2')"
          prop="Adress3"
          width="120"
          align="center"
        ></el-table-column>
        <el-table-column
          v-bind:label="$t('Area.DelievryPrice')"
          prop="DelievryPrice"
          width="120"
          align="center"
        ></el-table-column>

      <el-table-column
          v-bind:label="$t('Classification.Status')"
          width="120"
          align="center"
        >
          <template slot-scope="scope">
            <Status-Tag :Status="scope.row.Status" TableName="Area" />
          </template>
        </el-table-column>
          <el-table-column align="right" width="200">
          <template slot-scope="scope">
            <el-button
              icon="el-icon-edit"
              circle
              @click="handleUpdate(scope.row)"
            ></el-button>
              <Next-Oprations
                :ObjId="scope.row.Id"
                :Status="scope.row.Status"
                TableName="Area"
                @Done="getdata"
            />
             <Dialog-Action-Log TableName="Area" :ObjId="scope.row.Id" />
         
             
          </template>
        </el-table-column>  
      </el-table>
    </el-card>
       <el-dialog
      style="margin-top: -13vh"
      :show-close="false"
      :title="textMapForm[dialogFormStatus]"
      :visible.sync="dialogFormVisible"
    >
      <el-form
        ref="AreaForm"
        :rules="rulesForm"
        :model="tempForm"
        label-position="top"
        label-width="70px"
      >
        <el-form-item v-bind:label="$t('Area.City')" prop="Adress1">
          <el-input type="text" v-model="tempForm.Adress1"></el-input>
        </el-form-item>
        <el-form-item v-bind:label="$t('Area.Address1')" prop="Adress2">
          <el-input type="textarea" v-model="tempForm.Adress2"></el-input>
        </el-form-item>
        <el-form-item v-bind:label="$t('Area.Address2')" prop="Adress3">
          <el-input type="textarea" v-model="tempForm.Adress3"></el-input>
        </el-form-item>
         <el-form-item v-bind:label="$t('Area.DelievryPrice')" prop="DelievryPrice">
          <el-input-number
            v-model="tempForm.DelievryPrice"
            :precision="2"
            :step="0.1"
            :min="0.0"
            :max="1500"
            @focus="$event.target.select()"
          ></el-input-number>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">إلغاء</el-button>
        <el-button
          type="primary"
          @click="dialogFormStatus === 'create' ? createData() : updateData()"
          >حفظ</el-button
        >
      </div>
    </el-dialog>
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
        <el-form-item
          v-bind:label="$t('Classification.OperationNote')"
          prop="Description"
        >
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
import { GetAreas, Edit } from "@/api/Area";
import AddDialog from "@/views/Settings/Areas/AddDialog.vue";
import { ChangeObjStatus } from "@/api/Oprationsys";
import StatusTag from "@/components/Oprationsys/StatusTag";
import NextOprations from "@/components/Oprationsys/NextOprations";
import DialogActionLog from "@/components/ActionLog/DialogActionLog.vue";
export default {
  name: "Area",
  components: { StatusTag, NextOprations, AddDialog, DialogActionLog },
  data() {
    return {
      tableData: [],
      loading: true,
      dialogFormVisible: false,
      dialogOprationVisible: false,
      dialogFormStatus: "",
      search: "",
      textMapForm: {
        update: "تعديل",
        create: "إضافة",
      },
           textOpration: {
        OprationDescription: "",
        ArabicOprationDescription: "",
        IconClass: "",
        ClassName: "",
      },
        tempForm: {
        Id: undefined,
        Adress1: "",
        Adress2: "",
        Adress3: "",
        DelievryPrice: 0.0,
      },
            rulesForm: {
        Name: [
          {
            required: true,
            message: "يجب إدخال اسم ",
            trigger: "blur",
          },
          {
            min: 3,
            max: 50,
            message: "الرجاء إدخال اسم لا يقل عن 3 حروف و لا يزيد عن 50 حرف",
            trigger: "blur",
          },
        ],
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
            min: 5,
            max: 150,
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
      GetAreas()
        .then((response) => {
          // handle success
          console.log(response);
          this.tableData = response;
          this.loading = false;
        })
        .catch((error) => {
          // handle error
          console.log(error);
        });
    },
      resetTempForm() {
      this.tempForm = {
        Id: undefined,
        Adress1: "",
        Adress2: "",
        Adress3: "",
        DelievryPrice: 0.0,
      };
    },

    handleUpdate(row) {
      console.log(row);
      this.tempForm.Id = row.Id;
      this.tempForm.Adress1 = row.Adress1;
      this.tempForm.Adress2 = row.Adress2;
      this.tempForm.Adress3 = row.Adress3;
      this.tempForm.DelievryPrice = row.DelievryPrice;
      this.dialogFormStatus = "update";
      this.dialogFormVisible = true;
      
    },
    updateData() {
      this.$refs["AreaForm"].validate((valid) => {
        if (valid) {
          Edit(this.tempForm)
            .then((response) => {
              this.getdata();
              this.dialogFormVisible = false;
              this.$notify({
                message: "تم التعديل بنجاح",
                type: "success",
                duration: 2000,
              });
            })
            .catch((error) => {
              console.log(error);
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
        handleOprationsys(ObjId, Opration) {
      this.dialogOprationVisible = true;
      // text
      this.textOpration.OprationDescription = Opration.OprationDescription;
      this.textOpration.ArabicOprationDescription = Opration.ArabicOprationDescription;
      this.textOpration.IconClass = Opration.IconClass;
      this.textOpration.ClassName = Opration.ClassName;
      /// temp
      this.tempOpration.ObjId = ObjId;
      this.tempOpration.OprationId = Opration.Id;
      this.tempOpration.Description = "";
    },
       createOprationData() {
      this.$refs["dataOpration"].validate((valid) => {
        if (valid) {
          console.log(this.tempOpration);
          ChangeObjStatus({
            ObjId: this.tempOpration.ObjId,
            OprationId: this.tempOpration.OprationId,
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
          return false;
        }
      });
    },
  },
};
</script>
