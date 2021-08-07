<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <Add-Dialog @Done="getdata()" />
        <span>{{ $t("Area.Areas") }}</span>
      </div>
      <el-table
        v-loading="loading"
        :data="
          tableData.filter(
            (data) => !search || data.Name.toLowerCase().includes(search.toLowerCase())
          )
        "
        fit
        border
        max-height="900"
        highlight-current-row
        style="width: 100%"
      >
        <el-table-column prop="Id" width="80" align="center">
          <template slot="header" slot-scope="{}">
            <el-button
              circle
              type="success"
              icon="el-icon-refresh"
              @click="getdata()"
              :size="$store.getters.size"
            ></el-button>
          </template>
        </el-table-column>
        <el-table-column
          v-bind:label="$t('Area.City')"
          prop="Adress1"
          width="200"
          align="center"
        >
          <template slot="header" slot-scope="{}">
            <el-input v-model="search" v-bind:placeholder="$t('Area.City')" />
          </template>
        </el-table-column>
        <el-table-column
          v-bind:label="$t('Area.Address1')"
          prop="Adress2"
          width="200"
          align="center"
        ></el-table-column>
        <el-table-column
          v-bind:label="$t('Area.Address2')"
          prop="Adress3"
          width="120"
          align="center"
        ></el-table-column>
        <el-table-column
          v-bind:label="$t('Area.DelievryPrice')"
          prop="DelievryPrice"
          width="120"
          align="center"
        ></el-table-column>

        <!-- <el-table-column width="120" align="center">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.Opration.Status != -1"
              icon="el-icon-edit"
              :size="$store.getters.size"
              circle
              @click="handleUpdate(scope.row)"
            ></el-button>
          
          </template>
        </el-table-column> -->
      </el-table>
    </el-card>
  </div>
</template>
<script>
import { GetAreas, Edit } from "@/api/Area";
import AddDialog from "@/views/Settings/Areas/AddDialog.vue";
export default {
  name: "Area",
  components: { AddDialog },
  data() {
    return {
      tableData: [],
      loading: true,
      dialogFormVisible: false,
      dialogOprationVisible: false,
      dialogFormStatus: "",
      search: "",
    };
  },
  created() {
    this.getdata();
  },
  methods: {
    getdata() {
      this.loading = true;
      GetAreas()
        .then((response) => {
          // handle success
          console.log(response);
          this.tableData = response;
          this.loading = false;
        })
        .catch((error) => {
          // handle error
          console.log(error);
        });
    },

    handleUpdate(row) {
      console.log(row);
      this.tempForm.Id = row.Id;
      this.tempForm.Adress1 = row.Adress1;
      this.tempForm.Adress2 = row.Adress2;
      this.tempForm.Adress3 = row.Adress3;
      this.tempForm.DelievryPrice = row.DelievryPrice;
      this.dialogFormStatus = "update";
      this.dialogFormVisible = true;
      this.$refs["dataForm"].clearValidate();
    },
    updateData() {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          Edit(this.tempForm)
            .then((response) => {
              this.getdata();
              this.dialogFormVisible = false;
              this.$notify({
                message: "تم التعديل بنجاح",
                type: "success",
                duration: 2000,
              });
            })
            .catch((error) => {
              console.log(error);
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
  },
};
</script>
