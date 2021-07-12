<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-button
          style="float: left"
          type="success"
          icon="fa fa-save"
          @click="isEdit != true ? createData() : updateData()"
          >{{ isEdit != true ? "حفظ" : "تعديل" }}</el-button
        >
        <router-link
          class="pan-btn tiffany-btn"
          style="float: left; margin-left: 20px; padding: 10px 15px; border-radius: 6px"
          icon="el-icon-plus"
          to="/EntryAccounting/List"
          >{{ $t("route.EntryAccounting") }}</router-link
        >
        <span>{{ $t("Accounting.NewAccountingEntry") }}</span>
        <p style="color: #F56C6Cfont-size: 16pxtext-align: center">
          {{ ValidateNote }}
        </p>
      </div>
      <el-form
        ref="tempForm"
        :model="tempForm"
        label-position="top"
        label-width="70px"
        class="demo-ruleForm"
      >
        <el-row>
          <el-col :span="18">
            <el-form-item v-bind:label="$t('Classification.Notes')">
              <el-input type="textarea" v-model="tempForm.Description"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item
              prop="FakeDate"
              v-bind:label="$t('NewPurchaseInvoice.ReleaseDate')"
              :rules="[
                {
                  required: true,
                  message: 'لايمكن ترك التاريخ فارغ',
                  trigger: 'blur',
                },
              ]"
            >
              <Fake-Date
                :Value="tempForm.FakeDate.toString()"
                @Set="(v) => (tempForm.FakeDate = v)"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-table
          :data="tempForm.EntryMovements"
          fit
          border
          max-height="350"
          highlight-current-row
        >
          <el-table-column v-bind:label="$t('Accounting.Account')">
            <template slot-scope="scope">
              <el-form-item
                :prop="'EntryMovements.' + scope.$index + '.AccountId'"
                :rules="[
                  {
                    required: true,
                    message: 'لا يمكن ترك حساب فارغ',
                    trigger: 'blur',
                  },
                ]"
              >
            <account-search-any
            @focus="focusAccount"
            />
                <el-select
                  style="width: 100%"
                  v-model="tempForm.EntryMovements[scope.$index].AccountId"
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
                    <span style="float: left color: #8492a6 font-size: 13px">{{
                      item.value
                    }}</span>
                  </el-option>
                </el-select>

              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column width="230">
            <template slot="header" slot-scope="{}"
              >{{ $t("Accounting.Credit") }} ({{
                tempForm.EntryMovements.reduce((prev, cur) => {
                  return prev + cur.Credit;
                }, 0).toFixed($store.getters.settings.ToFixed)
              }})</template
            >
            <template slot-scope="scope">
              <el-input-number
                v-bind:disabled="
                  tempForm.EntryMovements[scope.$index].Debit != 0 ? true : false
                "
                controls-position="right"
                v-model="tempForm.EntryMovements[scope.$index].Credit"
                :precision="2"
                :step="1"
                :min="0.0"
                :max="1000000"                            @focus="$event.target.select()"

              ></el-input-number>
            </template>
          </el-table-column>
          <el-table-column width="230">
            <template slot="header" slot-scope="{}"
              >{{ $t("Accounting.Debit") }} ({{
                tempForm.EntryMovements.reduce((prev, cur) => {
                  return prev + cur.Debit;
                }, 0).toFixed($store.getters.settings.ToFixed)
              }})</template
            >
            <template slot-scope="scope">
              <el-input-number
                v-bind:disabled="
                  tempForm.EntryMovements[scope.$index].Credit != 0 ? true : false
                "
                controls-position="right"
                v-model="tempForm.EntryMovements[scope.$index].Debit"
                :precision="2"
                :step="1"
                :min="0.0"
                :max="1000000"                            @focus="$event.target.select()"

              ></el-input-number>
            </template>
          </el-table-column>
          <el-table-column v-bind:label="$t('Classification.Notes')" width="450">
            <template slot-scope="scope">
              <el-form-item
                :prop="'EntryMovements.' + scope.$index + '.Description'"
                :rules="[
                  {
                    required: true,
                    message: 'لايمكن ترك بيان فارغ',
                    trigger: 'blur',
                  },
                ]"
              >
                <el-input
                  v-model="tempForm.EntryMovements[scope.$index].Description"
                  required
                  class="input-with-select"
                >
                  <template slot="prepend">
                    <el-button
                      @click="Copy(scope.row.Description)"
                      icon="fa fa-copy"
                    ></el-button>
                  </template>
                  <template slot="append">
                    <el-button
                      @click="Paste(scope.$index)"
                      icon="fa fa-paste"
                    ></el-button>
                  </template>
                </el-input>
              </el-form-item>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
      <template>
        <el-card shadow="hover" style="float: left">
          <el-button type="danger" icon="fa fa-minus" @click="RemoveEntryMovements()"
            >حذف الأخير</el-button
          >
        </el-card>

        <el-card shadow="hover">
          <el-button type="primary" icon="el-icon-plus" @click="AddEntryMovements()">{{
            $t("Stocks.AddMore")
          }}</el-button>
        </el-card>
      </template>
    </el-card>
  </div>
</template>
<script>
import { CreateEntry, GetEntryById, Edit } from "@/api/EntryAccounting";
import { GetActiveAccounts } from "@/api/Account";
import FakeDate from "@/components/Date/FakeDate";
import AccountSearchAny from '@/components/TreeAccount/AccountSearchAny.vue';
export default {
  name: "NewAccountingEntry",
  components: { FakeDate ,AccountSearchAny },
  props: {
    isEdit: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      Account: [],
      Text: "",
      ValidateNote: "",
      tempForm: {
        Id: undefined,
        FakeDate: new Date(),
        Description: "",
        Type: "Manual",
        EntryMovements: [
          {
            Id: undefined,
            AccountId: undefined,
            Debit: 0.0,
            Credit: 0.0,
            Description: "",
            EntryId: undefined,
          },
          {
            Id: undefined,
            AccountId: undefined,
            Debit: 0.0,
            Credit: 0.0,
            Description: "",
            EntryId: undefined,
          },
        ],
      },
    };
  },
  created() {
    if (this.isEdit) {
      this.getdata(this.$route.params && this.$route.params.id);
    }
    this.tempRoute = Object.assign({}, this.$route);
    const loading = this.$loading({
      lock: true,
      text: "تحميل",
      spinner: "el-icon-loading",
      background: "rgba(0, 0, 0, 0.7)",
    });
    GetActiveAccounts()
      .then((response) => {
        // handle success
        console.log(response);
        this.Account = response;
        loading.close();
      })
      .catch((error) => {
        // handle error
        console.log(error);
        loading.close();
      });
  },
  mounted() {
    this.focusAccount();},
  methods: {

    Copy(Text) {
      this.Text = Text;
    },
    Paste(Index) {
      this.tempForm.EntryMovements[Index].Description = this.Text;
    },
    AddEntryMovements() {
      this.tempForm.EntryMovements.push({
        Id: undefined,
        AccountId: undefined,
        Debit: 0.0,
        Credit: 0.0,
        Description: "",
        EntryId: undefined,
      });
    },
    RemoveEntryMovements() {
      this.tempForm.EntryMovements.splice(this.tempForm.EntryMovements.length - 1, 1);
    },
    getdata(val) {
      GetEntryById({ Id: val })
        .then((response) => {
          this.tempForm = response;
          // set tagsview title
          this.setTagsViewTitle();
          // set page title
          this.setPageTitle();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    resetTempForm() {
      this.tempForm = {
        Id: undefined,
        FakeDate: new Date(),
        Description: "",
        EntryMovements: [
          {
            Id: undefined,
            AccountId: undefined,
            Debit: 0.0,
            Credit: 0.0,
            Description: "",
            EntryId: undefined,
          },
          {
            Id: undefined,
            AccountId: undefined,
            Debit: 0.0,
            Credit: 0.0,
            Description: "",
            EntryId: undefined,
          },
        ],
      };
    },
    createData() {
      this.$refs["tempForm"].validate((valid) => {
        if (valid) {
          if (
            this.tempForm.EntryMovements.reduce((prev, cur) => {
              return prev + cur.Debit;
            }, 0) ==
              this.tempForm.EntryMovements.reduce((prev, cur) => {
                return prev + cur.Credit;
              }, 0) &&
            this.tempForm.EntryMovements.reduce((prev, cur) => {
              return prev + cur.Debit;
            }, 0) +
              this.tempForm.EntryMovements.reduce((prev, cur) => {
                return prev + cur.Credit;
              }, 0) !=
              0
          ) {
            CreateEntry(this.tempForm)
              .then((response) => {
                this.getdata();
                this.resetTempForm();
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
          } else this.ValidateNote = "قيمة الدائن و المدين غير متساويات او تساوي صفر  ";
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    updateData() {
      this.$refs["tempForm"].validate((valid) => {
        if (valid) {
          if (
            this.tempForm.EntryMovements.reduce((prev, cur) => {
              return prev + cur.Debit;
            }, 0) ==
              this.tempForm.EntryMovements.reduce((prev, cur) => {
                return prev + cur.Credit;
              }, 0) &&
            this.tempForm.EntryMovements.reduce((prev, cur) => {
              return prev + cur.Debit;
            }, 0) +
              this.tempForm.EntryMovements.reduce((prev, cur) => {
                return prev + cur.Credit;
              }, 0) !=
              0
          ) {
            Edit(this.tempForm)
              .then((response) => {
                this.getdata();
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
          } else this.ValidateNote = "قيمة الدائن و المدين غير متساويات او تساوي صفر  ";
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    setTagsViewTitle() {
      const title = "Edit Entry";
      const route = Object.assign({}, this.tempRoute, {
        title: `${title}-${this.tempForm.Id}`,
      });
      this.$store.dispatch("tagsView/updateVisitedView", route);
    },
    setPageTitle() {
      const title = "Edit Entry";
      document.title = `${title} - ${this.tempForm.Id}`;
    },
  },
};
</script>