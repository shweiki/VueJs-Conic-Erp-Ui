<template>
  <div>
    <el-row type="flex">
      <el-col :span="4">
        <div style="float : left">
          <pan-thumb :image="Member.Avatar" :height="'75px'" :width="'75px'" :hoverable="false">
            <web-cam :ObjectID="Member.Id" />
          </pan-thumb>
          <el-col :span="24">
            <el-tag v-if="Member.HaveFaceOnDevice == true" type='success'>يوجد بصمة وجه</el-tag>
            <el-tag v-if="Member.HaveFaceOnDevice == false" type="danger">لا يوجد بصمة وجه</el-tag>
          </el-col>
          <el-col :span="24" v-if="Member.Status !=-2">
            <el-button @click="dialogOprationVisible = true" type="danger" plain>Black List</el-button>
          </el-col>
          <el-col :span="24" v-if="checkPermission(['admin'])">
            <el-button @click="dialogOprationVisible2 = true" type='success' plain>الغاء Black List</el-button>
          </el-col>
        </div>
      </el-col>
      <el-col :span="20">
        <el-row type="flex">
          <el-col :span="8">
            <el-col :span="24">
              <el-input disabled v-model="Member.Id"></el-input>
            </el-col>
            <!--
            <el-col :span="12">
              <el-input disabled v-model="Member.Tag"></el-input>
            </el-col>-->
          </el-col>
          <el-col :span="4">
            <span>رقم العضوية</span>
          </el-col>
          <el-col :span="8">
            <el-input disabled v-model="Member.Name"></el-input>
          </el-col>
          <el-col :span="4">
            <span>اسم المشترك</span>
          </el-col>
        </el-row>
        <el-row type="flex">
          <el-col :span="8">
            <el-input disabled v-model="Member.Age"></el-input>
          </el-col>
          <el-col :span="4">
            <span>العمر</span>
          </el-col>
          <el-col :span="8">
            <el-date-picker format="dd/MM/yyyy" v-model="Member.DateofBirth" type="date" disabled></el-date-picker>
          </el-col>
          <el-col :span="4">
            <span>تاريخ الميلاد</span>
          </el-col>
        </el-row>
        <el-row type="flex">
          <el-col :span="8">
            <el-input disabled v-model="Member.lastLog"></el-input>
          </el-col>
          <el-col :span="4">
            <span>اخر زيارة</span>
          </el-col>
          <el-col :span="8">
            <el-input disabled v-model="Member.PhoneNumber1"></el-input>
          </el-col>
          <el-col :span="4">
            <span>رقم الهاتف</span>
          </el-col>
        </el-row>

        <el-row type="flex">
          <el-col :span="8">
            <el-date-picker
              v-if="Member.ActiveMemberShip"
              format="dd/MM/yyyy"
              disabled
              v-model="Member.ActiveMemberShip.EndDate"
              type="date"
            ></el-date-picker>
          </el-col>
          <el-col :span="4">
            <span>تاريخ الانتهاء</span>
          </el-col>
          <el-col :span="8">
            <el-date-picker
              v-if="Member.ActiveMemberShip"
              format="dd/MM/yyyy"
              disabled
              v-model="Member.ActiveMemberShip.StartDate"
              type="date"
            ></el-date-picker>
          </el-col>
          <el-col :span="4">
            <span>تاريخ البدء</span>
          </el-col>
        </el-row>
        <el-row type="flex">
          <el-col :span="8">
            <span
              v-if="Member.ActiveMemberShip"
            >( {{Math.round(Math.abs((new Date() - new Date(Member.ActiveMemberShip.EndDate)) / (24 * 60 * 60 * 1000))) }} )</span>
          </el-col>
          <el-col :span="4">
            <span>الايام المتبقية</span>
          </el-col>
          <el-col :span="8">
            <el-tag
              v-if="Member.ActiveMemberShip"
            >{{ Member.ActiveMemberShip.Type + " - " }}{{Member.ActiveMemberShip.Name}}</el-tag>
          </el-col>
          <el-col :span="4">
            <span>نوع الاشتراك</span>
          </el-col>
        </el-row>
        <el-row type="flex">
          <el-col :span="8">
            <span>{{ (Member.TotalCredit - Member.TotalDebit).toFixed(2) + $t('MemberList.JOD')}}</span>
          </el-col>
          <el-col :span="4">
            <span>الرصيد</span>
          </el-col>
          <el-col :span="8">
            <el-tag
              :type="Member.Opration.ClassName"
            >{{ Member.Opration.ArabicOprationDescription }}</el-tag>
          </el-col>
          <el-col :span="4">
            <span>حالة المشترك</span>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <el-dialog
      style="margin-top: -13vh"
      :show-close="false"
      title="رفض العضو و ارساله الى القائمة السوداء"
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
          label="ملاحظات للعملية "
          prop="Description"
          :rules="[{ required: true, message: 'لايمكن ترك السبب فارغ', trigger: 'blur' } ]"
        >
          <el-input type="textarea" v-model="tempOpration.Description"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" @click="BlackList()">ارسال الى القائمة السوداء</el-button>
      </div>
    </el-dialog>
    <el-dialog
      style="margin-top: -13vh"
      :show-close="false"
      title="الغاء الرفض"
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
          label="ملاحظات للعملية "
          prop="Description"
          :rules="[{ required: true, message: 'لايمكن ترك السبب فارغ', trigger: 'blur' } ]"
        >
          <el-input type="textarea" v-model="tempOpration.Description"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type='success' @click="RemoveBlackList()">فك الرفض</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import checkPermission from "@/utils/permission";

import PanThumb from "@/components/PanThumb";
import WebCam from "@/components/WebCam";
import { string } from "clipboard";
import { ChangeObjStatusByTableName } from "@/api/Oprationsys";

export default {
  components: { PanThumb, WebCam },
  props: {
    Member: {
      type: Object,
      default: () => {
        return undefined;
      }
    }
  },
  data() {
    return {
      dialogOprationVisible: false,
      dialogOprationVisible2: false,

      tempOpration: {
        ObjID: undefined,
        OprationID: undefined,
        Description: ''
      }
    };
  },
  methods: {
    checkPermission,
    RemoveBlackList() {
      this.$refs["dataOpration"].validate(valid => {
        if (valid) {
          ChangeObjStatusByTableName({
            ObjID: this.Member.Id,
            TableName: "Member",
            Status: -1,
            Description: this.tempOpration.Description
          }).then(response => {
            this.$notify({
              title: "تم ",
              message: "تم الإضافة بنجاح",
              type: 'success',
              duration: 2000
            })
            this.$nextTick(() => {
              this.$router.replace({
                path: "/redirect" + this.$route.fullPath
              })
            })
          })
        }
      })
    },
    BlackList() {
      this.$refs["dataOpration"].validate(valid => {
        if (valid) {
          ChangeObjStatusByTableName({
            ObjID: this.Member.Id,
            TableName: "Member",
            Status: -2,
            Description: this.tempOpration.Description
          }).then(response => {
            this.$notify({
              title: "تم ",
              message: "تم الإضافة بنجاح",
              type: 'success',
              duration: 2000
            })
            this.$nextTick(() => {
              this.$router.replace({
                path: "/redirect" + this.$route.fullPath
              })
            })
          })
        }
      })
    }
  }
};
</script>
