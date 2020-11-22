<template>
  <div>
    <el-card class="box-card">
      <el-divider direction="vertical"></el-divider>
      <span>المجموع</span>
      <el-divider direction="vertical"></el-divider>
      <span>
        {{tableData.reduce(
        (a, b) =>
        a +
        (b.totalCredit - b.totalDebit),
        0
        ).toFixed(3)}}
      </span>
      <el-button
        style="float: left;"
        icon="el-icon-printer"
        type="success"
        @click="print(tableData)"
      ></el-button>
    </el-card>
    <el-table
      v-loading="loading"
      :data="tableData.filter(data => !search || data.name.toLowerCase().includes(search.toLowerCase()))"
      fit
      :default-sort="{prop: 'totalCredit', order: 'descending'}"
      border
      height="500"
      highlight-current-row
      ref="multipleTable"
    >
      <el-table-column type="selection" width="55" align="center"></el-table-column>
      <el-table-column label="#" prop="id" width="120" align="center">
        <template slot="header" slot-scope="{}">
          <el-button type="primary" icon="el-icon-refresh" @click="getdata()"></el-button>
        </template>
      </el-table-column>
      <el-table-column prop="name" align="center">
        <template slot="header" slot-scope="{}">
          <el-input v-model="search" v-bind:placeholder="$t('Members.Search')">
            <template slot="append">{{tableData.length}}</template>
          </el-input>
        </template>
        <template slot-scope="scope">
          <router-link :to="'/Gym/Edit/'+scope.row.id">
            <strong style="font-size: 10px; cursor: pointer;">{{scope.row.name}}</strong>
          </router-link>
        </template>
      </el-table-column>
      <el-table-column v-bind:label="$t('Members.Phone1')" prop="phoneNumber1" width="120"></el-table-column>

      <el-table-column
        prop="totalCredit"
        sortable
        v-bind:label="$t('Account.Credit')"
        width="120"
        align="center"
      >
        <template slot-scope="scope">{{(scope.row.totalCredit).toFixed(3) }}</template>
      </el-table-column>
      <el-table-column
        v-bind:label="$t('Account.Debit')"
        prop="totalDebit"
        sortable
        width="120"
        align="center"
      >
        <template slot-scope="scope">{{(scope.row.totalDebit).toFixed(3) }}</template>
      </el-table-column>
      <el-table-column v-bind:label="$t('Account.funds')" width="120" align="center">
        <template slot-scope="scope">{{ (scope.row.totalCredit - scope.row.totalDebit).toFixed(3) }}</template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { GetPayablesMember } from "@/api/Member";
import printJS from "print-js";

export default {
  data() {
    return {
      loading: true,
      tableData: [],
      search: ""
    };
  },
  created() {
    this.getdata();
  },
  methods: {
    getdata() {
      this.loading = true;
      GetPayablesMember()
        .then(response => {
          // handle success
          console.log(response);
          this.tableData = response;
          this.loading = false;
        })
        .catch(error => {
          // handle error
          console.log(error);
        });
    },
    print(data) {
      data = data.map(Item => ({
        الرصيد: (Item.totalCredit - Item.totalDebit).toFixed(3),
        دائن: Item.totalDebit.toFixed(3),
        مدين: Item.totalCredit.toFixed(3),
        الاسم: Item.name,
        رقم: Item.id
      }));
      printJS({
        printable: data,
        properties: ["الرصيد", "دائن", "مدين", "الاسم", "رقم"],
        type: "json",
        header:
          "<center> <h2>" +
          this.tableData
            .reduce((a, b) => a + (b.totalCredit - b.totalDebit), 0)
            .toFixed(3) +
          "</h2></center><h3 style='float:right'>  التاريخ  : " +
          this.formatDate(new Date()) +
          "</h3>",

        gridHeaderStyle: "color: red;  border: 2px solid #3971A5;",
        gridStyle: "border: 2px solid #3971A5; text-align: center;"
      });
    },
    formatDate(date) {
      let d = new Date(date),
        day = "" + d.getDate(),
        month = "" + (d.getMonth() + 1),
        year = d.getFullYear();
      if (month.length < 2) month = "0" + month;
      if (day.length < 2) day = "0" + day;

      return [day, month, year].join("/");
    }
  }
};
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