<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-col :span="3"> <add-account-dialog @Done="getdata()" /> </el-col>
        <el-col :span="21">
          <span>{{ $t("Account.Account") }}</span>
        </el-col>
      </div>
      <div class="custom-tree-container">
        <el-button type="primary" icon="el-icon-refresh" @click="getdata()"></el-button>
        <el-col :span="6">
          <el-input placeholder="Filter keyword" v-model="filterText"> </el-input>
        </el-col>
        <div class="block">
          <el-tree
            :data="Tree"
            show-checkbox
            node-key="Id"
            accordion
            icon-class="el-icon-refresh"
            default-expand-all
            :expand-on-click-node="false"
            :filter-node-method="filterNode"
            ref="AccountTree"
          >
            <span class="custom-tree-node" slot-scope="{ data }">
              <span>({{ data.Id }}) {{ data.Name }} {{ data.Code }} </span>
              <span>
                <!--     <span>{{ data.TotalCredit }}</span>
                <span>{{ data.TotalDebit }}</span> -->
                <span>{{ data.TotalCredit - data.TotalDebit }}</span>
              </span>
              <el-col :span="2">
                <Edit-Account :AccountId="data.Id" />
              </el-col>
            </span>
          </el-tree>
        </div>
      </div>
    </el-card>
  </div>
</template>
<script>
import { GetTreeAccount } from "@/api/Account";
import EditAccount from "./EditAccount.vue";
import AddAccountDialog from "./AddAccountDialog.vue";

export default {
  components: { EditAccount, AddAccountDialog },
  name: "TreeAccount",
  watch: {
    filterText(val) {
      this.$refs["AccountTree"].filter(val);
    },
  },
  data() {
    return {
      filterText: "",
      Tree: [],
      search: "",
    };
  },
  created() {
    this.getdata();
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true;
      return data.Name.indexOf(value) !== -1 || data.Code.indexOf(value) !== -1;
    },

    getdata() {
      GetTreeAccount()
        .then((response) => {
          // handle success
          console.log(response);
          this.Tree = this.generateTree(response);
        })
        .catch((error) => {
          // handle error
          console.log(error);
        });
    },
    generateTree(list) {
      var map = {},
        node,
        roots = [],
        i;

      for (i = 0; i < list.length; i += 1) {
        map[list[i].Id] = i; // initialize the map
        list[i].children = []; // initialize the children
      }

      for (i = 0; i < list.length; i += 1) {
        node = list[i];
        if (node.ParentId !== 0) {
          // if you have dangling branches check that map[node.parentId] exists
          list[map[node.ParentId]].children.push(node);
        } else {
          roots.push(node);
        }
      }
      return roots;
    },
  },
};
</script>

<style>
.el-tree-node__children {
  margin-right: 18px;
}
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
</style>
