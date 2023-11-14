<template>
  <el-row v-if="tempForm" type="flex">
    <el-col v-loading="loading" :span="24" :xs="24">
      <Member-Search />

      <el-card
        class="box-card"
        :class="{ BlackList: tempForm.Status === -2 ? true : false }"
      >
        <el-row type="flex">
          <el-col v-if="tempForm.Status != -2" :span="5">
            <el-row type="flex">
              <el-col :span="24">
                <el-button
                  style="width: 100px"
                  type="info"
                  icon="el-icon-zoom-in"
                  @click="$router.replace({ path: '/redirect' + '/Gym/ListMember' })"
                >جميع مشتركين</el-button>
              </el-col>
            </el-row>

            <el-row type="flex">
              <el-col :span="24">
                <Member-Ship-Movement
                  :member-id="tempForm.Id"
                  :account-id="tempForm.AccountId"
                  :name="tempForm.Name"
                  :enable="tempForm.TotalCredit - tempForm.TotalDebit > 0 ? true : false"
                  @Done="getdata"
                />
              </el-col>
            </el-row>

            <el-row type="flex">
              <el-col :span="24">
                <Member-Pay
                  :member-id="tempForm.Id"
                  :name="tempForm.Name"
                  :number-phone1="tempForm.PhoneNumber1"
                  @Done="getdata"
                />
              </el-col>
            </el-row>

            <el-row type="flex">
              <el-col :span="24">
                <Member-Ship-Movement-With-Pay
                  :member-id="tempForm.Id"
                  :account-id="tempForm.AccountId"
                  :name="tempForm.Name"
                  :number-phone1="tempForm.PhoneNumber1"
                  :enable="tempForm.TotalCredit - tempForm.TotalDebit > 0 ? true : false"
                  @Done="getdata"
                />
              </el-col>
            </el-row>

            <el-row type="flex">
              <el-col :span="24">
                <Service-Invoice :member-id="tempForm.Id" />
              </el-col>
            </el-row>

            <el-row type="flex">
              <el-col :span="24">
                <Massage
                  :number-phone1="tempForm.PhoneNumber1"
                  :number-phone2="tempForm.PhoneNumber2"
                  :email="tempForm.Email"
                />
              </el-col>
            </el-row>

            <el-row v-if="tempForm.MembershipsCount > 0 || checkPermission(['admin'])">
              <el-col :span="24">
                <send-to-device
                  :object-id="tempForm.Id"
                  :name="tempForm.Name"
                  table-name="Member"
                />
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="19">
            <Details :member="tempForm" />
          </el-col>
        </el-row>
      </el-card>

      <el-card class="box-card">
        <el-tabs v-model="activeTab" tab-position="top" @tab-click="tabClick">
          <el-tab-pane label="تواصل" name="communication">
            <span slot="label"><i class="el-icon-refresh" /> تواصل</span>
            <Communication />
          </el-tab-pane>

          <el-tab-pane label="مستندات" name="Documents">
            <span slot="label"><i class="el-icon-refresh" /> مستندات</span>
            <Documents :object-id="tempForm.Id" table-name="Member" />
          </el-tab-pane>

          <el-tab-pane label="مالية" name="account">
            <span slot="label"><i class="el-icon-refresh" /> مالية</span>
            <Account :entry-movements="EntryMovements" :account-id="tempForm.AccountId" />
          </el-tab-pane>
          <el-tab-pane label="مبيعات" name="SaleInvoice">
            <span slot="label"><i class="el-icon-refresh" /> مبيعات</span>
            <Sale-Invoice :service-invoices="ServiceInvoices" />
          </el-tab-pane>
          <el-tab-pane label="مقبوضات" name="Payment">
            <span slot="label"><i class="el-icon-refresh" /> مقبوضات</span>
            <Payment :payments="Payments" />
          </el-tab-pane>

          <el-tab-pane label="خدمات" name="Service">
            <span slot="label"><i class="el-icon-refresh" /> خدمات</span>
            <Service :service-invoices="ServiceInvoices" />
          </el-tab-pane>

          <el-tab-pane label="زيارات" name="timeline">
            <span slot="label"><i class="el-icon-refresh" /> زيارات</span>
            <TimeLine table-name="Member" :user-id="tempForm.Id" />
          </el-tab-pane>
          <el-tab-pane label="اشتراكات" name="activity">
            <span slot="label"><i class="el-icon-refresh" /> اشتراكات</span>
            <Activity
              :membership-movements="MembershipMovements"
              @Done="GetMembershipMovement"
            />
          </el-tab-pane>

          <el-tab-pane label="بيانات" name="Details">
            <span slot="label"><i class="el-icon-refresh" /> بيانات</span>
            <User-Card :member="tempForm" />
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </el-col>
  </el-row>
</template>

<script>
import Details from './Details.vue'
import UserCard from './UserCard.vue'
import MemberShipMovementWithPay from './Dialogs/MemberShipMovementWithPay.vue'
import MemberShipMovement from './Dialogs/MemberShipMovement.vue'
import MemberPay from './Dialogs/MemberPay.vue'
import ServiceInvoice from './Dialogs/ServiceInvoice.vue'
import MemberSearch from '@/components/Member/MemberSearch.vue'
import Payment from './Payment.vue'
import SaleInvoice from './SaleInvoice.vue'
import Activity from './Activity.vue'
import Account from './Account.vue'
import Service from './Service.vue'
import TimeLine from './TimeLine.vue'
import Communication from './Communication.vue'
import Documents from '@/components/Documents/Documents.vue'

import { GetMemberById } from '@/api/Member'
import { GetMembershipMovementByMemberId } from '@/api/MembershipMovement'
import { GetPaymentsByMemberId } from '@/api/Payment'
import { GetEntryMovementsByAccountId } from '@/api/EntryMovement'
import { GetSaleInvoiceByMemberId } from '@/api/SaleInvoice'
import SendToDevice from '@/components/Device/SendToDevice.vue'

import checkPermission from '@/utils/permission'

import Massage from '@/components/Massage/index.vue'

export default {
  name: 'Profile',
  components: {
    Details,
    UserCard,
    Activity,
    Account,
    Service,
    Payment,
    Communication,
    MemberShipMovement,
    MemberShipMovementWithPay,
    MemberPay,
    ServiceInvoice,
    Massage,
    MemberSearch,
    SendToDevice,
    Documents,
    SaleInvoice,
    TimeLine
  },
  props: {
    isEdit: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      activeTab: 'Details',
      loading: true,
      tempRoute: {},
      tempForm: null,
      MembershipMovements: [],
      Payments: [],
      EntryMovements: [],
      ServiceInvoices: [],
      SaleInvoices: [],
      log: []
    }
  },
  created() {
    if (this.isEdit) {
      this.getdata(this.$route.params && this.$route.params.id)
      // console.log(this.$route.params )
    }
    this.tempRoute = Object.assign({}, this.$route)
  },
  methods: {
    checkPermission,
    getdata(val = this.$route.params && this.$route.params.id) {
      GetMemberById({ Id: val })
        .then((response) => {
          response.Id = response.Id.toString()

          this.tempForm = response
          this.getAge()
          this.loading = false
          this.setTagsViewTitle()
          // set page title
          this.setPageTitle()
        })
        .catch((err) => {
          console.log(err)
        })
    },
    tabClick(tab, event) {
      if (tab.label === 'اشتراكات') this.GetMembershipMovement()
      if (tab.label === 'مقبوضات') {
        GetPaymentsByMemberId({
          MemberId: this.tempForm.Id
        }).then((response) => {
          this.Payments = response.reverse()
        })
      }
      if (tab.label === 'مبيعات') {
        GetSaleInvoiceByMemberId({
          Id: this.tempForm.Id,
          IsService: false
        }).then((response) => {
          this.ServiceInvoices = response.reverse()
        })
      }
      if (tab.label === 'مالية') {
        GetEntryMovementsByAccountId({
          AccountId: this.tempForm.AccountId
        }).then((response) => {
          this.EntryMovements = response.map((curr, i, array) => {
            curr.TotalRow =
              array[i !== 0 ? i - 1 : i].TotalRow - (curr.Debit - curr.Credit)
            return curr
          })
        })
      }
      if (tab.label === 'خدمات') {
        GetSaleInvoiceByMemberId({
          Id: this.tempForm.Id,
          IsService: true
        }).then((response) => {
          console.log('log :', response)
          this.ServiceInvoices = response.reverse()
        })
      }
    },
    GetMembershipMovement() {
      GetMembershipMovementByMemberId({
        MemberId: this.tempForm.Id
      }).then((response) => {
        this.MembershipMovements = response.reverse()
      })
    },
    getAge() {
      var today = new Date()
      var birthDate = new Date(this.tempForm.DateofBirth)
      var age = today.getFullYear() - birthDate.getFullYear()
      var m = today.getMonth() - birthDate.getMonth()
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age = age - 1
      }

      this.tempForm.Age = age
    },

    setTagsViewTitle() {
      const title = this.$t('route.EditMember')
      const route = Object.assign({}, this.tempRoute, {
        title: `${title}-${this.tempForm.Id}`
      })
      this.$store.dispatch('tagsView/updateVisitedView', route)
    },
    setPageTitle() {
      const title = this.$t('route.EditMember')
      document.title = `${title} - ${this.tempForm.Id}`
    }
  }
}
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

.el-tabs__nav-scroll {
  float: right;
  direction: ltr;
}
</style>
