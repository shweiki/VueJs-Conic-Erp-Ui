<template>
  <div class="app-container">
    <el-form
      ref="tempForm"
      :model="tempForm"
      label-position="top"
      label-width="70px"
      class="demo-ruleForm"
    >
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <el-button
            :disabled="DisabledSave"
            style="float: left"
            type="success"
            icon="fa fa-save"
            @click="isEdit != true ? createData() : updateData()"
            >{{ isEdit != true ? "حفظ" : "تعديل" }}</el-button
          >
          <router-link
            class="pan-btn tiffany-btn"
            style="float: left; margin-left: 20px; padding: 10px 15px; border-radius: 6px"
            icon="el-icon-plus"
            to="/Report/List"
            >{{ $t("route.ListReportInvoice") }}</router-link
          >
          <span>{{ $t("NewReportInvoice.ReportInvoice") }}</span>
        </div>
        <tinymce
          :width="900"
          :height="700"
          :id="tempForm.Id"
          v-model="tempForm.HtmlDesgin"
        />
      </el-card>
    </el-form>
  </div>
</template>
<script>
import { Create, Edit, GetReportByID } from "@/api/Report";
import Tinymce from "@/components/Tinymce";

export default {
  name: "Report",
  components: { Tinymce },
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
      tempForm: {
        ID: undefined,
        Name: "-",
        Tax: 0.0,
        AccountInvoiceNumber: "",
        FakeDate: "",
        InvoiceReportDate: "",
        PaymentMethod: "Cash",
        Discount: 0,
        VendorId: 2,
        Status: 0,
        InventoryMovements: []
      }
    };
  },
  created() {
    if (this.isEdit) {
      this.getdata(this.$route.params && this.$route.params.id);
    }
    this.tempRoute = Object.assign({}, this.$route);
  },
  methods: {
    getdata(val) {
      GetReportByID({ ID: val })
        .then(response => {
          console.log(response);
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
    AddKey(key) {
      console.log(key);
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
