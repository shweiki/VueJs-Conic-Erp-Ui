<template>
  <div class="app-container">
    <el-row v-if="tempForm">
     
      <el-col :span="24" :xs="24" v-loading="loading">
        <!-- <Member-Search /> -->

        <el-card
          class="box-card"
          v-bind:class="{ BlackList: tempForm.Status === -2 ? true : false }"
        >
          <el-row>
            <el-col :span="19">
              <Details :Employee="tempForm" />
            </el-col>

            <el-col :span="5" v-if="tempForm.Status != -2">
              <!-- <el-row>
                <el-col :span="24">
                  <el-button
                    style="width: 100px"
                    type="info"
                    icon="el-icon-zoom-in"
                    @click="$router.replace({ path: '/redirect' + '/Gym/ListMember' })"
                    >جميع مشتركين</el-button
                  >
                </el-col>
              </el-row> -->

              <!-- <el-row>
                <el-col :span="24">
                  <Member-Ship-Movement
                    :MemberId="tempForm.Id"
                    :AccountId="tempForm.AccountId"
                    :Name="tempForm.Name"
                    :Enable="
                      tempForm.TotalCredit - tempForm.TotalDebit > 0 ? true : false
                    "
                  />
                </el-col>
              </el-row> -->

              <!-- <el-row>
                <el-col :span="24">
                  <Member-Pay
                    :MemberId="tempForm.Id"
                    :Name="tempForm.Name"
                    :NumberPhone1="tempForm.PhoneNumber1"
                  />
                </el-col>
              </el-row> -->

              <!-- <el-row>
                <el-col :span="24">
                  <Member-Ship-Movement-With-Pay
                    :MemberId="tempForm.Id"
                    :AccountId="tempForm.AccountId"
                    :Name="tempForm.Name"
                    :NumberPhone1="tempForm.PhoneNumber1"
                    :Enable="
                      tempForm.TotalCredit - tempForm.TotalDebit > 0 ? true : false
                    "
                  />
                </el-col>
              </el-row> -->

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

              <User-Card :Employee="tempForm" />
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
import MemberSearch from "./MemberSearch.vue";


import Account from "./Account.vue";
import Communication from "./Communication.vue";

import { GetEmployeeById } from "@/api/Employee";
import { GetFileByObjId } from "@/api/File";
import { GetEntryMovementsByAccountId } from "@/api/EntryMovement";
import { GetSaleInvoiceByMemberId } from "@/api/SaleInvoice";
import checkPermission from "@/utils/permission";

import Massage from "@/components/Massage/index.vue";

export default {
  name: "Profile",
  components: {
    Details,
    UserCard,
    
    Account,
    Communication,
    Massage,
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
    checkPermission,
    getdata(val) {
      GetEmployeeById({ Id: val })
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
    GetImageMember(Id) {
      GetFileByObjId({ TableName: "Employee", ObjId: Id })
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
</style>
