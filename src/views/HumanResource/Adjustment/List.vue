<template>
  <div class="app-container" >
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="20">
    <Add-Adjustment/>
    </el-col>
      <el-col :span="4">
      <Add-Static-Adjustment />
    </el-col>
      </el-row>
      <el-divider/>
     
    <el-card class="box-card" >
          <el-tabs v-model="activeTab" tab-position="right" @tab-click="tabClick">
            <el-tab-pane label="التسويات العادية" name="RegularAdjustment">
              <span slot="label"><i class="el-icon-refresh"></i> التسويات العادية</span>
              <Regular-Adjustment  :RAdjustments="RAdjustments"/>
            </el-tab-pane>

         <el-tab-pane label="التسويات الدورية" name="PeriodicAdjustment">
              <span slot="label"><i class="el-icon-refresh"></i> التسويات الدورية</span>
              <Periodic-Adjustment :PAdjustments="PAdjustments" />
            </el-tab-pane>
          </el-tabs>
        </el-card>


        </el-card>
  </div>
</template>
<script>
import { GetRAdjustments, GetPAdjustments } from "@/api/Adjustment";
import { ChangeObjStatus } from "@/api/Oprationsys";
import StatusTag from "@/components/Oprationsys/StatusTag";
import AddAdjustment from "./Components/AddAdjustment";
import AddStaticAdjustment from "./Components/AddStaticAdjustment";
import RegularAdjustment from "./Components/RegularAdjustment";
import PeriodicAdjustment from "./Components/PeriodicAdjustment";

export default {
  name: "Adjustment",
  components: { StatusTag, AddAdjustment, AddStaticAdjustment, PeriodicAdjustment, RegularAdjustment },
  data() {
    return {
      loading: true,
      dialogFormVisible: false,
      dialogOprationVisible: false,
      dialogFormStatus: "",
      RAdjustments:[],
      PAdjustments:[],
      activeTab: "RegularAdjustment",
      search: "",
      textMapForm: {
        update: "تعديل",
        create: "إضافة",
      },
    

    };
  },
  created() {
    this.getdata();
  },
  methods: {

       tabClick(tab, event) {
     if (tab.label == "التسويات العادية")
        GetRAdjustments({
        }).then((response) => {
          this.RAdjustments = response.reverse();
        });
   
         if (tab.label == "التسويات الدورية")
        GetPAdjustments({
        }).then((response) => {
          this.PAdjustments = response.reverse();
          });
     
    },
    getdata() {
      this.loading = true;
      GetRAdjustments()
        .then((response) => {
          // handle success
          console.log(response);
          this.RAdjustments = response;
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
