<template>
  <div>
    <el-button
      style="width: 100px"
      type="warning"
      icon="el-icon-s-platform"
      @click="OpenDialog()"
    >
      صلاحيات</el-button
    >
    <el-dialog
      style="margin-top: -13vh"
      title="صلاحيات توجه"
      :visible.sync="dialogVisible"
    >
      <el-form label-width="80px" label-position="left">
        <el-form-item label="Menus">
          <el-tree
            ref="tree"
            :check-strictly="checkStrictly"
            :data="routesData"
            :props="defaultProps"
            show-checkbox
            node-key="path"
            class="permission-tree"
          />
        </el-form-item>
      </el-form>
      <div style="text-align: right">
        <el-button type="danger" @click="dialogVisible = false"
          >Cancel</el-button
        >
        <el-button type="primary" @click="confirmRouter">Confirm</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import path from "path";
import { deepClone } from "@/utils";
import { AddUserRouter, getRoutes } from "@/api/Role";

export default {
  props: {
    UserID: {
      type: String,
      default: '',
    },
    Router: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      routes: [],
      dialogVisible: false,
      checkStrictly: false,
      defaultProps: {
        children: "children",
        label: "title",
      },
    };
  },
  computed: {
    routesData() {
      return this.routes;
    },
  },
  created() {
    this.getRoutes();

  },
  methods: {
    OpenDialog(){
    this.checkStrictly = true;
    this.$nextTick(() => {
      console.log(this.Router);
      this.$refs.tree.setCheckedKeys(JSON.parse(this.Router));

      this.checkStrictly = false;
    })
    this.dialogVisible= true
    },
    async getRoutes() {
      const res = await getRoutes();
      this.serviceRoutes = res;
      this.routes = this.generateRoutes(res);
    },
    confirmRouter() {
      AddUserRouter({
        UserID: this.UserID,
        Router: JSON.stringify(this.$refs.tree.getCheckedKeys()),
      })
        .then((response) => {
          this.dialogVisible = false;
          this.$notify({
            title: "تم ",
            message: "تم الإضافة بنجاح",
            type: 'success',
            duration: 2000,
          })
        })
        .catch((error) => {
          console.log(error);
        })
    },
    // Reshape the routes structure so that it looks the same as the sidebar
    generateRoutes(routes, basePath = "/") {
      const res = [];

      for (let route of routes) {
        // skip some route
        if (route.hidden) {
          continue;
        }

        const onlyOneShowingChild = this.onlyOneShowingChild(
          route.children,
          route
        );

        if (route.children && onlyOneShowingChild && !route.alwaysShow) {
          route = onlyOneShowingChild;
        }

        const data = {
          path: path.resolve(basePath, route.path),
          title: route.meta && route.meta.title,
        };

        // recursive child routes
        if (route.children) {
          data.children = this.generateRoutes(route.children, data.path);
        }
        res.push(data);
      }
      return res;
    },
    generateArr(routes) {
      let data = [];
      routes.forEach((route) => {
        data.push(route);
        if (route.children) {
          const temp = this.generateArr(route.children);
          if (temp.length > 0) {
            data = [...data, ...temp];
          }
        }
      })
      return data;
    },

    generateTree(routes, basePath = "/", checkedKeys) {
      const res = [];
      for (const route of routes) {
        const routePath = path.resolve(basePath, route.path);

        // recursive child routes
        if (route.children) {
          route.children = this.generateTree(
            route.children,
            routePath,
            checkedKeys
          );
        }

        if (
          checkedKeys.includes(routePath) ||
          (route.children && route.children.length >= 1)
        ) {
          res.push(route);
        }
      }
      return res;
    },

    // reference: src/view/layout/components/Sidebar/SidebarItem.vue
    onlyOneShowingChild(children = [], parent) {
      let onlyOneChild = null;
      const showingChildren = children.filter((item) => !item.hidden);

      // When there is only one child route, the child route is displayed by default
      if (showingChildren.length === 1) {
        onlyOneChild = showingChildren[0];
        onlyOneChild.path = path.resolve(parent.path, onlyOneChild.path);
        return onlyOneChild;
      }

      // Show parent if there are no child route to display
      if (showingChildren.length === 0) {
        onlyOneChild = { ...parent, path: '', noShowingChildren: true };
        return onlyOneChild;
      }

      return false;
    },
  },
};
</script>

<style lang="scss" scoped>
.app-container {
  .roles-table {
    margin-top: 30px;
  }
  .permission-tree {
    margin-bottom: 30px;
  }
}
</style>
