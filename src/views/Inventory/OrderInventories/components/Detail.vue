<template>
  <div class="app-container">
    <el-form
      ref="tempForm"
      :model="tempForm"
      :rules="rules"
      label-position="top"
      label-width="70px"
      class="demo-ruleForm"
    >
      <el-card class="box-card">
        <div slot="header">
          <el-button
            style="float: left"
            type=" "
            icon="fa fa-save"
            @click="isEdit != true ? createData() : updateData()"
          >{{ isEdit != true ? "حفظ" : "تعديل" }}</el-button>
          <router-link
            class="pan-btn tiffany-btn"
            style="float: left; margin-left: 20px; padding: 10px 15px; border-radius: 6px"
            icon="el-icon-plus"
            to="/OrderInventories/List"
          >{{ $t("route.OrderInventory") }}</router-link>
          <span>{{ $t("OrderInventories.StoreMovement") }}</span>
          <p style="color: #F56C6Cfont-size: 16pxtext-align: center">
            {{ ValidateNote }}
          </p>
        </div>
        <el-row type="flex">
          <el-col :span="6">
            <el-form-item
              prop="OrderType"
              :label="$t('OrderInventories.OrderType')"
              :rules="[
                {
                  required: true,
                  message: 'يجب تحديد نوع سند',
                  trigger: 'blur',
                },
              ]"
            >
              <el-radio-group v-model="tempForm.OrderType">
                <el-radio-button label="ادخال بضاعة اول المدة / بونص" />
                <el-radio-button label="اخراج: هدايا / عروض / تالف" />
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="6">
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
              <el-date-picker
                v-model="tempForm.FakeDate"
                type="date"
                :placeholder="$t('Sales.Date')"
                :format="$store.getters.settings.DateTimeFormat"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              prop="Description"
              :label="$t('OrderInventories.Statement')"
            >
              <el-input v-model="tempForm.Description" type="textarea" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-card style="background: #545454" :body-style="{ padding: '1px' }">
          <Items-Search :with-bar-code="true" @add="AddItem" />
        </el-card>
        <el-form-item prop="InventoryMovements">
          <el-table
            :data="tempForm.InventoryMovements"
            fit
            border
            max-height="350"
            highlight-current-row
          >
            <el-table-column align="center">
              <template
                slot="header"
                slot-scope="{}"
              >{{ $t("OrderInventories.Items") }} ({{
                tempForm.InventoryMovements.length.toFixed(
                  $store.getters.settings.ToFixed
                )
              }})</template>
              <template slot-scope="scope">
                {{ tempForm.InventoryMovements[scope.$index].Name }}
                <edit-item :item-id="tempForm.InventoryMovements[scope.$index].ItemsId" />
              </template>
            </el-table-column>

            <el-table-column width="150" align="center">
              <template
                slot="header"
                slot-scope="{}"
              >{{ $t("CashPool.quantity") }} ({{
                tempForm.InventoryMovements.reduce(
                  (a, b) => a + (b["Qty"] || 0),
                  0
                ).toFixed($store.getters.settings.ToFixed)
              }})</template>
              <template slot-scope="scope">
                <el-input-number
                  v-model="tempForm.InventoryMovements[scope.$index].Qty"
                  controls-position="right"
                  :precision="2"
                  :step="1"
                  :min="0.0"
                  :max="1000000"
                  @focus="$event.target.select()"
                />
              </template>
            </el-table-column>
            <el-table-column align="center">
              <template slot="header" slot-scope="{}">نوع الحركة</template>
              <template slot-scope="scope">
                <el-radio-group
                  v-model="tempForm.InventoryMovements[scope.$index].TypeMove"
                >
                  <el-radio-button label="In">إضافة</el-radio-button>
                  <el-radio-button label="Out">سحب</el-radio-button>
                </el-radio-group>
              </template>
            </el-table-column>
            <el-table-column
              v-if="isEdit == false"
              label="المتوفر"
              width="80"
              align="center"
            >
              <template slot-scope="scope">
                {{ scope.row.Item.TotalIn - scope.row.Item.TotalOut }}
              </template>
            </el-table-column>
            <el-table-column label="EXP" width="175" align="center">
              <template slot-scope="scope">
                <Select-Item-Exp-Column
                  :value="tempForm.InventoryMovements[scope.$index].EXP"
                  :item-id="tempForm.InventoryMovements[scope.$index].ItemsId"
                  @SetVal="
                    (v) => {
                      tempForm.InventoryMovements[scope.$index].EXP = v;
                    }
                  "
                />
              </template>
            </el-table-column>
            <el-table-column align="center">
              <template slot="header" slot-scope="{}">{{
                $t("OrderInventories.Store")
              }}</template>
              <template slot-scope="scope">
                <radio-active-inventory
                  :inventory-id="tempForm.InventoryMovements[scope.$index].InventoryItemId"
                  @Set="
                    (v) =>
                      (tempForm.InventoryMovements[scope.$index].InventoryItemId =
                        v.value)
                  "
                />
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              :label="$t('Vendors.Description')"
              width="250"
            >
              <template slot-scope="scope">
                <el-form-item
                  :prop="'InventoryMovements.' + scope.$index + '.Description'"
                >
                  <el-input
                    v-model="tempForm.InventoryMovements[scope.$index].Description"
                    required
                    class="input-with-select"
                  >
                    <template slot="prepend">
                      <el-button
                        icon="fa fa-copy"
                        @click="Copy(scope.row.Description)"
                      />
                    </template>
                    <template slot="append">
                      <el-button
                        icon="fa fa-paste"
                        @click="Paste(scope.$index)"
                      />
                    </template>
                  </el-input>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column width="55">
              <template slot-scope="scope">
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  @click="RemoveItem(scope.$index)"
                />
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
      </el-card>
    </el-form>
  </div>
</template>
<script>
import { Create, Edit, GetOrderInventoryById } from '@/api/OrderInventory'
import ItemsSearch from '@/components/Item/ItemsSearch.vue'
import EditItem from '@/components/Item/EditItem'
import SelectItemExpColumn from '@/components/Item/SelectItemExpColumn.vue'
import RadioActiveInventory from '@/components/Inventory/RadioActiveInventory.vue'

export default {
  name: 'NewOrderInventories',
  components: {
    ItemsSearch,
    EditItem,
    SelectItemExpColumn,
    RadioActiveInventory
  },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      ValidateNote: '',
      tempForm: {
        Id: undefined,
        FakeDate: new Date(),
        OrderType: 'ادخال: بضاعة اول المدة / بونص',
        Description: '',
        InventoryMovements: []
      },
      rules: {
        InventoryMovements: [
          {
            type: 'array',
            required: true,
            message: 'لا يمكن إستكمال عملية مخزن من غير إضافة أصناف',
            trigger: 'change'
          }
        ]
      },
      Items: []
    }
  },
  created() {
    if (this.isEdit) {
      this.getdata(this.$route.params && this.$route.params.id)
    }
    this.tempRoute = Object.assign({}, this.$route)
  },
  methods: {
    restTempForm() {
      this.tempForm = {
        Id: undefined,
        FakeDate: new Date(),
        OrderType: 'ادخال: بضاعة اول المدة / بونص',
        Description: '',
        InventoryMovements: []
      }
    },
    AddItem(item) {
      this.tempForm.InventoryMovements.unshift({
        Id: undefined,
        TypeMove: 'In',
        ItemsId: item.Id,
        Status: 0,
        Qty: 1.0,
        SellingPrice: 0,
        Tax: 0.0,
        Description: '',
        InventoryItemId: 1,
        Name: item.Name,
        OrderInventoryId: undefined,
        Item: item
      })
    },

    Copy(Text) {
      this.Text = Text
    },
    Paste(Index) {
      this.tempForm.InventoryMovements[Index].Description = this.Text
    },
    getdata(val) {
      GetOrderInventoryById({ Id: val })
        .then((response) => {
          console.log(response)
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
    RemoveItem(index) {
      this.tempForm.InventoryMovements.splice(index, 1)
    },
    createData() {
      this.$refs['tempForm'].validate((valid) => {
        if (valid) {
          Create(this.tempForm)
            .then((response) => {
              this.$notify({
                title: 'تم الإضافة بنجاح',
                message: 'تم الإضافة بنجاح',
                type: 'success',
                position: 'top-left',
                duration: 1000,
                showClose: false,
                onClose: () => {
                  if (response) {
                    this.restTempForm()
                    /*    this.$nextTick(() => {
                      this.$router.replace({
                        path: "/redirect" + "/OrderInventories/List"
                      });
                    });*/
                  }
                }
              })
            })
            .catch((error) => {
              console.log(error)
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    updateData() {
      this.$refs['tempForm'].validate((valid) => {
        if (valid) {
          Edit(this.tempForm)
            .then((response) => {
              this.$notify({
                title: 'تم تعديل  بنجاح',
                message: 'تم تعديل بنجاح',
                type: 'success',
                position: 'top-left',
                duration: 1000,
                showClose: false,
                onClose: () => {
                  if (response) {
                    this.$nextTick(() => {
                      this.$router.replace({
                        path: '/redirect' + '/OrderInventories/List'
                      })
                    })
                  }
                }
              })
            })
            .catch((error) => {
              console.log(error)
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    setTagsViewTitle() {
      const title = this.$t('route.EditOrderInventory')
      const route = Object.assign({}, this.tempRoute, {
        title: `${title}-${this.tempForm.Id}`
      })
      this.$store.dispatch('tagsView/updateVisitedView', route)
    },
    setPageTitle() {
      const title = this.$t('route.EditOrderInventory')
      document.title = `${title} - ${this.tempForm.Id}`
    }
  }
}
</script>
