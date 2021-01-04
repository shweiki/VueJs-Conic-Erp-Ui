<template>
  <div>
    <el-button
      style="width: 100px;"
      type="warning"
      icon="el-icon-plus"
      @click="Visible = true"
    >خدمة جديد</el-button>
    <el-dialog style="margin-top: -13vh" title="تسجيل خدمة" :visible.sync="Visible">
      <el-form label-position="top" class="demo-form-inline">
        <el-row >
          <el-col :span="12">
            <el-form-item label="العدد">
              <span>{{Service.Qty}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="خدمة">
              <el-select
                v-model="ServiceID"
                @change="(id)=>{ Service = Services.find(
                  obj => obj.Id == id
                )}"
              >
                <el-option
                  v-for="item in Services"
                  :key="item.Id"
                  :label="item.Name"
                  :value="item.Id"
                >
                  <span style="float: left">{{ item.Name }}</span>
                  <span
                    style=" float: right; color: #8492a6; font-size: 13px"
                  >{{ item.SellingPrice.toFixed(2) }}</span>
                  <span style=" color: #8492a6; font-size: 13px">( {{ item.Qty }} )</span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row >
          <el-col :span="12">
            <el-form-item v-bind:label="$t('NewPurchaseInvoice.TotalJD')">
              <span>JOD {{Service.SellingPrice}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-bind:label="$t('AddVendors.Description')" prop="Description">
              <el-input v-model="Description"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="Visible = false">{{$t('AddVendors.Cancel')}}</el-button>
        <el-button type="primary" @click="createData()">{{$t('AddVendors.Save')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { Create } from "@/api/SaleInvoice";
import { GetActiveService } from "@/api/Service";

export default {
  props: {
    MemberID: {
      type: Number,
      default: () => {
        return undefined;
      }
    }
  },
  created() {
    this.getdata();
  },
  data() {
    return {
      Services: [],
      Service: {},
      ServiceID: undefined,

      Visible: false,
      Description: ''
    };
  },
  methods: {
    getdata() {
      GetActiveService()
        .then(response => {
          console.log(response)
          this.Services = response;
        })
        .catch(err => {
          console.log(err);
        })
    },
    createData() {
      let SaleInvoice = {
        ID: undefined,
        Name: this.Service.Name,
        Tax: 0.0,
        FakeDate: new Date(),
        PaymentMethod: "Cash",
        Discount: 0,
        Status: 0,
        Description: this.Description,
        MemberID: this.MemberID,
        IsPrime: true,
        InventoryMovements: []
      };
      let ItemSellingPrice = this.Service.SellingPrice / this.Service.Qty;
      for (var i = 0; i < this.Service.Qty; i++) {
        SaleInvoice.InventoryMovements.push({
          ID: undefined,
          ItemsId: this.Service.ItemId,
          TypeMove: "Out",
          Status: 1,
          Qty: 1.0,
          SellingPrice: ItemSellingPrice,
          Tax: 0.0,
          Description: '',
          InventoryItemId: 1,
          SalesInvoiceId: undefined
        })
      }
      console.log(SaleInvoice)
      if (SaleInvoice.InventoryMovements.length > 0) {
        Create(SaleInvoice)
          .then(response => {
            if (response) {
              this.Visible = false;
              this.$notify({
                title: "تم ",
                message: "تم الإضافة بنجاح",
                type: 'success',
                duration: 2000
              })
              this.$nextTick(() => {
                this.$router.replace({
                  path: "/redirect" + this.$route.fullPath
                })
              })
            }
          })
          .catch(error => {
            console.log(error);
          })
      }
    }
  }
};
</script>
