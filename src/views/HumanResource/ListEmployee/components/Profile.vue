<template>
  <div class="app-container">
    <el-row v-if="tempForm">
      <el-col :span="24" :xs="24" v-loading="loading">
        <Employee-Search />
        <el-card
          class="box-card"
          v-bind:class="{ BlackList: tempForm.Status === -2 ? true : false }"
        >
          <el-row type="flex">
            <el-col :span="19">
              <Details :Employee="tempForm" />
            </el-col>

            <el-col :span="5" v-if="tempForm.Status != -2">
              <el-row type="flex">
                <el-col :span="24">
                  <Massage
                    :NumberPhone1="tempForm.PhoneNumber1"
                    :NumberPhone2="tempForm.PhoneNumber2"
                    :Email="tempForm.Email"
                  />
                </el-col>
              </el-row>
              <el-row type="flex">
                <el-col :span="24">
                  <employee-login :Name="tempForm.Name" :Id="tempForm.Id" />
                </el-col>
              </el-row>
              <el-row type="flex">
                <el-col :span="24">
                  <employee-logout :Name="tempForm.Name" :Id="tempForm.Id" />
                </el-col>
              </el-row>
              <el-col :span="24">
                <send-to-device
                  :ObjectId="tempForm.Id"
                  :Name="tempForm.Name"
                  TableName="Employee"
                />
              </el-col>
            </el-col>
          </el-row>
        </el-card>

        <el-card class="box-card">
          <el-tabs v-model="activeTab" tab-position="top" @tab-click="tabClick">
            
            <el-tab-pane label="دوامات" name="timeline">
              <span slot="label"><i class="el-icon-refresh"></i> دوامات</span>
              <DeviceLog :EmployeeId="tempForm.Id" />
            </el-tab-pane>

            <el-tab-pane label="مالية" name="account">
              <span slot="label"><i class="el-icon-refresh"></i> مالية</span>
              <Account
                :EntryMovements="EntryMovements"
                :AccountId="tempForm.AccountId"
                :EmployeeId="tempForm.Id"
                :EmployeeName="tempForm.Name"
              />
            </el-tab-pane>
           <el-tab-pane label="مستندات" name="Documents">
              <span slot="label"><i class="el-icon-refresh"></i> مستندات</span>
              <Documents :ObjectId="tempForm.Id" TableName="Employee" />
            </el-tab-pane>
            <el-tab-pane label="تواصل" name="communication">
              <span slot="label"><i class="el-icon-refresh"></i> تواصل</span>
              <Communication />
            </el-tab-pane>
             <el-tab-pane label="رواتب" name="salary">
              <span slot="label"><i class="el-icon-refresh"></i> رواتب</span>
              <Salary
                :SalaryPayment="SalaryPayment"
                :EmployeeId="tempForm.Id"
                :EmployeeName="tempForm.Name"
              />
            </el-tab-pane>
             <el-tab-pane label="دوامات" name="timeline">
              <span slot="label"><i class="el-icon-refresh"></i> دوامات</span>
              <Timeline :timeline="log" :EmployeeId="tempForm.Id" />
            </el-tab-pane>
            <el-tab-pane label="بيانات" name="Details">
              <span slot="label"><i class="el-icon-refresh"></i> بيانات</span>
              <User-Card :Employee="tempForm" />
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
import EmployeeSearch from "./EmployeeSearch.vue";
import EmployeeLogin from "./Dialogs/EmployeeLogin";
import EmployeeLogout from "./Dialogs/EmployeeLogout";
import Account from "./Account.vue";
import Salary from "./Salary.vue";
import Communication from "./Communication.vue";
import Documents from "@/components/Documents/Documents.vue";
import DeviceLog from "./DeviceLog.vue";
import { GetEmployeeById } from "@/api/Employee";
import { GetProfilePictureByObjId } from "@/api/File";
import { GetEntryMovementsByAccountId } from "@/api/EntryMovement";
import { GetSalaryByEmployeeId } from "@/api/Salary";
import checkPermission from "@/utils/permission";
import Massage from "@/components/Massage/index.vue";
import SendToDevice from "@/components/Device/SendToDevice.vue";

export default {
  name: "Profile",
  components: {
    Details,
    UserCard,
    EmployeeLogin,
    EmployeeLogout,
    Account,
    Salary,
    Communication,
    Massage,
    DeviceLog,
    EmployeeSearch,
    SendToDevice,
    Documents,
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
      SalaryPayment: [],
    };
  },
  created() {
    if (this.isEdit) {
      this.getdata(this.$route.params && this.$route.params.id);
    }
    this.tempRoute = Object.assign({}, this.$route);
  },
  methods: {
    checkPermission,
    getdata(val) {
      GetEmployeeById({ Id: val })
        .then((response) => {
          this.tempForm = response;
          this.GetImage(this.tempForm.Id);
          this.getAge();
          //this.GetMemberLogFromDevices(val);
          this.setTagsViewTitle();
          // set page title
          this.setPageTitle();

          this.loading = false;
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
      if (tab.label == "رواتب")
        GetSalaryByEmployeeId({
          EmployeeId: this.tempForm.Id,
        }).then((response) => {
          this.SalaryPayment = response.reverse();
        });
    },
    GetImage(Id) {
      GetProfilePictureByObjId({ TableName: "Employee", ObjId: Id })
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

    setTagsViewTitle() {
      const title = "موظف";
      const route = Object.assign({}, this.tempRoute, {
        title: `${title}-${this.tempForm.Id}`,
      });
      this.$store.dispatch("tagsView/updateVisitedView", route);
    },
    setPageTitle() {
      const title = "موظف";
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
.el-tabs__nav-scroll{
float: right;
direction: ltr;}
</style>
