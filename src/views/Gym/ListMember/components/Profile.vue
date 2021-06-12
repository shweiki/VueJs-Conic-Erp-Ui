<template>
  <div class="app-container">
    <el-row v-if="tempForm">
      <el-col :span="6" :xs="24">
        <member-log />
      </el-col>
      <el-col :span="18" :xs="24" v-loading="loading">
        <member-search />

        <el-card
          class="box-card"
          v-bind:class="{ BlackList: tempForm.Status == -2 ? true : false }"
        >
          <el-row>
            <el-col :span="19">
              <Details :Member="tempForm" />
            </el-col>
            <el-col :span="5" v-if="tempForm.Status != -2">
              <el-row>
                <el-col :span="24">
                  <el-button
                    style="width: 100px"
                    type="info"
                    icon="el-icon-zoom-in"
                    @click="$router.replace({ path: '/redirect' + '/Gym/ListMember' })"
                    >جميع مشتركين</el-button
                  >
                </el-col>
              </el-row>

              <el-row>
                <el-col :span="24">
                  <member-ship-movement
                    :MemberId="tempForm.Id"
                    :AccountId="tempForm.AccountId"
                    :Name="tempForm.Name"
                    :Enable="
                      tempForm.TotalCredit - tempForm.TotalDebit > 0 ? true : false
                    "
                  />
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <member-pay :MemberId="tempForm.Id" :Name="tempForm.Name" />
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <member-ship-movement-with-pay
                    :MemberId="tempForm.Id"
                    :AccountId="tempForm.AccountId"
                    :Name="tempForm.Name"
                    :Enable="
                      tempForm.TotalCredit - tempForm.TotalDebit > 0 ? true : false
                    "
                  />
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <service-invoice :MemberId="tempForm.Id" />
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <massage
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
              <user-card :Member="tempForm" />
            </el-tab-pane>
            <el-tab-pane label="اشتراكات" name="activity">
              <activity :MembershipMovements="MembershipMovements" />
            </el-tab-pane>
            <el-tab-pane label="مقبوضات" name="Payment">
              <payment :Payments="Payments" />
            </el-tab-pane>
            <el-tab-pane label="زيارات" name="timeline">
              <timeline :timeline="log" :MemberId="tempForm.Id" />
            </el-tab-pane>
            <el-tab-pane label="مالية" name="account">
              <account :EntryMovements="EntryMovements" :AccountId="tempForm.AccountId" />
            </el-tab-pane>
            <el-tab-pane label="خدمات" name="Service">
              <service :ServiceInvoices="tempForm.ServiceInvoices" />
            </el-tab-pane>
            <el-tab-pane label="تواصل" name="communication">
              <Communication />
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import MemberLog from "./MemberLog";
import { GetUserLog } from "@/api/Device";

import Details from "./Details";
import UserCard from "./UserCard";
import MemberShipMovementWithPay from "./Dialogs/MemberShipMovementWithPay";
import MemberShipMovement from "./Dialogs/MemberShipMovement";

import MemberPay from "./Dialogs/MemberPay";
import ServiceInvoice from "./Dialogs/ServiceInvoice";
import MemberSearch from "./MemberSearch";

import Payment from "./Payment";

import Activity from "./Activity";
import Timeline from "./Timeline";
import Account from "./Account";
import Service from "./Service";
import Communication from "./Communication";

import {  GetMemberById } from "@/api/Member";
import { GetMemberLogById } from "@/api/MemberLog";
import { GetMembershipMovementByMemberId } from "@/api/MembershipMovement";
import { GetFileByObjId } from "@/api/File";
import { GetPaymentsByMemberId } from "@/api/Payment";
import { GetEntryMovementsByAccountId } from "@/api/EntryMovement";

import Massage from "@/components/Massage";

export default {
  name: "Profile",
  components: {
    Details,
    UserCard,
    Activity,
    Timeline,
    Account,
    Service,
    Payment,
    Communication,
    MemberShipMovement,
    MemberShipMovementWithPay,
    MemberPay,
    ServiceInvoice,
    MemberLog,
    Massage,
    MemberSearch,
  },
  props: {
    isEdit: {
      type: Boolean,
      default: true,
    },
  },

  data() {
    const validateRequire = (rule, value, callback) => {
      if (value === "") {
        this.$message({
          message: rule.field + "اواي",
          type: "error",
        });
        callback(new Error(rule.field + "اي"));
      } else {
        callback();
      }
    };
    const validateSourceUri = (rule, value, callback) => {
      if (value) {
        if (validURL(value)) {
          callback();
        } else {
          this.$message({
            message: "اه",
            type: "error",
          });
          callback(new Error("اوه"));
        }
      } else {
        callback();
      }
    };
    return {
      activeTab: "Details",
      loading: true,
      tempRoute: {},
      tempForm: null,
      MembershipMovements: [],
      Payments: [],
      EntryMovements: [],
      log: [],
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
      GetMemberById({ Id: val })
        .then((response) => {
          this.tempForm = response;
          this.GetImageMember(this.tempForm.Id);
          this.getAge();
          this.loading = false;
          //this.GetMemberLogFromDevices(val);
          this.setTagsViewTitle();
          // set page title
          this.setPageTitle();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    tabClick(tab, event) {
      if (tab.label == "زيارات")
        GetMemberLogById({
          Id: this.tempForm.Id,
        }).then((response) => {
          //  console.log("log :", response);
          this.log = response.reverse();
        });
      if (tab.label == "اشتراكات")
        GetMembershipMovementByMemberId({
          MemberId: this.tempForm.Id,
        }).then((response) => {
          //    console.log("log :", response);
          this.MembershipMovements = response.reverse();
        });
      if (tab.label == "مقبوضات")
        GetPaymentsByMemberId({
          MemberId: this.tempForm.Id,
        }).then((response) => {
          //   console.log("log :", response);
          this.Payments = response.reverse();
        });
      if (tab.label == "مالية")
        GetEntryMovementsByAccountId({
          AccountId: this.tempForm.AccountId,
        }).then((response) => {
          console.log("log :", response);
          this.EntryMovements = response.reverse();
        });
    },
    GetImageMember(ID) {
      GetFileByObjId({ TableName: "Member", ObjId: ID })
        .then((response) => {
          if (response) this.tempForm.Avatar = response.File;
           else this.tempForm.Avatar = this.$store.getters.CompanyInfo.Logo;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getAge() {
      var today = new Date();
      var birthDate = new Date(this.tempForm.DateofBirth);
      var age = today.getFullYear() - birthDate.getFullYear();
      var m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age = age - 1;
      }

      this.tempForm.Age = age;
    },
    GetMemberLogFromDevices(MemberId) {
      GetUserLog({
        DeviceId: this.$store.getters.Devices[0].Id,
        UserId: MemberId,
      }).then((response) => {
        if (response) {
          console.log(response);
          this.$notify({
            title: "تم",
            message:
              "تم سحب البيانات من جهاز " +
              this.$store.getters.Devices[0].Name +
              "  " +
              response +
              "",
            type: "success",
            duration: 2000,
          });
          GetUserLog({
            DeviceId: this.$store.getters.Devices[1].Id,
            UserId: MemberId,
          }).then((response) => {
            if (response) {
              console.log(response);
              this.$notify({
                title: "تم",
                message:
                  "تم سحب البيانات من جهاز " +
                  this.$store.getters.Devices[1].Name +
                  "  " +
                  response +
                  "",
                type: "success",
                duration: 2000,
              });
            }
          });
        }
      });
    },
    setTagsViewTitle() {
      const title = "Member";
      const route = Object.assign({}, this.tempRoute, {
        title: `${title}-${this.tempForm.Id}`,
      });
      this.$store.dispatch("tagsView/updateVisitedView", route);
    },
    setPageTitle() {
      const title = "Member";
      document.title = `${title} - ${this.tempForm.Id}`;
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
