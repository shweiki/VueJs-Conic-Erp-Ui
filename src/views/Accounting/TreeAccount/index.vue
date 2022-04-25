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
                v-bind:Code="
                  Selected.Code + ((Selected.children.length || 0) + 1)
                "
                :ParentId="Selected.Code"
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
              node-key="Code"
              default-expand-all
              accordion
              show-checkbox
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
              <span class="custom-tree-node" slot-scope="{ data }">
                <span style="color: black"
                  >({{ data.Code }}) {{ data.Name }}
                </span>
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
      return data.Name.indexOf(value) !== -1 || data.Code.indexOf(value) !== -1;
    },

    getdata() {
      this.loading = true;
      GetTreeAccount()
        .then((response) => {
          // handle success
          this.Tree = this.generateTree(response);
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
      list = list.sort((a, b) =>
        a.Code.length > b.Code.length
          ? 1
          : b.Code.length > a.Code.length
          ? -1
          : 0
      );
      for (i = 0; i < list.length; i += 1) {
        list[i].Code = parseInt(list[i].Code);
        map[list[i].Code] = i; // initialize the map
        list[i].children = []; // initialize the children
      }
      console.log(list);

      console.log(map);

      // for (i = list.length - 1; i >= 0; i--) {
      for (i = 0; i < list.length; i += 1) {
        node = list[i];
        if (
          node.ParentId !== 0 &&
          map[node.ParentId] != undefined &&
          node.ParentId !== node.Code
        ) {
          // if you have dangling branches check that map[node.parentId] exists
          console.log(list[map[node.ParentId]]);

          list[map[node.ParentId]].children.push(node);

          list[map[node.ParentId]].TotalCredit += node.TotalCredit;
          list[map[node.ParentId]].TotalDebit += node.TotalDebit;
        } else {
          roots.push(node);
        }
      }
      return roots;

      //   return roots.reverse();
      //  return roots.sort((a, b) =>
      //    a.Code > b.Code ? 1 : b.Code > a.Code ? -1 : 0
      //);
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
  border: outset;
    margin: 5px;
}
.custom-tree-container {
  margin-top: 15px;
}
</style>
