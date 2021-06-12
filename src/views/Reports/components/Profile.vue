<template>
  <div class="app-container">
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page.sync="tempForm.Id"
      :page-size="1"
      layout="prev, pager, next, jumper"
      :total="Total"
    >
    </el-pagination>
    <el-form ref="tempForm" :model="tempForm">
      <el-row type="flex">
        <el-col :span="4">
          <el-button
            :disabled="DisabledSave"
            style="float: left"
            type="success"
            icon="fa fa-save"
            @click="isEdit != true ? createData() : updateData()"
            >{{ isEdit != true ? "حفظ" : "تعديل" }}</el-button
          >
        </el-col>
        <el-col :span="4">
          <el-form-item label="تلقائي">
            <el-switch
              v-model="tempForm.AutoPrint"
              active-color="#13ce66"
              inactive-color="#ff4949"
              active-value="true"
              inactive-value="false"
            ></el-switch>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <printers
            :Value="tempForm.Printer"
            @change="
              v => {
                tempForm.Printer = v;
              }
            "
          />
        </el-col>
        <el-col :span="4">
          <el-form-item label="اسم التقرير">
            <el-input v-model="tempForm.Name" /> </el-form-item
        ></el-col>
        <el-col :span="4">
          <el-form-item label="الكينونة">
            <el-select v-model="tempForm.Type" placeholder="Select">
              <el-option label="SaleInvoice" value="SaleInvoice"> </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex">
        <el-col :span="18">
          <tinymce
        
            v-bind:id="'tinymce-' + tempForm.Id"
            v-model="tempForm.Html"
          />
        </el-col>
        <el-col :span="6">
          <json-editor ref="jsonEditor" v-model="tempForm.Keys" />
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script>
import { Create, Edit, GetReportById, GetTotal } from "@/api/Report";
import Tinymce from "@/components/Tinymce";
import Printers from "@/components/Printers/index.vue";
import JsonEditor from "@/components/JsonEditor";

export default {
  name: "Report",
  components: { Tinymce, Printers, JsonEditor },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const validateRequire = (rule, value, callback) => {
      if (value === "") {
        this.$message({
          message: rule.field + "اواي",
          type: "error"
        });
        callback(new Error(rule.field + "اي"));
      } else {
        callback();
      }
    };
    const validateSourceUri = (rule, value, callback) => {
      if (value) {
        if (validURL(value)) {
          callback();
        } else {
          this.$message({
            message: "اه",
            type: "error"
          });
          callback(new Error("اوه"));
        }
      } else {
        callback();
      }
    };
    return {
      DisabledSave: false,
      tempRoute: {},
      Total: 0,
      tempForm: {
        Id: undefined,
        Name: "",
        Type: "",
        AutoPrint: false,
        Keys: "",
        Printer: "",
        Html: "",
        Icon: ""
      }
    };
  },
  created() {
    if (this.isEdit) {
      this.getdata(this.$route.params && this.$route.params.id);
    }
    this.tempRoute = Object.assign({}, this.$route);
    GetTotal().then(r => {
      this.Total = r;
    });
  },
  methods: {
    handleSizeChange(val) {
      console.log(`${val} items per page`);
    },
    handleCurrentChange(val) {
      this.$router.push({ path: `/Reports/Edit/${val}` });
      console.log(`current page: ${val}`);
    },
    getdata(val) {
      GetReportById({ Id: val })
        .then(response => {
          console.log(response);
          response.Keys = JSON.parse(response.Keys)
          this.tempForm = response;
          // set tagsview title
          this.setTagsViewTitle();

          // set page title
          this.setPageTitle();
        })
        .catch(err => {
          console.log(err);
        });
    },

    updateData() {
      this.$refs["tempForm"].validate(valid => {
        if (valid) {
          Edit(this.tempForm)
            .then(response => {
              this.$notify({
                title: "تم تعديل  بنجاح",
                message: "تم تعديل بنجاح",
                type: "success",
                position: "top-left",
                duration: 1000,
                showClose: false
              });
            })
            .catch(error => {
              console.log(error);
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    createData() {
      this.$refs["tempForm"].validate(valid => {
        if (valid) {
          this.DisabledSave = true;

          Create(this.tempForm)
            .then(response => {
              this.$notify({
                title: "تم الإضافة بنجاح",
                message: "تم الإضافة بنجاح",
                type: "success",
                position: "top-left",
                duration: 1000,
                showClose: false
              });
            })
            .catch(error => {
              console.log(error);
              this.DisabledSave = false;
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    setTagsViewTitle() {
      const title = "Edit Report";
      const route = Object.assign({}, this.tempRoute, {
        title: `${title}-${this.tempForm.Id}`
      });
      this.$store.dispatch("tagsView/updateVisitedView", route);
    },
    setPageTitle() {
      const title = "Edit Report";
      document.title = `${title} - ${this.tempForm.Id}`;
    }
  }
};
</script>
