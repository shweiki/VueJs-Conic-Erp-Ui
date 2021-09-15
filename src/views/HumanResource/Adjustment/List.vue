<template>
  <div class="app-container">
    <el-card class="box-card">
    <Add-Adjustment/>
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
          v-bind:label="$t('Classification.Name')"
          prop="Name"
          width="200"
          align="center"
        >
          <template slot="header" slot-scope="{}">
            <el-input v-model="search" v-bind:placeholder="$t('Cheque.Name')" />
          </template>
        </el-table-column>
        <el-table-column
          label="القيمة النقدية"
          prop="AdjustmentAmount"
          width="200"
          align="center"
        ></el-table-column>
        <el-table-column
          label="القيمة المئوية"
          prop="AdjustmentPercentage"
          width="300"
          align="center"
        ></el-table-column>

<!--         
        <el-table-column v-bind:label="$t('Items.Status')" align="center" width="100">
          <template slot-scope="scope">
            <Status-Tag :Status="scope.row.Status" TableName="Cheque" />
          </template>
        </el-table-column> -->
        
      </el-table>
    </el-card>
   
  </div>
</template>
<script>
import { GetAdjustments } from "@/api/Adjustment";
import { ChangeObjStatus } from "@/api/Oprationsys";
import StatusTag from "@/components/Oprationsys/StatusTag";
import AddAdjustment from "./Components/AddAdjustment";
export default {
  name: "Adjustment",
  components: { StatusTag, AddAdjustment },
  data() {
    return {
      tableData: [],
      loading: true,
      dialogFormVisible: false,
      dialogOprationVisible: false,
      dialogFormStatus: "",
      search: "",
      textMapForm: {
        update: "تعديل",
        create: "إضافة",
      },
    
      tempForm: {
        Id: undefined,
        Name: "",
        AdjustmentAmount:1.00,
        AdjustmentPercentage: 0.01,
      },
    
    };
  },
  created() {
    this.getdata();
  },
  methods: {
    getdata() {
      this.loading = true;
      GetAdjustments()
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
  
    // updateData() {
    //   this.$refs["dataForm"].validate((valid) => {
    //     if (valid) {
    //       Edit(this.tempForm)
    //         .then((response) => {
    //           this.getdata();
    //           this.dialogFormVisible = false;
    //           this.$notify({
    //             title: "تم",
    //             message: "تم التعديل بنجاح",
    //             type: "success",
    //             duration: 2000,
    //           });
    //         })
    //         .catch((error) => {
    //           console.log(error);
    //         });
    //     } else {
    //       console.log("error submit!!");
    //       return false;
    //     }
    //   });
    // },
  },
};
</script>
