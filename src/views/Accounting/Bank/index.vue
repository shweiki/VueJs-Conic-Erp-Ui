<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-button
          style="float: left"
          type="success"
          icon="el-icon-plus"
          @click="handleCreate()"
          >{{ $t("Classification.Add") }}</el-button
        >
        <span>{{ $t("Bank.Banks") }}</span>
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
              size="small"
            ></el-button>
          </template>
        </el-table-column>
        <el-table-column
          v-bind:label="$t('Classification.Name')"
          prop="Name"
          width="200"
          align="center"
        >
          <template slot="header" slot-scope="{}">
            <el-input v-model="search" v-bind:placeholder="$t('Bank.BankName')" />
          </template>
        </el-table-column>
        <el-table-column
          v-bind:label="$t('Bank.BranchName')"
          prop="BranchName"
          width="200"
          align="center"
        ></el-table-column>
        <el-table-column
          v-bind:label="$t('Bank.AccountNumber')"
          prop="AccountNumber"
          width="120"
          align="center"
        ></el-table-column>
        <el-table-column
          v-bind:label="$t('Bank.AccountType')"
          prop="AccountType"
          width="120"
          align="center"
        ></el-table-column>
        <el-table-column
          v-bind:label="$t('Bank.Currency')"
          prop="Currency"
          width="120"
          align="center"
        ></el-table-column>
        <el-table-column
          v-bind:label="$t('Bank.IBAN')"
          prop="IBAN"
          width="120"
          align="center"
        ></el-table-column>
        <el-table-column
          v-bind:label="$t('Stocks.Description')"
          prop="Description"
          width="120"
          align="center"
        ></el-table-column>
        <el-table-column v-bind:label="$t('Items.Status')" align="center" width="100">
          <template slot-scope="scope">
            <status-tag :Status="scope.row.Status" TableName="Bank" />
          </template>
        </el-table-column>
        <el-table-column width="120" align="center">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.Opration.Status != -1"
              icon="el-icon-edit"
              size="mini"
              circle
              @click="handleUpdate(scope.row)"
            ></el-button>
            <el-button
              v-for="(NOprations, index) in scope.row.NextOprations"
              :key="index"
              :type="NOprations.ClassName"
              size="mini"
              round
              @click="handleOprationsys(scope.row.Id, NOprations)"
              >{{ NOprations.OprationDescription }}</el-button
            >
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
        ref="dataForm"
        :rules="rulesForm"
        :model="tempForm"
        label-position="top"
        label-width="70px"
      >
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item v-bind:label="$t('Bank.BankName')" prop="Name">
              <el-select v-model="tempForm.Name" filterable placeholder="Bank Name">
                <el-option
                  v-for="item in BanksNames"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-bind:label="$t('Bank.AccountType')" prop="AccountType">
              <el-select
                v-model="tempForm.AccountType"
                filterable
                placeholder="Account Type"
              >
                <el-option
                  v-for="item in AccountsTypes"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item v-bind:label="$t('Bank.BranchName')" prop="BranchName">
          <el-input type="text" v-model="tempForm.BranchName"></el-input>
        </el-form-item>
        <el-form-item v-bind:label="$t('Bank.AccountNumber')" prop="AccountNumber">
          <el-input type="text" v-model="tempForm.AccountNumber"></el-input>
        </el-form-item>
        <el-form-item v-bind:label="$t('Bank.IBAN')" prop="IBAN">
          <el-input type="text" v-model="tempForm.IBAN"></el-input>
        </el-form-item>
        <el-form-item v-bind:label="$t('Bank.Currency')" prop="Currency">
          <el-input type="text" v-model="tempForm.Currency"></el-input>
        </el-form-item>
        <el-form-item v-bind:label="$t('Items.Notes')" prop="Description">
          <el-input type="textarea" v-model="tempForm.Description"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{
          $t("Classification.cancel")
        }}</el-button>
        <el-button
          type="primary"
          @click="dialogFormStatus === 'create' ? createData() : updateData()"
          >{{ $t("AddVendors.Save") }}</el-button
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
import { GetBanks, Create, Edit } from "@/api/Bank";
import { ChangeObjStatus } from "@/api/Oprationsys";
import StatusTag from "@/components/Oprationsys/StatusTag";

export default {
  components: { StatusTag },
  name: "Bank",
  data() {
    return {
      tableData: [],
      loading: true,
      dialogFormVisible: false,
      dialogOprationVisible: false,
      dialogFormStatus: "",
      search: "",
      BanksNames: [
        {
          value: " العربي",
          label: " العربي",
        },
        {
          value: "المؤسسة العربية المصرفية",
          label: "المؤسسة العربية المصرفية ",
        },
        {
          value: " الاردن",
          label: " الاردن",
        },
        {
          value: " القاهرة عمان",
          label: " القاهرة عمان",
        },
        {
          value: " المال الأردني",
          label: " المال الأردني",
        },
        {
          value: " التجاري الأردني",
          label: " التجاري الأردني",
        },
        {
          value: " الاردني الكويتي",
          label: " الاردني الكويتي",
        },
        {
          value: " الاهلي الاردني",
          label: " الاهلي الاردني",
        },
        {
          value: " الاسكان للتجارة والتمويل",
          label: " الاسكان للتجارة والتمويل",
        },
        {
          value: " الاستثمار العربي الاردني",
          label: " الاستثمار العربي الاردني",
        },
        {
          value: "الاستثماري",
          label: "الاستثماري",
        },
        {
          value: "سوسيته جنرال",
          label: "سوسيته جنرال",
        },
        {
          value: "الاتحاد",
          label: "الاتحاد",
        },
        {
          value: "ستاندرد تشارترد",
          label: "ستاندرد تشارترد",
        },
        {
          value: " العقاري المصري العربي",
          label: " العقاري المصري العربي",
        },
        {
          value: "سيتي بنك إن . إيه",
          label: "سيتي بنك إن . إيه",
        },
        {
          value: "الرافدين",
          label: "الرافدين",
        },
        {
          value: " الكويت الوطني",
          label: " الكويت الوطني",
        },
        {
          value: " لبنان والمهجر",
          label: " لبنان والمهجر",
        },
        {
          value: "عوده ش.م.ل",
          label: "عوده ش.م.ل",
        },
        {
          value: " العربي الاسلامي الدولي",
          label: " العربي الاسلامي الدولي",
        },
        {
          value: " الاسلامي الاردني",
          label: " الاسلامي الاردني",
        },
        {
          value: " صفوة الإسلامي",
          label: " صفوة الإسلامي",
        },
        {
          value: "مصرف الراجحي",
          label: "مصرف الراجحي",
        },
      ],
      AccountsTypes: [
        {
          value: " حساب البنك الأساسي",
          label: " حساب البنك الأساسي",
        },
        {
          value: " حساب جاري",
          label: " حساب جاري",
        },
        {
          value: " حساب توفير",
          label: " حساب توفير",
        },
        {
          value: " حساب وديعة",
          label: " حساب وديعة",
        },
        {
          value: " حساب ودائع سوق المال",
          label: " حساب ودائع سوق المال",
        },

        {
          value: " حساب تحت الطلب",
          label: " حساب تحت الطلب",
        },
        {
          value: " حساب جاري رواتب",
          label: " حساب جاري رواتب ",
        },
        {
          value: " حساب الاستثمار المخصص ",
          label: " حساب الاستثمار المخصص ",
        },
        {
          value: " حساب استثمار ",
          label: " حساب استثمار ",
        },
        {
          value: " حساب نوع اخر ",
          label: " حساب نوع اخر ",
        },
      ],
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
        ID: undefined,
        IBAN: "",
        AccountId: "",
        Name: "",
        Description: "",
        AccountNumber: "",
        AccountType: "",
        Currency: "",
        BranchName: "",
        IsPrime: false,
      },
      rulesForm: {
        Name: [
          {
            required: true,
            message: "يجب إدخال إسم ",
            trigger: "blur",
          },
          {
            minlength: 3,
            maxlength: 50,
            message: "الرجاء إدخال إسم لا يقل عن 3 أحرف و لا يزيد عن 50 حرف",
            trigger: "blur",
          },
        ],
      },
      tempOpration: {
        ObjID: undefined,
        OprationID: undefined,
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
            message: "الرجاء إدخال إسم لا يقل عن 5 احرف و لا يزيد عن 150 حرف",
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
      GetBanks()
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
        ID: undefined,
        IBAN: "",
        AccountId: "",
        Name: "",
        Description: "",
        AccountNumber: "",
        AccountType: "",
        Currency: "",
        BranchName: "",
        IsPrime: false,
      };
    },
    handleCreate() {
      this.resetTempForm();
      this.dialogFormStatus = "create";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    handleUpdate(row) {
      console.log(row);
      this.tempForm.Id = row.Id;
      this.tempForm.Name = row.Name;
      this.tempForm.Description = row.Description;
      this.dialogFormStatus = "update";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
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
    createData() {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          Create(this.tempForm)
            .then((response) => {
              this.getdata();
              this.dialogFormVisible = false;
              this.$notify({
                title: "تم ",
                message: "تم الإضافة بنجاح",
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
    updateData() {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          Edit(this.tempForm)
            .then((response) => {
              this.getdata();
              this.dialogFormVisible = false;
              this.$notify({
                title: "تم",
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
    createOprationData() {
      this.$refs["dataOpration"].validate((valid) => {
        if (valid) {
          console.log(this.tempOpration);
          ChangeObjStatus({
            ObjID: this.tempOpration.ObjID,
            OprationID: this.tempOpration.OprationID,
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
