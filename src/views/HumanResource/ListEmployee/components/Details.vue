<template>
  <div>
    <el-row>
      <el-col :span="4">
        <div style="float: left">
          <pan-thumb
            :image="Employee.Avatar"
            :height="'100px'"
            :width="'100px'"
            :hoverable="false"
          >
            <el-button
              type="primary"
              icon="el-icon-upload"
              @click="imagecropperShow = true"
            ></el-button>
            <web-cam TableName="Employee" :ObjectId="Employee.Id" />
          </pan-thumb>
          <image-cropper
            v-show="imagecropperShow"
            :key="imagecropperKey"
            :width="150"
            :height="150"
            lang-type="ar"
            TableName="Employee"
            :ObjectId="Employee.Id"
            @close="close"
            @crop-upload-success="cropSuccess"
          />
          <el-col :span="24">
            <el-tag v-if="Employee.HaveFaceOnDevice == true" type="success"
              >يوجد بصمة وجه</el-tag
            >
            <el-tag v-if="Employee.HaveFaceOnDevice == false" type="danger"
              >لا يوجد بصمة وجه</el-tag
            >
          </el-col>
          <el-col :span="24" v-if="Employee.Status != -2">
            <el-button @click="dialogOprationVisible = true" type="danger" plain
              >إستقالة</el-button
            >
          </el-col>
          <el-col :span="24" v-if="checkPermission(['admin']) && Employee.Status == -2">
            <el-button @click="dialogOprationVisible2 = true" type="success" plain
              >الغاء إستقالة</el-button
            >
          </el-col>
        </div>
      </el-col>
      <el-col :span="20">
        <el-row type="flex">
          <el-col :span="4">
            <span>الرقم الوظيفي </span>
          </el-col>
          <el-col :span="4">
            <el-input disabled v-model="Employee.Id"></el-input>
            <!--
            <el-col :span="12">
              <el-input disabled v-model="Employee.Tag"></el-input>
            </el-col>-->
          </el-col>
          <el-col :span="4">
            <span>اسم الموظف</span>
          </el-col>
          <el-col :span="12">
            <el-input disabled v-model="Employee.Name"></el-input>
          </el-col>
        </el-row>
        <el-row type="flex">
          <el-col :span="4">
            <span>العمر</span>
          </el-col>
          <el-col :span="8">
            <el-input disabled v-model="Employee.Age"></el-input>
          </el-col>
          <el-col :span="4">
            <span>تاريخ الميلاد</span>
          </el-col>
          <el-col :span="8">
            <el-date-picker
              format="dd/MM/yyyy"
              v-model="Employee.DateofBirth"
              type="date"
              disabled
            ></el-date-picker>
          </el-col>
        </el-row>
        <el-row type="flex">
          <el-col :span="4">
            <span>اخر دوام</span>
          </el-col>
          <el-col :span="8">
            <last-log :UserId="Employee.Id" TableName="Employee" />
          </el-col>
          <el-col :span="4">
            <span>رقم الهاتف</span>
          </el-col>
          <el-col :span="8">
            <el-input disabled v-model="Employee.PhoneNumber1"></el-input>
          </el-col>
        </el-row>

        <el-row type="flex">
          <el-col :span="4">
            <span>الرصيد</span>
          </el-col>
          <el-col :span="8">
            <span>{{
              (Employee.TotalCredit - Employee.TotalDebit).toFixed(
                this.$store.getters.settings.ToFixed
              ) + $t("MemberList.JOD")
            }}</span>
          </el-col>
          <el-col :span="4">
            <span>حالة الموظف</span>
          </el-col>
          <el-col :span="8">
            <Status-Tag :Status="Employee.Status" TableName="Employee" />
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <el-dialog
      style="margin-top: -13vh"
      :show-close="false"
      title="إستقالة الموظف "
      :visible.sync="dialogOprationVisible"
    >
      <el-form
        ref="dataOpration"
        :model="tempOpration"
        label-position="top"
        label-width="70px"
        style="width: 400px margin-left:50px"
      >
        <el-form-item
          label="سبب إستقالة "
          prop="Description"
          :rules="[
            {
              required: true,
              message: 'لايمكن ترك السبب فارغ',
              trigger: 'blur',
            },
          ]"
        >
          <el-input type="textarea" v-model="tempOpration.Description"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" @click="ResignationList()">تأكيد</el-button>
      </div>
    </el-dialog>
    <el-dialog
      style="margin-top: -13vh"
      :show-close="false"
      title="الغاء إستقالة"
      :visible.sync="dialogOprationVisible2"
    >
      <el-form
        ref="dataOpration"
        :model="tempOpration"
        label-position="top"
        label-width="70px"
        style="width: 400px margin-left:50px"
      >
        <el-form-item
          label="سبب الغاء إستقالة"
          prop="Description"
          :rules="[
            {
              required: true,
              message: 'لايمكن ترك السبب فارغ',
              trigger: 'blur',
            },
          ]"
        >
          <el-input type="textarea" v-model="tempOpration.Description"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="success" @click="RemoveResignationList()">فك إستقالة</el-button>
        <Dialog-Action-Log TableName="Employee" :ObjId="Employee.Id" />
      </div>
    </el-dialog>
  </div>
</template>

<script>
import checkPermission from "@/utils/permission";

import PanThumb from "@/components/PanThumb";
import WebCam from "@/components/WebCam";
import ImageCropper from "@/components/ImageCropper";
import { ChangeObjStatusByTableName } from "@/api/Oprationsys";
import StatusTag from "@/components/Oprationsys/StatusTag";
import DialogActionLog from "@/components/ActionLog/DialogActionLog.vue";
import LastLog from "@/components/Gym/LastLog.vue";

export default {
  components: {
    PanThumb,
    WebCam,
    StatusTag,
    ImageCropper,
    DialogActionLog,
    LastLog,
  },
  props: {
    Employee: {
      type: Object,
      default: () => {
        return undefined;
      },
    },
  },
  data() {
    return {
      dialogOprationVisible: false,
      dialogOprationVisible2: false,
      imagecropperShow: false,
      imagecropperKey: 0,
      tempOpration: {
        ObjId: undefined,
        OprationId: undefined,
        Description: "",
      },
    };
  },
  methods: {
    checkPermission,
    RemoveResignationList() {
      this.$refs["dataOpration"].validate((valid) => {
        if (valid) {
          ChangeObjStatusByTableName({
            ObjId: this.Employee.Id,
            TableName: "Employee",
            Status: 0,
            Description: this.tempOpration.Description,
          }).then((response) => {
            this.$notify({
              title: "تم ",
              message: "تم الإضافة بنجاح",
              type: "success",
              duration: 2000,
            });
            this.$nextTick(() => {
              this.$router.replace({
                path: "/redirect" + this.$route.fullPath,
              });
            });
          });
        }
      });
    },
    ResignationList() {
      this.$refs["dataOpration"].validate((valid) => {
        if (valid) {
          ChangeObjStatusByTableName({
            ObjId: this.Employee.Id,
            TableName: "Employee",
            Status: -2,
            Description: this.tempOpration.Description,
          }).then((response) => {
            this.$notify({
              title: "تم ",
              message: "تم الإضافة بنجاح",
              type: "success",
              duration: 2000,
            });
            this.$nextTick(() => {
              this.$router.replace({
                path: "/redirect" + this.$route.fullPath,
              });
            });
          });
        }
      });
    },
    cropSuccess(resData) {
      this.imagecropperShow = false;
      this.imagecropperKey = this.imagecropperKey + 1;
    },
    close() {
      this.imagecropperShow = false;
    },
  },
};
</script>
