<template>
  <div class="app-container">
    <el-row v-if="tempForm">
      <el-col :span="24" :xs="24" v-loading="loading">
        <Vendor-Search :VendorId="tempForm.Id" />
        <el-card
          class="box-card"
          v-bind:class="{ BlackList: tempForm.Status === -2 ? true : false }"
        >
          <el-row>
            <el-col :span="19">
              <Details :Vendor="tempForm" />
            </el-col>
            <el-col :span="5" v-if="tempForm.Status != -2">
              <el-row>
                <el-col :span="24">
                  <el-button
                    style="width: 100px"
                    type="info"
                    icon="el-icon-zoom-in"
                    @click="
                      $router.replace({
                        path: '/redirect' + '/Vendor/ListVendor',
                      })
                    "
                    >جميع العملاء</el-button
                  >
                </el-col>
              </el-row>

              <el-row>
                <el-col :span="24">
                  <Vendor-Pay :VendorId="tempForm.Id" :Name="tempForm.Name" />
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24"
                  ><Vendor-Receive :VendorId="tempForm.Id" :Name="tempForm.Name" />
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <Massage
                    :NumberPhone1="tempForm.PhoneNumber1"
                    :NumberPhone2="tempForm.PhoneNumber2"
                    :Email="tempForm.Email"
                  />
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </el-card>
        <el-card class="box-card">
          <el-tabs v-model="activeTab" tab-position="right" @tab-click="tabClick">
            <el-tab-pane label="بيانات" name="Details">
              <span slot="label"><i class="el-icon-refresh"></i> بيانات</span>
              <User-Card :Vendor="tempForm" />
            </el-tab-pane>
            <el-tab-pane label="مبيعات" name="SaleInvoice">
              <span slot="label"><i class="el-icon-refresh"></i> مبيعات</span>
              <Sale-Invoice :VendorId="tempForm.Id" />
            </el-tab-pane>
            <el-tab-pane label="مشتريات" name="PurchaseInvoice">
              <span slot="label"><i class="el-icon-refresh"></i> مشتريات</span>
              <Purchase-Invoice :VendorId="tempForm.Id" />
            </el-tab-pane>
            <el-tab-pane label="مقبوضات" name="Payment">
              <span slot="label"><i class="el-icon-refresh"></i> مقبوضات</span>
              <Payment :VendorId="tempForm.Id" />
            </el-tab-pane>
            <el-tab-pane label="مصروفات" name="Receive">
              <span slot="label"><i class="el-icon-refresh"></i> مصروفات</span>
              <Receive :VendorId="tempForm.Id" />
            </el-tab-pane>
            <el-tab-pane label="مالية" name="account">
              <span slot="label"><i class="el-icon-refresh"></i> مالية</span>
              <Account :EntryMovements="EntryMovements" :AccountId="tempForm.AccountId" />
            </el-tab-pane>
            <el-tab-pane label="تواصل" name="communication">
              <span slot="label"><i class="el-icon-refresh"></i> تواصل</span>
              <Communication />
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Details from "./Details.vue";
import UserCard from "./UserCard.vue";
import VendorReceive from "./Dialogs/VendorReceive.vue";

import VendorPay from "./Dialogs/VendorPay.vue";
import VendorSearch from "./VendorSearch.vue";

import Payment from "./Payment.vue";
import Receive from "./Receive.vue";

import SaleInvoice from "./SaleInvoice.vue";
import PurchaseInvoice from "./PurchaseInvoice.vue";

import Account from "./Account.vue";
import Communication from "./Communication.vue";
import { GetFileByObjId } from "@/api/File";

import { GetById } from "@/api/Vendor";
import { GetEntryMovementsByAccountId } from "@/api/EntryMovement";

import Massage from "@/components/Massage/index.vue";

export default {
  name: "Profile",
  components: {
    Details,
    UserCard,
    Account,
    Payment,
    Receive,
    VendorPay,
    Massage,
    VendorSearch,
    Communication,
    SaleInvoice,
    PurchaseInvoice,
    VendorReceive,
  },
  props: {
    isEdit: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      activeTab: "Details",
      loading: true,
      tempRoute: {},
      tempForm: null,
      EntryMovements: [],
    };
  },
  created() {
    if (this.isEdit) {
      this.getdata(this.$route.params && this.$route.params.id);
      // console.log(this.$route.params )
    }
    this.tempRoute = Object.assign({}, this.$route);
  },
  methods: {
    getdata(val) {
      GetById({ Id: val })
        .then((response) => {
          this.tempForm = response;
          this.GetImage(this.tempForm.Id);
          this.loading = false;
          this.setTagsViewTitle();
          // set page title
          this.setPageTitle();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    tabClick(tab, event) {
      if (tab.label == "مالية")
        GetEntryMovementsByAccountId({
          AccountId: this.tempForm.AccountId,
        }).then((response) => {
          this.EntryMovements = response.map((curr, i, array) => {
            curr.TotalRow =
              array[i != 0 ? i - 1 : i].TotalRow - (curr.Debit - curr.Credit);
            return curr;
          });
        });
    },
    GetImage(Id) {
      GetFileByObjId({ TableName: "Vendor", ObjId: Id })
        .then((response) => {
          if (response) this.tempForm.Avatar = response.File;
          else this.tempForm.Avatar = this.$store.getters.CompanyInfo.Logo;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    setTagsViewTitle() {
      const title = "";
      const route = Object.assign({}, this.tempRoute, {
        title: `${title}-${this.tempForm.Name}`,
      });
      this.$store.dispatch("tagsView/updateVisitedView", route);
    },
    setPageTitle() {
      const title = "";
      document.title = `${title} - ${this.tempForm.Name}`;
    },
  },
};
</script>
<style>
.el-date-editor.el-input,
.el-input__inner {
  width: 100%;
}
.el-col-8 {
  margin-left: 15px;
}
/*
.el-input.is-disabled .el-input__inner {
  color: #3399a5;
  font-weight: 650;
}*/
.BlackList {
  background: #ff1100;
}
.el-tabs__content {
  max-height: 700px;
}
</style>
