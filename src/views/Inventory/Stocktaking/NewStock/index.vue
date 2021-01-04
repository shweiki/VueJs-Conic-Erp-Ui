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
        <div slot="header" class="clearfix">
          <el-button
            style="float: left"
            type='success'
            icon="fa fa-save"
            @click="createData('tempForm')"
          >حفظ</el-button>
           <router-link
          class="pan-btn tiffany-btn"
          style="float: left ; margin-left: 20px; padding: 10px 15px; border-radius: 6px;"
          icon="el-icon-plus"
          to="/StockItem"
        >{{ $t('route.StockItem') }}</router-link>
          <span>جرد مخزن</span>
        </div>
        <el-row >

          <el-col :span="6">
            <el-form-item
              prop="FakeDate"
              label="تاريخ الإصدار"
              :rules="[{ required: true, message: 'لايمكن ترك التاريخ فارغ', trigger: 'blur' }]"
            >
              <el-date-picker
                v-model="tempForm.FakeDate"
                type="date"
                placeholder="تاريخ"
                format="dd/MM/yyyy"
              ></el-date-picker>
            </el-form-item>
          </el-col>
                    <el-col :span="18">
            <el-form-item label="بيان جرد \ مسؤول الجرد">
              <el-input type="textarea" v-model="tempForm.Description"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-card class="box-card">
          <el-row >
            <el-col :span="6">
              <el-switch v-model="ByQTY" active-text="ادخال الكمية" inactive-text="عداد"></el-switch>
            </el-col>
            <el-col :span="12">
              <el-input data-barcode v-model="Barcode" placeholder="باركود صنف">
                <i class="fa fa-barcode el-input__icon" slot="suffix"></i>
              </el-input>
            </el-col>

            <el-col :span="6">
              <el-autocomplete
                popper-class="my-autocomplete"
                v-model="Name"
                :fetch-suggestions="SearchNameItem"
                placeholder="اسم صنف"
                @select="AddItem"
              >
                <i class="fa fa-barcode el-input__icon" slot="suffix"></i>
                <template slot-scope="{ item }">
                  <div class="ID">{{ item.Barcode }}</div>
                  <span class="Name">{{ item.Name }}</span>
                </template>
              </el-autocomplete>
            </el-col>
          </el-row>
        </el-card>
        <el-form-item prop="StockMovements">
          <el-table
            :data="tempForm.StockMovements"
            fit
            border
            max-height="320"
            highlight-current-row
          >
            <el-table-column prop="Itemx.Barcode" label="باركود" align="center"></el-table-column>
            <el-table-column prop="Itemx.Name" label="اسم الصنف" align="center"></el-table-column>

            <el-table-column width="180" align="center">
              <template slot="header" slot-scope="{}">() الكمية</template>
              <template slot-scope="scope">
                <el-input-number
                  v-model="tempForm.StockMovements[scope.$index].Qty"
                  :precision="2"
                  :step="1"
                  :min="0.00"
                  :max="1000000"
                ></el-input-number>
              </template>
            </el-table-column>
            <el-table-column width="220" align="center">
              <template slot="header" slot-scope="{}">المخزن</template>
              <template slot-scope="scope">
                <el-radio-group
                  v-model="tempForm.StockMovements[scope.$index].InventoryItemId"
                >
                  <el-radio-button
                    v-for="(item , index ) in InventoryItems"
                    :key="index"
                    :label="item.value"
                  >{{item.label}}</el-radio-button>
                </el-radio-group>
              </template>
            </el-table-column>
            <el-table-column label="وصف" width="200" align="center">
              <template slot-scope="scope">
                <el-form-item :prop="'StockMovements.'+scope.$index+'.Description'">
                  <el-input
                    v-model="tempForm.StockMovements[scope.$index].Description"
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

            <el-table-column width="55">
              <template slot-scope="scope">
                <el-button type="danger" icon="el-icon-delete" @click="RemoveItem(scope.$index)"></el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
      </el-card>
      <el-dialog
        style="margin-top: -13vh"
        :show-close="false"
        title="صنف جديد"
        :visible.sync="NewItemVisible"
        width="80%"
      >
        <el-row >
          <el-col :span="3">
            <el-button type='success' icon="el-plus" @click="NewItem()">حفظ</el-button>
          </el-col>

          <el-col :span="12">
            <el-input v-model="Barcode" placeholder="باركود" suffix-icon="fa fa-barcode"></el-input>
          </el-col>
          <el-col :span="6">
            <el-input type="text" v-model="Name" placeholder="إسم صنف"></el-input>
          </el-col>
        </el-row>
      </el-dialog>
      <el-dialog style="margin-top: -13vh" title="QTY" :visible.sync="EnterQTYVisible" width="80%">
        <el-row >
          <el-col :span="3">
            <el-button type='success' icon="el-plus" @click="onBarcodeScanned(Barcode)">Add</el-button>
          </el-col>

          <el-col :span="12">
            <el-input-number v-model="Qty" :precision="2" :step="1" :min="0.00" :max="1000000"></el-input-number>
          </el-col>
        </el-row>
      </el-dialog>
    </el-form>
  </div>
</template>
<script>
import { Create } from "@/api/StockInventory";
import { GetActiveInventory } from "@/api/InventoryItem";
import { CreateItem, GetActiveItem } from "@/api/Item";
export default {
  name: "NewStock",
  data() {
    return {
      ByQTY: false,
      Qty: 1,
      NewItemVisible: false,
      EnterQTYVisible: false,
      Barcode: '',
      Name: '',
      Text: '',
      ValidateNote: '',
      tempForm: {
        ID: undefined,
        FakeDate: new Date(),
        Description: '',
        StockMovements: []
      },
      rules: {
        StockMovements: [
          {
            type: "array",
            required: true,
            message: "لا يمكن إستكمال عملية مخزن من غير إضافة أصناف",
            trigger: "change"
          }
        ]
      },
      InventoryItems: [],
      Items: []
    };
  },
  methods: {
    AddItem(Item) {
      var find = this.tempForm.StockMovements.findIndex(
        value => value.ItemsId == Item.Id
      );
      //console.log(qty);
      if (find != -1) this.tempForm.StockMovements[find].Qty += this.Qty;
      else {
        this.tempForm.StockMovements.push({
          ID: undefined,
          ItemsId: Item.Id,
          Status: 0,
          Qty: this.Qty,
          SellingPrice: 0,
          Tax: 0.0,
          Description: '',
          InventoryItemId: 1,
          Itemx: Item,
          StocktakingInventoryID: undefined
        })
      }
      this.Barcode = "";
      this.Name = "";
    },
    Copy(Text) {
      this.Text = Text;
    },
    Paste(Index) {
      this.tempForm.StockMovements[Index].Description = this.Text;
    },
    RemoveItem(index) {
      this.tempForm.StockMovements.splice(index, 1);
    },
    SearchNameItem(queryString, cb) {
      var Items = this.Items;
      var results = queryString
        ? Items.filter(this.createFilter(queryString))
        : Items;
      if (results.length <= 0) {
        // console.log(results.length);
        this.NewItemVisible = true;
      } else {
        this.NewItemVisible = false;
      }
      // call callback function to return suggestion objects
      cb(results);
    },
    createFilter(queryString) {
      return Item => {
        return Item.Name.toLowerCase().indexOf(queryString.toLowerCase()) === 0;
      };
    },
    getdata() {
      GetActiveInventory().then(response => {
        console.log(response)
        this.InventoryItems = response;
      })
      GetActiveItem().then(response => {
        console.log(response)
        this.Items = response;
      })
    },
    createData() {
      this.$refs["tempForm"].validate(valid => {
        if (valid) {
          Create(this.tempForm)
            .then(response => {
              this.$notify({
                title: "تم الإضافة بنجاح",
                message: "تم الإضافة بنجاح",
                type: 'success',
                position: "top-left",
                duration: 1000,
                showClose: false,
                onClose: () => {
                  Object.assign(this.$data, this.$options.data());
                  this.getdata();
                }
              })
            })
            .catch(error => {
              console.log(error);
            })
        } else {
          console.log("error submit!!");
          return false;
        }
      })
    },
    NewItem() {
      CreateItem({
        ID: undefined,
        Name: ''+this.Name+'',
        CostPrice: 0.0,
        SellingPrice: 0.0,
        OtherPrice: 0.0,
        LowOrder: 0,
        Status : 0,
        Tax: 0.0,
        Rate: 0,
        Barcode: this.Barcode,
        Description: '',
      })
        .then(response => {
          this.Barcode = "";
          this.NewItemVisible = false;
          this.getdata();
          this.$notify({
            title: "تم ",
            message: "تم الإضافة بنجاح",
            type: 'success',
            duration: 2000
          })
        })
        .catch(error => {
          console.log(error);
        })
    },
    onBarcodeScanned(barcode) {
      console.log(barcode);
      if (this.ByQTY && this.Qty == 1) {
        this.EnterQTYVisible = true;
        this.Qty = 1;
      } else {
        var find = this.Items.findIndex(value => value.Barcode == this.Barcode);
        console.log(find);
        if (find != -1) {
          if (this.Qty > 1) {
            this.EnterQTYVisible = false;
            this.AddItem(this.Items[find]);
            this.Qty = 1;
          } else this.AddItem(this.Items[find]);
        } else {
          this.NewItemVisible = true;
        }
      }
    },
    // Reset to the last barcode before hitting enter (whatever anything in the input box)
    resetBarcode() {
      console.log("10");
      let barcode = this.$barcodeScanner.getPreviousCode();
      // do something...
    }
  },
  created() {
    this.$barcodeScanner.init(this.onBarcodeScanned);
    this.getdata();
  }
};
</script>
