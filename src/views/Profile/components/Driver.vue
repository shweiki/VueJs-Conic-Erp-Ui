<template>
  <div>
    <el-row type="flex">
      <el-col :span="20">
        <el-row type="flex">
          <el-col :span="4">
            <span>الرقم الوظيفي </span>
          </el-col>
          <el-col :span="4">
            <el-input disabled v-model="DriverForm.Id"></el-input>
          </el-col>
          <el-col :span="4">
            <span>اسم الموظف</span>
          </el-col>
          <el-col :span="12">
            <el-input disabled v-model="DriverForm.Name"></el-input>
          </el-col>
        </el-row>
        <el-row type="flex">
          <el-col :span="4">
            <span>البريد الالكتروني</span>
          </el-col>
          <el-col :span="8">
            <el-input disabled v-model="DriverForm.Email"></el-input>
          </el-col>
          <el-col :span="4">
            <span>تاريخ الميلاد</span>
          </el-col>
          <el-col :span="8">
            <el-date-picker
              format="dd/MM/yyyy"
              v-model="DriverForm.DateofBirth"
              type="date"
              disabled
            ></el-date-picker>
          </el-col>
        </el-row>
        <el-row type="flex">
          <el-col :span="4">
            <span>رقم الهاتف1</span>
          </el-col>
          <el-col :span="8">
            <el-input disabled v-model="DriverForm.PhoneNumber1"></el-input>
          </el-col>
            <el-col :span="4">
            <span>رقم الهاتف2</span>
          </el-col>
          <el-col :span="8">
            <el-input disabled v-model="DriverForm.PhoneNumber2"></el-input>
          </el-col>
        </el-row>

        <el-row type="flex">
          <el-col :span="4">
            <span>الرقم الوطني</span>
          </el-col>
          <el-col :span="8">
            <el-input disabled v-model="DriverForm.Ssn"></el-input>
          </el-col>
          <el-col :span="4">
            <span>حالة الموظف</span>
          </el-col>
          <el-col :span="8">
            <Status-Tag :Status="DriverForm.IsActive" TableName="DriverIsActive" />
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <el-row :gutter="20"> 
       <el-col :span="4">
          <div v-if="DriverForm.IsActive == 1">
            <el-tooltip content="الغاء تفعيل الحساب وايقاف استلام الطلبات" placement="top">
      <el-popconfirm
             confirm-button-text=" موافق"
             cancel-button-text="لا, شكرا"
             confirm-button-type="danger"
             icon="el-icon-error"
             title="الغاء تفعيل الحساب وايقاف استلام الطلبات" 
             @confirm="DeActivation()"
> 
        <el-button
              slot="reference"
              type="danger"
              icon="el-icon-error"
              @click="DeActivation()">
          الغاء التفعيل
        </el-button>
      </el-popconfirm>
            </el-tooltip>
          </div>
           <div v-else>
             <el-tooltip content="تفعيل الحساب وبدء استقبال الطلبات" placement="top">
              <el-popconfirm
             confirm-button-text="موافق"
             cancel-button-text="لا, شكرا"
             confirm-button-type="success"
             icon="el-icon-info"
             title="تفعيل الحساب وبدء استقبال الطلبات"
             @confirm="Activation()"
> 
             
        <el-button
              slot="reference"
              type="success"
              icon="el-icon-success"
              >
          تفعيل
        </el-button>
             </el-popconfirm>
              </el-tooltip>
          </div>
      </el-col>
      <el-col :span="20">
        <el-button
              type="primary"
              icon="el-icon-edit"
              @click="ShowEdit = true">
           {{$t('table.edit')}}
        </el-button>
      </el-col>
       
    </el-row>
       <el-dialog
      :rules="rulesForm"
      style="margin-top: -13vh"
      title="تعديل البيانات الشخصية"
      :visible.sync="ShowEdit"
    >
      <el-form
        ref="driverForm"
        :model="DriverForm"
        label-position="top"
        label-width="70px"
        style="width: 400px margin-left:50px"
      >
        <el-form-item
          label="الاسم"
          prop="Name"
        >
          <el-input type="textarea" v-model="DriverForm.Name"></el-input>
        </el-form-item>
    <el-form-item
      label="تاريخ ميلاد"
      prop="DateofBirth"
      :rules="[
        {
          required: true,
          message: 'لايمكن ترك التاريخ فارغ',
          trigger: 'blur'
        }
      ]"
    >
      <el-date-picker
        format="dd/MM/yyyy"
        v-model="DriverForm.DateofBirth"
        type="date"
        placeholder="تاريخ ميلاد"
      ></el-date-picker>
    </el-form-item>
           <el-form-item
          label="البريد الالكتروني"
          prop="Email"
        >
          <el-input type="textarea" v-model="DriverForm.Email"></el-input>
        </el-form-item>
           <el-form-item
          label="رقم الهاتف1"
          prop="PhoneNumber1"
        >
          <el-input type="textarea" v-model="DriverForm.PhoneNumber1"></el-input>
        </el-form-item>
           <el-form-item
          label="رقم الهاتف2"
          prop="PhoneNumber2"
        >
          <el-input type="textarea" v-model="DriverForm.PhoneNumber2"></el-input>
        </el-form-item>
        <el-form-item
          label="الرقم الوطني"
          prop="Ssn"
        >
          <el-input type="textarea" v-model="DriverForm.Ssn"></el-input>
        </el-form-item>
        <el-form-item
          label="اسم الشركة"
          prop="Company"
        >
          <el-input type="textarea" v-model="DriverForm.Company"></el-input>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="updateData()"
          >{{$t('AddVendors.Save')}}</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import StatusTag from "@/components/Oprationsys/StatusTag";
import {Edit, DriverDeActivation, DriverActivation } from "@/api/Driver";
export default {
  components: {
    StatusTag,
  },
  props: {
    DriverForm: {
      type: Object,
      default: () => {
        return undefined;
      },
    },
  },
  data() {
    return {
      ShowEdit:false,
            rulesForm: {
        Name: [
          {
            required: true,
            message: "يجب إدخال إسم ",
            trigger: "blur",
          },
          {
            min: 3,
            max: 50,
            message: "الرجاء إدخال إسم لا يقل عن 3 أحرف و لا يزيد عن 50 حرف",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
      updateData() {
      this.$refs["driverForm"].validate((valid) => {
        if (valid) {
          Edit(this.DriverForm)
            .then((response) => {
              this.ShowEdit = false;
              this.$notify({
                title: "تم",
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
    Activation (){
    DriverActivation(
      {Id: this.DriverForm.Id}
    ).then((res) => {
      this.$notify({
                title: "تم",
                message: "تم التفعيل بنجاح",
                type: "success",
                duration: 2000,
              });
    })
    },
       DeActivation (){
    DriverDeActivation(
      {Id: this.DriverForm.Id}
    ).then((res) => {
      this.$notify({
                title: "تم",
                message: "تم الغاء التفعيل بنجاح",
                type: "success",
                duration: 2000,
              });
    })
    },
  },
};
</script>
