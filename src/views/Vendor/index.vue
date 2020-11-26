<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
      <add-vendorbutton />
        <el-button
          style="float: left"
          type="success"
          icon="el-icon-plus"
          @click="handleCreate()"
        >{{ $t('Vendors.Add') }}</el-button>
        <span>{{ $t('Vendors.Vendor') }}</span>
      </div>
      <el-table
        v-loading="loading"
        :data="tableData.filter(data => !search || data.name.toLowerCase().includes(search.toLowerCase()))"
        fit
        border
        max-height="900"
        highlight-current-row
        style="width: 100%"
        @row-dblclick="handleUpdate"
      >
        <el-table-column label="#" prop="id" width="120" align="center">
          <template slot="header" slot-scope="{}">
            <el-button type="primary" icon="el-icon-refresh" @click="getdata()"></el-button>
          </template>
        </el-table-column>
        <el-table-column prop="name" align="center">
          <template slot="header" slot-scope="{}">
            <el-input v-model="search" v-bind:placeholder="$t('Vendors.Search')" />
          </template>
        </el-table-column>
        <el-table-column v-bind:label="$t('Accounting.Credit')" width="120" align="center">
          <template slot-scope="scope">{{(scope.row.totalCredit).toFixed(3) }}</template>
        </el-table-column>
        <el-table-column
          v-bind:label="$t('Accounting.Debit')"
          prop="totalDebit"
          width="120"
          align="center"
        >
          <template slot-scope="scope">{{(scope.row.totalDebit).toFixed(3) }}</template>
        </el-table-column>
        <el-table-column v-bind:label="$t('Accounting.funds')" width="120" align="center">
          <template
            slot-scope="scope"
          >{{ (scope.row.totalCredit - scope.row.totalDebit).toFixed(3) }}</template>
        </el-table-column>
        <el-table-column v-bind:label="$t('Vendors.Status')" width="120" align="center">
          <template slot-scope="scope">
            <el-tag
            >{{ scope.row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column width="120">
          <template slot-scope="scope" v-if="scope.row.id !=1">
            <el-button
              icon="el-icon-edit"
              circle
              @click="handleUpdate(scope.row)"
            ></el-button>
          </template>
        </el-table-column>
        <el-table-column type="expand" width="30">
          <template slot-scope="scope" v-if="scope.row.id !=1">
            <el-table :data="[scope.row]">
              <el-table-column
                v-bind:label="$t('Vendors.address')"
                prop="address"
                width="200"
                align="center"
              ></el-table-column>
              <el-table-column
                v-bind:label="$t('Vendors.Email')"
                prop="email"
                width="200"
                align="center"
              ></el-table-column>
              <el-table-column
                v-bind:label="$t('Vendors.Phone1')"
                prop="phoneNumber1"
                width="150"
                align="center"
              ></el-table-column>
              <el-table-column
                v-bind:label="$t('Vendors.Phone2')"
                prop="phoneNumber2"
                width="150"
                align="center"
              ></el-table-column>
              <el-table-column
                v-bind:label="$t('Vendors.Fax')"
                prop="fax"
                width="110"
                align="center"
              ></el-table-column>
              <el-table-column
                v-bind:label="$t('Vendors.CreditLimit')"
                prop="creditLimit"
                width="110"
                align="center"
              ></el-table-column>
              <el-table-column
                v-bind:label="$t('Vendors.Description')"
                prop="description"
                align="center"
              ></el-table-column>
            </el-table>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

  </div>
</template>

<script>
import { GetVendor, Create, Edit } from "@/api/Vendor";
import { ChangeObjStatus } from "@/api/Oprationsys";

export default {
  name: "Vendor",
  data() {
    return {
      tableData: [],
      loading: true,
      dialogFormVisible: false,
      dialogFormStatus: "",
      search: "",
      textMapForm: {
        update: "تعديل",
        create: "إضافة"
      },
      tempForm: {
        ID: undefined,
        name: "",
        address: "",
        email: "",
        phoneNumber1: "0096278",
        PhoneNumber2: "0096279",
        fax: "0",
        creditLimit: 0.0,
        description: "",
        isPrime: false,
        type: "Customer"
      },
      rulesForm: {
        name: [
          {
            required: true,
            message: "الرجاء ادخال الاسم",
            trigger: "blur"
          },
          {
            minlength: 3,
            maxlength: 50,
            message: "الرجاء إدخال إسم لا يقل عن 3 حروف و لا يزيد عن 50 حرف",
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
      GetVendor().then(response => {
        //console.log(response);
        this.tableData = response;
        this.loading = false;
      });
    },
    resetTempForm() {
      this.tempForm = {
        ID: undefined,
        name: "",
        address: "",
        Email: "",
        phoneNumber1: "",
        PhoneNumber2: "",
        Fax: "0",
        CreditLimit: 0.0,
        Description: "",
        IsPrime: false,
        type: "Customer"
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
      this.tempForm.id = row.id;
      this.tempForm.name = row.name;
      this.tempForm.address = row.address;
      this.tempForm.Email = row.Email;
      this.tempForm.phoneNumber1 = row.phoneNumber1;
      this.tempForm.PhoneNumber2 = row.PhoneNumber2;
      this.tempForm.Fax = row.Fax;
      this.tempForm.CreditLimit = row.CreditLimit;
      this.tempForm.Description = row.Description;
      this.tempForm.type = row.type;
      this.dialogFormStatus = "update";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    createData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          Create(this.tempForm)
            .then(response => {
              this.getdata();
              this.dialogFormVisible = false;
              this.$notify({
                title: "تم ",
                message: "تم الإضافة بنجاح",
                type: "success",
                duration: 2000
              });
            })
            .catch(error => {
              console.log(error);
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    updateData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          Edit(this.tempForm)
            .then(response => {
              this.getdata();
              this.dialogFormVisible = false;
              this.$notify({
                title: "تم",
                message: "تم التعديل بنجاح",
                type: "success",
                duration: 2000
              });
            })
            .catch(error => {
              console.log(error);
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },

  }
};
</script>