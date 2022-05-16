<template>
  <div class="app-container">
    <el-card v-loading="loading" class="box-card">
      <div slot="header">
        <el-col :span="24">
          <span>{{ $t("Account.Account") }}</span>
        </el-col>
      </div>
      <el-row type="flex">
        <el-col :span="24">
          <el-row type="flex">
            <el-col :span="10">
              <el-input placeholder="بحث عن اسم الحساب" v-model="filterText">
              </el-input>
            </el-col>
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
              icon-class="el-icon-folder"
              :filter-node-method="filterNode"
              @node-click="Select"
              @node-drag-start="handleDragStart"
              @node-drag-enter="handleDragEnter"
              @node-drag-leave="handleDragLeave"
              @node-drag-over="handleDragOver"
              @node-drag-end="handleDragEnd"
              @node-drop="handleDrop"
              draggable
              :allow-drop="allowDrop"
              :allow-drag="allowDrag"
              ref="AccountTree"
            >
              <div class="custom-tree-node" slot-scope="{ data }">
                <el-col :span="14" style="color: black"
                  >({{ data.Code }}) {{ data.Name }}
                </el-col>

                <el-col :span="18">
                  <el-col :span="4">
                    <Entry-Movements-Dialog :AccountId="data.Id" />
                  </el-col>
                  <el-col :span="4">
                    <Edit-Account :AccountId="data.Id" @Done="getdata()" />
                  </el-col>
                  <el-col :span="4">
                    <Delete-Account :AccountId="data.Id" @Done="getdata()" />
                  </el-col>
                  <el-col :span="4">
                    <Add-Account-Dialog
                      v-bind:Code="
                        data.Code +
                        ((data.children.length != null
                          ? data.children.length
                          : 0) +
                          1)
                      "
                      :ParentId="data.Code"
                      @Done="getdata()"
                    />
                  </el-col>
                </el-col>
                <el-col :span="18" :gutter="20">
                  <el-col :span="6" style="color: green">{{
                    calcCreditDebitParent(
                      data.children,
                      data.TotalCredit,
                      data.TotalDebit
                    ).TotalCredit -
                    calcCreditDebitParent(
                      data.children,
                      data.TotalCredit,
                      data.TotalDebit
                    ).TotalDebit
                  }}</el-col>
                  <el-col :span="6" style="color: red">{{
                    calcCreditDebitParent(
                      data.children,
                      data.TotalCredit,
                      data.TotalDebit
                    ).TotalDebit
                  }}</el-col>
                  <el-col :span="6" style="color: blue">{{
                    calcCreditDebitParent(
                      data.children,
                      data.TotalCredit,
                      data.TotalDebit
                    ).TotalCredit
                  }}</el-col>
                </el-col>
              </div>
            </el-tree>
          </div>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>
<script>
import { GetTreeAccount, EditParent } from "@/api/Account";
import EditAccount from "./EditAccount.vue";
import AddAccountDialog from "@/components/TreeAccount/AddAccountDialog.vue";
import EntryMovementsDialog from "./EntryMovementsDialog.vue";
import DrawerPrint from "@/components/PrintRepot/DrawerPrint.vue";
import DeleteAccount from "./DeleteAccount.vue";

export default {
  components: {
    EditAccount,
    AddAccountDialog,
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
      loading: false,

      Selected: {
        Code: "0",
        Description: "",
        Id: 0,
        Name: "",
        ParentId: "",
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
      // console.log("value", value, data);
      data.Name = data.Name == null ? "" : data.Name;
      return (
        data.Name.indexOf(value) !== -1 ||
        data.Code.toString().indexOf(value) !== -1
      );
    },

    getdata() {
      this.loading = true;
      GetTreeAccount()
        .then(async (response) => {
          // handle success
          var generateTree = this.generateTree(response);

          this.Tree = generateTree;
          console.log("this.Tree", this.Tree);

          this.loading = false;
        })
        .catch((error) => {
          // handle error
          this.loading = false;

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
      list = list.sort((a, b) => {
        //console.log(a.Code);
        //  a.Code = a.Code.toString().match(/\d+/);
        return a.Code.length > b.Code.length
          ? 1
          : b.Code.length > a.Code.length
          ? -1
          : 0;
      });

      for (i = 0; i < list.length; i += 1) {
        list[i].Code = parseInt(list[i].Code);
        map[list[i].Code] = i; // initialize the map
        list[i].children = []; // initialize the children
      }
      //console.log(list);

      // console.log(map);

      // for (i = list.length - 1; i >= 0; i--) {
      for (i = 0; i < list.length; i += 1) {
        node = list[i];
        if (
          node.ParentId !== 0 &&
          map[node.ParentId] != undefined &&
          node.ParentId !== node.Code
        ) {
          // if you have dangling branches check that map[node.parentId] exists
          //  console.log(list[map[node.ParentId]]);

          list[map[node.ParentId]].children.push(node);
        } else {
          roots.push(node);
        }
      }
      return roots;
    },
    calcCreditDebitParent(tree = [], Credit, Debit) {
      var Total = { TotalCredit: Credit, TotalDebit: Debit };
      var node, i, Balancecarried;
      for (i = 0; i < tree.length; i += 1) {
        node = tree[i];

        if (node.children.length > 0) {
          var newTotal = this.calcCreditDebitParent(
            node.children,
            Credit,
            Debit
          );

          Total.TotalCredit += newTotal.TotalCredit;
          Total.TotalDebit += newTotal.TotalDebit;
        } else {
          Balancecarried = node.TotalCredit - node.TotalDebit;
          Total.TotalCredit +=
            Balancecarried > 0 ? Math.abs(Balancecarried) : 0;
          Total.TotalDebit += Balancecarried < 0 ? Math.abs(Balancecarried) : 0;
        }
      }
      return Total;
    },
    handleDragStart(node, ev) {
      this.Selected = node;

      console.log("drag start", node);
    },
    handleDragEnter(draggingNode, dropNode, ev) {
      console.log("tree drag enter: ", dropNode.data.Name);
    },
    handleDragLeave(draggingNode, dropNode, ev) {
      console.log("tree drag leave: ", dropNode.data.Name);
    },
    handleDragOver(draggingNode, dropNode, ev) {
      console.log("tree drag over: ", dropNode.data.Name);
    },
    handleDragEnd(draggingNode, dropNode, dropType, ev) {
      console.log("tree drag end: ", dropNode && dropNode.data.Name, dropType);
    },
    handleDrop(draggingNode, dropNode, dropType, ev) {
      EditParent({ ID: this.Selected.data.Id, ParentId: dropNode.data.Code })
        .then((response) => {
          this.$notify({
            title: "تم ",
            message: "تم الإضافة بنجاح",
            type: "success",
            duration: 2000,
          });
        })
        .catch((error) => {
          console.log(error);
        });
      console.log("tree drop: ", dropNode.data.Name, dropType);
    },
    allowDrop(draggingNode, dropNode, type) {
      if (dropNode.data.Name === "Level two 3-1") {
        return type !== "inner";
      } else {
        return true;
      }
    },
    allowDrag(draggingNode) {
      return draggingNode.data.Name.indexOf("Level three 3-1-1") === -1;
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
  margin: 10px;
}
.custom-tree-container {
  margin-top: 15px;
}
</style>
