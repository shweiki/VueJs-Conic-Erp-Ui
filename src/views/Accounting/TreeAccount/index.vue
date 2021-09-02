<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header">
        <el-col :span="24">
          <span>{{ $t("Account.Account") }}</span>
        </el-col>
      </div>
      <el-row type="flex">
        <el-col :span="24">
          <el-row type="flex">
            <el-col :span="10">
              <el-input placeholder="بحث عن اسم الحساب" v-model="filterText"> </el-input>
            </el-col>
            <el-col :span="3">
              <Entry-Movements-Dialog :AccountId="Selected.Id" />
            </el-col>
            <el-col :span="3">
              <Edit-Account :AccountId="Selected.Id" @Done="getdata()" />
            </el-col>
            <el-col :span="3">
              <Delete-Account :AccountId="Selected.Id" @Done="getdata()" />
            </el-col>
            <el-col :span="4">
              <Add-Account-Dialog
                v-bind:Code="Selected.Code + '-0' + (Selected.children.length + 1)"
                :ParentId="Selected.Id"
                @Done="getdata()"
              />
            </el-col>
            <Drawer-Print Type="" :Data="{}" />
            <el-col :span="4">
              <el-button
                type="primary"
                icon="el-icon-refresh"
                @click="getdata()"
              ></el-button>
            </el-col>
          </el-row>
          <div class="custom-tree-container">
            <el-tree
              :data="Tree"
              node-key="Id"
              accordion
              icon-class="el-icon-folder"
              :filter-node-method="filterNode"
              @node-click="Select"
              ref="AccountTree"
            >
              <span class="custom-tree-node" slot-scope="{ data }">
                <span style="color: black">({{ data.Code }}) {{ data.Name }} </span>

                <span>
                  <span style="color: red">{{
                    (data.TotalCredit - data.TotalDebit).toFixed(
                      $store.getters.settings.ToFixed
                    )
                  }}</span>
                </span>
              </span>
            </el-tree>
          </div>
        </el-col>
      </el-row>
    </el-card>
    <el-row>
      <el-col :span="24"> <create /> </el-col
    ></el-row>
  </div>
</template>
<script>
import { GetTreeAccount } from "@/api/Account";
import EditAccount from "./EditAccount.vue";
import AddAccountDialog from "@/components/TreeAccount/AddAccountDialog.vue";
import Create from "../EntryAccounting/Create.vue";
import EntryMovementsDialog from "./EntryMovementsDialog.vue";
import DrawerPrint from "@/components/PrintRepot/DrawerPrint.vue";
import DeleteAccount from "./DeleteAccount.vue";

export default {
  components: {
    EditAccount,
    AddAccountDialog,
    Create,
    EntryMovementsDialog,
    DrawerPrint,
    DeleteAccount,
  },
  name: "TreeAccount",
  watch: {
    filterText(val) {
      this.$refs["AccountTree"].filter(val);
    },
  },
  data() {
    return {
      Selected: {
        Code: "0",
        Description: "",
        Id: 0,
        Name: "",
        ParentId: 0,
        Status: 0,
        TotalCredit: 0,
        TotalDebit: 0,
        Type: "",
        children: [],
      },
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
    Select(v) {
      this.Selected = v;
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

      // for (i = list.length - 1; i >= 0; i--) {
      for (i = 0; i < list.length; i += 1) {
        node = list[i];
        if (node.ParentId !== 0) {
          // if you have dangling branches check that map[node.parentId] exists
          list[map[node.ParentId]].children.push(node);

          list[map[node.ParentId]].TotalCredit += node.TotalCredit;
          list[map[node.ParentId]].TotalDebit += node.TotalDebit;
        } else {
          roots.push(node);
        }
      }
      //   return roots.reverse();
      return roots.sort((a, b) => (a.Code > b.Code ? 1 : b.Code > a.Code ? -1 : 0));
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
.custom-tree-container {
  margin-top: 15px;
}
</style>
