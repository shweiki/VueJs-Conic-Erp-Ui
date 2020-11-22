<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-button
          style="float: left"
          type="success"
          icon="fa fa-save"
          @click="createData('tempForm')"
        >{{ $t('Stocks.Save') }}</el-button>
          <router-link
          class="pan-btn tiffany-btn"
          style="float: left ; margin-left: 20px;padding: 10px 15px; border-radius: 6px;"
          icon="el-icon-plus"
          to="/Accounting/EntryAccounting"
        >{{ $t('route.EntryAccounting') }}</router-link>
        <span>{{ $t('Accounting.NewAccountingEntry') }}</span>
        <p style="color: #F56C6Cfont-size: 16pxtext-align: center">{{ ValidateNote }}</p>
      </div>
      <el-form
        ref="tempForm"
        :model="tempForm"
        label-position="top"
        label-width="70px"
        class="demo-ruleForm"
      >
        <el-row type="flex">
          <el-col :span="18">
            <el-form-item v-bind:label="$t('Classification.Notes')">
              <el-input type="textarea" v-model="tempForm.Description"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item
              prop="FakeDate"
              v-bind:label="$t('NewPurchaseInvoice.ReleaseDate')"
              :rules="[{ required: true, message: 'لايمكن ترك التاريخ فارغ', trigger: 'blur' }]"
            >
              <el-date-picker
                v-model="tempForm.FakeDate"
                type="date"
                v-bind:placeholder="$t('NewPurchaseInvoice.Date')"
                format="dd/MM/yyyy"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-table :data="tempForm.EntryMovements" fit border max-height="350" highlight-current-row>
          <el-table-column v-bind:label="$t('Accounting.Account')" >
            <template slot-scope="scope">
              <el-form-item
                :prop="'EntryMovements.'+scope.$index+'.AccountID'"
                :rules="[{ required: true, message: 'لا يمكن ترك حساب فارغ', trigger: 'blur' }]"
              >
                <el-select style="width: 100%;"
                  v-model="tempForm.EntryMovements[scope.$index].AccountID"
                  filterable
                  v-bind:placeholder="$t('Accounting.Account')"
                  autocomplete="off"
                >
                  <el-option
                    v-for="item in Account"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                    <span style="float: right">{{ item.label }}</span>
                    <span style="float: left color: #8492a6 font-size: 13px">{{ item.value }}</span>
                  </el-option>
                </el-select>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column width="230">
            <template
              slot="header"
              slot-scope="{}"
            >{{ $t('Accounting.Credit') }} ({{totalCredit.toFixed(2)}})</template>
            <template slot-scope="scope">
              <el-input-number
                v-bind:disabled="(tempForm.EntryMovements[scope.$index].Debit != 0)? true : false"
                @change="SumCredit"
                controls-position="right"
                v-model="tempForm.EntryMovements[scope.$index].Credit"
                :precision="2"
                :step="1"
                :min="0.00"
                :max="1000000"
              ></el-input-number>
            </template>
          </el-table-column>
          <el-table-column width="230">
            <template
              slot="header"
              slot-scope="{}"
            >{{ $t('Accounting.Debit') }} ({{totalDebit.toFixed(2)}})</template>
            <template slot-scope="scope">
              <el-input-number
                v-bind:disabled="(tempForm.EntryMovements[scope.$index].Credit != 0)? true : false"
                @change="SumDebit"
                controls-position="right"
                v-model="tempForm.EntryMovements[scope.$index].Debit"
                :precision="2"
                :step="1"
                :min="0.00"
                :max="1000000"
              ></el-input-number>
            </template>
          </el-table-column>
          <el-table-column v-bind:label="$t('Classification.Notes')" width="450">
            <template slot-scope="scope">
              <el-form-item
                :prop="'EntryMovements.'+scope.$index+'.Description'"
                :rules="[{ required: true, message: 'لايمكن ترك بيان فارغ', trigger: 'blur' }]"
              >
                <el-input
                  v-model="tempForm.EntryMovements[scope.$index].Description"
                  required
                  class="input-with-select"
                >
                  <template slot="prepend">
                    <el-button @click="Copy(scope.row.Description)" icon="fa fa-copy"></el-button>
                  </template>
                  <template slot="append">
                    <el-button @click="Paste(scope.$index)" icon="fa fa-paste"></el-button>
                  </template>
                </el-input>
              </el-form-item>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
      <template>
            <el-card shadow="hover" style="float :left">
              <el-button type="danger" icon="fa fa-minus" @click="RemoveEntryMovements()">حذف الأخير</el-button>
            </el-card>

            <el-card shadow="hover">
              <el-button
                type="primary"
                icon="el-icon-plus"
                @click="AddEntryMovements()"
              >{{ $t('Stocks.AddMore') }}</el-button>
            </el-card>
      </template>
    </el-card>
  </div>
</template>
<script>
import { CreateEntry } from "@/api/EntryAccounting";
import { GetActiveAccounts } from "@/api/Account";

export default {
  name: "NewAccountingEntry",
  data() {
    return {
      Account: [],
      Text: "",
      ValidateNote: "",
      totalDebit: 0,
      totalCredit: 0,
      tempForm: {
        ID: undefined,
        FakeDate: new Date(),
        Description: "",
        Type : 'Manual',
        EntryMovements: [
          {
            ID: undefined,
            AccountID: undefined,
            Debit: 0.0,
            Credit: 0.0,
            Description: "",
            EntryID: undefined
          },
          {
            ID: undefined,
            AccountID: undefined,
            Debit: 0.0,
            Credit: 0.0,
            Description: "",
            EntryID: undefined
          }
        ]
      }
    };
  },
  created() {
    this.getdata();
  },
  methods: {
    Copy(Text) {
      this.Text = Text;
    },
    Paste(Index) {
      this.tempForm.EntryMovements[Index].Description = this.Text;
    },
    SumCredit(currentValue, oldValue) {
      this.totalCredit -= oldValue;
      this.totalCredit += currentValue;
    },
    SumDebit(currentValue, oldValue) {
      this.totalDebit -= oldValue;
      this.totalDebit += currentValue;
    },
    AddEntryMovements() {
      this.tempForm.EntryMovements.push({
        ID: undefined,
        AccountID: undefined,
        Debit: 0.0,
        Credit: 0.0,
        Description: "",
        EntryID: undefined
      });
    },
    RemoveEntryMovements() {
      this.SumCredit(
        0,
        this.tempForm.EntryMovements[this.tempForm.EntryMovements.length - 1]
          .Credit
      );
      this.SumDebit(
        0,
        this.tempForm.EntryMovements[this.tempForm.EntryMovements.length - 1]
          .Debit
      );
      this.tempForm.EntryMovements.splice(
        this.tempForm.EntryMovements.length - 1,
        1
      );
    },
    created() {
      this.getdata();
    },
    getdata() {
      GetActiveAccounts()
        .then(response => {
          // handle success
          console.log(response);
          this.Account = response;
        })
        .catch(error => {
          // handle error
          console.log(error);
        });
    },
    resetTempForm() {
      this.tempForm = {
        ID: undefined,
        FakeDate: new Date(),
        Description: "",
        EntryMovements: [
          {
            ID: undefined,
            AccountID: undefined,
            Debit: 0.0,
            Credit: 0.0,
            Description: "",
            EntryID: undefined
          },
          {
            ID: undefined,
            AccountID: undefined,
            Debit: 0.0,
            Credit: 0.0,
            Description: "",
            EntryID: undefined
          }
        ]
      };
    },
    createData(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (
            this.totalDebit == this.totalCredit &&
            this.totalDebit + this.totalCredit != 0
          ) {
            CreateEntry(this.tempForm)
              .then(response => {
                this.getdata();
                this.resetTempForm();
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
          } else
            this.ValidateNote =
              "قيمة الدائن و المدين غير متساويات او تساوي صفر  ";
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }
  }
};
</script>
