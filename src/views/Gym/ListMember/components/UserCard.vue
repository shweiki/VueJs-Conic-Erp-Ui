<template>
  <el-form :model="Member" ref="dataForm" label-position="top">
    <el-row type="flex">
      <el-col :span="8">
        <el-form-item label="ملاحظات" prop="Description">
          <el-input
            type="textarea"
            v-model="Member.Description"
            v-bind:placeholder="$t('AddVendors.Description')"
          ></el-input>
        </el-form-item>
        <el-button
          type="primary"
          icon="el-icon-save"
          @click="Member.Id != null ?updateData():createData()"
        >{{$t('AddVendors.Save')}}</el-button>
            <el-button
     
      @click="Print()"
      type="primary"
      icon="el-icon-printer"
    ></el-button>
      </el-col>
      <el-col :span="8">
        <el-form-item
          label="رقم الهاتف"
          prop="PhoneNumber1"
          :rules="[{ required: true, message: 'لايمكن ترك رقم الهاتف فارغ', trigger: 'blur' } ]"
        >
          <el-input
            type="text"
            v-model="Member.PhoneNumber1"
            v-bind:placeholder="$t('AddVendors.PhoneNumber1')"
          ></el-input>
        </el-form-item>
        <el-form-item label="رقم الهاتف" prop="PhoneNumber2">
          <el-input
            type="text"
            v-model="Member.PhoneNumber2"
            v-bind:placeholder="$t('AddVendors.PhoneNumber2')"
          ></el-input>
        </el-form-item>
        <el-form-item label="البريد الالكتروني" prop="Email">
          <el-input type="text" v-model="Member.Email" v-bind:placeholder="$t('AddVendors.Email')"></el-input>
        </el-form-item>
      </el-col>

      <el-col :span="8">
        <el-form-item
          v-bind:label="$t('CashDrawer.Name')"
          prop="Name"
          :rules="[{ required: true, message: 'لايمكن ترك الاسم فارغ', trigger: 'blur' } ]"
        >
          <el-input type="text" v-model="Member.Name" v-bind:placeholder="$t('CashDrawer.Name')"></el-input>
        </el-form-item>
        <el-form-item
          label="الرقم الوطني"
          prop="Ssn"
          :rules="[{ required: true, message: 'لايمكن ترك الرقم الوطني فارغ', trigger: 'blur' } ]"
        >
          <el-input type="text" v-model="Member.Ssn" placeholder="الرقم الوطني"></el-input>
        </el-form-item>
        <el-form-item
          label="تاريخ ميلاد"
          prop="DateofBirth"
          :rules="[{ required: true, message: 'لايمكن ترك التاريخ فارغ', trigger: 'blur' } ]"
        >
          <el-date-picker
            format="dd/MM/yyyy"
            v-model="Member.DateofBirth"
            type="date"
            placeholder="تاريخ ميلاد"
          ></el-date-picker>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
import { Create, Edit } from "@/api/Member";
import { SetUser } from "@/api/Device";
import printJS from "print-js";
import { MemberAgreement } from "@/Report/MemberAgreement";
export default {
  props: {
    Member: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  methods: {
    createData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          const data = {
            ID: this.Member.Id,
            Name: this.Member.Name,
            Ssn: this.Member.Ssn,
            DateofBirth: this.Member.DateofBirth,
            Email: this.Member.Email,
            phoneNumber1: this.Member.PhoneNumber1,
            PhoneNumber2: this.Member.PhoneNumber2,
            Description: this.Member.Description,
            Tag:this.Member.Tag,
            Status: 0,
            Type: "New"
          };
          Create(data)
            .then(response => {
              this.dialogFormVisible = false;
              this.$notify({
                title: "تم ",
                message: "تم الإضافة بنجاح",
                type: 'success',
                duration: 2000
              })
              this.$router.replace({ path: "/redirect" + "/Gym/ListMember" })
            })
            .catch(error => {
              console.log(error);
            })
        } else {
          console.log("error submit!!");
          return false;
        }
      })
    },
    updateData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          const data = {
            ID: this.Member.Id,
            Name: this.Member.Name,
            Ssn: this.Member.Ssn,
            DateofBirth: this.Member.DateofBirth,
            Email: this.Member.Email,
            phoneNumber1: this.Member.PhoneNumber1,
            PhoneNumber2: this.Member.PhoneNumber2,
            Description: this.Member.Description,
            Status: this.Member.Status,
            Tag:this.Member.Tag,
            Type: "Edit"
          };
          Edit(data)
            .then(response => {
              this.dialogFormVisible = false;
              this.$store.getters.Devices.forEach(element => {
                this.SetOnDevice(element.Id ,element.Name);
              })
              this.$notify({
                title: "تم",
                message: "تم التعديل بنجاح",
                type: 'success',
                duration: 2000
              })
            })
            .catch(error => {
              console.log(error);
            })
        } else {
          console.log("error submit!!");
          return false;
        }
      })
    },
        Print() {
      printJS({
        printable: MemberAgreement(this.Member),
        type: "pdf",
        base64: true,
        showModal: true
      })
    },
    SetOnDevice(DeviceID ,Name) {
      SetUser({
        DeviceID: DeviceID,
        UserID: this.Member.Id
      }).then(response => {
        if (response) {
          console.log(response);
          this.$notify({
            title: "تم",
            message: "تم ارسال البيانات لاجهاز " + Name +" \ "+ response+" ",
            type: 'success',
            duration: 3000,
            position :"top-right"

          })
        }
      })
    }
  }
};
</script>
