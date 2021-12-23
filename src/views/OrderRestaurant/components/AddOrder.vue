<template>
  <div>
 <el-button
      class="filter-item"
      type="primary"
      icon="el-icon-plus"
      @click="OrderDialog=true"
    >
      Add Order
    </el-button>

  <el-dialog
      style="margin-top: -13vh"
      :show-close="false"
      :visible.sync="OrderDialog"
    >
      <div slot="title" class="dialog-footer">
        <el-col :span="4">
          <el-button
            icon="fa fa-save"
            style="float: left"
            type="primary"
            @click="createData()"
          />
        </el-col>
        <el-col :span="20">
          <el-divider> إضافة طلب توصيل </el-divider>
        </el-col>
      </div>
       <el-form
        ref="dataForm"
        :rules="rulesForm"
        :model="tempForm"
        label-position="top"
        label-width="70px"
      >
      <el-row :gutter="20">
            <el-col :span="14">
        <el-form-item
          label="رقم الهاتف"
          prop="PhoneNumber"
          :rules="[
            {
              required: true,
              message: 'لايمكن ترك رقم الهاتف فارغ',
              trigger: 'blur'
            }
          ]"
        >
          <VuePhoneNumberInput
            default-country-code="JO"
            v-model="tempForm.PhoneNumber"
            :ignored-countries="['LI']"
          />
        </el-form-item>
        </el-col>
        <el-col :span="10">
        <el-form-item label="اسم الزبون" prop="Name">
          <el-input type="text" v-model="tempForm.Name"></el-input>
        </el-form-item>
        </el-col>
    
        </el-row>
         <el-form-item label="المنطقة" prop="Region">
          <el-input v-model="tempForm.Region"></el-input>
        </el-form-item>
         <el-form-item v-bind:label="$t('Classification.Notes')" prop="Description">
          <el-input type="textarea" v-model="tempForm.Description"></el-input>
        </el-form-item>
          <el-form-item
              label="سعر التوصيل"
              prop="DeliveryPrice"
            >
              <el-input-number
                v-model="dprice"
                :precision="2"
                :step="1.0"
                :min="0.0"
                :max="1500"
                @focus="$event.target.select()"
                @change="setdprice"
              ></el-input-number>
            </el-form-item>
        <el-form-item label="المحتويات" prop="Content">
          <el-input v-model="tContents" @change="setcontant" style="width:500px">
          
         <el-input-number v-model="tval" @input="totalsum" @change="setval" slot="append" style="width:150px; " > 
         </el-input-number>
        
         <el-button slot="append" icon="el-icon-plus" style="width:100px; padding-right:30px" @click="setinput"></el-button>
         
          </el-input>
          
         
        </el-form-item>
        <h5>المحتويات </h5>
        <p> {{tempForm.Content}}</p>
          <el-divider></el-divider>
          <el-row :gutter="20">
             <el-col :span="8">
          <h4> المبلغ الاجمالي </h4>
        <el-tag type="success"> {{tempForm.TotalPrice}} .دأ</el-tag>
        </el-col>
            <el-col :span="12">
          <h4> المجموع </h4>
        <el-tag type="success">  {{tempForm.TotalPill}} .دأ</el-tag>
            </el-col>
           
          </el-row>
      </el-form>
     <div >
     </div>
    </el-dialog>
  </div>
</template>

<script>
import { Create } from "@/api/OrderDelivery";
import VuePhoneNumberInput from "vue-phone-number-input";
export default {
  name: "AddOrder",
  components:{ VuePhoneNumberInput},
  data() {
    return {
      tval:0,
      dprice:0,
      tContents:"",
        inputVisible: false,
        inputValue: '',
        inputLabel: '',
      OrderDialog: false,
      tempForm: {
        Id: undefined,
        TotalPrice :0.0,
        Status:0,
        Description:"",
        FakeDate: new Date,
        VendorId: undefined,
        DriverId: undefined,
        PhoneNumber:"",
        Name:"",
        Region:"",
        DeliveryPrice: 0.0,
        TotalPill: 0.0,
        Content: "",
      },
       rulesForm: {
        Name: [
          {
            required: true,
            message: "يجب إدخال إسم ",
            trigger: "blur"
          },
          {
            minlength: 3,
            maxlength: 50,
            message: "الرجاء إدخال إسم لا يقل عن 3 أحرف و لا يزيد عن 50 حرف",
            trigger: "blur"
          }
        ]
      },
    };
  },
  created() {
    this.resetTempForm();
  },
  methods: {
    setinput(){
      this.tempForm.Content = this.tempForm.Content + " , " + this.tContents;
      this.tempForm.TotalPill += this.tval;
      this.tempForm.DeliveryPrice = this.dprice;
      this.tempForm.TotalPrice = this.tempForm.DeliveryPrice + this.tempForm.TotalPill;
      this.tContents = "";
      this.tval = 0;
    },
    totalsum(){
       this.tempForm.TotalPrice = this.tempForm.DeliveryPrice + this.tempForm.TotalPill;
    },
    setcontant(val){
      this.tContents = val
    },
    setval(val){
      this.tval = val
    },
    setdprice(val){
      this.dprice = val
    },
   
   resetTempForm() {
      this.tempForm = {
        Id: undefined,
        TotalPrice :0.0,
        Status:0,
        Description:"",
        FakeDate: new Date,
        VendorId: undefined,
        DriverId: undefined,
        PhoneNumber:"",
        Name:"",
        Region:"",
        DeliveryPrice: 0.0,
        TotalPill: 0.0,
        Content: "",
      };
    },
     createData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          console.log(this.tempForm);
          Create(this.tempForm)
            .then(response => {
              this.OrderDialog = false;
              this.resetTempForm();
              this.$notify({
                title: "تم ",
                message: "تم الإضافة بنجاح",
                type: "success",
                duration: 2000
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

  }
};
</script>
