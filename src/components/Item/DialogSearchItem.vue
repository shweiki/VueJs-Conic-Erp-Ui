<template>
  <div>
    <el-button
      type="primary"
      icon="el-icon-search"
      circle
      @click="Open = true"
    ></el-button>

    <el-dialog
      width="80%"
      style="margin-top: -13vh"
      :show-close="false"
      title="بحث عن صنف"
      :visible.sync="Open"
      @closed="focus"
    >
      <item-view />
      <el-table
        :data="[]"
        @row-dblclick="AddItem"
        fit
        border
        max-height="500"
        highlight-current-row
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
          width="160"
          align="center"
        ></el-table-column>

        <el-table-column prop="Name" align="center">
          <template slot="header" slot-scope="{}">
            <el-input v-model="search" v-bind:placeholder="$t('Items.Item')" />
          </template>
        </el-table-column>

        <el-table-column width="40">
          <template slot-scope="scope">
            <edit-item :ItemId="scope.row.Id" />
          </template>
        </el-table-column>
        <el-table-column type="expand" width="30">
          <template slot-scope="props">
            <el-table :data="[props.row]">
              <el-table-column v-bind:label="$t('Items.Cost')" align="center">
                <template slot-scope="scope">
                  <i class="el-icon-money"></i>
                  {{
                    scope.row.CostPrice.toFixed($store.getters.settings.ToFixed)
                  }}
                </template>
              </el-table-column>
              <el-table-column
                v-bind:label="$t('Items.Packeges')"
                align="center"
              >
                <template slot-scope="scope">
                  <i class="el-icon-money"></i>
                  {{
                    scope.row.OtherPrice.toFixed(
                      $store.getters.settings.ToFixed
                    )
                  }}
                </template>
              </el-table-column>
              <el-table-column v-bind:label="$t('Items.Retail')" align="center">
                <template slot-scope="scope">
                  <i class="el-icon-money"></i>
                  {{
                    scope.row.SellingPrice.toFixed(
                      $store.getters.settings.ToFixed
                    )
                  }}
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
import EditItem from "./EditItem";
import ItemView from "@/views/Inventory/Item/index";
export default {
  components: { EditItem, ItemView },
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
      this.Open = false;
    },
    focus() {
      this.$emit("focus");
    }
  }
};
</script>
