<template>
  <div class="app-container" style="direction : rtl ">
    <el-table height="500" :data="Payments" fit border highlight-current-row>
      <el-table-column label="#" prop="Id" width="120" align="center">
        <template slot="header" slot-scope="{}">
          <el-button type="primary" icon="el-icon-refresh" @click="getdata()"></el-button>
        </template>
      </el-table-column>
      <el-table-column prop="ObjectID" label="رقم المشترك" align="center"></el-table-column>

      <el-table-column prop="Name" label="المشترك" align="center">
        <template slot-scope="scope">
          <router-link :to="'/Gym/Edit/'+scope.row.ObjectID">
            <strong style="font-size: 10px; cursor: pointer;">{{scope.row.Name}}</strong>
          </router-link>
        </template>
      </el-table-column>

      <el-table-column label="التاريخ" align="center">
        <template slot-scope="scope">
          <el-date-picker format="dd/MM/yyyy" disabled v-model="scope.row.FakeDate"></el-date-picker>
        </template>
      </el-table-column>
      <el-table-column
        prop="PaymentMethod"
        v-bind:label="$t('CashPool.Pay')"
        width="150"
        align="center"
      ></el-table-column>
      <el-table-column v-bind:label="$t('CashPool.Total')" align="center">
        <template slot-scope="scope">{{scope.row.TotalAmmount.toFixed(3) }} JOD</template>
      </el-table-column>
      <el-table-column label="#" align="center">
        <template slot-scope="scope">
          <el-button icon="el-icon-printer" type="primary" @click="printPayment(scope.row)"></el-button>
        </template>
      </el-table-column>
      <el-table-column label="الحالة" align="center">
        <template slot-scope="scope">
           <status-tag
                  :Status="scope.row.Status"
                  TableName="Payment"
                />
          <el-tag :type="scope.row.Status.ClassName">{{ scope.row.Status.ArabicOprationDescription}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="محرر" align="center" prop="EditorName"></el-table-column>
    </el-table>
  </div>
</template>

<script>
import checkPermission from "@/utils/permission";
import { PaymentMember } from "@/Report/PayPapar";
import StatusTag from "@/components/Oprationsys/StatusTag";

import printJS from "print-js";

export default {
  components :{StatusTag},
  props: {
    Payments: {
      type: Array,
      default: () => {
        return null;
      }
    }
  },
  methods: {
    checkPermission,
    printPayment(data) {
      printJS({
        printable: PaymentMember(data),
        type: "pdf",
        base64: true,
        showModal: true
      })
    }
  }
};
</script>

