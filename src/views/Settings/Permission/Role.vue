<template>
  <div class="app-container">
    <el-button type="primary" @click="handleAddRole">New Role</el-button>

    <el-table :data="rolesList" style="width: 100%; margin-top: 30px" border>
      <el-table-column align="center" label="Role Id" width="220">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="Role Name" width="220">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column align="header-center" label="NormalizedName">
        <template slot-scope="scope">
          {{ scope.row.normalizedName }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="Operations">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="handleEdit(scope)"
            >Edit</el-button
          >
          <el-button type="danger" size="small" @click="handleDelete(scope)"
            >Delete</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      :visible.sync="dialogVisible"
      :title="dialogType === 'edit' ? 'Edit Role' : 'New Role'"
    >
      <el-form :model="role" label-width="80px" label-position="left">
        <el-form-item label="Name">
          <el-input v-model="role.name" placeholder="Role Name" />
        </el-form-item>
        <el-form-item label="Desc">
          <el-input
            v-model="role.normalizedName"
            :autosize="{ minRows: 2, maxRows: 4 }"
            type="textarea"
            placeholder="Role Description"
          />
        </el-form-item>

      </el-form>
      <div style="text-align: right">
        <el-button type="danger" @click="dialogVisible = false"
          >Cancel</el-button
        >
        <el-button type="primary" @click="confirmRole">Confirm</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import path from "path";
import { deepClone } from "@/utils";
import { getRoutes, GetRoles, AddRole, DeleteRole, Edit } from "@/api/Role";

const defaultRole = {
  id: "",
  name: "",
  normalizedName: "",
};

export default {
  data() {
    return {
      role: Object.assign({}, defaultRole),
      rolesList: [],
      dialogVisible: false,
      dialogType: "new",
      checkStrictly: false,
      defaultProps: {
        children: "children",
        label: "title",
      },
    };
  },

  created() {
    this.GetRoles();
  },
  methods: {

    async GetRoles() {
      const res = await GetRoles();
      this.rolesList = res;
    },


    handleAddRole() {
      this.role = Object.assign({}, defaultRole);
   
      this.dialogType = "new";
      this.dialogVisible = true;
    },
    handleEdit(scope) {
      this.dialogType = "edit";
      this.dialogVisible = true;
      this.checkStrictly = true;
      this.role = deepClone(scope.row);
      this.$nextTick(() => {
  
        this.checkStrictly = false;
      });
    },
    handleDelete({ $index, row }) {
      this.$confirm("Confirm to remove the role?", "Warning", {
        confirmButtonText: "Confirm",
        cancelButtonText: "Cancel",
        type: "warning",
      })
        .then(async () => {
          await DeleteRole(row);
          this.rolesList.splice($index, 1);
          this.$message({
            type: "success",
            message: "Delete succed!",
          });
        })
        .catch((err) => {
          console.error(err);
        });
    },

    async confirmRole() {
      const isEdit = this.dialogType === "edit";

   
      if (isEdit) {

        await Edit(this.role);
        for (let index = 0; index < this.rolesList.length; index++) {
          if (this.rolesList[index].Id === this.role.Id) {
            this.rolesList.splice(index, 1, Object.assign({}, this.role));
            break;
          }
        }
      } else {
        // console.log(this.role)

        const  data  = await AddRole(this.role);

        this.role.Id = data.Id;
        this.rolesList.push(this.role);
      }

      const { description, id, name } = this.role;
      this.dialogVisible = false;
      this.$notify({
        title: "Success",
        dangerouslyUseHTMLString: true,
        message: `
            <div>Role Id: ${Id}</div>
            <div>Role Name: ${name}</div>
            <div>Description: ${description}</div>
          `,
        type: "success",
      });
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
