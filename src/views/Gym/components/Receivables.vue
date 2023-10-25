<template>
  <div>
    <el-divider direction="vertical" />
    <span>{{ $t("PanelGroup.Total") }}</span>
    <el-divider direction="vertical" />
    <span>
      {{
        tableData
          .reduce((a, b) => a + (b.TotalCredit - b.TotalDebit), 0)
          .toFixed($store.getters.settings.ToFixed)
      }}
    </span>
    <el-button
      style="float: left"
      icon="el-icon-printer"
      type="success"
      @click="print(tableData)"
    />
    <el-table
      ref="multipleTable"
      v-loading="loading"
      :data="
        tableData.filter(
          (data) => !search || data.Name.toLowerCase().includes(search.toLowerCase())
        )
      "
      fit
      :default-sort="{ prop: 'totalCredit', order: 'descending' }"
      border
      height="500"
      highlight-current-row
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="#" prop="Id" width="120" align="center">
        <template slot="header" slot-scope="{}">
          <el-button type="primary" icon="el-icon-refresh" @click="getdata()" />
        </template>
      </el-table-column>
      <el-table-column prop="Name" align="center">
        <template slot="header" slot-scope="{}">
          <el-input v-model="search" :placeholder="$t('Members.Search')">
            <template slot="append">{{ tableData.length }}</template>
          </el-input>
        </template>
        <template slot-scope="scope">
          <router-link :to="'/Gym/Edit/' + scope.row.Id">
            <strong style="font-size: 10px; cursor: pointer">{{ scope.row.Name }}</strong>
          </router-link>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('Members.Phone1')"
        prop="PhoneNumber1"
        width="120"
      />

      <el-table-column
        prop="totalCredit"
        sortable
        :label="$t('Account.Credit')"
        width="120"
        align="center"
      >
        <template slot-scope="scope">{{
          scope.row.TotalCredit.toFixed($store.getters.settings.ToFixed)
        }}</template>
      </el-table-column>
      <el-table-column
        :label="$t('Account.Debit')"
        prop="totalDebit"
        sortable
        width="120"
        align="center"
      >
        <template slot-scope="scope">{{
          scope.row.TotalDebit.toFixed($store.getters.settings.ToFixed)
        }}</template>
      </el-table-column>
      <el-table-column :label="$t('Account.funds')" width="120" align="center">
        <template slot-scope="scope">{{
          (scope.row.TotalCredit - scope.row.TotalDebit).toFixed(
            $store.getters.settings.ToFixed
          )
        }}</template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { GetReceivablesMember } from '@/api/Member'
import printJS from 'print-js'

export default {
  data() {
    return {
      loading: false,
      tableData: [],
      search: ''
    }
  },
  created() {},
  methods: {
    getdata() {
      this.loading = true
      GetReceivablesMember()
        .then((response) => {
          // handle success
          console.log(response)
          this.tableData = response
        })
        .catch((error) => {
          // handle error
          console.log(error)
        })
        .finally(() => {
          this.loading = false
        })
    },
    print(data) {
      data = data.map((Item) => ({
        الرصيد: (Item.TotalCredit - Item.TotalDebit).toFixed(
          this.$store.getters.settings.ToFixed
        ),
        دائن: Item.TotalDebit.toFixed(this.$store.getters.settings.ToFixed),
        مدين: Item.TotalCredit.toFixed(this.$store.getters.settings.ToFixed),
        الاسم: Item.Name,
        رقم: Item.Id
      }))
      printJS({
        printable: data,
        properties: ['الرصيد', 'دائن', 'مدين', 'الاسم', 'رقم'],
        type: 'json',
        header:
          '<center> <h2>' +
          this.tableData
            .reduce((a, b) => a + (b.TotalCredit - b.TotalDebit), 0)
            .toFixed(this.$store.getters.settings.ToFixed) +
          "</h2></center><h3 style='float:right'>  التاريخ  : " +
          this.formatDate(new Date()) +
          '</h3>',

        gridHeaderStyle: 'color: red;  border: 2px solid #3971A5;',
        gridStyle: 'border: 2px solid #3971A5; text-align: center;'
      })
    },
    formatDate(date) {
      const d = new Date(date)
      let day = '' + d.getDate()
      let month = '' + (d.getMonth() + 1)
      const year = d.getFullYear()
      if (month.length < 2) month = '0' + month
      if (day.length < 2) day = '0' + day

      return [day, month, year].join('/')
    }
  }
}
</script>

<style lang="scss" scoped>
.panel-group {
  margin-top: 18px;

  .card-panel-col {
    margin-bottom: 32px;
  }

  .card-panel {
    height: 108px;
    cursor: pointer;
    font-size: 14px;
    position: relative;
    overflow: hidden;
    color: #009432;
    background: #fff;
    border-color: rgba(0, 0, 0, 0.05);
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.3);

    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }

      .icon-people {
        background: #40c9c6;
      }

      .icon-message {
        background: #36a3f7;
      }

      .icon-money {
        background: #f4516c;
      }

      .icon-shopping {
        background: #34bfa3;
      }
    }

    .icon-people {
      color: #40c9c6;
    }

    .icon-message {
      color: #36a3f7;
    }

    .icon-money {
      color: #f4516c;
    }

    .icon-shopping {
      color: #34bfa3;
    }

    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }

    .card-panel-icon {
      float: left;
      font-size: 48px;
    }

    .card-panel-description {
      float: right;
      font-weight: bold;
      margin: 26px;
      margin-left: 0px;

      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }

      .card-panel-num {
        font-size: 20px;
      }
    }
  }
}

@media (max-width: 550px) {
  .card-panel-description {
    display: none;
  }

  .card-panel-icon-wrapper {
    float: none !important;
    width: 100%;
    height: 100%;
    margin: 0 !important;

    .svg-icon {
      display: block;
      margin: 14px auto !important;
      float: none !important;
    }
  }
}
</style>
