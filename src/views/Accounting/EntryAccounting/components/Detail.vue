<template>
  <div>
    <el-card class="box-card">
      <div slot="header">
        <el-button
          style="float: left"
          type="success"
          icon="fa fa-save"
          @click="isEdit != true ? createData() : updateData()"
        />

        <router-link
          class="pan-btn tiffany-btn"
          style="float: left; margin-left: 20px; padding: 10px 15px; border-radius: 6px"
          icon="el-icon-plus"
          to="/EntryAccounting/List"
        >{{ $t("route.EntryAccounting") }}</router-link>
        <span>{{ $t("Accounting.NewAccountingEntry") }}</span>
        <p style="color: #F56C6Cfont-size: 16pxtext-align: center">
          {{ ValidateNote }}
        </p>
      </div>
      <el-form ref="tempForm" :model="tempForm" class="demo-ruleForm">
        <el-row type="flex">
          <el-col :span="12">
            <el-form-item
              prop="FakeDate"
              :label="$t('NewPurchaseInvoice.ReleaseDate')"
              :rules="[
                {
                  required: true,
                  message: 'لايمكن ترك التاريخ فارغ',
                  trigger: 'blur',
                },
              ]"
            >
              <Fake-Date
                :value="tempForm.FakeDate.toString()"
                @Set="(v) => (tempForm.FakeDate = v)"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <Search-By
          type="AccountSearchBar"
          @Set="
            (v) => {
              AddEntryMovements(v);
            }
          "
        />
        <el-table
          :data="tempForm.EntryMovements"
          fit
          border
          max-height="350"
          highlight-current-row
        >
          <el-table-column align="center" width="150">
            <template
              slot="header"
              slot-scope="{}"
            >{{ $t("Accounting.Credit") }} ({{
              tempForm.EntryMovements.reduce((prev, cur) => {
                return prev + cur.Credit;
              }, 0).toFixed($store.getters.settings.ToFixed)
            }})</template>
            <template slot-scope="scope">
              <el-input-number
                v-model="tempForm.EntryMovements[scope.$index].Credit"
                :disabled="
                  tempForm.EntryMovements[scope.$index].Debit != 0 ? true : false
                "
                controls-position="right"
                :precision="2"
                :step="1"
                :min="0.0"
                :max="1000000"
                @focus="$event.target.select()"
              />
            </template>
          </el-table-column>
          <el-table-column align="center" width="150">
            <template
              slot="header"
              slot-scope="{}"
            >{{ $t("Accounting.Debit") }} ({{
              tempForm.EntryMovements.reduce((prev, cur) => {
                return prev + cur.Debit;
              }, 0).toFixed($store.getters.settings.ToFixed)
            }})</template>
            <template slot-scope="scope">
              <el-input-number
                v-model="tempForm.EntryMovements[scope.$index].Debit"
                :disabled="
                  tempForm.EntryMovements[scope.$index].Credit != 0 ? true : false
                "
                controls-position="right"
                :precision="2"
                :step="1"
                :min="0.0"
                :max="1000000"
                @focus="$event.target.select()"
              />
            </template>
          </el-table-column>
          <el-table-column align="center" :label="$t('Accounting.Account')">
            <template slot-scope="scope">
              <el-form-item
                :prop="'EntryMovements.' + scope.$index + '.AccountId'"
                :rules="[
                  {
                    required: true,
                    message: 'لا يمكن ترك الحساب فارغ',
                    trigger: 'blur',
                  },
                ]"
              >
                {{ tempForm.EntryMovements[scope.$index].Name }}
                <el-col :span="4">
                  <EditAccount
                    :account-id="tempForm.EntryMovements[scope.$index].AccountId"
                  /></el-col>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            :label="$t('Classification.Notes')"
            width="320"
          >
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
                    <el-tooltip effect="dark" content="Copy" placement="top">
                      <el-button
                        icon="fa fa-copy"
                        @click="Copy(scope.row.Description)"
                      />
                    </el-tooltip>
                  </template>
                  <template slot="append">
                    <el-tooltip effect="dark" content="Paste" placement="top">
                      <el-button
                        icon="fa fa-paste"
                        @click="Paste(scope.$index)"
                      />
                    </el-tooltip>
                  </template>
                </el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column width="55">
            <template slot-scope="scope">
              <el-tooltip effect="dark" content="Remove" placement="top">
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  @click="RemoveEntryMovements(scope.$index)"
                />
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
        <el-col :span="18">
          <el-form-item :label="$t('Classification.Notes')">
            <el-input v-model="tempForm.Description" type="textarea" />
          </el-form-item>
        </el-col>
      </el-form>
    </el-card>
    <el-card v-if="tempForm.Id != undefined" class="box-card">
      <Documents :object-id="tempForm.Id" table-name="AccountingEntry" />
    </el-card>
  </div>
</template>
<script>
import { CreateEntry, GetEntryById, Edit } from '@/api/EntryAccounting'
import FakeDate from '@/components/Date/FakeDate'
import EditAccount from '@/components/TreeAccount/EditAccount.vue'
import SearchBy from '@/components/DynamicComponents/SearchBy.vue'
import Documents from '@/components/Documents/Documents.vue'
export default {
  name: 'NewAccountingEntry',
  components: { FakeDate, SearchBy, EditAccount, Documents },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      Text: '',
      ValidateNote: '',
      tempForm: {
        Id: undefined,
        FakeDate: new Date(),
        Description: '',
        Type: 'Manual',
        EntryMovements: []
      }
    }
  },
  created() {
    if (this.isEdit) {
      this.getdata(this.$route.params && this.$route.params.id)
    }
    this.tempRoute = Object.assign({}, this.$route)
    const loading = this.$loading({
      lock: true,
      text: 'تحميل',
      spinner: 'el-icon-loading',
      background: 'rgba(0, 0, 0, 0.7)'
    })
    loading.close()
  },

  methods: {
    Copy(Text) {
      this.Text = Text
    },
    Paste(Index) {
      this.tempForm.EntryMovements[Index].Description = this.Text
    },
    AddEntryMovements(v) {
      this.tempForm.EntryMovements.push({
        Id: undefined,
        AccountId: v.Id,
        Name: v.Name,
        Debit: 0.0,
        Credit: 0.0,
        Description: '',
        EntryId: undefined,
        TableName: 'Manual',
        Fktable: undefined
      })
    },
    RemoveEntryMovements(index) {
      this.tempForm.EntryMovements.splice(index, 1)
    },
    getdata(val) {
      GetEntryById({ Id: val || (this.$route.params && this.$route.params.id) })
        .then((response) => {
          this.tempForm = response
          // set tagsview title
          this.setTagsViewTitle()
          // set page title
          this.setPageTitle()
        })
        .catch((err) => {
          console.log(err)
        })
    },
    resetTempForm() {
      this.tempForm = {
        Id: undefined,
        FakeDate: new Date(),
        Description: '',
        Type: 'Manual',
        EntryMovements: []
      }
    },
    createData() {
      this.$refs['tempForm'].validate((valid) => {
        if (valid) {
          if (
            this.tempForm.EntryMovements.reduce((prev, cur) => {
              return prev + cur.Debit
            }, 0) ==
              this.tempForm.EntryMovements.reduce((prev, cur) => {
                return prev + cur.Credit
              }, 0) &&
            this.tempForm.EntryMovements.reduce((prev, cur) => {
              return prev + cur.Debit
            }, 0) +
              this.tempForm.EntryMovements.reduce((prev, cur) => {
                return prev + cur.Credit
              }, 0) !=
              0
          ) {
            CreateEntry(this.tempForm)
              .then((response) => {
                if (response) {
                  //  this.getdata(response);
                  this.resetTempForm()
                  this.$notify({
                    title: 'تم ',
                    message: 'تم الإضافة بنجاح',
                    type: 'success',
                    duration: 2000
                  })
                } else {
                  this.$notify({
                    title: 'خطأ ',
                    message: 'حصلت مشكلة في عملية الحفظ',
                    type: 'error',
                    duration: 20000
                  })
                }
              })
              .catch((error) => {
                console.log(error)
              })
          } else this.ValidateNote = 'قيمة الدائن و المدين غير متساويات او تساوي صفر  '
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    updateData() {
      this.$refs['tempForm'].validate((valid) => {
        if (valid) {
          if (
            this.tempForm.EntryMovements.reduce((prev, cur) => {
              return prev + cur.Debit
            }, 0) ==
              this.tempForm.EntryMovements.reduce((prev, cur) => {
                return prev + cur.Credit
              }, 0) &&
            this.tempForm.EntryMovements.reduce((prev, cur) => {
              return prev + cur.Debit
            }, 0) +
              this.tempForm.EntryMovements.reduce((prev, cur) => {
                return prev + cur.Credit
              }, 0) !=
              0
          ) {
            Edit(this.tempForm)
              .then((response) => {
                this.getdata()
                this.$notify({
                  title: 'تم ',
                  message: 'تم تعديل بنجاح',
                  type: 'success',
                  duration: 2000
                })
              })
              .catch((error) => {
                console.log(error)
              })
          } else this.ValidateNote = 'قيمة الدائن و المدين غير متساويات او تساوي صفر  '
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    setTagsViewTitle() {
      const title = this.$t('route.EditEntryAccounting')
      const route = Object.assign({}, this.tempRoute, {
        title: `${title}-${this.tempForm.Id}`
      })
      this.$store.dispatch('tagsView/updateVisitedView', route)
    },
    setPageTitle() {
      const title = this.$t('route.EditEntryAccounting')
      document.title = `${title} - ${this.tempForm.Id}`
    }
  }
}
</script>
