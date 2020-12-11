<template>
  <div>
    <el-button
      type="primary"
      icon="el-icon-search"
      circle
      @click="Open = true"
    ></el-button>

    <el-dialog
      style="margin-top: -13vh"
      :show-close="false"
      title="بحث عن صنف"
      :visible.sync="Open"
    >
      <el-table
        :data="
          $store.getters.AllItems.filter(
            data =>
              !search || data.Name.toLowerCase().includes(search.toLowerCase())
          )
        "
        @row-dblclick="AddItem"
        fit
        border
        max-height="900"
        highlight-current-row
        style="width: 100%"
      >
        <el-table-column prop="Id" width="120">
          <template slot="header" slot-scope="{}">
            <el-button
              type="primary"
              icon="el-icon-refresh"
              @click="getdata()"
            ></el-button>
          </template>
        </el-table-column>
        <el-table-column
          v-bind:label="$t('Items.Barcode')"
          prop="Barcode"
          width="120"
          align="center"
        ></el-table-column>

        <el-table-column prop="Name" align="center">
          <template slot="header" slot-scope="{}">
            <el-input v-model="search" v-bind:placeholder="$t('Items.Item')" />
          </template>
        </el-table-column>

        <el-table-column width="40">
          <template slot-scope="scope">
            <edit-item :ItemID="scope.row.Id" />
          </template>
        </el-table-column>
        <el-table-column type="expand" width="30">
          <template slot-scope="props">
            <el-table :data="[props.row]">
              <el-table-column v-bind:label="$t('Items.Cost')" align="center">
                <template slot-scope="scope">
                  <i class="el-icon-money"></i>
                  {{ scope.row.CostPrice.toFixed(2) }}
                </template>
              </el-table-column>
              <el-table-column
                v-bind:label="$t('Items.Packeges')"
                align="center"
              >
                <template slot-scope="scope">
                  <i class="el-icon-money"></i>
                  {{ scope.row.OtherPrice.toFixed(2) }}
                </template>
              </el-table-column>
              <el-table-column v-bind:label="$t('Items.Retail')" align="center">
                <template slot-scope="scope">
                  <i class="el-icon-money"></i>
                  {{ scope.row.SellingPrice.toFixed(2) }}
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import store from "@/store";
import EditItem from "./EditItem";

export default {
  components: { EditItem },
  data() {
    return {
      Open: false,
      search: ""
    };
  },
  methods: {
    AddItem(row) {
     // console.log("row", row);
      this.$emit("add", row, 1);
    }
  }
};
</script>

