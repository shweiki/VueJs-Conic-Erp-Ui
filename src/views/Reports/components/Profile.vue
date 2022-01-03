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
          <el-form-item label="تلقائي الطباعة">
            <el-switch
              v-model="tempForm.AutoPrint"
              active-color="#13ce66"
              inactive-color="#ff4949"
              active-value="true"
              inactive-value="false"
            ></el-switch>
          </el-form-item>
          <el-form-item label="تلقائي ارسال">
            <el-switch
              v-model="tempForm.AutoSent"
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
              (v) => {
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
            <el-input v-model="tempForm.Type" />
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item
            prop="EmailSent"
            label="Email"
            :rules="[
              {
                required: false,
                message: 'Please input email address',
                trigger: 'blur',
              },
              {
                type: 'email',
                message: 'Please input correct email address',
                trigger: ['blur', 'change'],
              },
            ]"
          >
            <el-input v-model="tempForm.EmailSent"></el-input> </el-form-item
        ></el-col>
      </el-row>
      <el-row type="flex">
        <el-col :span="24">
          <tinymce height="950" v-bind:id="'tinymce-' + 0" v-model="tempForm.Html" />
        </el-col>
      </el-row>
      <el-row type="flex">
        <el-col :span="6">
          <Keys
            @Add="
              (v) => {
                AddTinymce(v);
              }
            "
          />
        </el-col>
        <el-col :span="18">
          <Templates
            @Add="
              (v) => {
                AddTinymce(v);
              }
            "
          />
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script>
import { Create, Edit, GetReportById, GetTotal } from "@/api/Report";
import Tinymce from "@/components/Tinymce";
import Printers from "@/components/Printers/index.vue";
import Keys from "./Keys.vue";
import Templates from "./Templates.vue";

export default {
  name: "Report",
  components: { Tinymce, Printers, Keys, Templates },
  props: {
    isEdit: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      DisabledSave: false,
      tempRoute: {},
      Total: 0,
      tempForm: {
        Id: 1,
        Name: "",
        Type: "",
        AutoPrint: false,
        AutoSent: false,
        Printer: "",
        EmailSent: "",
        Html: "",
        Icon: "",
      },
    };
  },
  created() {
    if (this.isEdit) {
      this.getdata(this.$route.params && this.$route.params.id);
    }
    this.tempRoute = Object.assign({}, this.$route);
    GetTotal().then((r) => {
      this.Total = r;
    });
  },
  methods: {
    AddTinymce(v) {
      console.log(this.tempForm.Id);
      window.tinymce.get("tinymce-" + 0 + "").insertContent(`${v}`);
    },
    handleSizeChange(val) {
      console.log(`${val} items per page`);
    },
    handleCurrentChange(val) {
      this.$router.push({ path: `/Reports/Edit/${val}` });
      console.log(`current page: ${val}`);
    },
    getdata(val) {
      GetReportById({ Id: val })
        .then((response) => {
          console.log(response);
          this.tempForm = response;
          // set tagsview title
          this.setTagsViewTitle();

          // set page title
          this.setPageTitle();
        })
        .catch((err) => {
          console.log(err);
        });
    },

    updateData() {
      this.$refs["tempForm"].validate((valid) => {
        if (valid) {
          Edit(this.tempForm)
            .then((response) => {
              this.$notify({
                title: "تم تعديل  بنجاح",
                message: "تم تعديل بنجاح",
                type: "success",
                position: "top-left",
                duration: 1000,
                showClose: false,
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
    createData() {
      this.$refs["tempForm"].validate((valid) => {
        if (valid) {
          this.DisabledSave = true;
          this.tempForm.Id = undefined;
          Create(this.tempForm)
            .then((response) => {
              if (response)
                this.$notify({
                  title: "تم الإضافة بنجاح",
                  message: "تم الإضافة بنجاح",
                  type: "success",
                  position: "top-left",
                  duration: 1000,
                  showClose: false,
                });
              else {
                this.$notify({
                  title: "حصلت مشكلة",
                  message: "الرجاء التاكد من المعلومات",
                  type: "error",
                  position: "top-left",
                  duration: 1000,
                  showClose: false,
                });
                this.DisabledSave = false;
              }
            })
            .catch((error) => {
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
        title: `${title}-${this.tempForm.Id}`,
      });
      this.$store.dispatch("tagsView/updateVisitedView", route);
    },
    setPageTitle() {
      const title = "Edit Report";
      document.title = `${title} - ${this.tempForm.Id}`;
    },
  },
};
</script>
