<template>
  <div>
    <el-row type="flex">
      <el-col :span="20">
        <el-row type="flex">
          <el-col :span="4">
            <span>رقم العضوية</span>
          </el-col>
          <el-col :span="4">
            <el-input v-model="member.Id" disabled />
          </el-col>
          <el-col :span="4">
            <span>اسم المشترك</span>
          </el-col>
          <el-col :span="12">
            <el-input v-model="member.Name" disabled />
          </el-col>
        </el-row>
        <el-row type="flex">
          <el-col :span="4">
            <span>العمر</span>
          </el-col>
          <el-col :span="8">
            <el-input v-model="member.Age" disabled />
          </el-col>
          <el-col :span="4">
            <span>تاريخ الميلاد</span>
          </el-col>
          <el-col :span="8">
            <el-date-picker
              v-model="member.DateofBirth"
              type="date"
              format="yyyy-MM-dd"
              disabled
            />
          </el-col>
        </el-row>
        <el-row type="flex">
          <el-col :span="4">
            <span>اخر زيارة</span>
          </el-col>
          <el-col :span="8">
            <last-log :user-id="member.Id" table-name="Member" />
          </el-col>
          <el-col :span="4">
            <span>رقم الهاتف</span>
          </el-col>
          <el-col :span="8">
            <el-input v-model="member.PhoneNumber1" disabled />
          </el-col>
        </el-row>

        <el-row type="flex">
          <el-col :span="4">
            <span>تاريخ البدء</span>
          </el-col>
          <el-col :span="8">
            <el-date-picker
              v-if="member.ActiveMemberShip"
              v-model="member.ActiveMemberShip.StartDate"
              format="yyyy-MM-dd"
              disabled
              type="date"
            />
          </el-col>
          <el-col :span="4">
            <span>تاريخ الانتهاء</span>
          </el-col>
          <el-col :span="8">
            <el-date-picker
              v-if="member.ActiveMemberShip"
              v-model="member.ActiveMemberShip.EndDate"
              format="yyyy-MM-dd"
              disabled
              type="date"
            />
          </el-col>
        </el-row>
        <el-row v-if="member.ActiveMemberShip" type="flex">
          <el-col
            :span="6"
          ><span style="color: dodgerblue">الايام</span> \

            <span style="color: orangered"> الحصص </span>
          </el-col>
          <el-col :span="3">
            (
            <span style="color: dodgerblue">{{ member.ActiveMemberShip.Remaining }}</span>\ {{ member.ActiveMemberShip.TotalDays }})
          </el-col>
          <el-col :span="3">
            (
            <span style="color: orangered">
              {{
                member.ActiveMemberShip.NumberClass - member.ActiveMemberShip.VisitsUsed
              }}
            </span>
            \{{ member.ActiveMemberShip.NumberClass }})</el-col>
          <el-col :span="4">
            <span>نوع الاشتراك</span>
          </el-col>
          <el-col :span="8">
            <el-tag>{{ member.ActiveMemberShip.Type + " - "
            }}{{ member.ActiveMemberShip.Name }}</el-tag>
          </el-col>
        </el-row>
        <el-row type="flex">
          <el-col :span="4">
            <span>الرصيد</span>
          </el-col>
          <el-col :span="8">
            <span>{{
              (member.TotalCredit - member.TotalDebit).toFixed(
                this.$store.getters.settings.ToFixed
              ) + $t("MemberList.JOD")
            }}</span>
          </el-col>
          <el-col :span="4">
            <span>حالة المشترك</span>
          </el-col>
          <el-col :span="8">
            <Status-Tag :status="member.Status" table-name="Member" />
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="4">
        <div>
          <pan-thumb
            :image="avatar"
            :height="'100px'"
            :width="'100px'"
            :hoverable="false"
          >
            <el-button
              type="primary"
              icon="el-icon-upload"
              @click="imagecropperShow = true"
            />
            <image-cropper
              v-show="imagecropperShow"
              :key="imagecropperKey"
              :width="150"
              :height="150"
              lang-type="ar"
              table-name="Member"
              :object-id="member.Id"
              @close="close"
              @crop-upload-success="cropSuccess"
            />
            <WebCam table-name="Member" :object-id="member.Id" />
          </pan-thumb>

          <el-col :span="24">
            <el-tag
              v-if="member.HaveFaceOnDevice == true"
              type="success"
            >يوجد بصمة وجه</el-tag>
            <el-tag
              v-if="member.HaveFaceOnDevice == false"
              type="danger"
            >لا يوجد بصمة وجه</el-tag>
          </el-col>
          <el-col v-if="member.Status != -2" :span="24">
            <el-button
              type="danger"
              plain
              @click="dialogOprationVisible = true"
            >Black List</el-button>
          </el-col>
          <el-col v-if="checkPermission(['admin']) && member.Status == -2" :span="24">
            <el-button
              type="success"
              plain
              @click="dialogOprationVisible2 = true"
            >الغاء Black List</el-button>
          </el-col>
        </div>
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
          :rules="[
            {
              required: true,
              message: 'لايمكن ترك السبب فارغ',
              trigger: 'blur',
            },
          ]"
        >
          <el-input v-model="tempOpration.Description" type="textarea" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button
          type="danger"
          @click="BlackList()"
        >ارسال الى القائمة السوداء</el-button>
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
          :rules="[
            {
              required: true,
              message: 'لايمكن ترك السبب فارغ',
              trigger: 'blur',
            },
          ]"
        >
          <el-input v-model="tempOpration.Description" type="textarea" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="success" @click="RemoveBlackList()">فك الرفض</el-button>
        <Dialog-Action-Log table-name="Member" :obj-id="member.Id" />
      </div>
    </el-dialog>
  </div>
</template>

<script>
import checkPermission from '@/utils/permission'

import PanThumb from '@/components/PanThumb/index.vue'
import WebCam from '@/components/WebCam'
import ImageCropper from '@/components/ImageCropper'

import LastLog from '@/views/Gym/components/LastLog.vue'

import { ChangeObjStatusByTableName } from '@/api/Oprationsys'
import StatusTag from '@/components/Oprationsys/StatusTag'
import DialogActionLog from '@/components/ActionLog/DialogActionLog.vue'
import { GetProfilePictureByObjId } from '@/api/File'

export default {
  components: {
    LastLog,
    PanThumb,
    WebCam,
    StatusTag,
    ImageCropper,
    DialogActionLog
  },
  props: {
    member: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      avatar: undefined,
      dialogOprationVisible: false,
      dialogOprationVisible2: false,
      imagecropperShow: false,
      imagecropperKey: 0,
      tempOpration: {
        ObjId: undefined,
        OprationId: undefined,
        Description: ''
      }
    }
  },
  watch: {
    member(value) {
      if (value) {
        this.GetImage(value.Id)
      }
    }
  },
  created() {
    if (this.member) {
      this.GetImage(this.member.Id)
    }
  },
  methods: {
    checkPermission,
    GetImage(Id) {
      GetProfilePictureByObjId({ TableName: 'Member', ObjId: Id })
        .then((response) => {
          if (response) this.avatar = response
          else this.avatar = this.$store.getters.CompanyInfo.Logo
        })
        .catch((err) => {
          console.log(err)
        })
    },
    RemoveBlackList() {
      this.$refs['dataOpration'].validate((valid) => {
        if (valid) {
          ChangeObjStatusByTableName({
            ObjId: this.member.Id,
            TableName: 'Member',
            Status: -1,
            Description: this.tempOpration.Description
          }).then((response) => {
            this.$notify({
              title: 'تم ',
              message: 'تم الإضافة بنجاح',
              type: 'success',
              duration: 2000
            })
            this.$nextTick(() => {
              this.$router.replace({
                path: '/redirect' + this.$route.fullPath
              })
            })
          })
        }
      })
    },
    BlackList() {
      this.$refs['dataOpration'].validate((valid) => {
        if (valid) {
          ChangeObjStatusByTableName({
            ObjId: this.member.Id,
            TableName: 'Member',
            Status: -2,
            Description: this.tempOpration.Description
          }).then((response) => {
            this.$notify({
              title: 'تم ',
              message: 'تم الإضافة بنجاح',
              type: 'success',
              duration: 2000
            })
            this.$nextTick(() => {
              this.$router.replace({
                path: '/redirect' + this.$route.fullPath
              })
            })
          })
        }
      })
    },
    cropSuccess(resData) {
      this.imagecropperShow = false
      this.imagecropperKey = this.imagecropperKey + 1
    },
    close() {
      this.imagecropperShow = false
    }
  }
}
</script>
