<template>
  <div class="app-container">
    <div class="filter-container">

      <el-row type="flex" >

            <el-col :span="16">
        <div style="padding-bottom: 8px;">
        <el-date-picker
                  v-model="dateValue"
                  :format="$store.getters.settings.DateTimeFormat"
                  type="daterange"
                  align="left"
                  unlink-panels
                  :range-separator="$t('Sales.until')"
                  :start-placeholder="$t('Sales.From')"
                  :end-placeholder="$t('Sales.To')"
                  :default-time="['00:00:00', '23:59:59']"
                  style="width: 100%"
                />
              </div>
            </el-col>
            <el-col :span="8">
          <div v-if="dateValue.length < 1" style="width: 50px;"> </div>
          <p style="font-size: 12px; padding-right: 16px;" v-if="dateValue.length > 0">
              مجموع الايام حسب الفترة المطلوبة
              {{
                Math.round(
                  Math.abs(
                    (new Date(dateValue[0]) - new Date(dateValue[1])) /
                      (24 * 60 * 60 * 1000)
                  )
                )
              }}
              ايام
            </p>
            </el-col>
      </el-row>

      <!-- <i class="fas fa-filter" @click="toggleFilter"></i> -->
      <!-- <el-row type="flex" v-if="showFilter"> -->
      <el-row type="flex">

        <el-col :span="4">
          <div style="justify-items: right;; display: grid; ">
          <label style="font-size: 12px; margin-bottom: 8px;">اسم المستخدم</label>
          <user-select
              @Set="
                (v) => {
                  listQuery.User = v;
                  handleFilter();
                }
              "
            />
        </div>
        </el-col>

        <el-col :span="4">
          <div style="justify-items: right; display: grid; width: 130px">
          <label style="font-size: 12px; margin-bottom: 8px;">الإشتراك</label>
          <el-select v-model="membershipModel" class="filter-item"  @change="val => setMembership(val)">
            <el-option
              v-for="item in membershipOptions"
              :key="item.Id"
              :label="item.Name"
              :value="item.Name"
            />
          </el-select>
        </div>
        </el-col>
        <!-- <button @click="applyFilter">Apply</button>
        <button @click="resetFilter">Reset</button> -->
      </el-row>

      </div>

    <!-- Totals -->
    <el-row type="flex">
       <el-col v-permission="['admin']" :span="24">
        <el-divider direction="vertical"></el-divider>
        <span>{{ $t("Vendors.PersonsCount") }}</span>
        <el-divider direction="vertical"></el-divider>
        <span>{{ userAccountTotalsModel.Rows }}</span>
        <el-divider direction="vertical"></el-divider>

        <span>{{ $t("Vendors.TotalCredit") }}</span>
        <el-divider direction="vertical"></el-divider>
        <span>{{ userAccountTotalsModel.Credit.toFixed($store.getters.settings.ToFixed) }} JOD</span>
        <el-divider direction="vertical"></el-divider>

        <span>{{ $t("Vendors.TotalDebit") }}</span>
        <el-divider direction="vertical"></el-divider>
        <span>{{ userAccountTotalsModel.Debit.toFixed($store.getters.settings.ToFixed) }} JOD</span>
        <el-divider direction="vertical"></el-divider>

        <span>{{ $t("MinOrd.Balance") }}</span>
        <el-divider direction="vertical"></el-divider>
        <span>{{ userAccountTotalsModel.Totals.toFixed($store.getters.settings.ToFixed) }} JOD</span>
        <el-divider direction="vertical"></el-divider>
      </el-col> 
    </el-row>

    <!-- Tables -->
    <el-table
        v-loading="listLoading"
        :data="tableData"
        fit
        border
        highlight-current-row
        style="width: 100%"
      >
        <el-table-column
          v-bind:label="$t('Accounting.EntryId')"
          prop="Id"
          width="120"
          align="center"
        >
          <template slot-scope="{ row }">
            <el-tag type="primary" disable-transitions>
              <!-- <strong
                style="font-size: 10px; cursor: pointer"
                @click="
                  () => {
                    let r = $router.resolve({
                      path: '/EntryAccounting/Edit/' + row.Id,
                    });
                    window.open(
                      r.href,
                      r.route.name,
                      $store.getters.settings.windowStyle
                    );
                  }
                ">-->
               <strong
                >{{ row.Id }}</strong
              > 
              </el-tag
            >
          </template>
        </el-table-column>

        <el-table-column label="من تاريخ" align="center" width="140">
          <template slot-scope="{ row }">
            <span>{{ row.StartDate | parseTime("{y}-{m}-{d} {h}:{i}") }}</span>
          </template>
        </el-table-column>
        <el-table-column label="الى تاريخ" align="center" width="140">
          <template slot-scope="{ row }">
            <span>{{ row.EndDate | parseTime("{y}-{m}-{d} {h}:{i}") }}</span>
          </template>
        </el-table-column>

        <el-table-column
          label="اسم المنشأ"
          prop="CreatedBy"
          align="center"
        ></el-table-column>

        <!-- <el-table-column label="اخر تعديل" align="center" width="140">
          <template slot-scope="{ row }">
            <span>{{ row.LastModified | parseTime("{y}-{m}-{d} {h}:{i}") }}</span>
          </template>
        </el-table-column>

        <el-table-column
          label="اسم المعدل"
          prop="LastModifiedBy"
          align="center"
        ></el-table-column> -->

        <el-table-column
          v-bind:label="$t('Accounting.Notes')"
          prop="Description"
          align="center"
        ></el-table-column>

        <el-table-column v-bind:label="$t('Sales.Status')" width="120" align="center">
          <template slot-scope="scope">
            <Status-Tag :status="scope.row.Status" tableName="MembershipMovement" />
          </template>
        </el-table-column>

        <el-table-column type="expand" align="center">
            <template slot-scope="props">
          <el-table :data="[props.row]">
              <el-table-column
                label="النوع"
                prop="Type"
                align="center"
              >
              </el-table-column>
            
              <el-table-column
                label="الزيارات"
                prop="VisitsUsed"
                align="center"
              >
              </el-table-column>
              
              <el-table-column label="الخصم" prop="Discount" align="center">
                <template slot-scope="scope">{{
                  scope.row.Discount.toFixed($store.getters.settings.ToFixed)
                }}</template>

              </el-table-column>
              
              <el-table-column
                label="وصف الخصم"
                prop="DiscountDescription"
                align="center"
              >
              </el-table-column>
              
              <el-table-column label="المجموع" prop="TotalAmmount" align="center">
                <template slot-scope="scope">{{
                  scope.row.TotalAmmount.toFixed($store.getters.settings.ToFixed)
                }}</template>
              </el-table-column>
</el-table>
          </template>
        </el-table-column>
      </el-table>

    <!-- Pagination -->
    <pagination
      v-show="userAccountTotalsModel.Rows > 0"
      :total="userAccountTotalsModel.Rows"
      :page.sync="listQuery.Page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    /> 

  </div>
</template>


<script>
import UserSelect from "@/components/User/UserSelect";
import { GetMembershipMovementByCreatedUser, GetMembershipMovementByMemberId } from "@/api/MembershipMovement";
import { GetMembership } from "@/api/Membership";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
import StatusTag from "@/components/Oprationsys/StatusTag";

export default {
  name: "MovementEnquiry",
  components: {
    UserSelect,
    Pagination,
    StatusTag
  },
  data() {
    return {
      showFilter: false,
      listLoading: false,
      editorUserModel: '',
      dateValue:'',
      tableData: [],
      list: [],
      editorUsers:[],
      membershipOptions:[],
      listQuery: JSON.parse(
        localStorage.getItem("EntryAccounting_ListQuery") || null
      ) || {
        Page: 1,
        Any: "",
        limit: this.$store.getters.settings.LimitQurey,
        User: undefined,
        DateFrom: "",
        DateTo: "",
        Status: undefined,
      },
      userAccountTotalsModel: {
        Credit: 0,
        Debit: 0,
        Rows: 0,
        Totals: 0
      },
      membershipMovementModel:{
      Id:null,
      TotalAmmount: 0.0,
      Tax: 0.0,
      StartDate: new Date,
      EndDate: new Date,
      Type: '',
      VisitsUsed: 0,
      Discount: 0.0,
      Description: '',
      Status: '',
      MemberId: 0,
      MembershipId: 0,
      DiscountDescription: '',
      EditorName: '',
      Created: new Date,
      CreatedBy: '',
      IsDeleted: false,
      LastModified: new Date,
      LastModifiedBy: '',
      },
      membershipModel: {
        Description: '',
        FullDayPrice: 0,
        Id: 0,
        MaxFreezeLimitDays: 0,
        MinFreezeLimitDays: 0,
        MorningPrice: 0,
        Name: '',
        NumberDays: 0,
        Rate: 0,
        Status: 0,
        Tax: 0.01
      },
    }
  },

  created() {
    // this.getdata();
    this.getMembershipBtId()
    // this.getList()
  },
  methods: {
    getdata() {
      this.loading = true;
      get()
        .then(response => {
          // handle success
          console.log(response)
          this.tableData = response;
          this.loading = false
        })
        .catch(error => {
          // handle error
          console.log(error);
        })
    },

    handleFilter() {
      this.listQuery.Page = 1;
      this.getList();
    },

    getList() {
      this.listLoading = true;
      GetMembershipMovementByCreatedUser({MembershipId:2, DateIn:"2023-10-17 23:59:59.0000000"}).then((response) => {
        console.log('users', response)
        this.tableData = response;
        localStorage.setItem("MembershipMovement", JSON.stringify(this.tableData));

        this.listLoading = false;
      });
    },

    setMembership(val){
      console.log('setMembership', val)
    },

    getMembershipList(){
      console.log('getMembershipList')
      this.loading = true;
      GetMembership().then((response) => {
        console.log('membership', response)
        // handle success
        // this.tableData = response;
        this.membershipOptions = response
        this.loading = false;
      });
    },

    getMembershipBtId() {
      GetMembershipMovementByMemberId({MemberId:7080080}).then((response) => {
        console.log('MembershipMovement', response)
        this.tableData = response;
        localStorage.setItem("MembershipMovement", JSON.stringify(this.tableData));

        this.listLoading = false;
      });
        
    },

    toggleFilter() {
      this.showFilter = !this.showFilter;
    },
    applyFilter() {
      this.showFilter = false;
    },
    resetFilter() {
      this.showFilter = false;
    },
  },
}
      
</script>